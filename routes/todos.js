const express = require("express");
const router = express.Router();

function findMatchingTodo(array, id) {
  const todo = array.find((i) => i.id === Number(id));
  const index = array.findIndex((i) => i.id === Number(id));
  return { todo, index };
}
function validateCategory(array, category) {
  return Boolean(array.find((i) => i.category === category));
}

const allTodos = [
  { id: 1, task: "go to school", category: "school", complete: false },
  { id: 2, task: "work", category: "work", complete: false },
  { id: 3, task: "go to dentist", category: "health", complete: false },
  { id: 4, task: "do homework", category: "school", complete: false },
  { id: 5, task: "go to gym", category: "health", complete: false },
];

// GET return all todos
router.get("/", (req, res) => {
  res.status(200).json(allTodos);
});

//GET returns all todos within specific category
router.get("/:category", (req, res) => {
  const { category } = req.params;

  const matchingTodos = allTodos.filter((i) => i.category === category);

  matchingTodos[0]
    ? res.status(200).json(matchingTodos)
    : res.status(404).json("No todos with requested category");
});

//POST adds a todo to allTodos
router.post("/add", (req, res) => {
  console.log("req---", req.body);
  const { task, category } = req.body;

  //checks for duplicate task names
  const isDuplicate = Boolean(allTodos.find((i) => i.task === task));

  //checks if category is valid
  //   const isCategoryValid = allTodos.find((i) => i.category === category)
  const isCategoryValid = validateCategory(allTodos, category);
  console.log("isCat valid--->", isCategoryValid);

  if (isDuplicate) {
    res.status(409).json({
      error: 409,
      message: "Todo already exists",
    });
  } else if (!isCategoryValid && category) {
    res.status(409).json({
      error: 409,
      message:
        "Invalid category. To create a new category, use POST /category/add",
    });
  } else {
    const newTodo = {
      id: Date.now(),
      task,
      category: category || "uncategorized",
      complete: false,
    };
    console.log("newTodo---_>", newTodo);
    allTodos.push(newTodo);
    res.status(200).json({
      message: "success",
      newTodo
    });
  }
});

router.put("/:todoId", (req, res) => {
  const { todoId } = req.params;
  console.log("todo id---", todoId);
  const { task, category, complete } = req.body;
  const todoToEdit = allTodos.find((i) => i.id === Number(todoId));
  console.log("todoTo Edit---", todoToEdit);

  const isCategoryValid = validateCategory(allTodos, category);
  console.log("isCategory valid?? ---", isCategoryValid);
  if (!isCategoryValid && category) {
    res.status(409).json({
      error: 409,
      message:
        "Invalid category. To create a new category, use POST /category/add",
    });
  } else {
    const updatedTodo = {
      id: todoToEdit.id,
      task: task || todoToEdit.task,
      category: category || todoToEdit.category,
      complete: complete || todoToEdit.complete,
    };
    console.log("upodated todo---", updatedTodo);

    const todoIndex = allTodos.findIndex((i) => i.id === Number(todoId));
    console.log("todoIndex----", todoIndex);
    allTodos.splice(todoIndex, 1, updatedTodo);
    console.log("allTodos---", allTodos);
    res.status(200).json({ 
        message: "success",
        updatedTodo: updatedTodo,
        previousTodo: todoToEdit
     });
  }
});

router.delete("/:todoId", (req, res) => {
  const { todoId } = req.params;
  console.log("todoId---", todoId);
  const { todo, index } = findMatchingTodo(allTodos, todoId);
  console.log("todo---", todo);
  console.log("index---", index);

  if (!todo) {
    res.status(409).json({
      error: 404,
      message: `No tasks with ID of ${todoId} found`,
    });
  } else {
    allTodos.splice(index, 1);
    res.status(200).json({ message: "task successfully deleted" });
  }
});

module.exports = router;
