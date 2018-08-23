//Importing External Libraries and Modules
require('dotenv').config();
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors');

//Mongoose and App Config
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/todo-api', { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(cors());

//Importing Internal Files and Modules
const {createToDo, fetchToDos, deleteToDo, updateToDo} = require('./handlers/todo'),
      {registerUser, loginUser} = require('./handlers/user');

//User Routes
app.post('/api/user/signup', registerUser);
app.post('/api/user/signin', loginUser);

//ToDo's Routes
app.post('/api/user/:id/todos', createToDo);
app.get('/api/user/:id/todos', fetchToDos);
app.delete('/api/user/:id/todos/:todo_id', deleteToDo);
app.put('/api/user/:id/todos/:todo_id', updateToDo);


const PORT = 8081;
app.listen(PORT, () => {
    console.log(`TODO server has started on PORT ${PORT}`);
});      

module.exports = app;