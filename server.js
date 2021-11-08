const express = require("express");
// const todosRoutes = require('./routes/todos')
// const categoriesRoutes = require('./routes/categories');
const bodyParser = require("body-parser");
const _ = require("lodash");
const port = 5000;
const app = express();

const mongoose = require("mongoose");
const { mongoURI } = require("./config");

// const uri =
//   "mongodb+srv://admin:admin123@cluster0.cqw57.mongodb.net/users?retryWrites=true&w=majority";

  const uri = `${mongoURI}`;
  console.log('uri---', uri);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`you are connected listening on port ${port}`);
    });
  })
  .catch(console.error);

const Todo = require("./models/Todo");
const allTodos = [];
const getAllTodos = async () => {
  const allTodos = await Todo.find();
  // console.log('allTodos', allTodos);
  return allTodos;
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static("public"));

// app.listen(port, () => {
//     console.log(`server running on port ${port}`);
// })

// const allTodos = [
//     { id: 1, task: 'go to school', complete: false },
//     { id: 2, task: 'work', complete: false },
//     { id: 3, task: 'go to dentist', complete: false },
//     { id: 4, task: 'do homework', complete: false },
//     { id: 5, task: 'go to gym', complete: false },
//   ];

// app.use('/todos', todosRoutes);
// app.use('/categories', categoriesRoutes)

app.get("/", (req, res) => {
  res.json({
    message:
      "You hit the API! Nice! Read this for more info on how to access the rest of this API. https://github.com/erinhancock794/nodejs-api#readme",
  });
});
app.get("/todos", async (req, res) => {
  await getAllTodos().then((result) => {
    allTodos.push(result[0]);
    res.status(200).json(result);
  });
});

//POST adds a todo to allTodos
app.post("/todos/add", async (req, res) => {
  const task = req.body;
  console.log("task", task);

  let formatTodo;
  //checks for duplicate tasks
  const { matchingTodo } = findMatchingTodo(allTodos, { task: task });
  const isDuplicate = Boolean(matchingTodo);
  console.log("isDuplicate", isDuplicate);
  if (isDuplicate) {
    res.status(409).json({
      error: true,
      message: "Todo already exists",
    });
  } else {
    formatTodo = {
      id: Date.now(),
      task,
      complete: false,
    };
    allTodos.push(formatTodo);
    res.status(200).json({
      message: "success",
      newTodo: formatTodo,
    });
  }

  const newTodo = await new Todo(formatTodo);
  newTodo
    .save()
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => console.log("err", err));
});

//PUT-- update a todo
app.put("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  // const { matchingTodo, index } = findMatchingTodo(allTodos, {
  //   id: Number(todoId),
  // });
  const complete = _.get(req, "body.complete");
  console.log('complete?', complete);
  const task = _.get(req, "body.task");
  console.log("req body", req.body);

    const updatedTodo = {
      id: todoId,
      task: task,
    };
    // _.set(updatedTodo, 'complete', complete); //Boolean wouldn't update if I set it in the object above so I moved it here.

  //   allTodos.splice(index, 1, updatedTodo);
  //   res.status(200).json({
  //       message: 'success',
  //       updatedTodo,
  //       previousTodo: matchingTodo
  //    });

  await Todo.findOneAndUpdate({ id: req.params.todoId }, req.body)
  .then((result) => {
    if (result.complete === null || !req.body.complete) {
      _.set(result, 'complete', false)

    }
    if (req.body.task) {
      result.task = req.body.task
    }
    console.log('result', result);
    res.status(200).send({
      message: 'success',
      updatedTodo: result
    });
  });
});

//DELETE
app.delete("/todos/:todoId", async (req, res) => {
  await Todo.findOneAndDelete({id: req.params.todoId})
  .then((todo) => {
    res.send(todo)
  })
  // const { todoId } = req.params;
  // const { matchingTodo, index } = findMatchingTodo(allTodos, {
  //   id: Number(todoId),
  // });
  // if (!matchingTodo) {
  //   res.status(404).json({
  //     error: true,
  //     message: `No tasks with ID of ${todoId} found`,
  //   });
  // } else {
  //   allTodos.splice(index, 1);
  //   res.status(200).json({ message: "success" });
  // }
});

//helper function
function findMatchingTodo(array, identifier) {
  console.log("identifier--->", identifier);
  const { id, task } = identifier; //POST request passes task instead of id
  const matchingTodo = array.find((i) => {
    return i.id == id || i.task === task;
  });
  const index = array.findIndex((i) => i.id == id);
  return { matchingTodo, index };
}

module.exports = app;
