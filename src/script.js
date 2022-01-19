import SongContainer from './songContainer.js';

const songContainer1 = new SongContainer('1');
const songContainer2 = new SongContainer('2');
const slider = document.getElementById("global-slider");
/**
 * The function to call when it's time to update your animation for the next repaint.
 * The callback function is passed one single argument
 */
function drawVisualizer() {

    /*
     tells the browser that you wish to perform an animation and requests that the browser calls a
     specified function to update an animation before the next repaint.
     The method takes a callback as an argument to be invoked before the repaint.
     */
    requestAnimationFrame(drawVisualizer);

    // copies the current frequency data into 'dataArray' (Uint8Array) passed into it as parameter.
    songContainer1.analyzerNode.getByteFrequencyData(songContainer1.dataArray)

    const barWidth = (songContainer1.width / songContainer1.arrayLength) * 1.82;
    let barHeight;
    let x = 0;

    songContainer1.canvasContext.fillStyle = 'rgb(0, 0, 0)';
    songContainer1.canvasContext.fillRect(0, 0, songContainer1.width, songContainer1.height);
    songContainer1.dataArray.forEach((item, index) => {
        barHeight = songContainer1.dataArray[index];
        songContainer1.canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        songContainer1.canvasContext.fillRect(x, songContainer1.height - barHeight / 2, barWidth, barHeight);
        x += barWidth + 1;
    });
}

slider.addEventListener('input', e => {
    songContainer1.globalGain =  1 - e.target.value;
    songContainer2.globalGain =  e.target.value;
    songContainer1.gain.gain.value = songContainer1.globalGain * songContainer1.volume.valueOf().value;
    songContainer2.gain.gain.value = songContainer2.globalGain * songContainer2.volume.valueOf().value;
})

// Initially load song details into DOM
songContainer1.loadSong(0);
drawVisualizer();
songContainer2.loadSong(0);




