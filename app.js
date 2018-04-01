var express = require('express');
var parser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://charles:charles123@ds231199.mlab.com:31199/bestdatabasev2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
 console.log("connected to mongo");
});

var bookSchema = new mongoose.Schema({
 id: Number,
 first_name: String
 
});

// “compile” the schema into a model
var User = mongoose.model('users',bookSchema);

// create an express app

var app = express();
// tell node to use json and HTTP header features in body-parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.get("/", function(req, res) {
 res.send("Heroku Demo!");
});

// handle GET requests for [domain]/api/books e.g. return all books
app.route('/api/users')
 .get(function (req,resp) {
 // use mongoose to retrieve all books from Mongo
 User.find({}, function(err, data) {
 if (err) {
 resp.json({ message: 'Unable to connect to books' });
 } else {
 // return JSON retrieved by Mongo as response
 resp.json(data);
 }
 });
 });
 
 // Use express to listen to port
let port = 8080;
app.listen(process.env.PORT || 5000, function () {
 console.log("Server running at port= " + port);
});