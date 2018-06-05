// Require all models
var db = require("./../models");

// function to render html through handlebars
module.exports = function (app) {

    // default catch-all route to index, rendered through handlebars, and getting all Articles from the db
    app.get("/*", (req, res) => {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.render("index", { articles: dbArticle });
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

};