import SongContainer from './songContainer.js';
import Visualizer from './visualizer.js';

const allSongs = ['hey', 'summer', 'ukulele'];
const audioCtx = new AudioContext();
const songContainer1 = new SongContainer('1', audioCtx, allSongs);
const songContainer2 = new SongContainer('2', audioCtx, allSongs);
const visualizer = new Visualizer(
    audioCtx,
    // [songContainer1.outputNode,songContainer2.outputNode]

    [songContainer1,songContainer2]
);

// Initially load song details into DOM
songContainer1.loadSong(0);
songContainer2.loadSong(0);

function draw() {
    requestAnimationFrame(draw);
    visualizer.draw();
}
draw();





