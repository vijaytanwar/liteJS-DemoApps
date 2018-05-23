app.component("headerComponent", [], function () {
    var self = this;
    self.init = function () {
        self.render("headerTemplate", { title: "Header" }, true);
    }
});