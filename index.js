const express = require('express');
const todosRoutes = require('./routes/todos')
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.listen(3000, () => {
    console.log('server running on port 3000');
})
app.use("/todos", todosRoutes);

app.get('/', (req, res, next) => {
    res.json( {message: 'todo app nodejs'} )
})