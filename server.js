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
const getAllTodos = async () => {
  const allTodos = await Todo.find();
  return allTodos;
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    message:
      "You hit the API! Nice! Read this for more info on how to access the rest of this API. https://github.com/erinhancock794/nodejs-api#readme",
  });
});
app.get("/todos", async (req, res) => {
  await getAllTodos().then((result) => {
    res.status(200).json(result);
  });
});

//POST adds a todo to allTodos
app.post("/todos/add", async (req, res) => {
  const task = req.body;
  let formatTodo;
  //checks for duplicate tasks
  await Todo.findOne({ task: task}).then(async(duplicate) => {
    if (duplicate) {
      res.status(409).json({
        error: true,
        message: "Todo already exists",
      });
    }
    else {
      formatTodo = {
        id: Date.now(),
        task,
        complete: false,
      };
      res.status(200).json({
        message: "success",
        newTodo: formatTodo,
      });
  
    const newTodo = await new Todo(formatTodo);
    newTodo
      .save()
      .then((result) => res.send(result[0]))
      .catch((err) => console.log("err", err));
    }
  })
});

//PUT-- update a todo
app.put("/todos/:todoId", async (req, res) => {
  await Todo.findOneAndUpdate({ id: req.params.todoId }, req.body)
  .then((result) => {
    if (result.complete === null || !req.body.complete) {
      _.set(result, 'complete', false)
    }
    if (req.body.task) {
      result.task = req.body.task
    }
    res.status(200).json({
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
