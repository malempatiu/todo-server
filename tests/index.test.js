const expect = require('expect'),
    request = require('supertest'),
    { ObjectID } = require('mongodb');

const app = require('../index'),
    ToDoDB = require('../models/todo-model');

const seedToDos = [
    {
        _id: new ObjectID(),
        text: "Telugu"
    },
    {
        _id: new ObjectID(),
        text: "German"
    }]
beforeEach((done) => {
    ToDoDB.remove({})
        .then(() => {
            return ToDoDB.insertMany(seedToDos);
        })
        .then(() => {
            done();
        });
});

describe('POST /api/todos', () => {
    it('should create a new todo', (done) => {
        const text = 'English';
        request(app)
            .post('/api/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                ToDoDB.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                    .catch((err) => done(err));
            });
    });

    it('should not create a new todo with invalid body', (done) => {
        request(app)
            .post('/api/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                ToDoDB.find({}).then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                })
                    .catch((err) => done(err));
            });
    });
});

describe('GET /api/todos', () => {
    it('should get all todos from the the DB', (done) => {
        request(app)
            .get('/api/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /api/todos/:id', () => {
    it('should return a ToDo', (done) => {
        const { _id, text } = seedToDos[0];
        request(app)
            .get(`/api/todos/${_id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
            })
            .end(done);
    });
    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID();
        request(app)
            .get(`/api/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 for invalid ID', (done) => {
       request(app)
       .get('/api/todos/123')
       .expect(404)
       .end(done);
    });
});

describe('DELETE /api/todos/:id', () => {
     it('should remove a todo', (done) => {
        const { _id, text } = seedToDos[0];
        request(app)
        .delete(`/api/todos/${_id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.deletedTodo.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            ToDoDB.findById(_id).then((todo) => {
                expect(todo).toBeNull();
                done();
            })
            .catch((err) => done(err));
        });
     });

     it('should return 404 if todo not found', (done) => {
        const id = new ObjectID();
        request(app)
            .delete(`/api/todos/${id}`)
            .expect(404)
            .end(done);
     });

     it('should return 404 for invalid ID', (done) => {
        request(app)
        .delete('/api/todos/123')
        .expect(404)
        .end(done);
     });
});

describe('PUT /api/todos/:id', () => {
    it('should update a todo', (done) => {
       const { _id} = seedToDos[1];
       request(app)
       .put(`/api/todos/${_id}`)
       .send({text: "Learn German", completed: true})
       .expect(200)
       .expect((res) => {
           expect(res.body.updatedTodo._id).toBe(_id.toHexString());
       })
       .end((err, res) => {
           if(err){
               return done(err);
           }
           ToDoDB.findById(_id).then((todo) => {
               expect(todo.completed).toBeTruthy();
               expect(todo.text).toBe("Learn German");
               done();
           })
           .catch((err) => done(err));
       });
    });

    it('should return 404 if todo not found', (done) => {
       const id = new ObjectID();
       request(app)
           .put(`/api/todos/${id}`)
           .send({text: "Learn German", completed: true})
           .expect(404)
           .end(done);
    });

    it('should return 404 for invalid ID', (done) => {
       request(app)
       .put('/api/todos/123')
       .send({text: "Learn German", completed: true})
       .expect(404)
       .end(done);
    });
});