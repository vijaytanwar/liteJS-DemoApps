this["templates"] = this["templates"] || {};

this["templates"]["demo-app-layout"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div style=\"display:none\" id=\"mySidebar\" data-component=\"sidebarComponent\"></div>\r\n\r\n<div data-component=\"headerComponent\" class=\"w3-container app-header  w3-red\">\r\n</div>\r\n<div ltView class=\"w3-container app-content \"></div>";
},"useData":true});

this["templates"]["headerTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"w3-row\">\r\n    <div class=\"w3-cell s1\" style=\"vertical-align: middle;\">\r\n        <button class=\"w3-button w3-xlarge sidebar-show\">☰</button>\r\n    </div>\r\n    <div class=\"w3-cell s11\">\r\n        <h1>LiteJS - "
    + container.escapeExpression(((helper = (helper = helpers.pageHeading || (depth0 != null ? depth0.pageHeading : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageHeading","hash":{},"data":data}) : helper)))
    + "</h1>\r\n    </div>\r\n</div>";
},"useData":true});

this["templates"]["modalTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"w3-modal-content\">\r\n        <header class=\"w3-container w3-teal\">\r\n            <span class=\"modal-close w3-button w3-display-topright\">&times;</span>\r\n            <h2>Modal Header</h2>\r\n        </header>\r\n        <div class=\"w3-container\">\r\n            <p>Some text..</p>\r\n            <p>Some text..</p>\r\n        </div>\r\n        <footer class=\"w3-container w3-teal\">\r\n            <p>Modal Footer</p>\r\n        </footer>\r\n    </div>";
},"useData":true});

this["templates"]["sidebarTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"w3-sidebar w3-gray w3-bar-block w3-border-right\">\r\n    <button class=\"hide-sidebar w3-bar-item w3-large\">&times;</button>\r\n     <a href=\"/\" class=\"w3-bar-item w3-button\" lt-route>Home</a>\r\n    <a href=\"basic-app/1/vijay\" class=\"w3-bar-item w3-button\" lt-route>Basic app</a>\r\n    <a href=\"dependency-injection\" class=\"w3-bar-item w3-button\" lt-route>Dependency Injection</a>\r\n    <a href=\"basic-app\" class=\"w3-bar-item w3-button\" lt-route>Link 3</a>\r\n</div>";
},"useData":true});

this["templates"]["basicAppDemoTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>\r\n    Begining with LiteJS\r\n</h1>\r\n<pre class=\"prettyprint\">\r\n<xmp id=\"snippet-container\">\r\n//app.js\r\napp.run(\"[demoApp]\", [\"config\"], function (config) {\r\n    //mandatory step\r\n    config.templateFunc = function (templateName, obj) {\r\n        //templates is pre-compiled handlerbar templates object\r\n        return templates[templateName](obj);\r\n    }\r\n});\r\napp.component(\"helloComponent\", function(){\r\n    this.render(\"homeTemplate\");\r\n});\r\n\r\n//homeTemplate.html\r\n<h1>Hello LiteJS</h1>\r\n\r\n//index.html\r\n<body>\r\n    <div demoApp=\"demoApp\">\r\n        <div data-component=\"helloComponent\"></div>\r\n    </div>\r\n    <script src=\"scripts/liteJS-debug.1.0.0.js\"></script>\r\n    <script src=\"scripts/handlebars.min.js\"></script>\r\n    <script src=\"scripts/app.js\"></script>\r\n</body>\r\n</xmp>\r\n</pre>";
},"useData":true});

this["templates"]["dependencyInjectionDemoTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h2>Injecting depedencies</h2>\r\n<pre class=\"prettyprint\">\r\n<xmp id=\"snippet-container\">\r\n//modalService.js\r\napp.service(\"modalService\", function () {\r\n    var self = this;\r\n    self.showModal = function (params) {\r\n        self.trigger(\"show:modal\", params);\r\n    }\r\n});\r\n//modalComponent.js\r\napp.component(\"modalComponent\", [\"modalService\"], function (modalService) {\r\n    var self = this;\r\n    this.events = {\r\n        \"click .modal-close\": hideModal\r\n    }\r\n    function hideModal() {\r\n        self.element.style.display = \"none\";\r\n    }\r\n    function showModal(params) {\r\n        self.element.style.display = \"block\";\r\n    }\r\n    modalService.on(\"show:modal\", showModal, self.key);\r\n    this.render(\"modalTemplate\");\r\n});\r\n//dependencyInjection.js\r\napp.component(\"dependencyInjection\", [\"modalService\"], function (modalService) {\r\n    function showModal() {\r\n        modalService.showModal();\r\n    }\r\n    this.events = {\r\n        \"click button\": showModal\r\n    }\r\n    this.render(\"dependencyInjectionDemoTemplate\");\r\n});\r\n</xmp>\r\n</pre>\r\n\r\n<label>Show Modal using modal service</label><br>\r\n<button>Show Modal</button>";
},"useData":true});

this["templates"]["homeTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>LiteJS</h1>\r\n<a href=\"https://bitbucket.org/lite-js/litejs\">Source</a>\r\n<p>\r\n    LiteJS is light weight javascript framework to create rich front end application.\r\n</p>\r\n<p>\r\n    LiteJS is only 5.3KB when gzipped and 16kb when just minified. </p>\r\n<p>\r\n    It uses the MVC design pattern to structure the web application code. You can create plugable modules, services, components\r\n    and providers and many others to structure your application code. You can also create plugins which can you reuse in\r\n    other projects.\r\n</p>";
},"useData":true});