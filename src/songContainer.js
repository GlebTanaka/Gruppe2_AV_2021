class SongContainer {
	constructor(titleSuffix, audioCtx, allSongs) {

		this.musicContainer = document.getElementById('music-container-'+titleSuffix);
		this.playBtn = document.getElementById('play-'+titleSuffix);
		this.prevBtn = document.getElementById('prev-'+titleSuffix);
		this.nextBtn = document.getElementById('next-'+titleSuffix);
		this.progressContainer = document.getElementById('progress-container-'+titleSuffix);
		this.progress = document.getElementById('progress-'+titleSuffix);

		this.querySelector = "i.bi";
		this.classPlay = "bi-play-fill";
		this.classPause = "bi-pause-fill";

		this.itemsNavigation = {
			img:		document.getElementById('img-'+titleSuffix),
			eq:			document.getElementById('eq-'+titleSuffix),
			settings:	document.getElementById('settings-'+titleSuffix),
			link:		document.getElementById('link-'+titleSuffix)
		};
		this.itemsSubcontainer = {
			img:		document.getElementById('img-subcontainer-'+titleSuffix),
			eq:			document.getElementById('eq-subcontainer-'+titleSuffix),
			settings:	document.getElementById('settings-subcontainer-'+titleSuffix),
			link:		document.getElementById('link-subcontainer-'+titleSuffix)
		}

		// img subcontainer
		this.title = document.getElementById('title-'+titleSuffix);
		this.cover = document.getElementById('cover-'+titleSuffix);
		this.audio = document.getElementById('audio-'+titleSuffix);

		// eq subcontainer
        this.volume = document.getElementById('volume-'+titleSuffix);
        this.bass = document.getElementById('bass-'+titleSuffix);
        this.mid = document.getElementById('mid-'+titleSuffix);
        this.treble = document.getElementById('treble-'+titleSuffix);

        // song data
		this.audioCtx = audioCtx;
		this.songs = allSongs;
		this.songIndex = 0;
		this.createSongs();

        this.lowerBandThreshold = 500;
        this.higherBandThreshold = 3000;

        this.gain = new GainNode(this.audioCtx, {
        	gain: this.volume.value
        });
        this.bassEqualizer = new BiquadFilterNode(this.audioCtx, {
            type: 'lowshelf',
            frequency: this.lowerBandThreshold,
            gain: this.bass.value
        });
        this.midEqualizer = new BiquadFilterNode(this.audioCtx, {
            type: 'peaking',
            Q: Math.SQRT1_2,
            frequency: 1500,
            gain: this.mid.value
        });
        this.trebleEqualizer = new BiquadFilterNode(this.audioCtx, {
            type: 'highshelf',
            frequency: this.higherBandThreshold,
            gain: this.treble.value
        });
        this.outputNode = new GainNode(this.audioCtx, {
        	gain: 1
        });

		// Event listeners (event targets abfragen)
		// play button
		this.playBtn.addEventListener('click', this.togglePlay.bind(this));
		// back button
		this.prevBtn.addEventListener('click', this.prevSong.bind(this));
		// next button
		this.nextBtn.addEventListener('click', this.nextSong.bind(this));
		// Time/song update
		this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
		// Click on progress bar
		this.progressContainer.addEventListener('click', this.setProgress.bind(this));

		// change eq sliders
        this.volume.addEventListener('input', e => {
            this.gain.gain.value = e.target.value;
        });
        this.bass.addEventListener('input', e => {
            this.bassEqualizer.gain.value = parseInt(e.target.value);
        });
        this.mid.addEventListener('input', e => {
            this.midEqualizer.gain.value = parseInt(e.target.value);
        });
        this.treble.addEventListener('input', e => {
            this.trebleEqualizer.gain.value = parseInt(e.target.value);
        });

        // switch tabs in song container
        for (let selectedItem in this.itemsNavigation) {
        	this.itemsNavigation[selectedItem].addEventListener('click', this.switchSubcontainer.bind(this, selectedItem));
        }
    }

	createSongs(){
		this.songs.forEach(song => this.createSongSetting(song));
	}

	checkBoxSwitch(inputNode, song){
		if(inputNode.checked){
			if(!this.songs.includes(song)){
				this.songs.push(song);
			}
		}else{
			this.songs = this.songs.filter(function(value, index, arr){ 
				return song != value;
			});
		}
	}

	createSongSetting(song){
		var node = document.createElement("tr"); 
		var cellLabel = document.createElement("td");
		var cellInput = document.createElement("td"); 
		var labelNode = document.createTextNode(song);
		var inputNode = document.createElement("input");
		inputNode.type = "checkbox";
		inputNode.checked = true;
		inputNode.addEventListener('change',() =>{ this.checkBoxSwitch(inputNode, song)});
		
		cellLabel.appendChild(labelNode);
		node.appendChild(cellLabel);
		cellInput.appendChild(inputNode);
		node.appendChild(cellInput);
		
		this.itemsSubcontainer.settings.appendChild(node);
	}

	loadSong(index) {
	    let song = this.songs[index];
	    this.audio.src = `music/${song}.mp3`;
	    this.source = this.audioCtx.createMediaElementSource(this.audio);

	    this.source.connect(this.gain);
        this.gain.connect(this.trebleEqualizer);
        this.trebleEqualizer.connect(this.bassEqualizer);
        this.bassEqualizer.connect(this.midEqualizer);
        this.midEqualizer.connect(this.outputNode);
        this.source.loop = true;
	    this.title.innerText = song;
	    this.cover.src = `images/${song}.jpg`;
	}

    playSong() {
	    this.musicContainer.classList.add('play');
	    this.playBtn.querySelector(this.querySelector).classList.remove(this.classPlay);
	    this.playBtn.querySelector(this.querySelector).classList.add(this.classPause);
	    this.audio.play();
	}

	pauseSong() {
	    this.musicContainer.classList.remove('play');
	    this.playBtn.querySelector(this.querySelector).classList.add(this.classPlay);
	    this.playBtn.querySelector(this.querySelector).classList.remove(this.classPause);
	    this.audio.pause();
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
	    const progressPercent = (currentTime / duration) * 100;
	    this.progress.style.width = `${progressPercent}%`;
	}

	setProgress(e) {
	    const width = this.progressContainer.clientWidth;
	    const clickX = e.offsetX;
	    const duration = this.audio.duration;
	    this.audio.currentTime = (clickX / width) * duration;
	}

    switchSubcontainer(selectedItem) {
    	for (let item in this.itemsSubcontainer) {
    		this.itemsSubcontainer[item].hidden = (item != selectedItem);
    	}
    }
}

export default SongContainer;