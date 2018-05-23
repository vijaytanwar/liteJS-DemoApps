app.component("sidebarComponent", ["componentChatService"], function (componentChatService) {
    function hideSidebar() {
        document.getElementById("mySidebar").style.display = "none";
    }
    function showSidebar() {
        document.getElementById("mySidebar").style.display = "block";
    }
    componentChatService.on("show:sidebar", showSidebar, this.key);
    this.events = {
        "click #mySidebar": hideSidebar
    }
    this.render("sidebarTemplate");
});