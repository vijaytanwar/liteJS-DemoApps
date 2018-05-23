app.component("registerComponent", ["ajax", "query", "router"], function (ajax, query, router) {
    var self = this;
    function saveUser() {
        ajax.get({
            url: "todo.txt",
            success: function () {
                query(self.element).find("#msg").html("Registered Successfully");
                router.goTo("/login");
            }
        })
    }
    self.events = [
        { event: "click", selector: "button", handler: saveUser }
    ];
    self.init = function () {
        self.render("registerTemplate");
    }
});