const DEFAULT_MODES = {
  pomodoro: 25,
  short: 5,
  long: 15
};
let time = 25 * 60;
let timeInterval;
let currentMode = "pomodoro";
let MODES = {
  pomodoro: 25,
  short: 5,
  long: 15
};
let totalBreaks = 0;
const alarmSound = new Audio('./assets/mixkit-clock-bells-hour-signal.wav');

const handleModeButtons = e => switchMode(e.target.dataset.modeId);

const durationControlHandler = e => {
  const value = e.target.value.trim();
  const durationId = e.target.dataset.durationId;

  if (value !='' && !isNaN(value) && Number.isInteger(parseFloat(value)) && parseInt(value) != 0) {
    MODES[durationId] = parseInt(value);
  } else {
    MODES[durationId] = DEFAULT_MODES[durationId];
  }
  resetTimer();
}

const modesBtn = document.querySelectorAll("#modes button");
modesBtn.forEach(button => button.addEventListener("click", handleModeButtons));

const durationInput = document.querySelectorAll("#duration-control input")
durationInput.forEach(input => {
  input.addEventListener("change", durationControlHandler);
  input.value = '';
});


const updateControlButtons = (isRunning) => {
  const startButton = document.querySelector(".timer-control.start");
  const pauseButton = document.querySelector(".timer-control.pause");
  if (isRunning) {
    startButton.disabled = true;
    pauseButton.disabled = false;
  } else {
    startButton.disabled = false;
    pauseButton.disabled = true;
  }
}

const switchMode = mode => {
  currentMode = mode;
  document.documentElement.style.backgroundColor = `var(--${mode})`;
  document.querySelectorAll("#modes button")
          .forEach(el => {
            el.classList.remove("active")
          })
  document.querySelector(`button[data-mode-id="${mode}"]`)
          .classList.add("active");
  resetTimer();
}

const startTimer = () => {
  timeInterval = setInterval(updateTimer, 1000);
  updateControlButtons(true);
};
const pauseTimer = () => {
  clearInterval(timeInterval);
  updateControlButtons(false);
};

const updateTimer = () => {

  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("timer").textContent = `${minutes}:${seconds}`
  document.title = `${minutes}:${seconds} - Totoro Timer`;
  if (time <= 0) {
    pauseTimer();
    alarmSound.currentTime = 0;
    alarmSound.play();
    nextMode();
    resetTimer();
  }
  time --;
}

const nextMode = () => {
  if (currentMode === "pomodoro") {
    totalBreaks ++;
    totalBreaks % 4 == 0 ? switchMode("long") : switchMode("short");
    updateControlButtons(false);
  } else {
    switchMode("pomodoro");
    updateControlButtons(false);
  }
}

const resetTimer = () => {
  time = MODES[currentMode] * 60;
  clearInterval(timeInterval);
  updateTimer();
  updateControlButtons(false);
}
