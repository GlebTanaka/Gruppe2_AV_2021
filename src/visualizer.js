class Visualizer {
	constructor(audioCtx, inputNodes) {
		this.canvas = document.getElementById('visualizer');
		this.slider = document.getElementById("global-slider");
        this.toggleVisualisation = document.getElementById("visualizer-toggle");

        this.canvasCtx = this.canvas.getContext('2d');
		this.audioCtx = audioCtx;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.amplitudeStile = true;
        this.querySelector = "i.bi";
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
        this.dataArray02 = new Uint8Array(this.bufferLength);

        inputNodes[0].connect(this.analyzerNode1);
        inputNodes[1].connect(this.analyzerNode2);
        this.analyzerNode1.connect(this.audioCtx.destination);
        this.analyzerNode2.connect(this.audioCtx.destination);

		this.slider.addEventListener('input', e => {
		    inputNodes[0].gain.value = 1 - e.target.value;
		    inputNodes[1].gain.value = e.target.value;
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
        analyzerNode.getByteTimeDomainData(this.dataArray02);
        this.canvasCtx.lineWidth = 3;
        this.canvasCtx.strokeStyle = color;
        this.canvasCtx.beginPath();

        const sliceWidth = this.width * 1.0 / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            let v = this.dataArray02[i] / 128.0;
            let y = v * this.height/2;

            if(i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        this.canvasCtx.lineTo(this.canvas.width, this.canvas.height/2);
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
        this.drawVisualizerAmplitude(this.analyzerNode1, 'rgba(255,0,0)');
        this.drawVisualizerAmplitude(this.analyzerNode2, 'rgba(0,255,0)');
    }

    sinewave() {
        this.drawVisualizerSinewave(this.analyzerNode1, 'rgba(255,0,0)');
        this.drawVisualizerSinewave(this.analyzerNode2, 'rgba(0,255,0)');
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
}

export default Visualizer;
