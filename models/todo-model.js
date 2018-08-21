const mongoose = require('mongoose');

//ToDos Schema
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//ToDos Model
const ToDo = mongoose.model('ToDo', todoSchema);

module.exports = ToDo;