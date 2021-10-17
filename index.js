const express = require('express');
const todosRoutes = require('./routes/todos')
const categoriesRoutes = require('./routes/categories');



const allCategories = ['school', 'work', 'health']
const allTodos = [
    { id: 1, task: 'go to school', category: 'school', complete: false },
    { id: 2, task: 'work', category: 'work', complete: false },
    { id: 3, task: 'go to dentist', category: 'health', complete: false },
    { id: 4, task: 'do homework', category: 'school', complete: false },
    { id: 5, task: 'go to gym', category: 'health', complete: false },
  ];


const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('allCat', allCategories)

app.listen(3000, () => {
    console.log('server running on port 3000');
})
app.use('/todos', todosRoutes);
app.use('/categories', categoriesRoutes)

app.get('/', (req, res, next) => {
    res.json( {
        message: 'todo app nodejs'
    } )
})

module.exports = app