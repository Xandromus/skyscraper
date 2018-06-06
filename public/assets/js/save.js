$(document).ready(function () {

    $("#btn-scraper").hide();

    function renderArticles() {
        // empty all rows
        $("#saved-articles").empty();

        //ajax to get all items in the current suitcase
        $.get("/api/articles", function (dbArticles) {

            if (dbArticles) { // check for response

                // build the item inputs with checkmarks for each item that comes back and trashcans for deleting items
                dbArticles.forEach(function (article) {

                    if (article.saved) {

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

                        var optionBtns = $("<div>");
                        optionBtns.addClass("row mx-auto option-btns");

                        var colOne = $("<div>");
                        var colTwo = $("<div>");
                        colOne.addClass("col-6 text-center");
                        colTwo.addClass("col-6 text-center");

                        var deleteBtn = $("<button>");
                        deleteBtn.addClass("btn btn-primary delete").html("<i class='fa fa-trash'></i> Delete").attr("data-article-id", article._id);

                        var notesBtn = $("<button>");
                        notesBtn.addClass("btn btn-primary notes").html("<i class='fa fa-pencil-square-o'></i> Notes").attr("data-article-id", article._id).attr("value", article.title);
                        notesBtn.attr("data-toggle", "modal");
                        notesBtn.attr("data-target", "#notes-modal");

                        cardTitle.append(titleLink);
                        colOne.append(deleteBtn);
                        colTwo.append(notesBtn);
                        optionBtns.append(colOne, colTwo);
                        cardBody.append(cardTitle, cardText, optionBtns);
                        card.append(cardImg, cardBody);

                        $("#saved-articles").append(card);
                    }
                });
            }
        });
    };

    // click handler for changing status of article
    $("body").on("click", ".delete", function (event) {

        // variables to obtain article's id
        let id = $(this).data("article-id");

        // Send the PUT request, passing the new devoured state
        $.ajax("/api/delete/articles/" + id, {
            type: "PUT"
        }).then(
            function () {
                renderArticles();
            }
        );
    });

    $("#notes-modal").on("show.bs.modal", function (event) {
        var articleId = $(event.relatedTarget).data("article-id");
        var articleTitle = $(event.relatedTarget).attr("value");
        $(this).find(".notes-title").html("Notes for:<br/>" + articleTitle);
    });

    renderArticles();

});