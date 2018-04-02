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
    date: String,
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
var Portfolio = mongoose.model('portfolios', portfolioSchema);

// create an express app

var app = express();
// tell node to use json and HTTP header features in body-parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.get("/", function(req, res) {
 res.send("ITS ALIVE");
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

//Gets price information on symbol and exact date inputted
app.route('/api/price/:symbol/:date')
 .get(function (req,resp) {
Prices.aggregate([
        {
            $match: {
                name: req.params.symbol,
                date: req.params.date
            }
        }
    ], function (err, data) {
        if (err) {
            console.log(err);
            resp.json({ message: 'Symbol and date not found' });
        } else {
            resp.json(data);
        }
    });
 });

//Gets price information on symbol and newest date 2017-12-29
app.route('/api/pricelast/:symbol')
 .get(function (req,resp) {
Prices.aggregate([
        {
            $match: {
                name: req.params.symbol,
                date: "2017-12-29"
            }
        }
    ], function (err, data) {
        if (err) {
            console.log(err);
            resp.json({ message: 'Symbol and date not found' });
        } else {
            resp.json(data);
        }
    });
 });

//Gets price information on symbol and month inputted
app.route('/api/price/month/:symbol/:month')
 .get(function (req,resp) {
Prices.aggregate([
        {
            $match: {
                name: req.params.symbol,  
                date: { "$regex": "-"+req.params.month+"-"}
            }
        }
    ], function (err, data) {
        if (err) {
            console.log(err);
            resp.json({ message: 'Symbol and date not found' });
        } else {
            
            resp.json(data);
        }
    });
 });

// handle requests for specific company prices
app.route('/api/price/:symbol')
 .get(function (req,resp) {
 Prices.find({name: req.params.symbol}, function(err, data) {
 if (err) {
 resp.json({ message: 'Prices not found' });
 } else {
    var priceArray = data;
    var tempArr = [];
     var average = 0;
     for (let x = 0; x < data.length; x++) {
         //Get Date string and split it into parts. Ex. 2017-01-01 = 2017,01,01
         let thisMonth = data[x].date.split("-");
         
         //If tempArr[1] is null, which means new month, set counter to 1, and insert new value
         if (tempArr[parseInt(thisMonth[1])] == null) {
             var countDays = 1;
             tempArr[parseInt(thisMonth[1])] = data[x].close;
         }
         
         //if tempArr isn't empty, take previous value and add together, and place back in.
         else {
         var tempNum = tempArr[parseInt(thisMonth[1])] + data[x].close;
         tempArr[parseInt(thisMonth[1])] = tempNum;
         countDays++;
            
         //If the next day is a new month, tally up current months closing value and average it and place it back into array     
         if (x+1 != data.length) {
             let nextMonth = data[x+1].date.split("-"); 
             if (parseInt(thisMonth[1]) != parseInt(nextMonth[1])) {
                 var tempNum = tempArr[parseInt(thisMonth[1])]/countDays;
                 tempArr[parseInt(thisMonth[1])] = tempNum;
             }
         }
         
         }
         
         
     }

     console.log(tempArr);
     resp.json(tempArr);
     
 }
 });
 });

// handle requests for specific portfolio
app.route('/api/portfolio/:userid')
 .get(function (req,resp) {
 Portfolio.find({user: req.params.userid}, function(err, data) {
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