app.provider("appRouteProvider", ["config", "router", "componentChatService"], function (config, router, componentChatService) {
    this.init = function () {
        config.routePath = "http://127.0.0.1:8080";
        //=>mandatory step, if using router
        config.defaultLayout = "demo-app-layout";

        //Want to add some animation navigation when route changes
        config.defaultAnimation = "w3-animate-opacity w3-animate-right";

        //register Routes
        //=> mandatory if using router plugin
        router.registerRoutes({
            "/": {
                component: 'homeComponent'
            },
            "/basic-app/:id/:action": {
                component: "basicAppDemoComponent",
                config: {
                    title: "Basic Lt App"
                }
            },
            "/dependency-injection": {
                component: "dependencyInjection",
                config: {
                    title: "DI"
                }
            },
            "/communication": {
                component: "communicationDemoComponent",
            },
            "/child-component": {
                component: "childDemoComponent",
            },
            "/router": {
                component: "routerDemoComponent",
            },
            "/lite-promise": {
                component: "routerDemoComponent",
            },
            "/lite-query": {
                component: "routerDemoComponent",
            },
            "/lite-ajax": {
                component: "routerDemoComponent",
            },
            "/api-reference": {
                component: "apiReferenceComponent",
            }
        });
        router.beforeRouteChange(function (e) {
            var a = router;
            var config = e.data.route.config;
            componentChatService.trigger("change:app_page_heading", config ? config.title : "Home");
            e.data.done();
        });
        router.afterRouteChange(function (obj) {
        });
    }
});