

const context = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = {};
const gainNodes = {};

async function loadWav(sound, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffers[sound] = await context.decodeAudioData(arrayBuffer);
}

function play(sound) {
  const now = context.currentTime;

  const source = context.createBufferSource();
  const gainNode = context.createGain();
  gainNodes[sound] = gainNode;

  source.buffer = audioBuffers[sound];
  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(now);
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadWav('kick', 'audio/kick.wav');
  await loadWav('snare', 'audio/snare.wav');
  await loadWav('hihat', 'audio/hihat.wav');
  await loadWav('hihat_open', 'audio/hihat_open.wav');
});

document.addEventListener("keypress", async e => {
  if(['s', 'd'].includes(e.key)) {
    play('kick');
  } else if(['f', 'h'].includes(e.key)) {
    play('snare');
  } else if(['j', 'k'].includes(e.key)) {
    play('hihat');
  } else if(['l'].includes(e.key)) {
    play('hihat_open');
  }
});

document.addEventListener("keyup", async e => {
  if(['l'].includes(e.key)) {
    const now = context.currentTime;
    gainNodes['hihat_open'].gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  }
});