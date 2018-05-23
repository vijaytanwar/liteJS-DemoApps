
var app = liteJS.module("app", ["ltRouter", "ltAjax", "helpers"]);
app.run("[ltApp]", ["router", "config"], function (router, config) {
    config.templateFunc = function (templateName, obj) {
        return templates[templateName](obj);
    };
    config.defaultLayout = "layout";
    config.defaultAnimation = "w3-animate-right";
    config.keepComponentOnRouteChange = true;

    router.registerRoutes({
        "/": {
            component: 'homeComponent',
            config: { login: false }
        },
        "/login": {
            component: "loginComponent",
            layout: "layout2"
        },
        "/register": {
            component: "registerComponent",
            layout: "layout2",
            animation: "w3-animate-opacity w3-animate-right"
        },
        "/customers": {
            component: "customersComponent",
           // animation: "w3-animate-opacity w3-animate-right"
        }
    });
    router.beforeRouteChange(function (routeObj) {
        routeObj.done();
    });
    router.afterRouteChange(function (routeObj) {
    });
});


Handlebars.registerHelper("count", function () {
    window.count = window.count || 0;
    return window.count++;
});