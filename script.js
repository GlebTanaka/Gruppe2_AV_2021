// First player:
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

// Second player:
const musicContainer2 = document.getElementById('second-music-container');
const playBtn2 = document.getElementById('second-play');
const prevBtn2 = document.getElementById('second-prev');
const nextBtn2 = document.getElementById('second-next');
const audio2 = document.getElementById('second-audio');
const progress2 = document.getElementById('second-progress');
const progressContainer2 = document.getElementById('second-progress-container');
const title2 = document.getElementById('second-title');
const cover2 = document.getElementById('second-cover');

const querySelector = "i.bi";
const classPlay = "bi-play-fill";
const classPause = "bi-pause-fill";

// Song titles
const songs = ['hey', 'summer', 'ukulele'];

// Keep track of song
let songIndex = 2;
let songIndexSecondPlayer = 2;

// Initially load song details into DOM
loadSong(songs[songIndex]);
loadSongSecondPlayer(songs[songIndexSecondPlayer]);

// Update song details
function loadSong(song) {
    title.innerText = song;
    audio.src = `music/${song}.mp3`;
    cover.src = `images/${song}.jpg`;
}

function loadSongSecondPlayer(song) {
    title2.innerText = song;
    audio2.src = `music/${song}.mp3`;
    cover2.src = `images/${song}.jpg`;
}

// Play song
function playSong() {
        musicContainer.classList.add('play');
        playBtn.querySelector(querySelector).classList.remove(classPlay);
        playBtn.querySelector(querySelector).classList.add(classPause);

        audio.play();
}

function playSongSecondPlayer() {
    musicContainer2.classList.add('play');
    playBtn2.querySelector(querySelector).classList.remove(classPlay);
    playBtn2.querySelector(querySelector).classList.add(classPause);

    audio2.play();
}
// Pause song
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector(querySelector).classList.add(classPlay);
    playBtn.querySelector(querySelector).classList.remove(classPause);

    audio.pause();
}

function pauseSongSecondPlayer() {
    musicContainer2.classList.remove('play');
    playBtn2.querySelector(querySelector).classList.add(classPlay);
    playBtn2.querySelector(querySelector).classList.remove(classPause);

    audio2.pause();
}

// Previous song
function prevSong() {
    songIndex--;

    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }

    loadSong(songs[songIndex]);

    playSong();
}

function prevSongSecondPlayer() {
    songIndexSecondPlayer--;

    if (songIndexSecondPlayer < 0) {
        songIndexSecondPlayer = songs.length - 1;
    }

    loadSongSecondPlayer(songs[songIndexSecondPlayer]);

    playSongSecondPlayer();
}

// Next song
function nextSong() {
    songIndex++;

    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }

    loadSong(songs[songIndex]);

    playSong();
}

function nextSongSecondPlayer() {
    songIndexSecondPlayer++;

    if (songIndexSecondPlayer > songs.length - 1) {
        songIndexSecondPlayer = 0;
    }

    loadSongSecondPlayer(songs[songIndexSecondPlayer]);

    playSongSecondPlayer();
}

// Update progress bar
function updateProgress(e) {
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function updateProgressSecondPlayer(e) {
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress2.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

function setProgressSecondPlayer(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio2.currentTime = (clickX / width) * duration;
}

// Event listeners
// player one play button
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

//  player two play button
playBtn2.addEventListener('click', () => {
    const isPlaying = musicContainer2.classList.contains('play');

    if (isPlaying) {
        pauseSongSecondPlayer();
    } else {
        playSongSecondPlayer();
    }
});

// Change song
// player one back button
prevBtn.addEventListener('click', prevSong);
// second player
prevBtn2.addEventListener('click', prevSongSecondPlayer);

// player two back button
nextBtn.addEventListener('click', nextSong);
// second player
nextBtn2.addEventListener('click', nextSongSecondPlayer);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);
// second audio
audio2.addEventListener('timeupdate', updateProgressSecondPlayer);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);
// second players
progressContainer2.addEventListener('click', setProgressSecondPlayer);

// Song ends
audio.addEventListener('ended', nextSong);
// second player
audio2.addEventListener('ended', nextSongSecondPlayer);

