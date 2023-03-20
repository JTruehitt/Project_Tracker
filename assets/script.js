$(function () {
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
  let completedProjectDisplay = $(".completedProjectDisplay");
  let projectList = [];
  let completedProjectsList = [];

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

    let projectDetails = { projectNumber, projectName, projectType, dueDate };

    projectList = JSON.parse(localStorage.getItem("projectList"));
    if (projectList === null) {
      projectList = [];
    }

    projectList.push(projectDetails);

    localStorage.setItem("projectList", JSON.stringify(projectList));

    projectNumber++;
    localStorage.setItem("projectNumber", projectNumber);

    fetchProjects();
  });

  function fetchProjects() {
    mainProjectDisplay.empty();
    projectList = JSON.parse(localStorage.getItem("projectList"));

    if (projectList === null) {
      return;
    } else {
      for (let i = 0; i < projectList.length; i++) {
        let projectEntry = $("<tr>");
        let projectNumberDisplay = $("<td>");
        let projectNameDisplay = $("<td>");
        let projectTypeDisplay = $("<td>");
        let projectDueDateDisplay = $("<td>");
        let projectComplete = $("<td>");
        let projectDelete = $("<td>");
        let projectCompleteBtn = $("<button>");
        let projectDeleteBtn = $("<button>");

        projectNumberDisplay.text(projectList[i].projectNumber);
        projectNameDisplay.text(projectList[i].projectName);
        projectTypeDisplay.text(projectList[i].projectType);
        projectDueDateDisplay.text(projectList[i].dueDate);

        projectCompleteBtn.text("Completed");
        projectDeleteBtn.text("Delete");

        projectCompleteBtn.addClass(
          "projectCompleteBtn btn btn-success btn-sm"
        );
        projectDeleteBtn.addClass("projectDeleteBtn btn btn-danger btn-sm");

        projectComplete.append(projectCompleteBtn);
        projectDelete.append(projectDeleteBtn);

        projectEntry.append(projectNumberDisplay);
        projectEntry.append(projectNameDisplay);
        projectEntry.append(projectTypeDisplay);
        projectEntry.append(projectDueDateDisplay);
        projectEntry.append(projectComplete);
        projectEntry.append(projectDelete);

        mainProjectDisplay.append(projectEntry);

        projectNameInput.val("");
        projectTypeInput.val("");
        dueDateInput.val("");

        if (projectList[i].dueDate < dayjs().format("MM/DD/YYYY")) {
          projectDueDateDisplay.parent().addClass("table-danger");
        } else if (projectList[i].dueDate == dayjs().format("MM/DD/YYYY")) {
          projectDueDateDisplay.parent().addClass("table-warning");
        } else {
          projectDueDateDisplay.parent().addClass("table-success");
        }
      }
    }
  }

  $(mainProjectDisplay).click(function (e) {
    if (!e.target.matches("button.projectCompleteBtn")) {
      return;
    } else {
      let completedProject = $(e.target)
        .parent()
        .parent()
        .children()
        .eq(0)
        .text();

      projectList = JSON.parse(localStorage.getItem("projectList"));

      let index = projectList.findIndex((object) => {
        return object.projectNumber == completedProject;
      });

      let completeDate = dayjs().format("MM/DD/YYYY");

      projectList[index].dueDate = completeDate;

      completedProjectsList = JSON.parse(
        localStorage.getItem("completedProjectsList")
      );

      if (completedProjectsList === null) {
        completedProjectsList = [];
      }
      completedProjectsList.push(projectList.splice(index, 1));

      localStorage.setItem(
        "completedProjectsList",
        JSON.stringify(completedProjectsList)
      );

      localStorage.setItem("projectList", JSON.stringify(projectList));

      displayCompleted();

      location.reload();
    }
  });

  function displayCompleted() {
    completedProjectDisplay.empty();
    completedProjectsList = JSON.parse(
      localStorage.getItem("completedProjectsList")
    );

    if (completedProjectsList === null) {
      return;
    }

    $(".completed-projects-container").removeClass("hide");

    for (let i = 0; i < completedProjectsList.length; i++) {
      let completedProjectEntry = $("<tr>");
      let completedProjectNumberDisplay = $("<td>");
      let completedProjectNameDisplay = $("<td>");
      let completedProjectTypeDisplay = $("<td>");
      let completedProjectDateDisplay = $("<td>");

      completedProjectNumberDisplay.text(
        completedProjectsList[i][0].projectNumber
      );
      completedProjectNameDisplay.text(completedProjectsList[i][0].projectName);
      completedProjectTypeDisplay.text(completedProjectsList[i][0].projectType);
      completedProjectDateDisplay.text(completedProjectsList[i][0].dueDate);

      completedProjectEntry.append(completedProjectNumberDisplay);
      completedProjectEntry.append(completedProjectNameDisplay);
      completedProjectEntry.append(completedProjectTypeDisplay);
      completedProjectEntry.append(completedProjectDateDisplay);

      completedProjectEntry.addClass("table-info");

      completedProjectDisplay.append(completedProjectEntry);
    }
  }

  $(mainProjectDisplay).click(function (e) {
    if (!e.target.matches("button.projectDeleteBtn")) {
      return;
    } else {
      let deletedProject = $(e.target)
        .parent()
        .parent()
        .children()
        .eq(0)
        .text();

      projectList = JSON.parse(localStorage.getItem("projectList"));

      index = projectList.findIndex((object) => {
        return object.projectNumber == deletedProject;
      });

      projectList.splice(index, 1);

      localStorage.setItem("projectList", JSON.stringify(projectList));

      fetchProjects();
    }
  });

  fetchProjects();
  displayCompleted();
});

$(".clearAllBtn").click(function () {
  localStorage.clear();
  location.reload();
});
