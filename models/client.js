var mongoose = require('mongoose');

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

module.exports = mongoose.model('Client', clientSchema);