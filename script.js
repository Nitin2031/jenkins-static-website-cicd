const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

async function loadBuildData() {
  try {
    const response = await fetch("build-info.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Metadata unavailable");
    }

    const data = await response.json();
    const date = new Date(data.deployedAt);

    $("#buildNumber").textContent = "#" + data.buildNumber;
    $("#buildResult").textContent = data.result;
    $("#commitHash").textContent = data.commit;
    $("#branchName").textContent = data.branch;

    $("#deployedAt").textContent = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    $("#deployedDate").textContent = date.toLocaleDateString();

    $("#heroBuild").textContent = "#" + data.buildNumber;
    $("#heroStatus").textContent = data.result;

    $("#heroTime").textContent =
      "Commit " + data.commit + " • " + date.toLocaleString();

    const events = [
      ["Metadata loaded", "build-info.json"],
      ["Release verified", "HTTP 200"],
      ["Assets synchronized", "rsync"],
      ["Source resolved", data.commit]
    ];

    $("#eventFeed").innerHTML = events
      .map(
        ([name, value]) =>
          `<p>${name}<span>${value}</span></p>`
      )
      .join("");

  } catch (error) {
    $("#buildResult").textContent = "DEMO MODE";

    $("#eventFeed").innerHTML =
      "<p>Metadata unavailable<span>Simulation ready</span></p>";
  }
}

/* Pipeline simulation */

const launch = $("#launch");
const stages = $$(".stage");

const messages = [
  "Resolving main and fetching the latest commit...",
  "Validating HTML, CSS and JavaScript assets...",
  "Opening private SSH transport and synchronizing files...",
  "Requesting production endpoint and verifying HTTP 200..."
];

const wait = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

launch.addEventListener("click", async () => {
  launch.disabled = true;
  launch.textContent = "PIPELINE RUNNING";

  $("#simulationStatus").textContent = "DEPLOYMENT IN PROGRESS";

  stages.forEach(stage => {
    stage.classList.remove("running", "done");
    stage.querySelector("small").textContent = "STANDBY";
  });

  for (let index = 0; index < stages.length; index++) {
    const stage = stages[index];

    stage.classList.add("running");
    stage.querySelector("small").textContent = "RUNNING";
    $("#terminalText").textContent = messages[index];

    await wait(1100);

    stage.classList.remove("running");
    stage.classList.add("done");
    stage.querySelector("small").textContent = "COMPLETE";

    await wait(250);
  }

  $("#simulationStatus").textContent = "RELEASE HEALTHY";

  $("#terminalText").textContent =
    "Deployment complete. Production endpoint returned HTTP 200.";

  launch.textContent = "RUN AGAIN ↻";
  launch.disabled = false;
});

/* 3D card movement */

$$("[data-tilt]").forEach(card => {
  card.addEventListener("pointermove", event => {
    const rectangle = card.getBoundingClientRect();

    const x =
      (event.clientX - rectangle.left) / rectangle.width - 0.5;

    const y =
      (event.clientY - rectangle.top) / rectangle.height - 0.5;

    card.style.transform =
      `perspective(800px)
       rotateY(${x * 7}deg)
       rotateX(${y * -7}deg)
       translateY(-3px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

/* Animated network background */

const canvas = $("#network");
const context = canvas.getContext("2d");

let particles = [];

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;

  context.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );

  particles = Array.from(
    {
      length: Math.min(65, Math.floor(innerWidth / 20))
    },
    () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18
    })
  );
}

function draw() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  context.fillStyle = "rgba(66, 245, 212, 0.65)";

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > innerWidth) {
      particle.vx *= -1;
    }

    if (particle.y < 0 || particle.y > innerHeight) {
      particle.vy *= -1;
    }

    context.beginPath();
    context.arc(
      particle.x,
      particle.y,
      1.1,
      0,
      Math.PI * 2
    );
    context.fill();

    particles.slice(index + 1).forEach(otherParticle => {
      const distance = Math.hypot(
        particle.x - otherParticle.x,
        particle.y - otherParticle.y
      );

      if (distance < 115) {
        context.strokeStyle =
          `rgba(76, 141, 255, ${(1 - distance / 115) * 0.14})`;

        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(otherParticle.x, otherParticle.y);
        context.stroke();
      }
    });
  });

  requestAnimationFrame(draw);
}

addEventListener("resize", resize);

resize();

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  draw();
}

loadBuildData();
