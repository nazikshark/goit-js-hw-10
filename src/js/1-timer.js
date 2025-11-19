import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minsEl = document.querySelector('[data-minutes]');
const secsEl = document.querySelector('[data-seconds]');

let userDate = null;
let timerId = null;

btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const now = new Date();

    if (selectedDates[0] <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future!',
      });
      btnStart.disabled = true;
      return;
    }

    userDate = selectedDates[0];
    btnStart.disabled = false;
  },
};

flatpickr(input, options);

btnStart.addEventListener('click', () => {
  btnStart.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const diff = userDate - new Date();

    if (diff <= 0) {
      clearInterval(timerId);
      iziToast.success({
        title: 'Done!',
        message: 'The countdown has ended.',
      });

      input.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);

    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minsEl.textContent = addLeadingZero(minutes);
    secsEl.textContent = addLeadingZero(seconds);
  }, 1000);
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}