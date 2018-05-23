app.component("headerComponent", ["componentChatService"], function (componentChatService) {
    var self = this;
    componentChatService.on("change:app_page_heading", reRender, self.key);

    function reRender(e) {
        self.reRender({
            pageHeading: e.data
        });
    }
    function notifySidebar() {
        componentChatService.trigger("show:sidebar");
    }

    this.events = {
        "click .sidebar-show": notifySidebar
    }
    self.init = function () {
        self.render("headerTemplate", { pageHeading: "Home" });
    }
});