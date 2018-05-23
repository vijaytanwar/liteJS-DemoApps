app.component("modalComponent", ["modalService"], function (modalService) {
    var self = this;
    this.events = {
        "click .modal-close": hideModal
    }
    function hideModal() {
        self.element.style.display = "none";
    }
    function showModal(params) {
        self.element.style.display = "block";
    }
    modalService.on("show:modal", showModal, self.key);
    this.render("modalTemplate");
});