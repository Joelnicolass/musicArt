const model =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

//AUDIO---------------------
let pitch;
let mic;
let initialized = false;
let selection;
let freq = 0;
let diff = freq - 440;
let onVoice = 0;
//IMAGE--------------------
let o = 8;
/* let width = 500;
let height = 500; */
let mult = 0.008;
let density = 10;
let space;
let points = [];
let pointsb = [];
let r;
let g;
let b;
let colorfill;
let c1;
let c2;
let finalfill;
//SETUP---------------------------------------------------------

function setup() {
  angleMode(DEGREES);
  noiseDetail(1.5, 8);

  if (windowWidth < 700) {
    createCanvas(windowWidth / 1.1, windowHeight / 2);
    density = 10;
  } else if (windowWidth > 700 && windowWidth < 1000) {
    createCanvas(windowWidth / 1.5, windowHeight / 2);
    density = 20;
  } else if (windowWidth > 1000) {
    createCanvas(windowWidth / 2.5, windowHeight / 2);
    density = 20;
  }

  space = width / density;
  background(20);
  /* frameRate(30); */
  mic = new p5.AudioIn();
  mic.start(micInitialized);
  fft = new p5.FFT();
  fft.setInput(mic);

  for (let x = 0; x < width; x += space) {
    for (let y = 0; y < height; y += space) {
      let p = createVector(x + random(-10, 10), y + random(-10, 10));
      points.push(p);
    }
  }

  button = createButton("Guardar");
  button.mousePressed(saveImg);
}
//--------------------------------------------------------------

//config notes--------------------------------------------------
function noteFromPitch(frequency) {
  let noteText = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
    /* "C2",
    "C#2",
    "D2",
    "D#2",
    "E2",
    "F2",
    "F#2",
    "G2",
    "G#2",
    "A2",
    "A#2",
    "B2", */
  ];
  let noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  let nnum = Math.round(noteNum) + 69;
  let note = nnum % 12;
  return noteText[note];
}

const noteFinal = () => {
  let note = noteFromPitch(freq);
  if (note === undefined) {
    onVoice = 0;
    return 0;
  }
  onVoice = 1;
  return note;
};

//-------------------mic init and config
function micInitialized() {
  console.log("Mic Initialized");
  pitch = ml5.pitchDetection(model, getAudioContext(), mic.stream, modelLoaded);
}

function gotPitch(err, frequency) {
  if (err) {
    console.log(err);
  } else {
    freq = frequency;
  }
  pitch.getPitch(gotPitch);
}

function modelLoaded() {
  console.log("Model Loaded");
  pitch.getPitch(gotPitch);
}

function colorTone(note) {
  switch (note) {
    case "C":
      r = 255;
      g = 84;
      b = 84;
      break;
    case "C#":
      r = 255;
      g = 118;
      b = 84;
      break;
    case "D":
      r = 255;
      g = 158;
      b = 84;
      break;
    case "D#":
      r = 255;
      g = 201;
      b = 84;
      break;
    case "E":
      r = 255;
      g = 246;
      b = 84;
      break;
    case "F":
      r = 215;
      g = 255;
      b = 84;
      break;
    case "F#":
      r = 133;
      g = 255;
      b = 84;
      break;
    case "G":
      r = 84;
      g = 255;
      b = 212;
      break;
    case "G#":
      r = 84;
      g = 215;
      b = 255;
      break;
    case "A":
      r = 84;
      g = 141;
      b = 255;
      break;
    case "A#":
      r = 110;
      g = 84;
      b = 255;
      break;
    case "B":
      r = 255;
      g = 84;
      b = 212;
      break;

    default:
      r = 255;
      g = 255;
      b = 255;
      break;
  }
}

function saveImg() {
  /* save(cnv, "MusicArt.png"); */
  saveCanvas("MusicArt.png");
}
function windowResized() {
  if (windowWidth < 700) {
    resizeCanvas(windowWidth / 1.1, windowHeight / 2);
    density = 20;
  } else if (windowWidth > 700 && windowWidth < 1000) {
    resizeCanvas(windowWidth / 1.5, windowHeight / 2);
    density = 20;
  } else if (windowWidth > 1000) {
    resizeCanvas(windowWidth / 2.5, windowHeight / 2);
    density = 20;
  }
}
//RENDER--------------------------------------------------------

function draw() {
  noStroke();
  fill(255);
  getAudioContext().resume();
  /* console.log(noteFinal()); */

  /* console.log(o); */
  /* console.log(density); */
  //agrandar ruido

  /* density = o + 0.005; */
  /* o = o + 0.05;
  noiseDetail(1.5, o); */

  //color notas
  colorTone(noteFinal());

  /* fill(r, g, b); */

  //particulas
  for (let i = 0; i < points.length; i++) {
    //colores
    /*     r = map(points[i].x, 0, width, 50, 255);
    g = map(points[i].x, 0, width, 50, 255);
    b = map(points[i].x, 0, width, 255, 50); */

    //alpha canvas
    let alpha = map(
      dist(width / 2, height / 2, points[i].x, points[i].y),
      0,
      250,
      255,
      0
    );

    fill(r, g, b, alpha);
    //forma
    let angle = map(
      noise(points[i].x * mult, points[i].y * mult),
      0,
      onVoice,
      0,
      freq * 0.5
    );

    points[i].add(createVector(cos(angle), sin(angle)));

    if (dist(width / 2, height / 2, points[i].x, points[i].y) < 230) {
      ellipse(points[i].x, points[i].y, mic.getLevel() * 20);
    }
  }
}
//--------------------------------------------------------------
