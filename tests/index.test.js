const expect = require('expect'),
    request = require('supertest'),
    { ObjectID } = require('mongodb');

const app = require('../index'),
    ToDoDB = require('../models/todo-model'),
    User = require('../models/user-model');

let userID;
let token;
let todoID;

/********** USER TEST ***************/
describe('POST /api/user/signup', function () {
    this.timeout(3000);
    before((done) => {
        User.remove({}).then(() => {
            done();
        });
    });

    it('should create a user', (done) => {
        const email = "abc@gmail.com";
        const username = "abc";
        const password = "abc123"
        request(app)
            .post('/api/user/signup')
            .send({ email, username, password })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(email);
                userID = res.body._id;
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                };
                User.findOne({ email }).then((user) => {
                    expect(user.email).toBe(email);
                    expect(user._id.toHexString()).toBe(userID);
                    done();
                })
                    .catch((err) => done(err));
            });
    });

    it('should not create user for invalid input', (done) => {
        request(app)
            .post('/api/user/signup')
            .send({ email: "ugesh", username: "ugesh", password: "4455" })
            .expect(400)
            .end(done);
    });
});

describe('POST /api/user/signin', () => {
    it('should login the user', (done) => {
        request(app)
            .post('/api/user/signin')
            .send({ email: "abc@gmail.com", password: "abc123" })
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(userID);
                expect(res.body.token).toBeTruthy();
                token = res.body.token;
            })
            .end(done);
    });
    it('should not login the user for wrong data', (done) => {
        request(app)
            .post('/api/user/signin')
            .send({ email: "abc@gmail.com", password: "abc12" })
            .expect(400)
            .end(done);
    });
});

/************* ToDos Test *****************/
describe('POST /api/user/:id/todos', () => {
    before((done) => {
        ToDoDB.remove({}).then(() => {
            done();
        });
    });
    it('should create a todo', (done) => {
        const data = {
            text: "Create ToDo",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };
        request(app)
            .post(`/api/user/${userID}/todos`)
            .send(data)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(data.text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                };
                ToDoDB.find({}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(data.text);
                    done();
                })
                    .catch((err) => done(err));
            });
    });
    it('should not create a todo without token', (done) => {
        const data = {
            text: "Create ToDo"
        };
        request(app)
            .post(`/api/user/${userID}/todos`)
            .send(data)
            .expect(401)
            .end(done);
    });
    it('should not create a todo with empty data', (done) => {
        const data = {
            text: "",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };
        request(app)
            .post(`/api/user/${userID}/todos`)
            .send(data)
            .expect(400)
            .end(done);
    });
});

describe('GET /api/user/:id/todos', () => {
     it('should get all todos', (done) => {
        request(app)
        .get(`/api/user/${userID}/todos`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
            expect(res.body.todos[0].text).toBe('Create ToDo');
        })
        .end(done);
     });
});




