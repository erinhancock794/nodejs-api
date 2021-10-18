const express = require('express');
const todosRoutes = require('./routes/todos')
const categoriesRoutes = require('./routes/categories');
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