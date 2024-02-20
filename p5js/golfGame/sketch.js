class Goal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 15;
    this.goal = false;
    this.score = 0;
  }

  display() {
    fill(40);
    stroke(200);
    strokeWeight(4);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Score: " + this.score, width / 2, 2 * 20);
  }

  evolve() {
    if (this.isIn(ball.x, ball.y)) {
      if (!this.goal) {
        this.score++;
      }
      this.goal = true;
      textAlign(CENTER, CENTER);
      textSize(width / 10);
      text("GOAL!", width / 2, height / 2);
      dt = 0.001;
    } else if (this.goal) {
      dt = 0.01;
      this.goal = false;
      this.x = random() * width;
      this.y = random() * height;
    }
  }
  isIn(x, y) {
    let dx = this.x - x;
    let dy = this.y - y;
    return dx ** 2 + dy ** 2 < this.r ** 2;
  }
}

class Force {
  constructor(f, dur) {
    this.f = f;
    this.dur = dur;
  }
  evolve(dt) {
    this.dur = this.dur - dt;
    if (this.dur > 0) {
      ball.addForce(this.f);
    }
  }
}

class Ball {
  constructor() {
    this.r = 0;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.dragAcc = 0.01;
    this.vLossComplement = 0.99;
    this.force = [];
  }
  evolve(dt) {
    let fx = 0;
    let fy = 0;
    for (let i = 0; i < this.force.length; i++) {
      fx += this.force[i].x;
      fy += this.force[i].y;
    }

    this.vx =
      this.vx - Math.sign(this.vx) * this.vx ** 2 * this.dragAcc * dt + fx * dt;
    this.vx = this.vx * this.vLossComplement;
    this.vy =
      this.vy - Math.sign(this.vy) * this.vy ** 2 * this.dragAcc * dt + fy * dt;
    this.vy = this.vy * this.vLossComplement;

    this.x =
      this.x +
      this.vx * dt +
      0.5 * Math.sign(this.vx) * this.dragAcc * dt ** 2 +
      0.5 * fx * dt ** 2;

    this.y =
      this.y +
      this.vy * dt +
      0.5 * Math.sign(this.vy) * this.dragAcc * dt ** 2 +
      0.5 * fy * dt ** 2;

    if (this.x < 0) {
      this.x = 0;
      this.vx = -this.vx;
    }
    if (this.x > width) {
      this.x = width;
      this.vx = -this.vx;
    }
    if (this.y < 0) {
      this.y = 0;
      this.vy = -this.vy;
    }
    if (this.y > height) {
      this.y = height;
      this.vy = -this.vy;
    }

    this.force = [];
    if (isNaN(this.x)) {
      this.x = width / 2;
    }
    if (isNaN(this.y)) {
      this.y = height / 2;
    }
    if (isNaN(this.vx)) {
      this.vx = 0;
    }
    if (isNaN(this.vy)) {
      this.vy = 0;
    }
  }

  display() {
    fill(240);
    ellipse(this.x, this.y, this.r, this.r);
  }

  addForce(f) {
    this.force.push(f);
  }
}

class Controller {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.cx = 0;
    this.cy = 0;
    this.cr = 0;
    this.active = false;
    this.addingForce = new Force(0, 0);
  }

  display() {
    noStroke();
    fill(100, 100, 100);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
    fill(200, 200, 200);
    ellipse(this.x + this.cx, this.y + this.cy, this.cr * 2, this.cr * 2);

    if (this.active) {
      let distance = sqrt(width ** 2 + height ** 2);
      dashedLine(
        ball.x,
        ball.y,
        this.cx * 100,
        this.cy * 100,
        distance / 100,
        distance / 100
      );
    }
  }

  isIn(x, y) {
    let dx = this.x - x;
    let dy = this.y - y;
    return dx ** 2 + dy ** 2 < this.r ** 2;
  }

  activate() {
    if (!this.active) {
      this.active = true;
    }
  }

  release() {
    if (this.active) {
      let r = sqrt(this.cx ** 2 + this.cy ** 2);
      if (this.addingForce.dur < 0) {
        this.addingForce.dur = 0;
      }
      this.addingForce.dur += 0.03;
      this.addingForce.f = {
        x: (this.cx / r) * forceScale,
        y: (this.cy / r) * forceScale,
      };

      this.active = false;
      this.cx = 0;
      this.cy = 0;
    }
  }
}

let inputController;
let ball;
let dt = 0.01;
let forceScale = 30000;
let goal;
function setup() {
  createCanvas(windowWidth, windowHeight);
  inputController = new Controller();
  inputController.r = 50;
  inputController.cr = 25;
  inputController.x = width - inputController.r - inputController.cr;
  inputController.y = height * 0.99 - inputController.r - inputController.cr;
  inputController.cx = 0;
  inputController.cy = 0;

  ball = new Ball();
  ball.x = width / 2;
  ball.y = height / 2;
  ball.r = 20;

  goal = new Goal(width * random(), height * random());
  frameRate(60);
}

function draw() {
  background(0, 70, 0);
  inputController.display();
  goal.display();
  ball.display();
  ball.evolve(dt);
  goal.evolve();
  inputController.addingForce.evolve(dt);
}

function mousePressed() {
  if (inputController.isIn(mouseX, mouseY)) {
    inputController.activate();
  }
}
function mouseReleased() {
  inputController.release();
}
function mouseDragged() {
  if (inputController.active) {
    let dx = mouseX - inputController.x;
    let dy = mouseY - inputController.y;
    let theta = atan2(dy, dx);
    let dr = sqrt(dx ** 2 + dy ** 2);
    let r = min(dr, inputController.r);
    inputController.cx = r * cos(theta);
    inputController.cy = r * sin(theta);
    return false;
  }
}

function dashedLine(x0, y0, x1, y1, dashLength, gapLength) {
  stroke(255);
  let x = x0;
  let y = y0;
  let dx = x1 - x0;
  let dy = y1 - y0;
  let dist = sqrt(dx * dx + dy * dy);
  let dashCount = dist / (dashLength + gapLength);
  let dashX = dx / dashCount;
  let dashY = dy / dashCount;
  let gapX = gapLength * (dx / dist);
  let gapY = gapLength * (dy / dist);

  for (let i = 0; i < dashCount; i++) {
    stroke(255, 255, 255, map(i ** 2, 0, dashCount, 255, 0));

    line(x, y, x + dashX, y + dashY);
    x += dashX + gapX;
    y += dashY + gapY;
  }
}
