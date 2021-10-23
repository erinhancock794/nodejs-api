(function (window) {
  const incompleteTodoList = document.querySelector("#incomplete-ul");
  const completeTodoList = document.querySelector("#complete-ul");

  const newTodoInput = document.querySelector(".todo-list-input");
  const newTodoButton = document.querySelector(".todo-list-add-btn");
  newTodoButton.addEventListener("click", () => {
    submitNewTask(newTodoInput);
  });

  newTodoInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      console.log("you pressed enter");
      submitNewTask(newTodoInput);
    }
  });

  fetch("/todos/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((todo) => displayTodo(todo));
    });
  function displayTodo(todo) {
    // console.log("todo in display todo-0---->", todo);
    let todoTemplate = `
    <div class="form-check">
    <label class="form-check-label">
    <input id="${todo.id}" onClick="" class="js-tick checkbox" type="checkbox"/>
    ${todo.task}
    <p class="input-helper" id="incomplete-list">
    </p>
    </label>
    <div class="editicons">
    <i onclick="" class="remove mdi mdi-close-circle-outline fas fa-edit customeditbutton" id="edit">
    </i>
    <i onclick="" class="remove mdi mdi-close-circle-outline" id="remove">
    </i>
    </div>
    </div>

    `;

    if (!todo.complete) {
      incompleteTodoList.insertAdjacentHTML("beforeend", todoTemplate);
    } else {
      displayCompletedTodo(todo);
    }
  }

  function displayCompletedTodo(todo) {
    let todoTemplate = `
    <div class="form-check">
    <label class="form-check-label">
    <input id="${todo.id}" onClick="" class="js-tick checkbox" type="checkbox" checked />
    ${todo.task}
    <p class="input-helper" id="complete-list">
    </p>
    </label>
    <div class="editicons">
    <i onclick="" class="remove mdi mdi-close-circle-outline fas fa-edit customeditbutton" id="edit">
    </i>
    <i onclick="" class="remove mdi mdi-close-circle-outline" id="remove" >
    </i>
    </div>
    </div>
    `;
    completeTodoList.insertAdjacentHTML("beforeend", todoTemplate);
  }
  const listOfIncompleteTasks = document.querySelector(`#incomplete-list`);
  listOfIncompleteTasks.addEventListener("click", (event) => {
    toggleTask(event); //moves tasks between incomplete and complete list by using PUT to edit the status of the task
    deleteTask(event);
    editTask(event);
  });
  const listOfCompleteTasks = document.querySelector(`#complete-list`);
  listOfCompleteTasks.addEventListener("click", (event) => {
    event.preventDefault();

    toggleTask(event); //sets task complete/incomplete
    deleteTask(event); //removes task
    editTask(event) //edits task
  });
 


  function toggleTask(event) {
    const { id, checked, type } = event.target;
    
    
    if (type === "checkbox") {
      updateTask(id, checked);
      event.target.parentElement.parentElement.remove();
    }
  }

function editTask(event) {
  console.log('event target--->', event.target);
  const { id, checked, type } = event.target;
  console.log('id--->', id);
  // const getTask =
  // event.target.parentElement.parentElement.querySelector(".checkbox");
// const todoId = getTask.getAttribute("id"); //id of todo to be used in fetch call
// console.log('todo id--->', todoId);
const inputField = event.target.parentElement.parentElement;
console.log('inputField--->', inputField);
inputField.innerHTML = `<input placeholder="editing" id="edit-todo"></input><button class='mb-sm-btn btn btn-secondary btn-sm'>Update</button>`;

// inputField.firstChild.focus();
// inputField.firstChild.select();

let updatedTodoString = document.getElementById(`${id}`).value;
console.log('updatedTodoString--->', updatedTodoString);

  // if (id === 'edit') {
  //   const 
  //   updateTask(todoId, null, )
  // }




}

  function deleteTask(event) {
    event.preventDefault();
    const getTask =
      event.target.parentElement.parentElement.querySelector(".checkbox");
    const todoId = getTask.getAttribute("id"); //id of todo to be used in fetch call
    const { id } = event.target; //element id
    if (id === "remove") {
      fetch(`/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then(() => {
          getTask.parentElement.parentElement.remove();
        });
    }
  }

  function submitNewTask(newTodoInput) {
    let task = newTodoInput.value;
    if (!task) {
      return window.alert("Todo item cannot be blank. Please try again.");
    }

    fetch("/todos/add", {
      method: "POST",
      body: JSON.stringify({
        task,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          window.alert(`${data.message}`);
        } else {
          displayTodo(data.newTodo);
        }
      });
  }

  function updateTask(id, complete, task) {
    // console.log('bodyData---->', bodyData);
    // const complete = _.get(bodyData, 'complete')
    console.log('complete--->', complete);
    console.log('task---->', task);
    fetch(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        complete,
        task
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data----->", data);
        displayTodo(data.updatedTodo);
      });
  }

  // function renderTopInputSectionInDOM() {
  //   const topInputSectionDiv = document.querySelector(".add-items");
  //   const textInput = document.querySelector(".todo-list-input");
  //   const inputGroup = document.querySelector(".input-group-prepend");

  //   // event listener for hitting 'Enter' instead of clicking button
  //   textInput.addEventListener("keyup", function (event) {
  //     if (event.code === "Enter") {
  //       submitInput(event);
  //     }
  //   });

  //   // New Task Add Button
  //   const addNewTaskButton = document.querySelector("#add-btn");

  //   addNewTaskButton.addEventListener("click", (event) => {
  //     submitInput(event);
  //   });

  //   inputGroup.appendChild(textInput);
  //   topInputSectionDiv.appendChild(inputGroup);
  //   topInputSectionDiv.appendChild(addNewTaskButton);

  //   textInput.focus();
  //   textInput.select();
  // }
})(window);
