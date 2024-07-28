class Ship {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.m = 1;
    this.r = r;
    this.f = [];
    this.points = [];
    for (let i = 0; i <= system.precision; i++) {
      let theta = (i / system.precision) * PI;
      let x = this.r * cos(theta);
      let y = this.r * sin(theta);
      this.points.push({ x: x, y: y });
    }
    this.printNextForces = false;
  }

  addForce(f) {
    this.f.push(f);
  }

  display() {
    fill(255, 0, 0, 200);
    noStroke();
    //ellipse(this.x, this.y, this.r * 2);

    beginShape();
    vertex();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      vertex(this.x + p.x, this.y + p.y);
    }
    endShape();

    if (system.debug) {
      let arrowX = 20;
      let arrowY = height / 4;
      let arrowW = 20;
      let arrowH = 10;
      let fg = system.g * this.m;
      fill(255, 0, 0);
      noStroke();
      if (abs(this.downwardForce) < 0.0001) {
        rect(arrowX - arrowW / 2, arrowY + arrowH / 4, arrowW, arrowH / 2);
      } else if (this.downwardForce > 0) {
        for (let i = 0; i < (this.downwardForce / fg) * 2; i++) {
          downArrow(arrowX, arrowY + arrowH * i, arrowW, arrowH);
        }
      } else if (this.downwardForce < 0) {
        for (let i = 0; i < (-this.downwardForce / fg) * 20; i++) {
          upArrow(arrowX, arrowY - arrowH * i, arrowW, arrowH);
        }
      }

      arrowX = arrowX + 10 + arrowW;
      fill(255, 255, 0);
      noStroke();
      if (abs(this.vy) < 0.1) {
        rect(arrowX - arrowW / 2, arrowY + arrowH / 4, arrowW, arrowH / 2);
      } else if (this.vy > 0) {
        for (let i = 0; i < this.vy; i++) {
          downArrow(arrowX, arrowY + arrowH * i, arrowW, arrowH);
        }
      } else if (this.vy < 0) {
        for (let i = 0; i < -this.vy; i++) {
          upArrow(arrowX, arrowY - arrowH * i, arrowW, arrowH);
        }
      }
    }
  }

  evolve() {
    let dt = system.dt;
    if (!dt) {
      dt = 0.01;
    }
    let fx = 0;
    let fy = 0;
    for (let i = 0; i < this.f.length; i++) {
      fx += this.f[i].x;
      fy += this.f[i].y;
    }

    this.vy += (fy / this.m) * dt;
    this.y += this.vy * dt;
    if (this.printNextForces) {
      print("<fx,fy>=<" + fx + "," + fy + ">");
      print(this.f);
      this.printNextForces = false;
    }
    this.f = [];
    this.downwardForce = fy;
  }
  printForces() {
    this.printNextForces = true;
  }
}
