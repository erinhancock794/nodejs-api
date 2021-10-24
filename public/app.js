(function (window) {
  const incompleteTodoList = document.querySelector("#incomplete-ul");
  const completeTodoList = document.querySelector("#complete-ul");
  const newTodoInput = document.querySelector(".todo-list-input");
  const newTodoButton = document.querySelector(".todo-list-add-btn");
  newTodoButton.addEventListener("click", () => submitNewTask(newTodoInput));
  newTodoInput.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      submitNewTask(newTodoInput);
    }
  });

  function submitNewTask(newTodoInput) {
    //takes input from user and adds it to API and displays on browser
    let task = newTodoInput.value;
    if (!task) {
      return window.alert("Todo item cannot be blank. Please try again.");
    }
    fetch("/todos/add", {
      method: "POST",
      body: JSON.stringify({ task }),
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        data.error
          ? window.alert(`${data.message}`)
          : displayTodo(data.newTodo, false); //if API sends back an error, dispay error message, otherwise display todo
      });
  }

  fetch("/todos") //populate todo list on server startup
    .then(res => res.json())
    .then(data => data.forEach((todo) => displayTodo(todo)));

  function displayTodo(todo, completed) {
    const isComplete = todo.complete || completed;
    const taskListId = isComplete ? "complete-list" : "incomplete-list";
    const checked = isComplete ? "checked" : "";
    const listToUpdate = isComplete ? completeTodoList : incompleteTodoList; //determines which list todo items go

    let todoTemplate = `
    <div class="form-check">
    <label class="form-check-label" id="${todo.task}">
    <input id="${todo.id}" onClick="" class="js-tick checkbox" type="checkbox" ${checked}/>
    <p class="input-helper" id="${taskListId}"> ${todo.task}
    </p>
    </label>
    <div class="editicons">
    <i onclick="" class="remove mdi mdi-close-circle-outline fas fa-edit customeditbutton" id="edit">
    </i>
    <i onclick="" class="remove mdi mdi-close-circle-outline" id="remove">
    </i>
    </div>
    </div>`;

    listToUpdate.insertAdjacentHTML("beforeend", todoTemplate);
  }

  const listOfIncompleteTasks = document.querySelector("#incomplete-list");
  listOfIncompleteTasks.addEventListener("click", (event) => {
    handleEvents(event);
  });
  const listOfCompleteTasks = document.querySelector("#complete-list");
  listOfCompleteTasks.addEventListener("click", (event) => {
    handleEvents(event);
  });

  function handleEvents(event) {
    //handles toggling between lists, editing, and deleting todos
    event.preventDefault();
    const { id, type } = event.target;
    if (type === "checkbox") {
      toggleTask(event); //sends tasks to incomplete or complete lists by using PUT to edit
    } else if (id === "remove") {//line 49
      deleteTask(event); //removes task
    } else if (id === "edit") {//line 47
      editTask(event); //edits task text content using PUT
    }
  }

  function toggleTask(event) {
    const { id, checked } = event.target;
    updateTask(id, checked);
    event.target.parentElement.parentElement.remove();
  }

  function editTask(event) {
    const todoId = event.target.parentElement.parentElement
      .querySelector(".js-tick")
      .getAttribute("id");

    const taskText = event.target.parentElement.parentElement
      .querySelector(".form-check-label")
      .getAttribute("id");

    const inputField = event.target.parentElement.parentElement;
    inputField.innerHTML = `<input placeholder="${taskText}" id="edit-todo"></input>`;
    inputField.firstChild.focus();
    inputField.firstChild.select();

    inputField.firstChild.addEventListener("keyup", (event) => {
      if (event.code === "Enter") {
        let updatedTaskText = inputField.firstChild.value;
        updateTask(todoId, null, updatedTaskText);
        document.getElementById("edit-todo").parentElement.remove();
      }
    });
  }

  function deleteTask(event) {
    const getTask =
      event.target.parentElement.parentElement.querySelector(".checkbox");
    const todoId = getTask.getAttribute("id"); //id of todo to be used in fetch call
    fetch(`/todos/${todoId}`, {
      method: "DELETE",
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then(() => getTask.parentElement.parentElement.remove());
  }

  function updateTask(id, complete, task) {
    fetch(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ complete, task }),
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then((data) => displayTodo(data.updatedTodo, complete));
  }

  function getHeaders() {
    return {
      "Content-Type": "application/json; charset=UTF-8",
    };
  }
})(window);
