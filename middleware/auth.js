require('dotenv').load();
const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (decoded) {
                return next();
            } else {
                return res.status(401).json({ error: 'please login!' });
            };
        });
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
};

exports.isAuthorized = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (decoded && decoded._id === req.params.id) {
                return next();
            } else {
                return res.status(401).json({ error: 'Unauthorized!' });
            };
        });
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized!' });
    }
};