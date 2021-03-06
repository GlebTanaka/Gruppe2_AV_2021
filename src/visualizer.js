class Visualizer {
    constructor(audioCtx, songContainers) {
        this.canvas = document.getElementById('visualizer');
        this.slider = document.getElementById("global-slider");
        this.masterPlayBtn = document.getElementById("master-play-btn");
        this.switchBtn = document.getElementById("switch-left-and-right");
        this.toggleVisualisation = document.getElementById("visualizer-toggle");

        this.canvasCtx = this.canvas.getContext('2d');
        this.audioCtx = audioCtx;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.amplitudeStile = true;
        this.querySelector = "i.bi";
        this.classPlay = "bi-play-fill";
        this.classPause = "bi-pause-fill";
        this.classToggleOff = "bi-toggle-off";
        this.classToggleOn = "bi-toggle-on";

        this.analyzerNode1 = new AnalyserNode(this.audioCtx, {
            fftSize: 256,
            maxDecibels: -25,
            minDecibels: -60,
            smoothingTimeConstant: 0.8
        });
        this.analyzerNode2 = new AnalyserNode(this.audioCtx, {
            fftSize: 256,
            maxDecibels: -25,
            minDecibels: -60,
            smoothingTimeConstant: 0.8
        });
        

        // number of data values for the visualization (128)
        this.arrayLength = this.analyzerNode1.frequencyBinCount;
        this.dataArray = new Uint8Array(this.arrayLength);

        this.bufferLength = this.analyzerNode1.fftSize
        this.dataArrayForSinewave = new Uint8Array(this.bufferLength);

        songContainers[0].processingGraph.outputNode.connect(this.analyzerNode1);
        songContainers[1].processingGraph.outputNode.connect(this.analyzerNode2);
        this.analyzerNode1.connect(this.audioCtx.destination);
        this.analyzerNode2.connect(this.audioCtx.destination);

        this.slider.addEventListener('input', e => {
            this.crossFadeVolumeOfTwoSongContainers(songContainers, e);
        });
        this.switchBtn.addEventListener('click', () => {
            if (this.isAtLeastOneSongContainerPlaying(songContainers)) {
                this.switchBetweenSongContainers(songContainers);
            }
        });
        this.masterPlayBtn.addEventListener('click', () => {
            if (this.isBothSongContainerNotPlaying(songContainers)) {
                this.playAllSongContainer(songContainers);
            } else if (this.isOneOfTwoSongContainerPlaying(songContainers)){
                this.stopAllSongContainer(songContainers);
            }
        });
        this.toggleVisualisation.addEventListener('click', this.toggleStile.bind(this));
    }

    drawVisualizerAmplitude(analyzerNode, color) {

        analyzerNode.getByteFrequencyData(this.dataArray);

        const barWidth = (this.width / this.arrayLength) * 1.82;
        let barHeight;
        let x = 0;

        this.dataArray.forEach((item, index) => {
            barHeight = this.dataArray[index];
            //this.canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            this.canvasCtx.fillStyle = color;
            this.canvasCtx.fillRect(x, this.height - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
        });
    }

    drawVisualizerSinewave(analyzerNode, color) {

        analyzerNode.getByteTimeDomainData(this.dataArrayForSinewave);
        this.canvasCtx.lineWidth = 3;
        this.canvasCtx.strokeStyle = color;
        this.canvasCtx.beginPath();

        const sliceWidth = this.width * 1.0 / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            let v = this.dataArrayForSinewave[i] / 128.0;
            let y = v * this.height / 2;

            if (i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.canvasCtx.stroke();
    }

    draw() {
        this.canvasCtx.globalAlpha = 1;
        this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        this.canvasCtx.fillRect(0, 0, this.width, this.height);
        this.canvasCtx.globalAlpha = 0.5;
        if (this.amplitudeStile)
            this.amplitude();
        else
            this.sinewave();
    }

    amplitude() {
        this.drawVisualizerAmplitude(this.analyzerNode1, 'rgba(255,0,0)')
        this.drawVisualizerAmplitude(this.analyzerNode2, 'rgba(0,255,0)');
    }

    sinewave() {
        this.drawVisualizerSinewave(this.analyzerNode1, 'rgba(255,0,0)');
        this.drawVisualizerSinewave(this.analyzerNode2, 'rgba(0,255,0)');
    }

    crossFadeVolumeOfTwoSongContainers(songContainers, e) {
        songContainers[0].processingGraph.outputNode.gain.value = 1 - e.target.value;
        songContainers[1].processingGraph.outputNode.gain.value = e.target.value;
    }

    toggleStile() {
        this.amplitudeStile = !this.amplitudeStile;
        if (this.amplitudeStile) {
            this.toggleVisualisation.querySelector(this.querySelector).classList.remove(this.classToggleOn);
            this.toggleVisualisation.querySelector(this.querySelector).classList.add(this.classToggleOff);
        } else {
            this.toggleVisualisation.querySelector(this.querySelector).classList.add(this.classToggleOn);
            this.toggleVisualisation.querySelector(this.querySelector).classList.remove(this.classToggleOff);
        }
    }

    stopAllSongContainer(songContainers) {
        this.masterPlayBtn.querySelector(this.querySelector).classList.remove(this.classPause);
        this.masterPlayBtn.querySelector(this.querySelector).classList.add(this.classPlay);
        songContainers[0].pauseSong();
        songContainers[1].pauseSong();
    }

    playAllSongContainer(songContainers) {
        this.masterPlayBtn.querySelector(this.querySelector).classList.remove(this.classPlay);
        this.masterPlayBtn.querySelector(this.querySelector).classList.add(this.classPause);
        songContainers[0].playSong();
        songContainers[1].playSong();
    }

    switchBetweenSongContainers(songContainers) {
        songContainers[0].togglePlay();
        songContainers[1].togglePlay();
    }

    isOneOfTwoSongContainerPlaying(songContainers) {
        return songContainers[0].musicContainer.classList.contains('play')
            || songContainers[1].musicContainer.classList.contains('play');
    }

    isBothSongContainerNotPlaying(songContainers) {
        return !songContainers[0].musicContainer.classList.contains('play')
            && !songContainers[1].musicContainer.classList.contains('play');
    }

    isAtLeastOneSongContainerPlaying(songContainers) {
        return songContainers[0].musicContainer.classList.contains('play') && !songContainers[1].musicContainer.classList.contains('play')
            || !songContainers[0].musicContainer.classList.contains('play') && songContainers[1].musicContainer.classList.contains('play');
    }
}

export default Visualizer;
