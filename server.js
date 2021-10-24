const express = require('express');
// const todosRoutes = require('./routes/todos')
// const categoriesRoutes = require('./routes/categories');
const bodyParser = require('body-parser');
const _ = require('lodash');

const port = 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.text());

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})


const allTodos = [
    { id: 1, task: 'go to school', complete: false },
    { id: 2, task: 'work', complete: false },
    { id: 3, task: 'go to dentist', complete: false },
    { id: 4, task: 'do homework', complete: false },
    { id: 5, task: 'go to gym', complete: false },
  ];


// app.use('/todos', todosRoutes);
// app.use('/categories', categoriesRoutes)

app.get('/', (req, res) => {
    res.json( {
        message: 'You hit the API! Nice! Read this for more info on how to access the rest of this API. https://github.com/erinhancock794/nodejs-api#readme'
    } )
})
app.get('/todos', (req, res) => {
    res.status(200).json(allTodos);
  });

//POST adds a todo to allTodos
app.post('/todos/add', (req, res) => {
  const { task } = req.body;
  //checks for duplicate tasks
  const { matchingTodo } = findMatchingTodo(allTodos, { task })
  const isDuplicate = Boolean(matchingTodo);
  if (isDuplicate) {
    res.status(409).json({
      error: true,
      message: 'Todo already exists',
    });
  } else {
    const newTodo = {
      id: Date.now(),
      task,
      complete: false,
    };
    allTodos.push(newTodo);
    res.status(200).json({
      message: 'success',
      newTodo
    });
  }
});

//PUT-- update a todo
app.put('/todos/:todoId', (req, res) => {
  const { todoId } = req.params;
  const { matchingTodo, index } = findMatchingTodo(allTodos, { id: Number(todoId) });
  const complete = _.get(req, 'body.complete')
  const task = _.get(req, 'body.task');

    const updatedTodo = {
      id: matchingTodo.id,
      task: task || matchingTodo.task,
    };
    _.set(updatedTodo, 'complete', complete);

    allTodos.splice(index, 1, updatedTodo);
    res.status(200).json({ 
        message: 'success',
        updatedTodo: updatedTodo,
        previousTodo: matchingTodo
     });
});

//DELETE
app.delete('/todos/:todoId', (req, res) => {
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

//helper function
function findMatchingTodo(array, identifier) {
  const { id, task } = identifier; //POST request passes task instead of id
  const matchingTodo = array.find((i) => {
      return i.id == id || i.task === task
  })
const index = array.findIndex((i) => i.id == id);
return { matchingTodo, index};
}

module.exports = app

