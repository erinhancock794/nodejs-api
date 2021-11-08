const { model, Schema } = require('mongoose');

const Todo = new Schema({
    id: {
        type: Number,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    }

});

module.exports = model("todo", Todo)