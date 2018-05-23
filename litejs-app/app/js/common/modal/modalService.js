app.service("modalService", function () {
    var self = this;
    self.showModal = function (params) {
        self.trigger("show:modal", params);
    }
});