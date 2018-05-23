var app = liteJS.module("demoApp", ["ltRouter", "ltAjax", "ltPromise"]);
app.run("[demoApp]", ["router", "config"], function (router, config) {
    //configuring template engion
    //=>mandatory step
    config.templateFunc = function (templateName, obj) {
        return templates[templateName](obj);
    }

    //configuring default layout template for application
    //=>mandatory step
    config.defaultLayout = "demo-app-layout";

    //Want to add some animation navigation when route changes
    config.defaultAnimation = "w3-animate-opacity w3-animate-right";

    //register Routes
    //=> mandatory if using router plugin
});

