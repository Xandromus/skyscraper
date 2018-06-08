$(document).ready(function () {

    $("#home-link").addClass("active");

    function renderArticles() {
        // empty all rows
        $("#articles").empty();

        //ajax to get all items in the current suitcase
        $.get("/api/articles", function (dbArticles) {
            console.log(dbArticles.length);
            if (dbArticles.length) { // check for response

                // build the item inputs with checkmarks for each item that comes back and trashcans for deleting items
                dbArticles.forEach(function (article) {

                    if (!article.saved) {

                        // variable declarations
                        var card = $("<div>");
                        card.addClass("card");

                        var cardImg = $("<img>");
                        cardImg.addClass("card-img-top").attr("src", article.imageLink).attr("alt", article.title);

                        var cardBody = $("<div>");
                        cardBody.addClass("card-body");

                        var cardTitle = $("<h5>");
                        cardTitle.addClass("card-title");

                        var titleLink = $("<a href='" + article.link + "' target='_blank'></a>");
                        titleLink.text(article.title);

                        var cardText = $("<p>");
                        cardText.text(article.summary);

                        var saveBtn = $("<button>");
                        saveBtn.addClass("btn btn-primary save").html("<i class='fa fa-floppy-o'></i> Save article").attr("data-article-id", article._id);

                        cardTitle.append(titleLink);
                        cardBody.append(cardTitle, cardText, saveBtn);
                        card.append(cardImg, cardBody);

                        $("#articles").prepend(card);
                    }
                });
            } else {
                $("#articles").html("<p>No scraped articles yet.</p>");
            }
        });
    };

     // click handler to add items to a suitcase
     $("#btn-scraper").on("click", function (event) {
        event.preventDefault();

        // ajax to pass the ids array to the endpoint and add them for user's current suitcase
        $.ajax({
            url: "/api/scrape",
            type: "GET"
        }).then(
            function (counter) {
                console.log(counter);
                $("#scrape-modal").modal("show");
                if (counter === 1) {
                    $("#articles-scraped").text(counter + " new article scraped.");
                } else if (counter > 1) {
                    $("#articles-scraped").text(counter + " new articles scraped.");
                } else {
                    $("#articles-scraped").text("No new articles right now. Check back soon!");
                }
                renderArticles();
            }
        );
    });

    // click handler for changing status of article
    $("body").on("click", ".save", function (event) {

        // variables to obtain article's id
        let id = $(this).data("article-id");

        // Send the PUT request, passing the new devoured state
        $.ajax("/api/save/articles/" + id, {
            type: "PUT"
        }).then(
            function () {
                renderArticles();
            }
        );
    });

    renderArticles();

});