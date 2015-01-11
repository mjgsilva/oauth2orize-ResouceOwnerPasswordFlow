var oauth2orize = require('oauth2orize')
    , constants = require('../utils/constants')
    , utils = require('../utils/utils')
    , User = require('../models/user')
    , Token = require('../models/token');

var server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(function (client, username, password, callback) {
    User.findOne({ username: username }, function (err, userDoc) {
        if (err) { return callback(err) }
        if (!userDoc) { return callback(null, false) }
        userDoc.verifyPassword(password, function (err, isValid) {
            if (!isValid) { return callback(null, false) }

            var accessToken = utils.getRandomString(constants.TOKEN_LENGTH);
            var refreshToken = utils.getRandomString(constants.TOKEN_LENGTH);

            var token = new Token({
                accessToken: utils.getHash(accessToken),
                refreshToken: utils.getHash(refreshToken),
                expirationDate: utils.getExpirationDate(),
                userId: userDoc.userId,
                clientId: client.clientId
            });

            console.log

            token.save(function (err) {
                if (err) { return callback(err) }
                callback(null, accessToken, refreshToken)
            })
        })
    })
}));

server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, callback) {
    var refreshTokenHash = utils.getHash(refreshToken);

    Token.findOne({ refreshToken: refreshTokenHash }, function (err, tokenDoc) {
        if (err) { return callback(err) }
        if (!tokenDoc) { return callback(null, false) }
        if (client.clientId !== tokenDoc.clientId) { return callback(null, false) }

        var accessToken = utils.getRandomString(constants.TOKEN_LENGTH)
        var accessTokenHash = utils.getHash(accessToken)
        var expirationDate = utils.getExpirationDate()

        Token.update({ refreshToken: tokenDoc.refreshToken }, {$set: { accessToken: accessTokenHash, expirationDate: expirationDate }}, function (err) {
            if (err) { return callback(err) }
            callback(null, accessToken, refreshToken)
        })
    })
}));

exports.logout = function(req, res) {
    var accessToken = utils.parseAccessToken(req.headers.authorization)
    var accessTokenHash = utils.getHash(accessToken)
    Token.findOne({ accessToken: accessTokenHash }, function (err, tokenDoc) {
        if (err) { return callback(err) }
        if (!tokenDoc) { return callback(null, false) }
        Token.remove({ accessToken: accessTokenHash }, function (err) {
            if(err) { res.send(err) }
            else { res.send({ logout: "success" })}
        })
    })
};

exports.token = [
    server.token(),
    server.errorHandler()
];
