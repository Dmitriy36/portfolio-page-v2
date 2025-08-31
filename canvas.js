const container = document.querySelector(".container");
const canvas = document.getElementById("canvas1");
const report1 = document.getElementById("reportInfected");
const context = canvas.getContext("2d");

canvas.width = container.offsetWidth;
canvas.height = container.offsetWidth;

const organismsCount = 3000;
const organismSize = 2;
let infectionRadius = 3;
const organismColor = "blue";
const organismColorInfected = "red";

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
      console.log("an organism has been infected");
      this.infected = true;
      infectedOrganisms.push(this);
      let itemToRemove = healthyOrganisms.indexOf(this);
      healthyOrganisms.splice(itemToRemove, 1);

      report1.innerHTML = `Infected: ${
        infectedOrganisms.length
      } <br/>Healthy: ${healthyOrganisms.length} <br/> Infection Rate: ${(
        (infectedOrganisms.length / organismsCount) *
        100
      ).toFixed(2)}%`;
    }
  }

  spreadInfection() {
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
    healthyOrganisms = [...this.particles];
    console.log(healthyOrganisms);
  }

  handleParticles(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
}

const effect = new Effect(canvas);

function infectOne() {
  if (healthyOrganisms.length > 1) {
    let randomOrganism = Math.floor(Math.random() * healthyOrganisms.length);
    healthyOrganisms[randomOrganism].infect();
  }
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
