const container = document.querySelector(".container");
const canvas = document.getElementById("canvas1");
// const report1 = document.getElementById("reportInfected");
const populationLabel = document.getElementById("populationValue");
const healthyLabel = document.getElementById("healthyValue");
const infectedLabel = document.getElementById("infectedValue");
const percentLabel = document.getElementById("percentValue");

const context = canvas.getContext("2d");

canvas.width = container.offsetWidth;
canvas.height = container.offsetWidth;

const organismsCount = 5000;
const organismSize = 1;
let infectionRadius = 5;
const organismColor = "blue";
const organismColorInfected = "red";

let allOrganisms = [];
let infectedOrganisms = [];
let healthyOrganisms = [];
let idGenerator = 0;

class Particle {
  constructor(effect) {
    this.id = ++idGenerator;
    this.infected = false;
    this.effect = effect;
    this.radius = organismSize;
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
  }

  draw(context) {
    if (!this.infected) {
      context.fillStyle = organismColor;
    } else {
      context.fillStyle = organismColorInfected;
    }
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();

    //pre-fill report:
    report();
  }

  update() {
    this.x += this.vx;
    if (this.x > this.effect.width || this.x < 0) this.vx *= -1;
    this.y += this.vy;
    if (this.y > this.effect.height || this.y < 0) this.vy *= -1;

    if (this.infected) {
      this.spreadInfection();
    }
  }

  infect() {
    if (!this.infected) {
      this.infected = true;
      infectedOrganisms.push(this);
      let itemToRemove = healthyOrganisms.indexOf(this);
      healthyOrganisms.splice(itemToRemove, 1);

      report();
    }
  }

  cure() {
    if (this.infected) {
      this.infected = false;
      let itemToRemove = infectedOrganisms.indexOf(this);
      infectedOrganisms.splice(itemToRemove, 1);
      healthyOrganisms.push(this);
    }

    report();
  }

  spreadInfection() {
    if (this.infected) {
      for (let healthy = 0; healthy < healthyOrganisms.length; healthy++) {
        if (
          Math.abs(this.x - healthyOrganisms[healthy].x) < infectionRadius &&
          Math.abs(this.y - healthyOrganisms[healthy].y) < infectionRadius
        ) {
          healthyOrganisms[healthy].infect();
        }
      }
    }
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = organismsCount;
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this)); // will look for this class and trigger its constructor.
    }
    allOrganisms = [...this.particles];
    healthyOrganisms = [...allOrganisms];
    // console.log(healthyOrganisms);
  }

  handleParticles(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
}

const effect = new Effect(canvas);

function report() {
  populationLabel.innerHTML = `${allOrganisms.length}`;
  healthyLabel.innerHTML = `${healthyOrganisms.length}`;
  infectedLabel.innerHTML = `${infectedOrganisms.length}`;
  percentLabel.innerHTML = `${(
    (infectedOrganisms.length / organismsCount) *
    100
  ).toFixed(2)}%`;

  // report1.innerHTML = `
  // All Organisms: ${allOrganisms.length}
  // Infected: ${infectedOrganisms.length}
  // <br/>Healthy: ${healthyOrganisms.length}
  // <br/> Infection Rate: ${(
  //   (infectedOrganisms.length / organismsCount) *
  //   100
  // ).toFixed(2)}%`;
}

function infectOne() {
  if (healthyOrganisms.length > 1) {
    let randomOrganism = Math.floor(Math.random() * healthyOrganisms.length);
    healthyOrganisms[randomOrganism].infect();
  }
}

function reset() {
  cureAll();
}

function cureOne() {
  if (infectedOrganisms.length >= 1) {
    let randomOrganism = Math.floor(Math.random() * infectedOrganisms.length);
    infectedOrganisms[randomOrganism].cure();
  }
}

function cureFive() {
  for (let counter = 0; counter < 5; counter++) {
    if (infectedOrganisms.length >= 1) {
      let randomOrganism = Math.floor(Math.random() * infectedOrganisms.length);
      infectedOrganisms[randomOrganism].cure();
    }
  }
}

function cureTen() {
  for (let counter = 0; counter < 10; counter++) {
    if (infectedOrganisms.length >= 1) {
      let randomOrganism = Math.floor(Math.random() * infectedOrganisms.length);
      infectedOrganisms[randomOrganism].cure();
    }
  }
}

function cureAll() {
  infectedOrganisms = [];
  healthyOrganisms = [];
  healthyOrganisms = [...allOrganisms];
  healthyOrganisms.forEach((puppy) => {
    if (puppy.infected) puppy.infected = false;
  });

  report();
}

function logInfected() {
  console.log(infectedOrganisms);
}

function logHealthy() {
  console.log(healthyOrganisms);
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(context);
  requestAnimationFrame(animate);
}

animate();
