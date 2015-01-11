var rs = require('random-strings')
    , crypto = require('crypto')
    , constants = require('../utils/constants');

exports.getClientPair = function() {
    var pair = {
        id: this.getRandomString(constants.CLIENTID_LENGTH),
        secret: this.getRandomString(constants.CLIENTSECRET_LENGTH)
    };
    return pair
};

exports.getExpirationDate = function() {
    var date = new Date();
    return date.setSeconds(date.getSeconds() + constants.TOKEN_TIMETOLIVE);
}

exports.getRandomString = function(length) {
    return rs.alphaNumMixed(length)
};

exports.getHash = function(input) {
    return crypto.createHash('sha1').update(input).digest('hex')
};

exports.parseAccessToken = function(bearer) {
    var split = bearer.split(" ")
    var accessToken = split[1]
    return accessToken
};