app.component("dashboardItemComponent", function () {
    var self = this;
    function handleClick() {
        alert("hi");
    }
    this.events = {
        "click .item-click": handleClick
    }
    self.init = function (data) {
        self.render("dashboardItemTemplate", data);
    }
}, true);