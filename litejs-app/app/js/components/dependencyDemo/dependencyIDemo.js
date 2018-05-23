app.component("dependencyInjection", ["modalService"], function (modalService) {
    function showModal() {
        modalService.showModal();
    }
    this.events = {
        "click button": showModal
    }
    this.render("dependencyInjectionDemoTemplate");
});