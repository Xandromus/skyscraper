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

    function renderNotes(articleId) {
        $(".note-container").empty();

        //ajax to get all items in the current suitcase
        $.get("/api/articles/" + articleId, function (dbArticle) {
            var notes = dbArticle.notes;
            console.log(notes);
            if (notes.length) {

                dbArticle.notes.forEach(function (note) {

                    var noteDeleteBtn = $("<button>");
                    noteDeleteBtn.addClass("btn btn-danger note-delete float-right").text("x");
                    var listItem = $("<li>");
                    listItem.addClass("list-group-item note").text(note.body);

                    listItem.append(noteDeleteBtn);
                    $(".note-container").append(listItem);

                });

            } else {
                $(".note-container").html("<li class='list-group-item note'>No notes for this article yet.</li>")
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
        $("#new-note-btn").attr("data-article-id", articleId);
        var articleTitle = $(event.relatedTarget).attr("value");
        $(this).find(".notes-title").html("Notes for:<br/>" + articleTitle);
        renderNotes(articleId);
    });

    // When you click the savenote button
    $("#new-note-btn").on("click", function () {
        // Grab the id associated with the article from the submit button
        var articleId = $(this).attr("data-article-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/api/articles/" + articleId,
            data: {
                // Value taken from note textarea
                body: $("#note-text").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                renderNotes(articleId);
            });

        // remove the values entered in the textarea for note entry
        $("#note-text").val("");
    });

    renderArticles();

});