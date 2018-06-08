// variable declarations for required packages
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
let request = require("request");
let cheerio = require("cheerio");

// sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// sets up the Express app to serve static files
app.use(express.static(path.join(__dirname, "/public")));

// sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// variable declaration for handlebars
const exphbs = require("express-handlebars");

// handlebars configuration
app.engine('handlebars', exphbs({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/skyScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// import routes and give the server access to them 
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});