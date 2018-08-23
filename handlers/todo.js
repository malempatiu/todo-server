const ToDoDB = require('../models/todo-model'),
      User   = require('../models/user-model'),
    { ObjectID } = require('mongodb');

exports.createToDo = async (req, res) => {
    try {
        const { text } = req.body;
        const createdTodo = await ToDoDB.create({ text });
        const foundUser = await User.findOne({_id: req.params.id});
        foundUser.todos.push(createdTodo.id);
        await foundUser.save();
        return res.status(200).json({ todo: createdTodo });
    } catch (err) {
        return res.status(400).json({error:err.message});
    };
};

exports.fetchToDos = async (req, res) => {
    try {
        const foundUserWithTodos = await User.findOne({_id: req.params.id}).populate('todos');
        return res.status(200).json({todos: foundUserWithTodos.todos});
    } catch (err) {
        return res.status(400).json({error:err.message});
    };
};

exports.deleteToDo = async (req, res) => {
    try {
        const { todo_id } = req.params;
        if (!ObjectID.isValid(todo_id)) {
            return res.status(404).json({error:"Invalid ID"});
        };
        const deletedTodo = await ToDoDB.findByIdAndRemove(todo_id);
        if (deletedTodo) {
            return res.status(200).json({ deletedTodo });
        } else {
            return res.status(404).json({error:"No todo to delete. Invalid ID"});
        };
    } catch (err) {
        return res.status(400).json({error:err.message});
    };
};

exports.updateToDo = async (req, res) => {
     try{
        const { todo_id } = req.params;
        if (!ObjectID.isValid(todo_id)) {
            return res.status(404).json({error:"Invalid ID"});
        };
        const updatedTodo = await ToDoDB.findOneAndUpdate({_id:todo_id}, req.body, {new: true});
        if (updatedTodo) {
            return res.status(200).json({ updatedTodo });
        } else {
            return res.status(404).json({error:"No todo to update. Invalid ID"});
        };
     }catch(err){
        return res.status(400).json({error:err.message});
     };
}; 

/*exports.getToDo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectID.isValid(id)) {
            return res.status(404).json({error:"Invalid ID"});
        }
        const todo = await ToDoDB.findById(id);
        if (todo) {
            return res.status(200).json({ todo });
        } else {
            return res.status(404).json({error:"Found no todo. Invalid ID"});
        }
    } catch (err) {
        return res.status(400).json({error:err.message});
    };
};*/