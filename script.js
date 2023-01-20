

let video;
let videoSize = 64;
let ready = false;

let pixelBrain;
let label = '';
let ctx;
let counterOne = 0;
let counterTwo = 0;
let counterBg = 0;
let countDisplayOne;
let countDisplayTwo;
let countDisplayBg;


function websiteVisits(response) {
    document.querySelector("#visits").textContent = response.value;
}


function setup() {
  let canvas = document.getElementById('myCanvas');
  canvas.width = 200;
  canvas.height = 200;
  ctx = canvas.getContext('2d');
  

  video = document.createElement('video');
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      video.srcObject = stream;
      video.play();
      videoReady();
    });
  video.width = videoSize;
  video.height = videoSize;
  video.style.display = 'none';

  var options = {
    inputs: [64, 64, 4],
    task: 'imageClassification',
    debug: false,
  };
  pixelBrain = ml5.neuralNetwork(options);


  countDisplayBg = document.getElementById('counterBg');
  countDisplayBg.id = 'counterBg';
  countDisplayBg.innerHTML = `Example Bg: ${counterBg}`;


  countDisplayOne = document.getElementById('counterOne');
  countDisplayOne.id = 'counterOne';
  countDisplayOne.innerHTML = `Example 1: ${counterOne}`;



  countDisplayTwo = document.getElementById('counterTwo');
  countDisplayTwo.id = 'counterTwo';
  countDisplayTwo.innerHTML = `Example 2: ${counterTwo}`;


  // Add event listeners to buttons
  document.getElementById('train-button').addEventListener('click', train);
  document.getElementById('restart-button').addEventListener('click', restart);
 
//   document.getElementById('save-button').addEventListener('click', saveData);
  document.getElementById('add-bg-button').addEventListener('click', addExampleBg);
  document.getElementById('add-one-button').addEventListener('click', addExampleOne);
  document.getElementById('add-two-button').addEventListener('click', addExampleTwo);
}

function loaded() {
  pixelBrain.train(
    {
      epochs: 50,
    },
    finishedTraining
  );
}

function finishedTraining() {
  console.log('training complete');
  classifyVideo();
}

function classifyVideo() {
  let imageDetected = {
    image: video,
  };
  pixelBrain.classify(imageDetected, gotResults);
  
}


function gotResults(error, results) {
  if (error) {
    return;
  }
    label = results[0].label;
  classifyVideo();
}

// Button callback functions
function train() {
  pixelBrain.normalizeData();
  pixelBrain.train(
    {
      epochs: 50,
    },
    finishedTraining
  );
}

// function saveData() {
//   pixelBrain.saveData();
// }

function restart() {
  location.reload();
}


function addExampleBg() {
    counterBg++;
    countDisplayBg.innerHTML = `Example Bg: ${counterBg}`;
  addExample('Bg');
}
function addExampleOne() {
    counterOne++;
    countDisplayOne.innerHTML = `Example 1: ${counterOne}`;
  addExample('One');
}

function addExampleTwo() {
    counterTwo++;
    countDisplayTwo.innerHTML = `Example 2: ${counterTwo}`;
  addExample('Two');
}

function addExample(label) {
  let inputImage = {
    image: video,
  };
  let target = {
    label,
  };
//   console.log('Adding example: ' + label);
  pixelBrain.addData(inputImage, target);
}

// Video is ready!
function videoReady() {
  ready = true;
}

function draw() {
  ctx.fillStyle = 'light-grey';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (ready) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }
  
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
 

    ctx.fillText(label, canvas.width / 2, canvas.height / 2);
  
  

  
  
  }
 


