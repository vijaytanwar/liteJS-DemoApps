app.component("loginComponent", ["router"], function (router) {
    var self = this;
    self.events = {
        "click [type=submit]": function login() {
            alert("Login successfully, even without login details..."); 
            router.goTo("/");
        }
    }
    self.init = function () {
        self.render("loginTemplate");
    }
});