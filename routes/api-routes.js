let request = require("request");
let cheerio = require("cheerio");

module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        
        // Make a request call to grab the HTML body from the site of your choice
        request("https://news.sky.com/", function (error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);

            // An empty array to save the data that we'll scrape
            var results = [];

            // Select each element in the HTML body from which you want information.
            $(".sdc-news-story-grid__card").each(function (i, element) {
                console.log(i);
                console.log(typeof i);
                var link;
                var title;
                if (i === 0) {
                    link = "https://news.sky.com" + $(element).children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").attr("href");
                    title = $(element).children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").text(); 
                } else {
                    link = "https://news.sky.com" + $(element).children("div.sdc-news-story-grid__body").children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").attr("href");
                    title = $(element).children("div.sdc-news-story-grid__body").children("h3.sdc-news-story-grid__headline").children("a.sdc-news-story-grid__link").text(); 
                }
                var imageLink = $(element).children("a.sdc-news-story-grid__link").children("div.sdc-news-story-grid__media").children("div.sdc-news-story-grid__ratio").children("img.sdc-news-story-grid__media-img").attr("src");
                var summaryTemp = $(element).children("div.sdc-news-story-grid__body").children("p.sdc-news-story-grid__intro").text();
                var summary;
                if (summaryTemp !== "") {
                    summary = summaryTemp;
                } else {
                    summary = "No summary available";
                }

                // Save these results in an object that we'll push into the results array we defined earlier
                results.push({
                    title: title,
                    link: link,
                    imageLink: imageLink,
                    summary: summary
                });
            });

            console.log(results);
            // // Log the results once you've looped through each of the elements found with cheerio
            // for (var i = 0; i < results.length; i++) {
            //     if (results[i].title !== "home") {
            //         db.scrapedData.insert({ "title": results[i].title, "link": results[i].link });
            //     }
            // }
        });
        res.end();
    });

};