import SongContainer from './songContainer.js';
import Visualizer from './visualizer.js';

const audioCtx = new AudioContext();
const songContainer1 = new SongContainer('1', audioCtx);
const songContainer2 = new SongContainer('2', audioCtx);
const visualizer = new Visualizer(
    audioCtx,
    [songContainer1.outputNode,songContainer2.outputNode]
);

// Initially load song details into DOM
songContainer1.loadSong(0);
songContainer2.loadSong(0);

function draw() {
    requestAnimationFrame(draw);
    visualizer.draw();
}
draw();





