let timeDisplay = $(".timeDisplay");
let currentDateDisplay = $(".currentDate");
let currentTimeDisplay = $(".currentTime");
let currentDate = dayjs().format("MMM D, YYYY");
let currentTime = dayjs().format("h:mm:ss a");
let projectNameInput = $("#projectName");
let projectTypeInput = $("#projectType");
let dueDateInput = $("#datepicker");
let formSubmitBtn = $(".submitBtn");

currentDateDisplay.text(currentDate);
currentTimeDisplay.text(currentTime);

function updateTime() {
  currentTimeDisplay.text(dayjs().format("h:mm:ss a"));
}
setInterval(updateTime, 1000);

$(function () {
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    selectOtherMonths: true,
  });
});

formSubmitBtn.click(function () {
  let projectName = projectNameInput.val();
  let projectType = projectTypeInput.val();
  let dueDate = dueDateInput.val();

  console.log(projectName);
  console.log(projectType);
  console.log(dueDate);
});
