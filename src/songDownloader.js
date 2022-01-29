import bufferToWave from "./audioBufferToWav.js";

class SongDownloader {
    constructor(songContainers) {
        this.downloadBtn = document.getElementById("download");
        this.songContainers = songContainers;
        this.sourceBuffers = [];
        this.offlineCtx;

        this.downloadBtn.addEventListener("click", this.download.bind(this));
    }

    async download() {
    	const duration = Math.max(
    		this.songContainers[0].audio.duration,
    		this.songContainers[0].audio.duration);

    	// init context and processing graph
    	this.offlineCtx = new OfflineAudioContext(2,44100*duration,44100);
    	let processingGraph1 = this.songContainers[0].initProcessingGraph(this.offlineCtx);
        let processingGraph2 = this.songContainers[1].initProcessingGraph(this.offlineCtx);
        processingGraph1.outputNode.connect(this.offlineCtx.destination);
    	processingGraph2.outputNode.connect(this.offlineCtx.destination);
    	this.sourceBuffers = [
    		this.offlineCtx.createBufferSource(),
    		this.offlineCtx.createBufferSource()];
    	this.sourceBuffers[0].connect(processingGraph1.gain);
    	this.sourceBuffers[1].connect(processingGraph2.gain);

    	console.log("download started");
    	await this.loadSourceBuffer(0);
    	await this.loadSourceBuffer(1);

    	this.offlineCtx.startRendering().then(function(buffer) {
    		let blob = bufferToWave(buffer, buffer.length);
        	this.downloadURI(URL.createObjectURL(blob), "mashup.wav");

        	// clean up
			this.sourceBuffers[0].disconnect();
			this.sourceBuffers[1].disconnect();

        	console.log("download finished");
    	}.bind(this));
    }

    loadSourceBuffer(index) {
    	let resolve;
    	let request = new XMLHttpRequest();
    	const promise = new Promise(r => resolve = r);
        request.open('GET', this.songContainers[index].audio.src, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            let audioData = request.response;
            this.offlineCtx.decodeAudioData(audioData, function(buffer) {
                this.sourceBuffers[index].buffer = buffer;
                this.sourceBuffers[index].start();
                resolve();
            }.bind(this));
        }.bind(this);
        request.send();
        return promise;
    }

    downloadURI(uri, name) {
        let link = document.createElement("a");
        link.hidden = true;
        link.download = name;
        link.href = uri;
        link.click();
    }
}

export default SongDownloader;