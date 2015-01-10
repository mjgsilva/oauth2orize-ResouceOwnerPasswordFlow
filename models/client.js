var mongoose = require('mongoose')
    , autoIncrement = require('mongoose-auto-increment');

var clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

clientSchema.index({ name: 1 });

autoIncrement.initialize(mongoose.connection);

clientSchema.plugin(autoIncrement.plugin, { model: 'Client', field: 'id', startAt: 1, incrementBy: 1 });

module.exports = mongoose.model('Client', clientSchema);