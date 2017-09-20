var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var path = require('path');

// Link Routes
var accountRoutes = require('./app/routes/account')(router);
var tokenRoutes = require('./app/routes/token')(router);
var conditionRoutes = require('./app/routes/condition')(router);
var userRoutes = require('./app/routes/user')(router);
var allergyRoutes = require('./app/routes/allergy')(router);
var ePrescriptionRoutes = require('./app/routes/eprescription')(router);
var immunizationRoutes = require('./app/routes/immunization')(router);
var labRoutes = require('./app/routes/lab')(router);
var medicationRoutes = require('./app/routes/medication')(router);
var procedureRoutes = require('./app/routes/procedure')(router);
var bpRoutes = require('./app/routes/bp')(router);
var bloodgulucoseRoutes = require('./app/routes/bloodgulucose')(router);
var bmiRoutes = require('./app/routes/bmi')(router);
var activityRoutes = require('./app/routes/activity')(router);
var dashboardRoutes = require('./app/routes/dashboard')(router);
var contactRoutes = require('./app/routes/medicalcontact')(router);
var shareRoutes = require('./app/routes/share')(router);
var auditRoutes = require('./app/routes/audit')(router);
var vitalsRoutes = require('./app/routes/vitals')(router);
// Middleware Sequence
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
//session
var session = require('express-session');
app.use(session({ secret: "Shh, its a secret!" }));
//app.set('sessioncheck', 1);
//console.log(req.session.sessioncheck);
// app.get('/session', function(req, res) {
//     if (req.session.page_views) {
//         req.session.page_views++;
//         // res.send("You visited this page " + req.session.page_views + " times");
//     } else {
//         req.session.page_views = 1;
//         // res.send("Welcome to this page for the first time!");
//     }
//     console.log(req.session.page_views);
// });
//session
// Account Route
app.use('/api/account', accountRoutes);

// Token Middleware Route
app.use('/api/token', tokenRoutes);

// In App Module Routes: Requires Tokens
app.use('/api/user', userRoutes);
app.use('/api/allergy', allergyRoutes);
app.use('/api/problem', conditionRoutes);
app.use('/api/eprescription', ePrescriptionRoutes);
app.use('/api/immunization', immunizationRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/medication', medicationRoutes);
app.use('/api/procedure', procedureRoutes);
app.use('/api/bloodgulucose', bloodgulucoseRoutes);
app.use('/api/bmi', bmiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/bp', bpRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/vitals', vitalsRoutes);
// DB Connector
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/phrms', function(err) {
    if (err) console.log('Database Connection Error: ');
    else console.log('Database phrms Connected Successfully');
});

// 'use strict';


// var session = require('express-session'),

//     mongoStore = require('connect-mongo')(session);
// // mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/someDB');



// var secret = 'shhh';

// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: secret,
//     store: new mongoStore({
//         mongooseConnection: mongoose.connection,
//         collection: 'sessions' // default
//     })
// }));


// Register Router 
// Register Router 

app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/register.html'));
});

app.get('/aadhaarRegistration', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/aadhaarOTP.html'));
});

app.get('/loginOTP', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/loginOTP.html'));
});


// Login Router
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/login.html'));
});
app.get('/forgetPassword', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/forgetPassword.html'));
});
// Login Router
app.get('/share', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/share.html'));
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/home.html'));
});
app.get('/FAQs', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/FAQs.html'));
});

app.get('/contactUs', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/contact.html'));
});
// Application Router
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Port Listener
app.listen(port, function() {
    console.log('Server Started & Running on Port ' + port);
});