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

        this.volume = document.getElementById('volume');
        this.bass = document.getElementById('bass');
        this.mid = document.getElementById('mid');
        this.treble = document.getElementById('treble');

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
        console.log(this.arrayLength);
        this.dataArray = new Uint8Array(this.arrayLength);
        // this.audioCoding;
        // this.source;



        /*
         Node, that represents a change in volume.
         https://developer.mozilla.org/en-US/docs/Web/API/GainNode
         */
        this.gain = new GainNode(this.audioCtx, {gain: this.volume.value});
        console.log("gain: ");
        console.log(this.gain.gain);



        /* https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/BiquadFilterNode */
        /**
         * simple low-order filter for boosting lower frequencies.
         * @type {BiquadFilterNode}
         */
        this.bassEqualizer = new BiquadFilterNode(this.audioCtx, {
            type: 'lowshelf',
            frequency: this.lowerBandThreshold,
            gain: this.bass.value
        });

        /**
         * simple low-order filter to boost all frequencies, here for mid range.
         * @type {BiquadFilterNode}
         */
        this.midEqualizer = new BiquadFilterNode(this.audioCtx, {
            type: 'peaking',
            Q: Math.SQRT1_2,
            frequency: 1500,
            gain: this.mid.value
        });

        /**
         * simple low-oder filter to boost high frequencies.
         * @type {BiquadFilterNode}
         */
        this.trebleEqualizer = new BiquadFilterNode(this.audioCtx, {
            type: 'highshelf',
            frequency: this.higherBandThreshold,
            gain: this.treble.value
        });

        this.volume.addEventListener("change", this.changeVolume.bind(this));

        this.bass.addEventListener('input', e => {
            this.bassEqualizer.gain.value = parseInt(e.target.value);
        });

        this.mid.addEventListener('input', e => {
            this.midEqualizer.gain.value = parseInt(e.target.value);
        });

        this.treble.addEventListener('input', e => {
            this.trebleEqualizer.gain.value = parseInt(e.target.value);
        });

    }


	loadSong(index) {
		if (this.source) this.source.disconnect();
		this.source = this.audioCtx.createBufferSource();
	    let request = new XMLHttpRequest();
	    let song = this.songs[index];
	    request.open('GET', `music/${song}.mp3`, true);
	    request.responseType = 'arraybuffer';
	    request.onload = function() {
	        this.audioCtx.decodeAudioData(request.response, function(buffer) {
	            this.source.buffer = buffer;
                console.log(buffer);

                this.source.connect(this.gain);
                // this.gain.connect(this.analyzerNode);
                this.gain.connect(this.trebleEqualizer);
                this.trebleEqualizer.connect(this.bassEqualizer);
                this.bassEqualizer.connect(this.midEqualizer);
                this.midEqualizer.connect(this.analyzerNode);

	            this.analyzerNode.connect(this.audioCtx.destination);
	            this.source.loop = true;
	        }.bind(this));
	    }.bind(this);
	    request.send();

	    this.audioCtx.suspend();
	    this.source.start(0);
	    this.title.innerText = song;
	    this.cover.src = `images/${song}.jpg`;
	}




    playSong() {
	    this.musicContainer.classList.add('play');
	    this.playBtn.querySelector(this.querySelector).classList.remove(this.classPlay);
	    this.playBtn.querySelector(this.querySelector).classList.add(this.classPause);
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

    changeVolume() {
        this.gain.gain.value = this.volume.value;
    }
}

export default SongContainer;
