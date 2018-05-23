app.component("customerComponent", ["query", "alertService"], function (query, alertService) {
    var self = this,
        associatedData;
    function removeChild() {
        if (alertService.showConfirmBox("Want to remove this?")) {
            query(self.element).trigger("remove_customer", self.element);
        }
    };
    this.events = {
        "click button.remove, touch button.remove": removeChild
    }
    this.init = function (data) {
        self.render("customerTemplate", data);
        associatedData = data;
    };
})