$(document).ready(function () {

    // hide scraper button for saved articles page
    $("#btn-scraper").hide();

    // add active class styles to home saved in navbar
    $("#saved-link").addClass("active");

    ///////////////////////////////////////////
    // FUNCTION TO RENDER ALL SAVED ARTICLES //
    ///////////////////////////////////////////

    function renderArticles() {
        // empty all articles for re-render
        $("#saved-articles").empty();

        //ajax to get all articles in db with saved flag set to true
        $.get("/api/articles/saved", function (dbArticles) {

            // check to see if any articles are set to saved
            if (dbArticles.length) {

                // build the cards for each article . . .
                dbArticles.forEach(function (article) {

                    // . . . if saved flag set to true
                    if (article.saved) {

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

                        // create row to hold buttons
                        var optionBtns = $("<div>");
                        optionBtns.addClass("row mx-auto option-btns");

                        // columns for each button
                        var colOne = $("<div>");
                        var colTwo = $("<div>");
                        colOne.addClass("col-6 text-center btn-col");
                        colTwo.addClass("col-6 text-center btn-col");

                        // button to delete from saved articles
                        var deleteBtn = $("<button>");
                        deleteBtn.addClass("btn btn-primary delete").html("<i class='fa fa-trash'></i> Delete").attr("data-article-id", article._id);

                        // button to launch notes modal. add associated article id and title in attributes
                        var notesBtn = $("<button>");
                        notesBtn.addClass("btn btn-primary notes").html("<i class='fa fa-pencil-square-o'></i> Notes").attr("data-article-id", article._id).attr("value", article.title);
                        notesBtn.attr("data-toggle", "modal");
                        notesBtn.attr("data-target", "#notes-modal");

                        // create card
                        cardTitle.append(titleLink);
                        colOne.append(deleteBtn);
                        colTwo.append(notesBtn);
                        optionBtns.append(colOne, colTwo);
                        cardBody.append(cardTitle, cardText, optionBtns);
                        card.append(cardImg, cardBody);

                        // append card to saved articles area
                        $("#saved-articles").append(card);
                    }
                });
            } else {
                // else insert default message
                $("#saved-articles").html("<p>No saved articles yet.</p>");
            }
        });
    };

    ////////////////////////////////////////
    // FUNCTION TO RENDER ALL SAVED NOTES //
    ////////////////////////////////////////

    function renderNotes(articleId) {

        // empty all notes for re-render
        $(".note-container").empty();

        //ajax to get all notes for the selected article
        $.get("/api/articles/" + articleId, function (dbArticle) {
            // variable to hold notes array for article
            var notes = dbArticle.notes;

            // if the notes array has notes . . .
            if (notes.length) {

                // . . . render each note
                notes.forEach(function (note) {

                    // columns for each note
                    var colLeft = $("<div>");
                    var colRight = $("<div>");
                    colLeft.addClass("col-9");
                    colRight.addClass("col-3");

                    // paragraph tag to hold note text
                    var par = $("<p>");
                    par.text(note.body);

                    // append note text to left column
                    colLeft.append(par);

                    // button to delete note, with data attributes for the note id and the related article id
                    var noteDeleteBtn = $("<button>");
                    noteDeleteBtn.addClass("btn btn-danger note-delete float-right").text("x").attr("data-note-id", note._id).attr("data-article-id", dbArticle._id);

                    // append delete button to right column
                    colRight.append(noteDeleteBtn);

                    // row to hold columns
                    var row = $("<div>");
                    row.addClass("row");

                    // append columns to row
                    row.append(colLeft, colRight);

                    // list item to hold note
                    var listItem = $("<li>");
                    listItem.addClass("list-group-item note");

                    // append row to list item
                    listItem.append(row);

                    // append note to note-container ul
                    $(".note-container").append(listItem);

                });
            } else {
                // else insert default message
                $(".note-container").html("<li class='list-group-item note'>No notes for this article yet.</li>")
            }
        });
    };

    ////////////////////
    // CLICK HANDLERS //
    ////////////////////

    // click handler for changing status of article
    $("body").on("click", ".delete", function (event) {

        // variable to obtain article's id
        let id = $(this).data("article-id");

        // Send the PUT request to the saved endpoint and change the status of the article
        $.ajax("/api/delete/articles/" + id, {
            type: "PUT"
        }).then(
            function () {
                // re-render articles minus the article that was moved to the saved articles page
                renderArticles();
            }
        );
    });

    // pull article id and title into modal and populate modal title
    $("#notes-modal").on("show.bs.modal", function (event) {

        // variable to hold article id, pulled from related notes button
        var articleId = $(event.relatedTarget).data("article-id");

        // give the save note button a data attribute with the article id
        $("#new-note-btn").attr("data-article-id", articleId);

        // variable to hold article title, pulled from related notes button
        var articleTitle = $(event.relatedTarget).attr("value");

        // Change the modal's title to reflect the current article
        $(this).find(".notes-title").html("Notes for:<br/>" + articleTitle);

        // call the function to render notes, passing the article id as an argument
        renderNotes(articleId);
    });

    // When you click the save note button
    $("#new-note-btn").on("click", function () {

        // Grab the id associated with the article from the save note button
        var articleId = $(this).attr("data-article-id");

        // variable to hold user input for note
        var noteBody = $("#note-text").val();

        // check to make certain the user input isn't blank
        if (noteBody !== "") {

            // Run a POST request to add the note, using what's entered in the inputs
            $.ajax({
                method: "POST",
                url: "/api/articles/" + articleId,
                data: {
                    // Value taken from note textarea
                    body: noteBody
                }
            })
                // With that done
                .then(function (data) {
                    // re-render the notes, passing the article id as an argument
                    renderNotes(articleId);
                });

            // remove the values entered in the textarea for note entry
            $("#note-text").val("");

            // clear out the blank input message if it's there
            $(".message").empty();
        } else {
            // prompt user to enter at least 1 character
            $(".message").text("Please enter at least 1 character");
        }
    });

    // click handler to delete note
    $("body").on("click", ".note-delete", function () {

        // Grab the id associated with the article from the delete button's data attribute
        var articleId = $(this).attr("data-article-id");

        // AJAX to delete the note
        $.ajax({
            method: "DELETE",
            url: "/api/articles/" + articleId,
            data: {
                // pass in the note id from the delete button's data attribute
                _id: $(this).attr("data-note-id")
            }
        })
            // With that done
            .then(function (data) {
                $(".message").empty();
                // re-render the notes, passing the article id as an argument
                renderNotes(articleId);
            });
    });

    // initial function call to render saved articles on page
    renderArticles();

});