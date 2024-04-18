let button_restart;
let button_up;
let button_down;
let button_weathering;
let button_layering;
let restartString = "البدء من جديد";
let upString = "حركة أرضيَّة رافعة";
let downString = "حركة أرضيَّة هابطة";
let weatheringString = "تجوية و تعرية";
let layeringString = "ترسيب";

let levelingAmount = 40;
let weatheringAmount = 40;
let dt = 0.1;
let ground;
let sea;
let layers = [];
let rain;

// let images=[];
// function preload() {
//   // Assuming you have 3 images in the same directory as your sketch
//   images[0] = loadImage('image1.jpg');
//   images[1] = loadImage('image2.jpg');
//   images[2] = loadImage('image3.jpg');
// }

function setup() {
  createCanvas(windowWidth, windowHeight * 0.6);
  ground = new Ground();
  sea = new Sea();

  button_restart = createButton(restartString);
  button_restart.mousePressed(restart);

  createDiv();

  button_up = createButton(upString);
  button_up.mousePressed(groundUp);

  button_down = createButton(downString);
  button_down.mousePressed(groundDown);
  createDiv();
  button_weathering = createButton(weatheringString);
  button_weathering.mousePressed(groundWeathering);

  button_layering = createButton(layeringString);
  button_layering.mousePressed(groundLayering);
}

function draw() {
  colorMode(RGB);
  background(100, 180, 255);

  //evolutions
  if (rain) {
    rain.evolve(dt);
  }
  ground.evolve(dt);
  sea.evolve(dt);
  if (ground.groundLevel > 0 && rain && rain.TTL > 0) {
    ground.groundLevel -= 0.2;
  }

  //displays
  if (rain) {
    rain.display();
  }
  sea.display();
  for (let i = 0; i < layers.length; i++) {
    layers[i].display();
  }
  ground.display();
}

function groundUp() {
  ground.groundLevel += levelingAmount;
}
function groundDown() {
  ground.groundLevel -= levelingAmount;
}
function groundWeathering() {
  if (!rain) {
    rain = new Rain();
  }
  rain.restart();
  // if (ground.groundLevel > 0) {
  //   ground.groundLevel -= weatheringAmount;
  // }
}
function groundLayering() {
  let last = layers[layers.length - 1];
  print(last);
  if (ground.groundLevel < -0.0000001 && (!layers.length > 0 || last.y > height / 2)) {
    let l = new Layer();
    if (layers.length > 0) {
      l.y = last.y - l.h;
    } else {
      l.y = height / 2 - ground.groundLevel - l.h;
    }
    layers.push(l);
  }
}

function restart() {
  ground = new Ground();
  sea = new Sea();
  rain = undefined;
  layers = [];
}
