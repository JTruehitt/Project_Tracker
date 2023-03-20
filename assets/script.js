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

  // on form submit, sets project number which will be used to identify project in later functions. projectNumber will iterate with each project created.
  // grabs values from form inputs, adds them to projectDetails object, and sends them to local storage within the full projectList array
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

  // this function renders any submitted projects to the page
  // first empties the display annd pulls in the saved projectList from local storage
  // for each saved project, creates a new table row, several table data values, and two buttons for complete and delete
  // adds the user input values from the form to the corresponding data cells, then appends the cells to the table row and appends the row to the main table
  // resets the form fields so they are empty should the user want to input another project
  // utilizes day.js to check due date vs current date and color code the table row accordingly
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

  // this event listener handles when the user clicks the complete button
  // locates the project number based on the value in the corresponding projectNumber cell of the buttons grandparent
  // uses this projectNumber to determine the index of the completed project within the full project list
  // updates the "dueDate" to the current date, which will reflect the completed date in the completed projects table
  // splices the completed project out of the full projectList and pushes it to the completedProjects array.
  // pushes the updated projectsList and completedProjects list to local storage and calls function to display completed projects. 
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

  // this function renders the completed projects to the page so the user can see all the great stuff they've completed
  // starts by emptying the table and pulls in the completedProjectsList from local storage.
  // displays the completed table if this is the first completed project
  // similar to how the main projects list was rendered, iterates through the completedProjectsList array and pushes each project to the page
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

  // this function deletes an open project from the page and from local storage.
  // obtains the project number of the grandparent of the clicked delete button similar to how the completed button was set up
  // uses the index of the deleted project and splices it out of the projectList. splice is used so that no blank spaces are left over.
  // calls fetchProjects to reload the page and show the project has been deleted. 
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

  // the fetchProjects and displayCompleted functions are called on load so that any saved projects render for the user upon access of the app.
  fetchProjects();
  displayCompleted();

  // adds listener to the clear all button to, well, clear all when clicked.
  $(".clearAllBtn").click(function () {
    localStorage.clear();
    location.reload();
  });
});


