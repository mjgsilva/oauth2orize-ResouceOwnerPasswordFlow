var express = require('express')
    , http = require('http')
    , bodyParser = require('body-parser')
    , passport = require('passport')
    , dbModel = require('./models/db')
    , userController = require('./routes/user')
    , clientController = require('./routes/client')
    , authController = require('./routes/auth')
    , oauth2Controller = require('./routes/oauth2');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

var router = express.Router();

router.route('/user')
    .post(userController.createUser);

router.route('/client')
    .post(clientController.createClient);

router.route('/profile')
    .get(authController.isBearerAuthenticated,userController.getProfile);

router.route('/token')
    .post(authController.isClientAuthenticated,oauth2Controller.token);

router.route('/logout')
    .post(authController.isBearerAuthenticated,oauth2Controller.logout);

app.use('/api', router);
http.createServer(app).listen(3545);