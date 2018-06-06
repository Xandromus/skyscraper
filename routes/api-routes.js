let request = require("request");
let cheerio = require("cheerio");

// Require all models
var db = require("./../models");

module.exports = function (app) {
    app.get("/api/scrape", function (req, res) {

        // Make a request call to grab the HTML body from the site of your choice
        request("https://news.sky.com/", function (error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);


            // Select each element in the HTML body from which you want information.
            $(".sdc-news-story-grid__card").each(function (i, element) {

                var result = {};

                if (i === 0) {
                    result.link = "https://news.sky.com" + $(element).children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").attr("href");
                    result.title = $(element).children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").text();
                } else {
                    result.link = "https://news.sky.com" + $(element).children("div.sdc-news-story-grid__body").children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").attr("href");
                    result.title = $(element).children("div.sdc-news-story-grid__body").children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").text();
                }
                result.imageLink = $(element).children("a.sdc-news-story-grid__link").children("div.sdc-news-story-grid__media").children("div.sdc-news-story-grid__ratio").children("img.sdc-news-story-grid__media-img").attr("src");
                var summaryTemp = $(element).children("div.sdc-news-story-grid__body").children("p.sdc-news-story-grid__intro").text();

                if (summaryTemp !== "") {
                    result.summary = summaryTemp;
                } else {
                    result.summary = "No summary available";
                }

                result.saved = false;

                console.log(result);
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });


            });

            res.send("Scrape Complete");
        });
    });

    // Route for getting all Articles from the db
    app.get("/api/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticles);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for 
    app.put("/api/save/articles/:id", function (req, res) {
        // 
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for 
    app.put("/api/delete/articles/:id", function (req, res) {
        // 
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};