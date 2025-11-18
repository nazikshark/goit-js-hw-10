import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
  input: document.querySelector("#datetime-picker"),
  btnStart: document.querySelector("[data-start]"),

  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

let userSelectedDate = null;
let timerId = null;

refs.btnStart.disabled = true;

flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (selected <= new Date()) {
      refs.btnStart.disabled = true;

      iziToast.error({
        message: "Please choose a date in the future",
        position: "topRight",
      });
      return;
    }

    userSelectedDate = selected;
    refs.btnStart.disabled = false;
  },
});

refs.btnStart.addEventListener("click", () => {
  refs.btnStart.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const ms = userSelectedDate - new Date();

    if (ms <= 0) {
      clearInterval(timerId);
      updateTimerInterface(0);

      refs.input.disabled = false;
      refs.btnStart.disabled = true;

      iziToast.success({
        message: "Time is up!",
        position: "topRight",
      });

      return;
    }

    const time = convertMs(ms);
    updateTimerInterface(time);
  }, 1000);
});

function updateTimerInterface({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
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
