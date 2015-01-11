var passport = require('passport')
    , BasicStrategy = require('passport-http').BasicStrategy
    , BearerStrategy = require('passport-http-bearer').Strategy
    , utils = require('../utils/utils')
    , Client = require('../models/client')
    , User = require('../models/user')
    , Token = require('../models/token');

passport.use('client-basic', new BasicStrategy(
    function(clientId, clientSecret, callback) {
        Client.findOne({ clientId: clientId }, function (err, clientDoc) {
            if (err) { return callback(err) }
            if (!clientDoc) { return callback(null, false) }
            if (clientDoc.clientSecret == clientSecret) { return callback(null, clientDoc) }
            else { return callback(null, false) }
        });
    }
));

passport.use('bearer', new BearerStrategy(
    function (accessToken, callback) {
        var accessTokenHash = utils.getHash(accessToken)
        Token.findOne({ accessToken: accessTokenHash }, function (err, tokenDoc) {
            if (err) { return callback(err) }
            if (!tokenDoc) { return callback(null, false) }
            if (new Date() > tokenDoc.expirationDate) {
                Token.remove({ accessToken: accessTokenHash }, function (err) { callback(err) })
            } else {
                User.findOne({ userId: tokenDoc.userId }, function (err, userDoc) {
                    if (err) { return callback(err) }
                    if (!userDoc) { return callback(null, false) }
                    callback(null, userDoc);
                })
            }
        })
    }
));

exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });