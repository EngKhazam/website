var employeeImageRatio = 128 / 397;
var imagesURL = [
  "employee_0.png",
  "employee_1.png",
  "employee_2.png",
  "employee_3.png",
  "employee_4.png",
];
var images = [];
var emp;
var dt = 0.001;
var timeSinceStart = 0;
var text_break = "استراحة";
var text_resume = "كمِّل شغل";
var text_task = "عطه شغل";
var text_multi_task = "بتاع كلُّو";
var text_single_task = "ركِّز على شغلة وحدة";
var text_restart = "إعادة";
var text_time = "الوقت: ";
let breakButton;
let restartButton;
let multiTaskButton;
let assignTaskButton;
var pressureHistory = [];

function preload() {
  for (let i = 0; i < imagesURL.length; i++) {
    images[i] = loadImage(imagesURL[i]);
  }
}

function setup() {
  createCanvas(400, 300);

  restart();

  assignTaskButton = createButton(text_task);
  assignTaskButton.mousePressed(assignTask);
  assignTaskButton.addClass("task");

  createDiv();

  breakButton = createButton(text_break);
  breakButton.mousePressed(takeBreak);
  multiTaskButton = createButton(text_single_task);
  multiTaskButton.mousePressed(toggleMultiTask);
  createDiv();
  restartButton = createButton(text_restart);
  restartButton.mousePressed(restart);
  restartButton.addClass("restart");
}

function draw() {
  background(220);
  displayTime();
  displayPlot();
  emp.display();
  emp.evolve(dt);
  pressureHistory.push(emp.pressureCurrent);
  pressureHistory.shift();
  if (!emp.isDead) timeSinceStart += deltaTime / 1000;
}
function displayTime() {
  colorMode(HSL);
  noStroke();
  textSize(20);
  fill(33);
  rect(width * 0.2, height * 0.05, 20 * 6, 20 + 10);
  fill(0, 100, 70);
  textAlign(RIGHT, TOP);
  textFont("Cairo");
  text(
    text_time + int(timeSinceStart),
    width * 0.2 - 5 + 20 * 6,
    height * 0.05 + 5
  );
}
function displayPlot() {
  let x = 10;
  let y = height * 0.7;
  let step = (width - 2 * x) / pressureHistory.length;
  let yScale = height * 0.4;
  colorMode(HSL);
  noFill();
  strokeWeight(3);
  stroke(33);
  dashLine(
    x,
    y - emp.pressureLimit * yScale,
    width,
    y - emp.pressureLimit * yScale,
    10,
    10
  );

  strokeWeight(2);
  stroke(0, 100, 50);
  beginShape();
  for (let i = 0; i < pressureHistory.length; i++) {
    vertex(x + i * step, y - yScale * pressureHistory[i]);
  }
  endShape();
}

function takeBreak() {
  if (emp.onBreak) {
    emp.resumeWork();
    breakButton.html(text_break);
  } else {
    emp.takeBreak();
    breakButton.html(text_resume);
  }
}

function assignTask() {
  var task = {
    name: document.getElementById("name").value,
    time: parseInt(document.getElementById("time").value),
    pressure: parseInt(document.getElementById("pressure").value),
    priority: parseInt(document.getElementById("priority").value),
  };
  if (task.name.legnth == 0) task.name = "task";
  if (isNaN(task.time)) task.time = 1;
  if (isNaN(task.pressure)) task.pressure = 1;
  if (isNaN(task.priority)) task.priority = 999;
  let t = new Task(task);
  emp.assignTask(t);
}

function toggleMultiTask() {
  if (emp.multiTask) {
    emp.multiTask = false;
    multiTaskButton.html(text_multi_task);
  } else {
    emp.multiTask = true;
    multiTaskButton.html(text_single_task);
  }
}

function restart() {
  emp = new Employee({
    pressureLimit: 1,
    pressureResistance: 1,
    pressureAccRate: 1,
    pressureChangeTask: 1,
    pressureCoolDownRate: -3,
    pressureCurrent: 0,
    performance: 5,
  });

  pressureHistory = [];
  for (let i = 0; i < width; i++) {
    pressureHistory.push(0);
  }
}

function dashLine(x, y, w, h, step, gap) {
  let slope = (y - h) / (x - w);
  let f = function (v) {
    return y + slope * v;
  };
  for (let i = x; i < x + w; i += step + gap) {
    line(i, f(i), i + step, f(i + step));
  }
}
