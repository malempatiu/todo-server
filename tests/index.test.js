const expect = require('expect'),
    request = require('supertest'),
    { ObjectID } = require('mongodb');

const app = require('../index'),
    ToDoDB = require('../models/todo-model'),
    User = require('../models/user-model');

const userID = "5b7ec61bdfe1d02eb401c7a9";
let todoID;

describe('POST /api/user/:id/todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Testing with mocha';
        request(app)
            .post(`/api/user/${userID}/todos`)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
            })
            .end(done);
    }).timeout(3000);

    it('should not create a new todo with invalid body', (done) => {
        request(app)
            .post(`/api/user/${userID}/todos`)
            .send({})
            .expect(400)
            .end(done);
    });
});

describe('GET /api/user/:id/todos', () => {
    it('should get all todos of a specific user', (done) => {
        request(app)
            .get(`/api/user/${userID}/todos`)
            .expect(200)
            .end(done);
    });
});

describe('DELETE /api/user/:id/todos/:todo_id', () => {
    let textToDelete = "Learn Mocha"
    beforeEach(async () => {
        const userID = "5b7ec61bdfe1d02eb401c7a9";
        const createdTodo = await ToDoDB.create({ text: textToDelete });
        todoID = createdTodo.id;
        const foundUser = await User.findOne({ _id: userID });
        foundUser.todos.push(createdTodo.id);
        await foundUser.save();
    });

    it('should remove a todo', (done) => {
        request(app)
            .delete(`/api/user/${userID}/todos/${todoID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.deletedTodo.text).toBe(textToDelete);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                ToDoDB.findById(todoID).then((todo) => {
                    expect(todo).toBeNull();
                    done();
                })
                    .catch((err) => done(err));
            });
    });

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID();
        request(app)
            .delete(`/api/user/${userID}/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid ID', (done) => {
        request(app)
            .delete(`/api/user/${userID}/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('PUT /api/user/:id/todos/:todo_id', () => {
    it('should update a todo', (done) => {
       request(app)
       .put(`/api/user/${userID}/todos/${todoID}`)
       .send({completed: true})
       .expect(200)
       .expect((res) => {
           expect(res.body.updatedTodo._id).toBe(todoID);
       })
       .end((err, res) => {
           if(err){
               return done(err);
           }
           ToDoDB.findById(todoID).then((todo) => {
               expect(todo.completed).toBeTruthy();
               expect(todo.text).toBe("Learn Mocha");
               done();
           })
           .catch((err) => done(err));
       });
    });

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID();
        request(app)
            .put(`/api/user/${userID}/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for invalid ID', (done) => {
        request(app)
            .put(`/api/user/${userID}/todos/123`)
            .expect(404)
            .end(done);
    });
});