var User = require('../models/user');

exports.createUser = function(req, res) {
    var user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err){
        if(err) { res.send(err.message) }
        else { res.json({ user_registration: "success" }) }
    });
};

exports.getProfile = function(req, res) {
    res.json({ er: "123" })
}