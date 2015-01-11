var User = require('../models/user')
    , Token = require('../models/token')
    , utils = require('../utils/utils');

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
    var accessToken = utils.parseAccessToken(req.headers.authorization)
    var accessTokenHash = utils.getHash(accessToken)
    Token.findOne({ accessToken: accessTokenHash }, function(err, tokenDoc) {
        if(err) { res.send(err) }
        else {
            User.findOne({ userId: tokenDoc.userId }).select({ _id: 0, name: 1, created: 1 }).exec(function (err, posts) {
                if (err) { res.send(err) }
                else { res.send(posts) }
            });
        }
    });
}