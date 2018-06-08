// variable declarations for required packages
let request = require("request");
let cheerio = require("cheerio");

// Require all models
var db = require("./../models");

// function for all api routes
module.exports = function (app) {

    // Route to scrape new articles
    app.get("/api/scrape", function (req, res) {

        // Make a request call to grab the HTML body from the site
        request("https://news.sky.com/", function (error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            var $ = cheerio.load(html);

            // initialize array to hold article results
            var results = [];

            // Select each element in the HTML body from which you want information.
            $(".sdc-news-story-grid__card").each(function (i, element) {

                // variables to hold the article link, title, and summary
                var link;
                var title;
                var summary;

                // the first article on Sky news has a a slightly different format than the others. Use cheerio to grab the links and titles, depending on whether they're from first article or subsequent ones
                if (i === 0) {
                    link = "https://news.sky.com" + $(element).children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").attr("href");
                    title = $(element).children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").text();
                } else {
                    link = "https://news.sky.com" + $(element).children("div.sdc-news-story-grid__body").children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").attr("href");
                    title = $(element).children("div.sdc-news-story-grid__body").children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").text();
                }

                // use cheerio to grab the image link
                var imageLink = $(element).children("a.sdc-news-story-grid__link").children("div.sdc-news-story-grid__media").children("div.sdc-news-story-grid__ratio").children("img.sdc-news-story-grid__media-img").attr("src");

                // not all news stories on sky news have a summary. use cheerio to load the summary into a temporary variable
                var summaryTemp = $(element).children("div.sdc-news-story-grid__body").children("p.sdc-news-story-grid__intro").text();

                // if the temporary variable has content, assign it to the summary variable
                if (summaryTemp !== "") {
                    summary = summaryTemp;
                } else { // else give the summary variable a default value
                    summary = "No summary available";
                }

                // every scraped article should start with the saved flag set to false
                var saved = false;

                // object to hold new article
                var newArticle = {
                    link: link,
                    title: title,
                    imageLink: imageLink,
                    summary: summary,
                    saved: saved
                }

                // only use the first 10 articles from sky news and place each one in an array. use unshift so that any new articles scraped on a subsequent day are placed at the beginning of the array and thus at the beginning of the database (due to the unique constraint for article links)
                if (i < 10) {
                    results.unshift(newArticle);
                } else {
                    return;
                };

            });

            // variables for the number of articles inserted into db, the number of articles rejected due to the unique constraint, and the total number of articles 
            let counter = 0;
            let errCount = 0;
            let total = 0;

            // Create a new Article in the db using the `results` array built from scraping
            results.forEach(function (article) {
                db.Article.create(article)
                    .then(function (article) {

                        // increase the counter for every article added to the db
                        counter++;

                        // total equals the number of articles added and rejected
                        total = counter + errCount;

                        // when the total equals the number of results, send a json with the number of articles added to the client
                        if (total === results.length) {
                            res.json(counter);
                        }

                    })
                    .catch(function (err) {

                        // if an article is rejected due to the unique constraint, increase the error count
                        if (err.code === 11000) {
                            errCount++;
                        }

                        // total equals the number of articles added and rejected
                        total = counter + errCount;

                        // when the total equals the number of results, send a json with the number of articles added to the client
                        if (total === results.length) {
                            res.json(counter);
                        }

                    });
            });
        });
    });

    // Route for getting all Articles from the db
    app.get("/api/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({ saved: false })
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticles);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    // Route for getting all Articles where the saved flag is true from the db
    app.get("/api/articles/saved", function (req, res) {
        // Grab every document in the Articles collection where the saved flag is true
        db.Article.find({ saved: true })
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticles);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with its notes
    app.get("/api/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("notes")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving an Article's associated Note
    app.post("/api/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for deleting an Article's associated Note
    app.delete("/api/articles/:id", function (req, res) {
        // Create a new note and pass the id from the req.body to the entry
        db.Note.remove({ _id: req.body._id }) // delete the note
            .then(function (dbNote) {
                // and remove the reference from the Article's Notes array
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $pull: { notes: req.body._id } });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving an article to our saved page
    app.put("/api/save/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, find the article and set its saved flag to true
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for deleting an article from the saved articles page
    app.put("/api/delete/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, find the article and set its saved flag to false
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};