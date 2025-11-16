import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("[data-start]");
const dateInput = document.querySelector("#datetime-picker");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let selectedDate = null;
let timerId = null;

startBtn.disabled = true;

// ---------------- FLATPICKR ----------------

flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startBtn.disabled = true;
      return;
    }

    startBtn.disabled = false;
  },
});

// ---------------- START BUTTON ----------------

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const diff = selectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      iziToast.success({
        message: "Timer finished!",
        position: "topRight",
      });
      return;
    }

    updateTimer(convertMs(diff));
  }, 1000);
});

// ---------------- HELPERS ----------------

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
