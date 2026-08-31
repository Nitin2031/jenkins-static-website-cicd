const button = document.getElementById("runPipeline");
const statusText = document.getElementById("pipelineStatus");
const logText = document.getElementById("logText");
const indicator = document.querySelector(".toolbar div i");
const stages = [...document.querySelectorAll(".stage")];
const lines = [...document.querySelectorAll(".line")];

const messages = [
  "Checking out the latest commit from the main branch...",
  "Validating index.html, style.css and script.js...",
  "Synchronizing release files to the Nginx EC2 server...",
  "Running the production HTTP health check..."
];

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function runPipeline() {
  button.disabled = true;
  button.textContent = "Running...";

  statusText.textContent = "Deployment in progress";
  indicator.style.background = "var(--orange)";

  // Reset the previous animation.
  stages.forEach((stage) => {
    stage.classList.remove("active", "complete");
    stage.querySelector("small").textContent = "Waiting";
  });

  lines.forEach((line) => {
    line.classList.remove("complete");
  });

  // Run each visual pipeline stage in sequence.
  for (let index = 0; index < stages.length; index += 1) {
    const stage = stages[index];

    stage.classList.add("active");
    stage.querySelector("small").textContent = "Running";
    logText.textContent = messages[index];

    await wait(900);

    stage.classList.remove("active");
    stage.classList.add("complete");
    stage.querySelector("small").textContent = "Complete";

    if (lines[index]) {
      lines[index].classList.add("complete");
    }

    await wait(250);
  }

  statusText.textContent = "Deployment successful";
  logText.textContent =
    "Release deployed successfully — production returned HTTP 200.";

  indicator.style.background = "var(--green)";
  button.textContent = "↻ Run again";
  button.disabled = false;
}

button.addEventListener("click", runPipeline);
