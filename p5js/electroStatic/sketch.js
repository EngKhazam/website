let g = 9.816 / 1000;
let airRho = 1.225 / 10;
let rod;
let papers = [];
let _scaling = 0.01;
let _timeScaling = 0.1;
let minES = 0;
let maxES = 10;
let minD = 0;
let maxD = 100;
let minG = 0;
let maxG = 5;
let vectorDebug = true;

class Rod {
  constructor(charge) {
    this.charge = charge;
    this.width = 10;
    this.offsetY = 30;
    this.x = 0;
    this.y = 0;
  }

  show() {
    let r = this.charge;
    let x = mouseX - this.width / 2;
    let y = -10;
    let w = this.width;
    let h = mouseY + this.offsetY;
    fill(0, 0, 200, 2);
    noStroke();
    for (let i = 0; i <= r; i += r / 50) {
      ellipse(x + this.width / 2, h, i, i);
    }
    stroke(0);
    fill(255);
    rect(x, y, w, h);
    this.x = x + this.width / 2;
    this.y = h;
  }
}

class Paper {
  constructor() {
    this.charge = 50;
    this.w = 40;
    this.h = 30;
    this.x = width / 2;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.C_d = 1; //drag coefficient
    this.m = 80; //(this.h * this.w) / 100;
    this.vertexes = [];

    let noiseScale = this.w;
    this.vertexes.push({ x: 0, y: 0 });
    this.vertexes.push({
      x: this.w + random(-millis(), millis()) * noiseScale,
      y: random(-millis(), millis()) * noiseScale,
    });
    this.vertexes.push({
      x: this.w + random(-millis(), millis()) * noiseScale,
      y: this.h + random(-millis(), millis()) * noiseScale,
    });
    this.vertexes.push({
      x: random(-millis(), millis()) * noiseScale,
      y: this.h + random(-millis(), millis()) * noiseScale,
    });

    this.cx = 0;
    this.cy = 0;
    for (let i = 0; i < this.vertexes.length; i++) {
      this.cx += this.vertexes[i].x;
      this.cy += this.vertexes[i].y;
    }
    this.cx = this.cx / this.vertexes.length;
    this.cy = this.cy / this.vertexes.length;
  }

  show() {
    fill(255, 255, 240);
    stroke(0);
    strokeWeight(1);
    //rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);

    beginShape();
    for (let i = 0; i < this.vertexes.length; i++) {
      vertex(this.x + this.vertexes[i].x, this.y + this.vertexes[i].y);
    }
    endShape(CLOSE);
  }

  update(rod) {
    // Gravity force (F = m*g)
    let gravity = createVector(
      0,
      constrain(this.m * 9.81 * _scaling, minG, maxG)
    );

    // Electrostatic force from the rod
    let electrostaticForce = this.calculateElectrostatic(rod);

    // Drag force
    let dragForce = this.calculateDrag();

    // Net force (F = m*a => a = F/m)
    let netForce = createVector(0, 0);
    netForce.add(gravity);
    netForce.add(electrostaticForce);
    netForce.add(dragForce);
    let acceleration = p5.Vector.div(netForce, this.m);
    if (vectorDebug) {
      stroke(255, 0, 0);
      strokeWeight(gravity.mag());
      line(
        this.x + this.cx,
        this.y + this.cy,
        this.x + this.cx,
        this.y + this.cy + gravity.mag() * 10
      );

      stroke(0, 255, 0);
      strokeWeight(electrostaticForce.mag());
      line(this.x + this.cx, this.y + this.cy, rod.x, rod.y);

      stroke(0, 0, 255);
      strokeWeight(dragForce.mag());
      line(
        this.x + this.cx,
        this.y + this.cy,
        this.x + this.cx - this.vx,
        this.y + this.cy - this.vy
      );
    }
    // Update velocity
    this.vx += acceleration.x * deltaTime * _timeScaling;
    this.vy += acceleration.y * deltaTime * _timeScaling;

    let minV = -50;
    let maxV = 50;
    this.vx = constrain(this.vx, minV, maxV);
    this.vy = constrain(this.vy, minV, maxV);

    // Update position
    this.x += this.vx * deltaTime * _timeScaling;
    this.y += this.vy * deltaTime * _timeScaling;

    this.x = constrain(this.x, 0, width - this.w);
    this.y = constrain(this.y, 0, height - this.h);
    //print(this.vx, this.vy);
  }

  calculateDrag() {
    //return 0;
    // Drag force (F = 1/2 * C_d * A * v^2)
    let velocity = createVector(this.vx, this.vy);
    let speed = velocity.mag();
    let dragMagnitude = constrain(
      (1000 * _scaling * (this.C_d * (speed * speed))) / 2 +
        noise(millis()) * 5,
      minD,
      maxD
    );
    let dragForce = velocity.copy();
    dragForce.mult(-1);
    dragForce.normalize();
    dragForce.mult(dragMagnitude);
    return dragForce;
  }

  calculateElectrostatic(rod) {
    //return 0;
    // Simple electrostatic force calculation (F = k*|q1*q2|/r^2)
    let k = 8.99 * _scaling * 10; // Coulomb's constant
    let r = p5.Vector.dist(
      createVector(
        rod.x + noise(millis(), 0) * 5,
        rod.y + noise(millis(), 1) * 5
      ),
      createVector(this.x + this.cx, this.y + this.cy)
    ); // Distance between rod and paper
    let forceMagnitude = constrain(
      (k * Math.abs(rod.charge * this.charge)) / (r * r),
      minES,
      maxES
    );
    let forceDirection = p5.Vector.sub(
      createVector(rod.x, rod.y),
      createVector(this.x + this.cx, this.y + this.cy)
    ); // Direction from paper to rod
    forceDirection.normalize();
    forceDirection.mult(forceMagnitude);
    return forceDirection;
  }
}

let checkbox;
function setup() {
  createCanvas(windowWidth, windowHeight * 0.9);
  rod = new Rod(300);
  for (let i = 0; i < 5; i++) {
    papers.push(new Paper());
  }
  checkbox = createCheckbox("أظهر متَّجهات القوة", vectorDebug);
  checkbox.changed(myCheckedEvent);
}
function myCheckedEvent() {
  vectorDebug = this.checked();
}

function draw() {
  //background(220);
  drawBackground();
  rod.show();
  for (let i = 0; i < papers.length; i++) {
    papers[i].show();
    papers[i].update(rod);
  }
  drawColorLegend();
}

function drawBackground() {
  noFill();
  background(255, 255, 224);
  stroke(210, 180, 127);
  strokeWeight(1);
  let spacing = min(width, height) / 10;
  for (let i = 0; i < width; i += spacing) {
    line(0, i, width, i);
    line(i, 0, i, height);
  }
}

function drawColorLegend() {
  if (vectorDebug) {
    stroke(255);
    strokeWeight(2);
    fill(255, 0, 0);
    rect(10, 10, 30, 10);
    fill(0);
    textAlign(LEFT, TOP);
    text("الجاذبيَّة", 40 + 10, 10);

    stroke(255);
    strokeWeight(2);
    fill(0, 255, 0);
    rect(10, 30, 30, 10);
    fill(0);
    textAlign(LEFT, TOP);
    text("الكهرباء السَّاكنة", 40 + 10, 30);

    stroke(255);
    strokeWeight(2);
    fill(0, 0, 255);
    rect(10, 50, 30, 10);
    fill(0);
    textAlign(LEFT, TOP);
    text("الإعاقة", 40 + 10, 50);
  }
}
