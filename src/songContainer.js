class SongContainer {
	constructor(titleSuffix) {
		this.musicContainer = document.getElementById('music-container-'+titleSuffix);
		this.playBtn = document.getElementById('play-'+titleSuffix);
		this.prevBtn = document.getElementById('prev-'+titleSuffix);
		this.nextBtn = document.getElementById('next-'+titleSuffix);
		this.progress = document.getElementById('progress-'+titleSuffix);
		this.progressContainer = document.getElementById('progress-container-'+titleSuffix);
		this.title = document.getElementById('title-'+titleSuffix);
		this.cover = document.getElementById('cover-'+titleSuffix);

		this.audioCtx = new AudioContext();
		this.songs = ['hey', 'summer', 'ukulele'];
		this.songIndex = 0;

		this.querySelector = "i.bi";
		this.classPlay = "bi-play-fill";
		this.classPause = "bi-pause-fill";

		// Event listeners (event targets abfragen)
		// play button
		this.playBtn.addEventListener('click', this.togglePlay.bind(this));
		// back button
		this.prevBtn.addEventListener('click', this.prevSong.bind(this));
		// next button
		this.nextBtn.addEventListener('click', this.nextSong.bind(this));
		// click on progress bar
		//this.progressContainer.addEventListener('click', this.setProgress.bind(this));
		// Time/song update
		//this.audioCtx.addEventListener('timeupdate', this.updateProgress.bind(this));
		// Song ends
		// audio.addEventListener('ended', nextSong);

        this.lowerBandThreshold = 500;
        this.higherBandThreshold = 3000;
        /* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas */
        // Get a canvas defined with ID "visualizer"
        this.canvas = document.getElementById('visualizer');
        //"2d", leading to the creation of a CanvasRenderingContext2D object representing a two-dimensional rendering context
        this.canvasContext = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        /*
        A node able to provide real-time frequency and time-domain analysis information
        https://developer.mozilla.org/en-US/docs/Web/API/AudioNode
        */
        this.analyzerNode = new AnalyserNode(this.audioCtx, {
            fftSize: 256,
            maxDecibels: -25,
            minDecibels: -60,
            smoothingTimeConstant: 0.8
        });

        // number of data values for the visualization (128)
        this.arrayLength = this.analyzerNode.frequencyBinCount;
        this.dataArray = new Uint8Array(this.arrayLength);
        // let audioCoding = new AudioBuffer();
        // let source;

        this.volume = document.getElementById('volume');

        /*
         Node, that represents a change in volume.
         https://developer.mozilla.org/en-US/docs/Web/API/GainNode
         */
        this.gain = new GainNode(this.audioCtx, {gain: this.volume.value});
	}


	loadSong(index) {
		if (this.source) this.source.disconnect();
		this.source = this.audioCtx.createBufferSource();
	    let request = new XMLHttpRequest();
	    let song = this.songs[index];
        let audioCoding;
	    request.open('GET', `music/${song}.mp3`, true);
	    request.responseType = 'arraybuffer';
	    request.onload = function() {
	        this.audioCtx.decodeAudioData(request.response, function(buffer) {
	            this.source.buffer = buffer;
                console.log(buffer);
	            this.source.connect(this.audioCtx.destination);
	            this.source.loop = true;
	        }.bind(this));
	    }.bind(this);
	    request.send();

	    this.audioCtx.suspend();
	    this.source.start(0);
	    this.title.innerText = song;
	    this.cover.src = `images/${song}.jpg`;
	}

    /**
     * The function to call when it's time to update your animation for the next repaint.
     * The callback function is passed one single argument
     */
    drawVisualizer() {

        /*
         tells the browser that you wish to perform an animation and requests that the browser calls a
         specified function to update an animation before the next repaint.
         The method takes a callback as an argument to be invoked before the repaint.
         */
        requestAnimationFrame(this.drawVisualizer)

        // copies the current frequency data into 'dataArray' (Uint8Array) passed into it as parameter.
        this.analyzerNode.getByteFrequencyData(this.dataArray)
        console.log(this.dataArray);

        const barWidth = (this.width / this.arrayLength) * 1.82;
        let barHeight;
        let x = 0;

        this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
        this.canvasContext.fillRect(0, 0, this.width, this.height);
        this.dataArray.forEach((item, index) => {
            barHeight = this.dataArray[index];
            this.canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            this.canvasContext.fillRect(x, this.height - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
        });
    }


    playSong() {
	    this.musicContainer.classList.add('play');
	    this.playBtn.querySelector(this.querySelector).classList.remove(this.classPlay);
	    this.playBtn.querySelector(this.querySelector).classList.add(this.classPause);

        // source = audioContext.createBufferSource();
        // // assign extracted AudioBuffer to source
        // source.buffer = audioCoding;
        // this.gain.connect(this.analyzerNode)

	    this.audioCtx.resume();
	}

	pauseSong() {
	    this.musicContainer.classList.remove('play');
	    this.playBtn.querySelector(this.querySelector).classList.add(this.classPlay);
	    this.playBtn.querySelector(this.querySelector).classList.remove(this.classPause);
	    this.audioCtx.suspend();
	}

	togglePlay() {
		const isPlaying = this.musicContainer.classList.contains('play');
	    if (isPlaying)
	        this.pauseSong();
	    else
	        this.playSong();
	}

	prevSong() {
	    this.songIndex--;
	    if (this.songIndex < 0)
	    	this.songIndex = this.songs.length-1;
	    this.loadSong(this.songIndex);
	    this.playSong();
	}

	nextSong() {
	    this.songIndex++;
	    if (this.songIndex > this.songs.length - 1)
	        this.songIndex = 0;
	    this.loadSong(this.songIndex);
	    this.playSong();
	}

	updateProgress(e) {
	    const {duration, currentTime} = e.srcElement;
	    console.log(duration, currenttime);
	    const progressPercent = (currentTime / duration) * 100;
	    this.progress.style.width = `${progressPercent}%`;
	}

	setProgress(e) {
	    const width = this.clientWidth;
	    const clickX = e.offsetX;
	    const duration = this.source.buffer.duration;
	    this.audioCtx.currentTime = (clickX / width) * duration;
	}
}

export default SongContainer;
