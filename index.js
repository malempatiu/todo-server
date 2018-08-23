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
const {createToDo, fetchToDos, getToDo, deleteToDo, updateToDo} = require('./handlers/todo'),
      {registerUser, loginUser} = require('./handlers/user');

//ToDo's Routes
app.post('/api/todos', createToDo);
app.get('/api/todos', fetchToDos);
app.get('/api/todos/:id', getToDo);
app.delete('/api/todos/:id', deleteToDo);
app.put('/api/todos/:id', updateToDo);

//User Routes
app.post('/api/signup', registerUser);
app.post('/api/signin', loginUser);

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`TODO server has started on PORT ${PORT}`);
});      

module.exports = app;