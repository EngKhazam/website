class Fluid {
  constructor() {
    this.density = system.fluidDensity;
    this.volume = 1;
    this.stepX = width / system.fluidSurfacePrecision;
    this.points = [];
    for (let i = 0; i < width; i += this.stepX) {
      this.points.push(new Point(i, height / 2));
    }
  }
  display() {
    stroke(255);
    strokeWeight(3);
    fill(0, 200, 255);

    beginShape();
    vertex(0, height / 2);
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      vertex(p.x, p.y);
    }
    vertex(width, height / 2);

    vertex(width, height);
    vertex(0, height);
    endShape();
    if (system.debug) {
      for (let i = 0; i < this.points.length; i++) {
        let p = this.points[i];
        ellipse(p.x, p.y, 10);
      }
    }
  }

  evolve() {
    let dt = system.dt;
    if (!dt) {
      dt = 0.01;
    }
    //this is not acccurate
    //this is artistic
    //not physical, i.e. spacial locality was not respected
    for (let i = 0; i < this.points.length; i++) {
      let r = random() - 0.5;
      let p = this.points[i];
      p.y += r * dt * 1;
      p.y = lerp(p.y, p.neutralLevel, min(1 / system.fluidViscosity, 1));
    }
  }

  addObject(obj) {
    let V = 0;
    let maxHeight = 0;
    let firstPoint = null;
    let lastPoint = null;

    for (let i = 0; i < obj.points.length; i++) {
      let p = obj.points[i];
      let pp = obj.points[i - 1];
      for (let j = 0; j < this.points.length; j++) {
        let q = this.points[j];
        let dp = obj.x + p.x - q.x;
        if (abs(dp) <= this.stepX) {
          let dy = obj.y + p.y - system.neutralLevel;
          dy = constrain(dy, 0, p.y);
          let dx = 0;
          if (pp) {
            dx = abs(p.x - pp.x);
          }
          if (dy > 0) {
            if (!firstPoint) {
              firstPoint = p;
            }
            lastPoint = p;
            q.neutralLevel = obj.y + p.y;
            if (maxHeight < p.y) {
              maxHeight = p.y;
            }
            V += dy * dx;
          }
        }
      }
    }
    if (obj.y > system.neutralLevel) {
      let Fd = { x: 0, y: 0 }; //drag force of the fluid
      Fd.y =
        6 * PI * system.fluidViscosity * (lastPoint.x - firstPoint.x) * obj.vy;

      obj.addForce(Fd);
      for (let j = 0; j < this.points.length; j++) {
        let q = this.points[j];
        q.neutralLevel = system.neutralLevel;
      }
    }
    obj.addForce({ x: 0, y: -V * system.g * this.density });
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.neutralLevel = system.neutralLevel;
  }
}
