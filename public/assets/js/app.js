$(document).ready(function () {

    // add active class styles to home link in navbar
    $("#home-link").addClass("active");

    /////////////////////////////////////
    // FUNCTION TO RENDER ALL ARTICLES //
    /////////////////////////////////////

    function renderArticles() {
        // empty all articles for re-render
        $("#articles").empty();

        //ajax to get all articles in db
        $.get("/api/articles", function (dbArticles) {

            // check to see if any articles are in db
            if (dbArticles.length) {

                // build the cards for each article . . .
                dbArticles.forEach(function (article) {

                    // . . . if it does not have the saved flag
                    if (!article.saved) {

                        // variable declarations for cards and card components
                        var card = $("<div>");
                        card.addClass("card");

                        // set image source to imageLink of article
                        var cardImg = $("<img>");
                        cardImg.addClass("card-img-top").attr("src", article.imageLink).attr("alt", article.title);

                        var cardBody = $("<div>");
                        cardBody.addClass("card-body");

                        var cardTitle = $("<h5>");
                        cardTitle.addClass("card-title");

                        // set title href to article link and title text to article title
                        var titleLink = $("<a href='" + article.link + "' target='_blank'></a>");
                        titleLink.text(article.title);

                        // set text of card to article summary
                        var cardText = $("<p>");
                        cardText.text(article.summary);

                        // button to save articles
                        var saveBtn = $("<button>");
                        saveBtn.addClass("btn btn-primary save").html("<i class='fa fa-floppy-o'></i> Save article").attr("data-article-id", article._id);

                        // create card
                        cardTitle.append(titleLink);
                        cardBody.append(cardTitle, cardText, saveBtn);
                        card.append(cardImg, cardBody);

                        // prepend card to articles area
                        $("#articles").prepend(card);
                    }
                });
            } else {
                // else insert default message
                $("#articles").html("<p>No scraped articles yet.</p>");
            }
        });
    };

    ////////////////////
    // CLICK HANDLERS //
    ////////////////////

    // click handler to scrape new articles
    $("#btn-scraper").on("click", function (event) {
        event.preventDefault();

        // ajax to hit the scrape endpoint and get the number of new articles added back
        $.ajax({
            url: "/api/scrape",
            type: "GET"
        }).then(
            function (counter) {

                // show the scraping update modal
                $("#scrape-modal").modal("show");

                // various messages to show the user in the scraping update modal depending on the number of new articles
                if (counter === 1) {
                    $("#articles-scraped").text(counter + " new article scraped.");
                } else if (counter > 1) {
                    $("#articles-scraped").text(counter + " new articles scraped.");
                } else {
                    $("#articles-scraped").text("No new articles right now. Check back soon!");
                }

                // re-render the articles
                renderArticles();
            }
        );
    });

    // click handler for changing status of article to saved
    $("body").on("click", ".save", function (event) {

        // variable to obtain article's id
        let id = $(this).data("article-id");

        // Send the PUT request to the saved endpoint and change the status of the article
        $.ajax("/api/save/articles/" + id, {
            type: "PUT"
        }).then(
            function () {
                // re-render articles minus the article that was moved to the saved articles page
                renderArticles();
            }
        );
    });

    // initial function call to render articles on page
    renderArticles();

});