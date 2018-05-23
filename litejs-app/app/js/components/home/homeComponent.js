app.component("homeComponent", function () {
    var self = this;
    self.init = function (id, name) {
        self.render("homeTemplate");
    }
});