liteJS.module("helpers")
    .component("topNotificationComponent", function () {
        var self = this;
        self.init = function () {
            self.addHtmlString("No new Notifications");
        };
    }, true)
    .service("alertService", function () {
        this.export = {
            showConfirmBox: function (msg) {
                return confirm(msg);
            }
        }
    });