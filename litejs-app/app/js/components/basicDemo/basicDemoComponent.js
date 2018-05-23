app.component("basicAppDemoComponent", function () {
    this.init = function (id, action) {
        localStorage.setItem("logged", true);
        this.render("basicAppDemoTemplate");
    }
});