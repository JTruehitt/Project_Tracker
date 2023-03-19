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
let mainProjectDisplay = $(".mainProjectDisplay");

let numberOfProjects = [];
let projectList = [];

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

  numberOfProjects = JSON.parse(localStorage.getItem("numberOfProjects"));
  if (numberOfProjects === null) {
    numberOfProjects = [];
  }
  numberOfProjects.push(projectNumber);

  localStorage.setItem("numberOfProjects", JSON.stringify(numberOfProjects));

  let projectName = projectNameInput.val();
  let projectType = projectTypeInput.val();
  let dueDate = dueDateInput.val();

  let projectDetails = { projectNumber, projectName, projectType, dueDate };

  projectList = JSON.parse(localStorage.getItem("projectList"));
  if (projectList === null) {
    projectList = [];
  }

  projectList.push(projectDetails);

  localStorage.setItem("projectList", JSON.stringify(projectList));

  projectNumber++;
  localStorage.setItem("projectNumber", projectNumber);
});

function fetchProjects() {
  projectList = JSON.parse(localStorage.getItem("projectList"));
  numberOfProjects = JSON.parse(localStorage.getItem("numberOfProjects"));
  console.log(projectList);
  console.log(numberOfProjects);

  if (projectList === null) {
    return;
  } else {
    for (let i = 0; i < projectList.length; i++) {
      let projectEntry = $("<tr>");
      let projectNumberDisplay = $("<td>");
      let projectNameDisplay = $("<td>");
      let projectTypeDisplay = $("<td>");
      let projectDueDateDisplay = $("<td>");

      projectNumberDisplay.text(projectList[i].projectNumber);
      projectNameDisplay.text(projectList[i].projectName);
      projectTypeDisplay.text(projectList[i].projectType);
      projectDueDateDisplay.text(projectList[i].dueDate);

      projectEntry.append(projectNumberDisplay);
      projectEntry.append(projectNameDisplay);
      projectEntry.append(projectTypeDisplay);
      projectEntry.append(projectDueDateDisplay);

      mainProjectDisplay.append(projectEntry);
    }
  }
}

console.log(localStorage);
fetchProjects();

// localStorage.clear()
