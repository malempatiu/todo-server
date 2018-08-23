const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

const User = require('../models/user-model');

exports.registerUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            ...rest,
            password: hashedPassword
        };
        const user = await User.create(userData);
        const { _id, email, username } = user;
        const token = jwt.sign({ _id, email, username }, process.env.SECRET_KEY);
        return res.status(200).json({
            _id,
            email,
            username,
            token
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "Sorry! that username and/or email is already taken" });
        }
        res.status(400).json({ error: err.message });
    };
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const { password, _id, username, email} = user;
        const isMatch = await bcrypt.compare(req.body.password, password);
        if (isMatch) {
            const token = jwt.sign({_id, username, email}, process.env.SECRET_KEY);
            return res.status(200).json({
                _id,
                username,
                email,
                token
            });
        } else {
            return res.status(400).json({ error: "Invalid Email/Password" });
        };
    } catch (err) {
        return res.status(400).json({ error: err.message});      
    }
};