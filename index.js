const express = require('express');
const todosRoutes = require('./routes/todos')
const categoriesRoutes = require('./routes/categories');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('server running on port 3000');
})
app.use('/todos', todosRoutes);
app.use('/categories', categoriesRoutes)

app.get('/', (req, res, next) => {
    res.json( {
        message: 'You hit the API! Nice! Read this for more info on how to access the rest of this API. https://github.com/erinhancock794/nodejs-api#readme'
    } )
})

module.exports = app