// function to render html through handlebars
module.exports = function (app) {

    // default catch-all route to index, rendered through handlebars
    app.get("/*", (req, res) => {
        res.render("index");
    });


};