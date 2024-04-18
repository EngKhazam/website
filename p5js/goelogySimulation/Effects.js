class Rain {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.clouds = [];
    this.TTL = 0;
    for (let i = 0; i < 3; i++) {
      let c = new Cloud();
      c.x = (width / 4) * i + (width / 4) * random();
      c.rain = this;
      this.clouds.push(c);
    }
  }

  evolve(dt) {
    this.TTL -= 1;
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i].evolve(dt);
    }
  }

  display() {
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i].display();
    }
  }
  start() {
    restart();
  }
  restart() {
    this.TTL = 60 * 5;
    for (let i = 0; i < this.clouds.length; i++) {
      let c = new Cloud();
      c.rain = this;
      c.x = (width / 4) * i + (width / 4) * random();
      this.clouds[i] = c;
    }
  }
  pause() {
    this.TTL = 0;
  }
}

class DropLet {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.r = 10;
    this.vy = 30;
    colorMode(HSL);
    this.color = color(255, 100, 50);
  }
  evolve(dt) {
    this.y += dt * this.vy;
  }
  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.r);
  }
}

class Cloud {
  constructor() {
    this.x = width * random();
    this.y = (height * random()) / 3;
    this.r = 40 + random() * 40;
    this.A = random() * 50;
    this.vx = 10 + random() * 5;
    this.drops = [];
    this.startup = 0;
    this.startupLimit = 30;
    this.shutdown = 0;
    this.shutdownLimit = 30;
    this.rain = {};
  }
  evolve(dt) {
    this.startup++;
    if (this.rain.TTL <= 0) {
      this.shutdown++;
    }
    this.x += dt * this.vx;
    if (frameCount % 10 == 0) {
      let d = new DropLet();
      d.x = this.x + random() * this.r * 1.25 - this.r * 0.5;
      d.y = this.y + random() * this.r;
      this.drops.push(d);
      d = new DropLet();
      d.x = this.x + random() * this.r * 1.25 - this.r * 0.5;
      d.y = this.y + random() * this.r;
      this.drops.push(d);
    }

    if (this.rain.TTL > 0) {
      for (let i = 0; i < this.drops.length; i++) {
        this.drops[i].evolve(dt);
      }
    }
  }
  display() {
    colorMode(RGB);
    if (this.startup < this.startupLimit) {
      fill(255, 255, 255, (this.startup / this.startupLimit) * 255);
    } else if (this.rain.TTL < 0) {
      fill(255, 255, 255, 255 - (this.shutdown / this.shutdownLimit) * 255);
    } else {
      fill(255, 255, 255);
    }

    noStroke();
    ellipse(this.x, this.y, this.r);
    ellipse(this.x + this.r / 2, this.y + this.r / 4, this.r / 2);
    ellipse(this.x - this.r / 2, this.y + this.r / 4, this.r / 2);

    if (this.rain.TTL > 0) {
      for (let i = 0; i < this.drops.length; i++) {
        this.drops[i].display();
      }
    }
  }
}
