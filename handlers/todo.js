const ToDoDB = require('../models/todo-model'),
    { ObjectID } = require('mongodb');

exports.createToDo = async (req, res) => {
    try {
        const { text } = req.body;
        const todo = await ToDoDB.create({ text });
        return res.status(200).json({ todo });
    } catch (err) {
        return res.status(400).json(err);
    };
};

exports.fetchToDos = async (req, res) => {
    try {
        const todos = await ToDoDB.find({});
        return res.status(200).json({ todos });
    } catch (err) {
        return res.status(400).json(err);
    };
};

exports.getToDo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectID.isValid(id)) {
            return res.status(404).json();
        }
        const todo = await ToDoDB.findById(id);
        if (todo) {
            return res.status(200).json({ todo });
        } else {
            return res.status(404).json();
        }
    } catch (err) {
        return res.status(400).json(err);
    };
};

exports.deleteToDo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectID.isValid(id)) {
            return res.status(404).json();
        };
        const deletedTodo = await ToDoDB.findByIdAndRemove(id);
        if (deletedTodo) {
            return res.status(200).json({ deletedTodo });
        } else {
            return res.status(404).json();
        };
    } catch (err) {
        return res.status(400).json(err);
    };
};

exports.updateToDo = async (req, res) => {
     try{
        const { id } = req.params;
        if (!ObjectID.isValid(id)) {
            return res.status(404).json();
        };
        const updatedTodo = await ToDoDB.findOneAndUpdate({_id:id}, req.body, {new: true});
        if (updatedTodo) {
            return res.status(200).json({ updatedTodo });
        } else {
            return res.status(404).json();
        };
     }catch(err){
        return res.status(400).json(err);
     };
}; 