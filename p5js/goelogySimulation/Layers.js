let ref_ground;
class Ground {
  constructor() {
    this.groundLevel = 0;
    this.currentGroundLevel = 0;
    this.minLevel = -5;
    this.maxLevel = 5;
    this.apply = [];
    colorMode(RGB);
    this.color = color(200, 130, 100);
    ref_ground = this;
  }
  evolve(dt) {
    this.currentGroundLevel = lerp(
      this.currentGroundLevel,
      this.groundLevel,
      dt
    );
  }
  display() {
    let step = width / 30;
    fill(this.color);
    stroke(0);
    strokeWeight(3);

    beginShape();
    vertex(0, height);
    vertex(0, height / 2);
    for (let i = 0; i < width; i += step) {
      let ss = width / 6;
      let mu = width / 2;
      vertex(i, -this.elevation((i - mu) / ss) + height / 2);
    }
    vertex(width, height / 2);
    vertex(width, height);
    endShape();
  }

  elevation(x) {
    return this.currentGroundLevel * exp(-1 * x ** 4);
  }
}

class Sea {
  constructor() {
    this.level = 0;
    this.angle = 0;

    colorMode(RGB);
    this.color = color(50, 100, 150);
  }
  evolve(dt) {
    this.angle += dt;
  }
  display() {
    if (ref_ground.currentGroundLevel >= 0) {
      return;
    }
    let step = width / 50;
    fill(this.color);
    stroke(255);
    strokeWeight(3);
    beginShape();
    vertex(0, height);
    vertex(0, height / 2);
    for (let i = 0; i < width; i += step) {
      vertex(i, this.surface(i) + height / 2);
    }
    vertex(width, height / 2);
    vertex(width, height);
    endShape();
  }
  surface(x) {
    let f = 10;
    let A = 10;
    return abs(A * sin(f * x + this.angle));
  }
}

class Layer {
  constructor() {
    this.y = 0;
    this.h = 10;
    colorMode(HSL);
    this.color = color(random(0, 360), 100, 50);
  }

  display() {
    fill(this.color);
    strokeWeight(1);
    noStroke();
    rect(0, this.y, width, this.h);
  }
}
