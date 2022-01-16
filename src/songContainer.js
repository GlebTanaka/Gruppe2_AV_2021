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
}

export default SongContainer;