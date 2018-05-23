var app = liteJS.module("demoApp", ["ltRouter", "ltAjax", "ltPromise"]);
app.run("[demoApp]", ["config", "appRouteProvider"], function (config, appRouteProvider) {
    //=>mandatory step
    config.templateFunc = function (templateName, obj) {
        return templates[templateName](obj);
    }

    //using router
    appRouteProvider.init();
});

