var Client = require('../models/client')
    , utils = require('../utils/utils')

exports.createClient = function(req, res) {
    var pair = utils.getClientPair()

    var client = new Client({
        name: req.body.name,
        clientId: pair.id,
        clientSecret: pair.secret
    });

    client.save(function (err) {
        if (err) { res.send(err) }
        else { res.json(pair) }
    });
};