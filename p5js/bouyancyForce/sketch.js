let system = {};
system.debug = false;
system.dt = 0.1;
system.simulationSpeed = 10;
system.g = 9.81;
system.airDrag = 0.000018;
system.precision = 300;
system.fluidDensity = 997;
system.fluidSurfacePrecision = system.precision;
system.fluidViscosity = 0.001;
system.stablizing = 0;

function setup() {
  createCanvas(windowWidth, windowHeight * 0.4);
  system.neutralLevel = height / 2;
  system.fluid = new Fluid();
  system.ship = new Ship(width / 2, height / 2, 100);
  system.ship.y = height / 2 - system.ship.r / 2;
  if (system.ship.r < 0) {
    system.ship.y = height / 2 + system.ship.r / 2;
  }
  system.ship.m = 20000000;
}

function draw() {
  background(180, 255, 255);
  system.fluid.display();
  system.ship.display();

  let y_dir = 1;
  let y_dir_prev = 1;
  for (let i = 0; i < system.simulationSpeed; i++) {
    system.ship.addForce({ x: 0, y: system.g * system.ship.m });
    system.fluid.addObject(system.ship);
    system.fluid.evolve();
    system.ship.evolve();
    if (system.stablizing > 0) {
      if (y_dir != y_dir_prev) {
        y_dir_prev = y_dir;
        system.stablizing--;
        system.ship.vy /= 2;
      }
      y_dir = int(system.ship.vy / abs(system.ship.vy));
    }
  }
}

function restart() {
  const precision = document.getElementById("precision").value;
  const dt = document.getElementById("dt").value;
  const simulationSpeed = document.getElementById("simulationSpeed").value;
  const mass = document.getElementById("mass").value;
  const radius = document.getElementById("radius").value;
  const density = document.getElementById("density").value;
  const viscosity = document.getElementById("viscosity").value;

  system.dt = dt;
  system.simulationSpeed = simulationSpeed;
  system.precision = precision;
  system.fluidDensity = density;
  system.fluidSurfacePrecision = system.precision;
  system.fluidViscosity = viscosity;

  system.fluid = new Fluid();
  system.ship = new Ship(width / 2, height * 0.2, radius);
  system.ship.y = height / 2 - system.ship.r / 2;
  if (system.ship.r < 0) {
    system.ship.y = height / 2 + system.ship.r / 2;
  }
  system.ship.m = mass;
}

function stablize() {
  system.stablizing = 20;
}

function updateSimulationSettings() {
  const dt = document.getElementById("dt").value;
  const simulationSpeed = document.getElementById("simulationSpeed").value;

  system.dt = dt;
  system.simulationSpeed = simulationSpeed;
  console.log(system.dt, system.simulationSpeed);
  console.log(system.dt * system.simulationSpeed);
}

function toggleDebug() {
  const debug = document.getElementById("debugCheckBox").checked;
  system.debug = debug;
}

function upArrow(x, y, w, h) {
  push();
  translate(x, y);
  beginShape();
  vertex(0, 0);
  vertex(-w / 2, h);
  vertex(0, h * 0.75); // Intermediate point for better 'V' shape
  vertex(w / 2, h);
  endShape(CLOSE);
  pop();
}

function downArrow(x, y, w, h) {
  push();
  translate(x, y);
  beginShape();
  vertex(0, h);
  vertex(-w / 2, 0);
  vertex(0, h * 0.25); // Intermediate point for better 'V' shape
  vertex(w / 2, 0);
  endShape(CLOSE);
  pop();
}
