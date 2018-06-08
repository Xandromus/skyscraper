// Require all models
var db = require("./../models");

// function to render html through handlebars
module.exports = function (app) {

    // route to render home page
    app.get("/", (req, res) => {
        res.render("index");
    });

    // route to render saved page
    app.get("/saved", (req, res) => {
        res.render("saved");
    });

};