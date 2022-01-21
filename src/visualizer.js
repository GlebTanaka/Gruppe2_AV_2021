class Visualizer {
	constructor(audioCtx, inputNodes) {
		this.canvas = document.getElementById('visualizer');
		this.slider = document.getElementById("global-slider");

        this.canvasCtx = this.canvas.getContext('2d');
		this.audioCtx = audioCtx;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

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

        inputNodes[0].connect(this.analyzerNode1);
        inputNodes[1].connect(this.analyzerNode2);
        this.analyzerNode1.connect(this.audioCtx.destination);
        this.analyzerNode2.connect(this.audioCtx.destination);

		this.slider.addEventListener('input', e => {
		    inputNodes[0].gain.value = 1 - e.target.value;
		    inputNodes[1].gain.value = e.target.value;
		});
	}

	drawVisualizer(analyzerNode, color) {

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

	draw() {
		this.canvasCtx.globalAlpha = 1;
	    this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
	    this.canvasCtx.fillRect(0, 0, this.width, this.height);
	    this.drawVisualizer(this.analyzerNode1, 'rgba(255,0,0)');

	    this.canvasCtx.globalAlpha = 0.5;
	    this.drawVisualizer(this.analyzerNode2, 'rgba(0,255,0)');
	}
}

export default Visualizer;