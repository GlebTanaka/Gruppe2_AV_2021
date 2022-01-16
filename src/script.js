import SongContainer from './songContainer.js';

const songContainer1 = new SongContainer('1');
const songContainer2 = new SongContainer('2');

// Initially load song details into DOM
songContainer1.loadSong(0);
songContainer1.drawVisualizer();
songContainer2.loadSong(0);




