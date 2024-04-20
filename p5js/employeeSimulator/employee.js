class Employee {
  constructor({
    pressureLimit = 1,
    pressureResistance = 1,
    pressureAccRate = 1,
    pressureChangeTask = 1,
    pressureCoolDownRate = -1,
    pressureCurrent = 0,
    performance = 1,
  }) {
    this.pressureLimit = pressureLimit;
    this.pressureResistance = pressureResistance;
    this.pressureAccRate = pressureAccRate;
    this.pressureChangeTask = pressureChangeTask;
    this.pressureCoolDownRate = pressureCoolDownRate;
    this.pressureCurrent = pressureCurrent;
    this.performance = performance;
    this.tasks = [];
    this.multiTask = true;
    this.isDead = false;
    this.onBreak = false;
    this.score = 0;
    this.workFocus = 0;
    this.workFocusRate = 1;
    this.workFocusLimit = 1;
    this.switchingReduction = 0.8;
    this.switchingPressure = 0.1 * this.pressureLimit;
    this.currentTask = undefined;
    this.preivousTask = undefined;
  }

  evolve(dt) {
    if (this.isDead) {
      return;
    }

    var tasksPressure = 0;
    let remainingTasks = [];
    if (!this.onBreak) {
      if (this.multiTask) {
        for (let i = 0; i < this.tasks.length; i++) {
          let t = this.tasks[i];
          t.evolve(dt, this.workFocus, this.performance);
          tasksPressure += t.pressure;
          if (t.time > 0) {
            remainingTasks.push(t);
          }
        }
      } else {
        let topTask = this.topPriorityTask();
        if (topTask) {
          this.currentTask = topTask;
          topTask.evolve(dt, this.workFocus, this.performance);
          tasksPressure += topTask.pressure;
          if(topTask.time<0){
            this.currentTask = undefined;
            this.previousTask = undefined;
          }
        }
        for (let i = 0; i < this.tasks.length; i++) {
          let t = this.tasks[i];
          if (t.time > 0) {
            remainingTasks.push(t);
          }
        }
      }
      this.tasks = remainingTasks;
    }

    if (
      this.tasks.length > 0 &&
      (!this.currentTask || this.currentTask != this.preivousTask)
    ) {
      this.taskSwitch();
    }

    this.workFocus +=
      dt * this.workFocusRate * (this.multiTask ? 1 / this.tasks.length : 1);

    this.workFocus = constrain(this.workFocus, 0, this.workFocusLimit);

    if (this.onBreak || this.tasks.length == 0) {
      this.workFocus = 0;
    }

    this.pressureCurrent +=
      this.pressureCoolDownRate *
        sigmoid(
          (-this.pressureCurrent / this.pressureLimit) * 2 + this.pressureLimit
        ) *
        dt +
      this.pressureAccRate * tasksPressure * dt;

    this.preivousTask = this.currentTask;

    this.pressureCurrent = constrain(
      this.pressureCurrent,
      0,
      this.pressureLimit * 1.01
    );
    this.score += tasksPressure * dt * this.performance * this.workFocus;
    if (this.pressureCurrent >= this.pressureLimit) {
      this.isDead = true;
    }
  }

  display() {
    let cp = this.pressureCurrent;
    let pl = this.pressureLimit;
    let index = 0;
    if (this.isDead) {
      index = 4;
    } else if (cp >= pl) {
      index = 4;
    } else if (cp > pl * 0.75) {
      index = 3;
    } else if (cp > pl * 0.5) {
      index = 2;
    } else if (cp > pl * 0.25) {
      index = 1;
    } else {
      index = 0;
    }

    images[index].resize(employeeImageRatio * height * 0.7, height * 0.7);
    image(images[index], 0, 0);

    colorMode(HSL);
    noStroke();
    let x = width * 0.2;
    let y = 50;
    let w = width * 0.6;
    let h = 30;
    fill(0, 0, 33);
    rect(x, y, w, h);
    let fillRatio = cp / pl;
    fill(180 - 180 * fillRatio, 100, 50);
    rect(x, y, w * fillRatio, h);
    fill(0);
    textSize(15);
    textAlign(LEFT, CENTER);
    text("الإجهاد: ", width - width * 0.2, y + h / 2);

    textSize(15);
    textAlign(LEFT, TOP);
    text(
      "الأداء: " + int(this.score * 100) / 100,
      width - width * 0.2,
      height * 0.05
    );

    for (let i = 0; i < this.tasks.length; i++) {
      let t = this.tasks[i];
      t.display(40 + (i * (width - 40)) / this.tasks.length, height * 0.7);
    }
  }

  assignTask(t) {
    this.tasks.push(t);
    t.employee = this;
  }
  takeBreak() {
    this.onBreak = true;
  }
  resumeWork() {
    this.onBreak = false;
  }
  topPriorityTask() {
    if (this.tasks && this.tasks.length > 0) {
      return this.tasks.reduce((prev, current) => {
        return prev.priority < current.priority ? prev : current;
      });
    }
  }
  taskSwitch() {
    this.currentTask = this.topPriorityTask();
    this.workFocus = this.workFocus * this.switchingReduction;
    this.pressureCurrent += this.switchingPressure;
  }
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

class Task {
  constructor({ time = 1, pressure = 1, priority = 1, name = "" }) {
    this.fullTime = time;
    this.time = time;
    this.pressure = pressure;
    this.employee = undefined;
    this.priority = priority;
    this.name = name;
  }
  evolve(dt, focus, performance) {
    if (this.employee) {
      this.time -= dt * focus * performance;
    }
  }
  display(x, y) {
    let w = 20;
    let h = 50;
    colorMode(HSL);
    strokeWeight(3);
    noStroke();
    fill(0, 0, 33);
    rect(x, y, w, h);

    let timeRatio = this.time / this.fullTime;
    let fillHeight = h * timeRatio;
    fill(100 * (1 - timeRatio), 100, 50);
    rect(x, y + (h - fillHeight), w, fillHeight);

    if (emp.multiTask) {
      stroke(70, 100, 70);
    } else {
      noStroke();
      let tp = emp.topPriorityTask();
      if (tp == this) {
        stroke(70, 100, 70);
      }
    }
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.name, x + w / 2, y + h * 1.2);
  }
}
