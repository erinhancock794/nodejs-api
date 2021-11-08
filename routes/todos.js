const express = require('express');
const router = express.Router();
const _ = require("lodash");


const Todo = require("../models/Todo");
const getAllTodos = async () => {
  const allTodos = await Todo.find();
  return allTodos;
};

router.get("/", async (req, res) => {
  await getAllTodos().then((result) => {
    res.status(200).json(result);
  });
});

//POST adds a todo to allTodos
router.post("/add", async (req, res) => {
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
router.put("/:todoId", async (req, res) => {
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
router.delete("/:todoId", async (req, res) => {
  await Todo.findOneAndDelete({id: req.params.todoId})
  .then((todo) => {
    res.send(todo)
  })
});

module.exports = router;