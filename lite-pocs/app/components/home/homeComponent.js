app.component("homeComponent", ["ajax", "q", "query"], function (ajax, q, query) {
    var self = this;
    self.init = function (data) {
        self.render("homeTemplate", { Name: "Hello, Vijay" });
        var str = "";
        var startTime = new Date().getTime();
        for (var i = 0; i < 100; i++) {
            //var data = JSON.stringify({ count: i });
            //self.renderHtmlString("<dashboard-item-component data-init=" + data + "></dashboard-item-component>", true);
            str += "<div data-component='dashboardItemComponent' data-init='{}'></div>", true;
        }
        this.element.style.backgroundColor = "green";
        self.addHtmlString(str);
        self.initChildrenComponent();
    };
    self.destroy = function () {
    };
});