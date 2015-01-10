var mongoose = require('mongoose')
    , bcrypt = require('bcrypt-nodejs')
    , autoIncrement = require('mongoose-auto-increment');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
     type: String,
     unique: true,
     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email!']
     },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

userSchema.index({ username: 1 });

userSchema.index({ email: 1 });

autoIncrement.initialize(mongoose.connection);

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'id', startAt: 1, incrementBy: 1 });

userSchema.pre('save', function(callback) {
    var user = this;

    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return callback(err) }
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return callback(err) }
            user.password = hash
            callback()
        });
    });
});

userSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isValid) {
        if(err) { return callback(err) }
        callback(null, isValid);
    });
};

module.exports = mongoose.model('User', userSchema);