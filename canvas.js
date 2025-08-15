// setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d"); // ctx = context
canvas.width = window.innerWidth / 4;
canvas.height = window.innerHeight / 4;
ctx.fillStyle = "blue";
ctx.strokeStyle = "white";
ctx.lineWidth = 2;

const organismsCount = 2500;
const organismSize = 1;

class Particle {
  constructor(effect) {
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
    context.fillStyle = "hsl(" + this.x * 0.1 + ",100%,50%)";
    // context.fillStyle = "hsl(" + Math.random() * 360 + ",100%,50%)";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    // context.stroke();
  }
  update() {
    this.x += this.vx;
    if (this.x > this.effect.width || this.x < 0) this.vx *= -1;
    this.y += this.vy;
    if (this.y > this.effect.height || this.y < 0) this.vy *= -1;
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
  }
  handleParticles(context) {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });
  }
}

const effect = new Effect(canvas);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  requestAnimationFrame(animate);
}
animate();
