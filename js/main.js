const myGif = GIFGroover();
myGif.src = "img/baldi.gif";
myGif.onload = gifLoad;
const canvas = document.getElementById("canvas");

function gifLoad(event) {
  const gif = event.gif;
  canvas.width = gif.width; // set canvas size to match the gif.
  canvas.height = gif.height;
  const ctx = canvas.getContext("2d"); // get a rendering context
  requestAnimationFrame(displayGif); // start displaying the gif.

  // Display loop
  function displayGif() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear in case the gif is transparent
    ctx.drawImage(gif.image, 0, 0); // The current frame
    requestAnimationFrame(displayGif);
  }
}
var sound = document.getElementById('sound');
var context = new AudioContext();
var fileInput = document.getElementById("fileInput");
fileInput.onchange = function() {
  var files = fileInput.files;
  if (files.length == 0) return;
  var reader = new FileReader();
  sound.pause();
  myGif.pause();
  myGif.seekFrame(180);
  document.getElementById('loading').style.display = 'inline';
  reader.onload = function(fileEvent) {
    context.decodeAudioData(fileEvent.target.result, calcTempo);
  }
  reader.readAsArrayBuffer(files[0]);
}
var calcTempo = function(buffer, element) {
  var audioData = [];
  // Take the average of the two channels
  if (buffer.numberOfChannels == 2) {
    var channel1Data = buffer.getChannelData(0);
    var channel2Data = buffer.getChannelData(1);
    var length = channel1Data.length;
    for (var i = 0; i < length; i++) {
      audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
    }
  } else {
    audioData = buffer.getChannelData(0);
  }

  var mt = new MusicTempo(audioData, {
    minBeatInterval: 0.3
  });

  console.log(mt);
  myGif.playSpeed = Number(mt.tempo) / 100
  sound.src = URL.createObjectURL(fileInput.files[0]);
  sound.play();
  myGif.play();
  document.getElementById('bpmslider').value = Math.round(mt.tempo);
  document.getElementById('loading').style.display = 'none';
  document.getElementById('info').innerText = `Tempo: ${Math.round(mt.tempo)} BPM`;
}

function updateSlider(slideAmount) {
  myGif.playSpeed = Number(slideAmount) / 100
  document.getElementById('info').innerText = `Tempo: ${Math.round(slideAmount)} BPM`;
}