var express = require('express');
var parser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://charles:charles123@ds231199.mlab.com:31199/bestdatabasev2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
 console.log("connected to mongo");
});

var userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    salt: String,
    password: String
});

var companySchema = new mongoose.Schema({
    symbol: String,
    name: String,
    sector: String,
    subindustry: String,
    address: String,
    date_added: Date,
    CIK: Number,
    frequency: Number
 
});

var priceSchema = new mongoose.Schema({
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    name: String
 
});

var portfolioSchema = new mongoose.Schema({
    id: Number,
    symbol: String,
    user: Number,
    owned: Number
 
});

// “compile” the schema into a model
var User = mongoose.model('users',userSchema);
var Companies = mongoose.model('companies', companySchema);
var Prices = mongoose.model('prices', priceSchema);
var Portfolio = mongoose.model('portfolio', portfolioSchema);

// create an express app

var app = express();
// tell node to use json and HTTP header features in body-parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.get("/", function(req, res) {
 res.send("Heroku Demo!");
});

// handle GET requests for [domain]/api/users e.g. return all users
app.route('/api/users')
 .get(function (req,resp) {
 // use mongoose to retrieve all books from Mongo
 User.find({}, function(err, data) {
 if (err) {
 resp.json({ message: 'Unable to connect to users' });
 } else {
 // return JSON retrieved by Mongo as response
 resp.json(data);
 }
 });
 });

// handle GET requests for [domain]/api/company e.g. return all company
app.route('/api/company')
 .get(function (req,resp) {
 // use mongoose to retrieve all books from Mongo
 Companies.find({}, function(err, data) {
 if (err) {
 resp.json({ message: 'Unable to connect to company' });
 } else {
 // return JSON retrieved by Mongo as response
 resp.json(data);
 }
 });
 });

// handle requests for specific company
app.route('/api/company/:symbol')
 .get(function (req,resp) {
 Companies.find({symbol: req.params.symbol}, function(err, data) {
 if (err) {
 resp.json({ message: 'Company not found' });
 } else {
 resp.json(data);
 }
 });
 });
 
 // Use express to listen to port
let port = 8080;
app.listen(process.env.PORT || 5000, function () {
 console.log("Server running at port= " + port);
});