$(document).ready(function () {

    // click handler to add items to a suitcase
    $("#btn-scraper").on("click", function (event) {
        event.preventDefault();

        // ajax to pass the ids array to the endpoint and add them for user's current suitcase
        $.ajax({
            url: "/api/scrape",
            type: "GET"
        })
    });
});