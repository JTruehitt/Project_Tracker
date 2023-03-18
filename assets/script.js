// setting global variables
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

// updating time each second
function updateTime() {
  currentTimeDisplay.text(dayjs().format("h:mm:ss a"));
}
setInterval(updateTime, 1000);

// setting functionality of datepicker
$(function () {
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    showOtherMonths: true,
    selectOtherMonths: true,
  });
});

// on form submit, sets project number which will act as the key to save project, and will iterate this number to allow to save different projects in storage
// grabs values from form inputs, adds them to projectDetails object, and sends them to local storage
formSubmitBtn.click(function () {
  let projectNumber = localStorage.getItem("projectNumber");
  if (projectNumber === null) {
    projectNumber = 1;
  }

  let projectName = projectNameInput.val();
  let projectType = projectTypeInput.val();
  let dueDate = dueDateInput.val();

  let projectDetails = { projectName, projectType, dueDate };

  localStorage.setItem(projectNumber, JSON.stringify(projectDetails));

  projectNumber++;
  localStorage.setItem("projectNumber", projectNumber);
});

// localStorage.clear()
