let timeDisplay = $(".timeDisplay");
let currentDateDisplay = $(".currentDate");
let currentTimeDisplay = $(".currentTime");
let currentDate = dayjs().format("MMM D, YYYY");
let currentTime = dayjs().format("h:mm:ss a");

currentDateDisplay.text(currentDate);
currentTimeDisplay.text(currentTime);

function updateTime() {
  currentTimeDisplay.text(dayjs().format("h:mm:ss a"));
}
setInterval(updateTime, 1000);

//! Figure out jQuery ui datepicker and link form elements to finish out step 1.
