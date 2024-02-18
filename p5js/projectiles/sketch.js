//let canvasWidth = 700;
//let canvasHeight = (canvasWidth * 9) / 16;
let canvasWidth = 0; //windowWidth;
let canvasHeight = 0;
let dt = 0.1;
let g = 9.81; // gravity

let groundSpots = [];
let groundSpotsMax = 30;
let time_ellapsed = 0;

let vInput;
let thetaInput;
let startButton;

let v;
let theta;
let running = false;

let _position;
let velocity;

let projectionLine = true;
let maxHeightLine = true;
let maxHeight = canvasHeight;

function setup() {
  canvasWidth = windowWidth;
  canvasHeight = (canvasWidth * 5) / 16;
  createCanvas(canvasWidth, canvasHeight);
  background(200);

  //createP("Initial velocity (v):");
  createP("السرعة الابتدائية (m/s):");
  vInput = createInput();

  //createP("Angle (theta) from the horizontal axis (in degrees):");
  createP("زاوية الإطلاق بالنسبة للأفق(بالدَّرجات):");
  thetaInput = createInput();

  startButton = createButton("أطلق!");
  startButton.mousePressed(startSimulation);
}

function startSimulation() {
  groundSpots = [];
  time_ellapsed = 0;
  running = true;
  maxHeight = canvasHeight;

  let vValue = parseFloat(vInput.value());
  let thetaValue = parseFloat(thetaInput.value()) * (PI / 180);

  _position = createVector(0, canvasHeight);
  velocity = createVector(vValue * cos(thetaValue), -vValue * sin(thetaValue));
}

function draw() {
  drawBackground();
  drawRulerHorizontal();
  drawRulerVertical();

  colorMode(HSL);
  for (let i = groundSpots.length - 1; i >= 0; i--) {
    stroke(0);
    strokeWeight(1);
    let c = color((i * 17) % 256, 100, 50);
    fill(c);
    ellipse(groundSpots[i].x, groundSpots[i].y, 10, 10);
    let tx = groundSpots[i].x;
    let ty = groundSpots[i].y - 2 * groundSpotsMax + 10 * (i % 5);
    stroke(c);
    line(groundSpots[i].x, groundSpots[i].y, tx, ty);
    strokeWeight(5);
    stroke(255);
    fill(0);
    textSize(15);
    textAlign(CENTER, CENTER);
    text(int(groundSpots[i].t * 100) / 100 + "s", tx, ty);
  }
  colorMode(RGB);

  if (running) {
    if (maxHeightLine) {
      drawMaxHeight();
    }
    update_position();
    checkBoundary();
    if (projectionLine) {
      drawRullerProjection();
    }
    displayProjectile();
  }
}

function update_position() {
  time_ellapsed += dt;
  velocity.y += g * dt;
  _position.x += velocity.x * dt;
  _position.y += velocity.y * dt - 0.5 * g * dt * dt;
}

function checkBoundary() {
  if (_position.y > canvasHeight) {
    groundSpots.push({ x: _position.x, y: canvasHeight, t: time_ellapsed });
    if (groundSpots.length > groundSpotsMax) {
      groundSpots.pop();
    }
    _position.y = canvasHeight;
    velocity.y = -0.8 * velocity.y;
    //running = false;
  }
  if (_position.x > canvasWidth) {
    _position.x = canvasWidth;
    velocity.x = -0.8 * velocity.y;
  }
}

function displayProjectile() {
  fill(255, 0, 0);
  stroke(0);
  ellipse(_position.x, _position.y, 10, 10);
}

function drawBackground() {
  background(135, 206, 250); // Set background color to blue sky

  fill(50, 205, 50); // Set fill color to green for grass
  noStroke(); // Set no stroke for grass

  // Draw 3 ellipses for the grass
  fill(0, 100, 0);
  ellipse(width * 0, height * 1.1, width, height);
  fill(50, 205, 50);
  ellipse(width * 0.5, height * 1.2, width, height);
  fill(144, 238, 144);
  ellipse(width * 0.8, height * 1.1, width, height);
}

function drawRulerHorizontal() {
  fill(0);
  noStroke();
  textSize(10);
  textAlign(LEFT, BOTTOM);
  for (let x = 30; x < width; x += 30) {
    rect(x, canvasHeight - 10, 1, 10);
    text(x + "m", x, canvasHeight - 10);
  }
}

function drawRulerVertical() {
  fill(0);
  noStroke();
  textSize(10);
  textAlign(LEFT, BOTTOM);
  for (let y = 30; y < width; y += 30) {
    rect(0, canvasHeight - y, 10, 1);
    text(y + "m", 2, canvasHeight - y);
  }
}

function drawRullerProjection() {
  if (running) {
    noFill(0);
    stroke(255, 0, 0);
    lineDashed(_position.x, 0, _position.x, canvasHeight);
    lineDashed(0, _position.y, width, _position.y);
  }
}

function drawMaxHeight() {
  if (running) {
    if (maxHeight > _position.y) {
      maxHeight = _position.y;
    }
    noFill();
    stroke(255, 255, 0);
    lineDashed(0, maxHeight, width, maxHeight);
    noStroke();
    fill(255, 255, 0);
    textSize(15);
    textAlign(LEFT, BOTTOM);
    text(
      Math.round((canvasHeight - maxHeight) * 100) / 100 + "m",
      30,
      maxHeight
    );
  }
}

function lineDashed(x0, y0, x1, y1) {
  strokeWeight(1);
  let spaces = 15;
  let dx = x0 - x1;
  let dy = y0 - y1;
  let slope = dy / dx;
  let epols = dx / dy;
  let dis = y0 - slope * x0;
  let sid = x0 - epols * y0;

  if (dx == 0) {
    let f = (y) => {
      return y * epols + sid;
    };
    for (let i = y0; i < y1; i += 2 * spaces) {
      line(f(i), i, f(i + spaces), i + spaces);
    }
  } else if (dy == 0) {
    let f = (x) => {
      return x * slope + dis;
    };
    for (let i = x0; i < x1; i += 2 * spaces) {
      line(i, f(i), i + spaces, f(i + spaces));
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    startSimulation();
  }
}
