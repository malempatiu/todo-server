let env = process.env.NODE_ENV || 'development';
console.log(env);
if(env === 'development'){
    process.env.PORT = 8081;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todo_api';
} else if(env === 'test'){
    process.env.PORT = 8081;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todo_test_api';
}
//Importing External Libraries and Modules
require('dotenv').config();
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors');

//Mongoose and App Config
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(cors());

//Importing Internal Files and Modules
const {createToDo, fetchToDos, deleteToDo, updateToDo} = require('./handlers/todo'),
      {registerUser, loginUser} = require('./handlers/user'),
      {isLoggedIn, isAuthorized} = require('./middleware/auth');

//User Routes
app.post('/api/user/signup', registerUser);
app.post('/api/user/signin', loginUser);

//ToDo's Routes
app.post('/api/user/:id/todos', isLoggedIn, isAuthorized, createToDo);
app.get('/api/user/:id/todos', isLoggedIn, isAuthorized, fetchToDos);
app.delete('/api/user/:id/todos/:todo_id', isLoggedIn, isAuthorized, deleteToDo);
app.put('/api/user/:id/todos/:todo_id', isLoggedIn, isAuthorized, updateToDo);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`TODO server has started on PORT ${port}`);
});      

module.exports = app;