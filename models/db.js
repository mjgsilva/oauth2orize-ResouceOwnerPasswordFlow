var mongoose = require('mongoose')
    , address = "localhost"
    , port = "27017"
    , db = "auth";

mongoose.connect('mongodb://' + address + ':' + port + '/' + db);

mongoose.connection.on('connected', function () {
    console.log('Connection established')
});

mongoose.connection.on('error',function (err) {
    console.log('Connection err: ' + err)
});

mongoose.connection.on('disconnected', function () {
    console.log('Disconnected')
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Database disconnected due to app termination')
        process.exit(0)
    });
});