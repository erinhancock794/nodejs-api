const express = require('express');
const router = express.Router();
// const bodyParser = require("body-parser");
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());


// const allCategories = ['school', 'work', 'health']

const allTodos = [
    { id: 1, task: 'go to school', category: 'school', complete: false },
    { id: 2, task: 'work', category: 'work', complete: false },
    { id: 3, task: 'go to dentist', category: 'health', complete: false },
    { id: 4, task: 'do homework', category: 'school', complete: false },
    { id: 5, task: 'go to gym', category: 'health', complete: false },
  ];

function findMatchingTodo(array, identifier) {
    const { id, task } = identifier; //POST request passes task instead of id
    const matchingTodo = array.find((i) => {
        return i.id == id || i.task === task
    })
  const index = array.findIndex((i) => i.id == id);
  return { matchingTodo, index};
}

function validateCategory(array, category) {
  return Boolean(array.find((i) => i.category === category));
}


// GET return all todos
router.get('/', (req, res) => {
  res.status(200).json(allTodos);
});

//GET returns all todos within specific category
router.get('/:category', (req, res) => {
  const { category } = req.params;
  const todosWithCategory = allTodos.filter((i) => i.category === category);
  todosWithCategory[0]
    ? res.status(200).json(todosWithCategory)
    : res.status(404).json('No todos with requested category');
});

//POST adds a todo to allTodos
router.post('/add', (req, res) => {
  const { task, category } = req.body;
  //checks for duplicate tasks
  const { matchingTodo } = findMatchingTodo(allTodos, { task })
  const isDuplicate = Boolean(matchingTodo);

  //checks if category is valid
  const isCategoryValid = validateCategory(allTodos, category);

  if (isDuplicate) {
    res.status(409).json({
      error: true,
      message: 'Todo already exists',
    });
  } else if (!isCategoryValid && category) {
    res.status(409).json({
      error: true,
      message:
        'Invalid category. To create a new category, use POST /category/add',
    });
  } else {
    const newTodo = {
      id: Date.now(),
      task,
      category: category || 'uncategorized',
      complete: false,
    };
    allTodos.push(newTodo);
    res.status(200).json({
      message: 'success',
      newTodo
    });
  }
});

router.put('/:todoId', (req, res) => {
  const { todoId } = req.params;
//   console.log("todo id---", todoId);
  const { task, category, complete } = req.body;
  const { matchingTodo, index } = findMatchingTodo(allTodos, { id: Number(todoId) });

  const isCategoryValid = validateCategory(allTodos, category);
//   console.log("isCategory valid?? ---", isCategoryValid);
  if (!isCategoryValid && category) {
    res.status(409).json({
      error: true,
      message:
        'Invalid category. To create a new category, use POST /category/add',
    });
  } else {
    const updatedTodo = {
      id: matchingTodo.id,
      task: task || matchingTodo.task,
      category: category || matchingTodo.category,
      complete: complete || matchingTodo.complete,
    };

    allTodos.splice(index, 1, updatedTodo);
    res.status(200).json({ 
        message: 'success',
        updatedTodo: updatedTodo,
        previousTodo: matchingTodo
     });
  }
});

router.delete('/:todoId', (req, res) => {
  const { todoId } = req.params;
  const { matchingTodo, index } = findMatchingTodo(allTodos, { id: Number(todoId) });
  if (!matchingTodo) {
    res.status(404).json({
      error: true,
      message: `No tasks with ID of ${todoId} found`,
    });
  } else {
    allTodos.splice(index, 1);
    res.status(200).json({ message: 'success' });
  }
});

module.exports = router;
