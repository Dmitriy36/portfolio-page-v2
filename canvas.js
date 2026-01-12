const container = document.querySelector(".canvas-container");
const canvas = document.getElementById("canvas1");

const populationLabel = document.getElementById("populationValue");
const healthyLabel = document.getElementById("healthyValue");
const infectedLabel = document.getElementById("infectedValue");
const percentLabel = document.getElementById("percentValue");

const chartPanel = document.getElementById("chart-panel");

const context = canvas.getContext("2d");

canvas.width = container.offsetWidth;
canvas.height = container.offsetWidth;

const organismsCount = 5000;

// Scale organism size and infection radius based on canvas width
// Base values are for a 800px canvas
const baseCanvasWidth = 800;
const baseOrganismSize = 2;
const baseInfectionRadius = 7;

const scaleFactor = canvas.width / baseCanvasWidth;
const organismSize = Math.max(1, baseOrganismSize * scaleFactor);
let infectionRadius = Math.max(3, baseInfectionRadius * scaleFactor);

const organismColor = "blue";
const organismColorInfected = "red";

let allOrganisms = [];
let infectedOrganisms = [];
let healthyOrganisms = [];
let idGenerator = 0;
let recentlySpreadInfection = false;

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
  // percentLabel.innerHTML = `${(
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

function infectFive() {
  if (healthyOrganisms.length > 5) {
    for (i = 0; i < 5; i++) {
      let randomOrganism = Math.floor(Math.random() * healthyOrganisms.length);
      healthyOrganisms[randomOrganism].infect();
    }
  }
}

function infectTen() {
  if (healthyOrganisms.length > 10) {
    for (i = 0; i < 10; i++) {
      let randomOrganism = Math.floor(Math.random() * healthyOrganisms.length);
      healthyOrganisms[randomOrganism].infect();
    }
  }
}
function infectFifty() {
  if (healthyOrganisms.length > 50) {
    for (i = 0; i < 50; i++) {
      let randomOrganism = Math.floor(Math.random() * healthyOrganisms.length);
      healthyOrganisms[randomOrganism].infect();
    }
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

function getData() {
  return infectedOrganisms.length;
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

var donutChartDiv = document.getElementById("donutChart");
var pieChartDiv = document.getElementById("pieChart");

let donutData = [
  {
    values: [infectedOrganisms.length, healthyOrganisms.length],
    labels: ["Infected", "Healthy"],
    type: "pie",
    hole: 0.5,
    marker: { colors: ["red", "#39FF14"] },
    sort: false,
    direction: "clockwise",
  },
];

let pieData = [
  {
    values: [infectedOrganisms.length, healthyOrganisms.length],
    labels: ["Infected", "Healthy"],
    type: "pie",
    marker: { colors: ["red", "#39FF14"] },
    sort: false,
    direction: "clockwise",
  },
];

let layout = {
  height: 200,
  width: 200,
  margin: {
    l: 0, // left margin
    r: 0, // right margin
    b: 10, // bottom margin
    t: 0, // top margin
  },
  autosize: true,
  annotations: [
    {
      text: `${((infectedOrganisms.length / organismsCount) * 100).toFixed(
        2
      )}%`,
      x: 0.5,
      y: 0.5,
      showarrow: false,
      font: {
        size: 15,
        color: "black",
      },
    },
  ],
  showlegend: false,
};

let pieLayout = {
  height: 200,
  width: 200,
  margin: {
    l: 0, // left margin
    r: 0, // right margin
    b: 10, // bottom margin
    t: 0, // top margin
  },
  autosize: true,
  showlegend: false,
};

var config = { responsive: true };

Plotly.newPlot(donutChartDiv, donutData, layout, config);
Plotly.newPlot(pieChartDiv, pieData, pieLayout, config);

function updateGraph() {
  layout = {
    height: 200,
    width: 200,
    margin: {
      l: 0, // left margin
      r: 0, // right margin
      b: 10, // bottom margin
      t: 0, // top margin
    },
    autosize: true,
    annotations: [
      {
        text: `${((infectedOrganisms.length / organismsCount) * 100).toFixed(
          2
        )}%`,
        x: 0.5,
        y: 0.5,
        showarrow: false,
        font: {
          size: 15,
          color: "black",
        },
      },
    ],
    showlegend: false,
  };

  let pieLayout = {
    height: 200,
    width: 200,
    margin: {
      l: 0, // left margin
      r: 0, // right margin
      b: 10, // bottom margin
      t: 0, // top margin
    },
    autosize: true,
    showlegend: false,
  };

  donutData = [
    {
      values: [infectedOrganisms.length, healthyOrganisms.length],
      labels: ["Infected", "Healthy"],
      type: "pie",
      hole: 0.5,
      marker: { colors: ["red", "#39FF14"] },
    },
  ];

  pieData = [
    {
      values: [infectedOrganisms.length, healthyOrganisms.length],
      labels: ["Infected", "Healthy"],
      type: "pie",
      marker: { colors: ["red", "#39FF14"] },
    },
  ];

  Plotly.react(donutChartDiv, donutData, layout, config);
  Plotly.react(pieChartDiv, pieData, pieLayout, config);
}

setInterval(updateGraph, 250);
