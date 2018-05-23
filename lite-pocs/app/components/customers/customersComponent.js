app.component("customersComponent", ["ajax", "query"], function (ajax, query) {
    var self = this,
        children = [],
        customerList;
    self.init = function () {
        this.render("customersTemplate");
        customerList = this.element.querySelector("#customer-list");
        query(self.element).on("remove_customer", function (e) {
            self.removeChild(e.data, customerList);
            e.stopPropagation();
        });
        ajax.get({
            url: "todo.json",
            success: function (response) {
                setTimeout(function () {
                    console.log(new Date());
                    for (var i = 0; i < response.length; i++) {
                        self.createAppendChild("customerComponent", response[i], query.new("tr"), customerList);
                    }
                    console.log(new Date());
                }, 0);
            }
        });
    };
})