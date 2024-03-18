(function pageLoad() {
  drawTaskPanel(null);
}());

// open 'add task' modal when user clicks on the 'add task' button
function openModal(mode, index) {
  let buttonMarkup;
  $('#tskDueDate').attr('min', new Date().toJSON().split('T')[0]);
  // check if user is adding a new task or editing an existing one
  if (mode === 'add') {
    setModalData(null);
    $('.modal-title').text('Add Task');
    buttonMarkup = '<button class="btn btn-primary" id="tskSaveBtn" onclick="addTask()">Add Task</button>'
  } else {
        fetch(`http://localhost:8000/task/${index}/`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch task data');
            }
            return response.json();
          })
          .then(taskData => {
            // Process task data and set it in modal
            setModalData(taskData);
            $('.modal-title').text('Edit Task');
            buttonMarkup = `<button class="btn btn-primary" id="tskSaveBtn" onclick="editTask(${index})">Edit Task</button>`;
            $('.modal-footer').empty().append(buttonMarkup);
          })
          .catch(error => {
            console.error('Error fetching task data:', error);
          });
  }
  $('.modal-footer').empty().append(buttonMarkup);
  $("#taskModal").modal('toggle');
  validate(); // call to enable/disable save button
}

// retrieve data from all the fields of the modal
function getModalData() {
  return {
    title: $('#tskTitle').val(),
    due_date: $('#tskDueDate').val(),
    status: $('#tskStatus').val(),
    priority: $('#tskPriority').val(),
    createdDate: new Date(),
    description: $('#tskContent').val(),
    isComplete: $('#tskCompletedChk').val()
  }
}

/* Sets the values of all modal fields before opening. Empties all fields in case of adding new task and sets all stored values
in case of task edit */
function setModalData(data) {
  if (!data) {
    $('#tskTitle').val('');
    $('#tskDueDate').val('');
    $('#tskStatus').val('to-do')
    $('#tskPriority').val('low')
    $('#tskContent').val('');
    $('#tskCompletedChk').attr('checked', false);
  } else {
    $('#tskTitle').val(data.title)
    $('#tskStatus').val(data.status)
    $('#tskPriority').val(data.priority)
    $('#tskContent').val(data.description)
    $('#tskCompletedChk').val(data.isComplete);
    $('#tskDueDate').val(data.due_date);
  }
}

//when 'add task' button is clicked from modal
function addTask() {
  let taskDetail = getModalData();
  saveTaskObject(null, taskDetail);
  drawTaskPanel(null);
  $("#taskModal").modal('toggle');
  window.location.reload();
}

//when 'edit task' button is clicked from modal(when existing task is edited)
function editTask(index) {
  let taskDetail = getModalData();
  updateTask(index, taskDetail);
  drawTaskPanel(null);
  $("#taskModal").modal('toggle');
  window.location.reload();
}

function updateTask(index, taskDetail){
    // Convert the taskDetail object to JSON string
    let jsonData = JSON.stringify(taskDetail);
    // Make an HTTP POST request to Django REST API endpoint
      fetch(`http://localhost:8000/task/${index}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers as needed
        },
        body: jsonData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save task object');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        // Handle successful response
        console.log('Task object saved successfully:', data);
      })
      .catch(error => {
        // Handle error
        console.error('Error saving task object:', error);
      });
 }

function saveTaskObject(index, taskDetail) {
  // Convert the taskDetail object to JSON string
  let jsonData = JSON.stringify(taskDetail);

  // Make an HTTP POST request to Django REST API endpoint
  fetch('http://localhost:8000/task/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers as needed
    },
    body: jsonData,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to save task object');
    }
    return response.json(); // Parse the response JSON
  })
  .then(data => {
    // Handle successful response
    console.log('Task object saved successfully:', data);
  })
  .catch(error => {
    // Handle error
    console.error('Error saving task object:', error);
  });
}

function drawTaskPanel(status) {
  // Make an HTTP GET request to fetch task data from Django backend
  var API_URL = "http://localhost:8000/task/";
  if(status){
    API_URL = `http://localhost:8000/task/filter_status/?status=${status}`;
  }
  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch task data');
      }
      return response.json(); // Parse the response JSON
    })
    .then(taskDetail => {
      // emptying the task list before redrawing
      $('#taskListContainer').empty();

      // showing a message when no task exists
      if (taskDetail.length === 0) {
        let taskItemMarkup = `<div class="row"><div class="col-xs-12">No tasks created</div></div>`;
        $('#taskListContainer').append(taskItemMarkup);
      }
      // loop through fetched tasks to draw panels
      taskDetail.forEach((task, index) => {
        let taskItemMarkup = `<div class="row"><div class="col-xs-12"><div class="panel panel-primary">
                              <div class="panel-heading"><span class="title" id="taskTitle">${task.title} (Priority: ${task.priority})</span>
                              <div style="float: right;">
                              <span onclick="openModal('edit', ${task.id})" class="glyphicon glyphicon-pencil edit-delete-icon"></span>
                              <span onclick="deleteTask(${task.id})" class="glyphicon glyphicon-trash edit-delete-icon"></span>
                              </div></div><div class="panel-body"><div class="container-fluid bg-2 text-center">
                              <h3 class="margin title">  Task Details: ${task.description}.</h5>
                              <h4 class="margin title"> This is a ${task.priority} priority task, the due date for the task is ${task.due_date} and the status is ${task.status}
                              </div></div></div></div></div>`;
        $('#taskListContainer').append(taskItemMarkup);
      });
    })
    .catch(error => {
      // Handle error
      console.error('Error fetching task data:', error);
    });
}

function filter_status(element){
    let status = $(element).val();
    drawTaskPanel(status);
}

function deleteTask(id) {
  // Make an HTTP DELETE request to delete the task data from Django backend
  fetch(`http://localhost:8000/task/${id}/`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    // Redraw task panels after deletion
    drawTaskPanel(null);
  })
  .catch(error => {
    // Handle error
    console.error('Error deleting task:', error);
  });
}

/* validate if all the fields are filled out in the modal
show error message on 'add/edit task' button if any of the field is empty
*/
function validate() {
  if ($('#tskTitle').val() === '' || $('#tskDueDate').val() === '' || $('#tskContent').val() === '') {
    $('#tskSaveBtn').attr('title', 'Please fill all fields in the form');
    $('#tskSaveBtn').attr('disabled', 'disabled')
  } else {
    $('#tskSaveBtn').attr('title', 'Save changes');
    $('#tskSaveBtn').removeAttr('disabled')
  }
}