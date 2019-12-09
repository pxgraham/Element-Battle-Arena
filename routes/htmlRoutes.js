var path = require("path");

module.exports = function(app) {

    // app.get("/games/element.html", function(req, res) {
    //     res.sendFile(path.join(__dirname, "../games/element.html"));
    // });

    // app.get("/games/element2.html", function(req, res) {
    //     res.sendFile(path.join(__dirname, "/public/element2.html"));
    // });

    app.get("/element", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/pages/element.html"));
    });

    app.get("/contact", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/pages/contact.html"));
    });

    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/pages/index.html"));
    });

    app.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/pages/404.html"));
    });

};