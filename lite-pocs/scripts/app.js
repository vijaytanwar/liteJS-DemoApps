this["templates"] = this["templates"] || {};

this["templates"]["headerTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"w3-container w3-teal layout\">\r\n    <h1>liteJS</h1>\r\n</div>";
},"useData":true});

this["templates"]["navTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<nav class=\"w3-cell-row w3-red\">\r\n    <a href=\"/#/login\" class=\"w3-cell w3-container\">Login</a>\r\n    <a href=\"/#/customers\" class=\"w3-cell w3-container\">customer</a>\r\n    <a href=\"/#/profile\" class=\"w3-cell w3-container\">profile</a>\r\n    <a href=\"/#/?name=vijay&lname=singh\" class=\"w3-cell w3-container\">home</a>\r\n</nav>";
},"useData":true});

this["templates"]["layout"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div data-component=\"headerComponent\"></div>\r\n<div data-component=\"navComponent\"></div>\r\n<div ltView class=\"w3-container\"></div>\r\n</div>";
},"useData":true});

this["templates"]["layout2"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div ltView class=\"w-container w3-blue\">\r\n</div>";
},"useData":true});

this["templates"]["customersTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Customers</h1>\r\n<table class=\"w3-table w3-bordered w3-striped w3-border test w3-hoverable\">\r\n    <tbody id=\"customer-list\">\r\n    </tbody>\r\n</table>";
},"useData":true});

this["templates"]["customerTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<tr>\r\n    <td>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\r\n    <td>"
    + alias4(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"email","hash":{},"data":data}) : helper)))
    + "</td>\r\n    <td>\r\n        <button class=\"remove w3-btn w3-ripple w3-green\">close</button>\r\n    </td>\r\n</tr>";
},"useData":true});

this["templates"]["dashboardItemTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"w3-card-4 w3-center w3-middle w3-panel\" style=\"height:60px;\">\r\n    <button class=\"item-click\">button</button>\r\n    <button class=\"item-click\">button</button>\r\n    <button class=\"item-click\">button</button>\r\n    <button class=\"item-click\">button</button>\r\n    <button class=\"item-click\">button</button>\r\n    <button class=\"item-click\">button</button>\r\n    <button class=\"item-click\">button</button>\r\n    <button class=\"item-click\">button</button>\r\n</div>";
},"useData":true});

this["templates"]["homeTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<h1>"
    + ((stack1 = ((helper = (helper = helpers.Name || (depth0 != null ? depth0.Name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"Name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h1>";
},"useData":true});

this["templates"]["loginTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Login Page</h1>\r\n<a href=\"/#/\" lt-route=\"true\">Home</a>\r\n<a href=\"/#/register\" lt-route=\"true\">Register</a>\r\n<p>\r\n    <div>user name</div>\r\n    <input type=\"text\">\r\n</p>\r\n<p>\r\n    <div>Password</div>\r\n    <input type=\"password\">\r\n</p>\r\n<p>\r\n    <button type=\"submit\">Login</button>\r\n</p>";
},"useData":true});

this["templates"]["registerTemplate"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Register</h1>\r\n<label>First Name</label>\r\n<input name=\"firstName\" type=\"text\" />\r\n\r\n<label>Last Name</label>\r\n<input name=\"lastName\" type=\"text\" />\r\n\r\n<label>User Name</label>\r\n<input name=\"userName\" type=\"text\" />\r\n\r\n<label>Password</label>\r\n<input name=\"password\" type=\"password\" />\r\n<br/>\r\n<button type=\"submit\">Register</button>\r\n<a href=\"/#/login\" lt-route=\"true\">Login</a>\r\n<br>\r\n<span id=\"msg\"></span>";
},"useData":true});

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
app.component("headerComponent", [], function () {
    var self = this;
    self.init = function () {
        self.render("headerTemplate", { title: "Header" }, true);
    }
});
app.component("navComponent", function () {
    this.init = function () {
        this.render("navTemplate");
    }
});
app.component("customerComponent", ["query", "alertService"], function (query, alertService) {
    var self = this,
        associatedData;
    function removeChild() {
        if (alertService.showConfirmBox("Want to remove this?")) {
            query(self.element).trigger("remove_customer", self.element);
        }
    };
    this.events = {
        "click button.remove, touch button.remove": removeChild
    }
    this.init = function (data) {
        self.render("customerTemplate", data);
        associatedData = data;
    };
})
app.component("customersComponent", ["ajax", "query"], function (ajax, query) {
    var self = this,
        children = [],
        customerList;
    self.init = function () {
        this.render("customersTemplate");
        customerList = this.element.querySelector("#customer-list");
        query(self.element).on("remove_customer", function (e) {
            self.removeChild(e.data, customerList);
            e.stopPropagation();
        });
        ajax.get({
            url: "todo.json",
            success: function (response) {
                setTimeout(function () {
                    console.log(new Date());
                    for (var i = 0; i < response.length; i++) {
                        self.createAppendChild("customerComponent", response[i], query.new("tr"), customerList);
                    }
                    console.log(new Date());
                }, 0);
            }
        });
    };
})
liteJS.module("helpers")
    .component("topNotificationComponent", function () {
        var self = this;
        self.init = function () {
            self.addHtmlString("No new Notifications");
        };
    }, true)
    .service("alertService", function () {
        this.export = {
            showConfirmBox: function (msg) {
                return confirm(msg);
            }
        }
    });
app.component("dashboardItemComponent", function () {
    var self = this;
    function handleClick() {
        alert("hi");
    }
    this.events = {
        "click .item-click": handleClick
    }
    self.init = function (data) {
        self.render("dashboardItemTemplate", data);
    }
}, true);
app.component("homeComponent", ["ajax", "q", "query"], function (ajax, q, query) {
    var self = this;
    self.init = function (data) {
        self.render("homeTemplate", { Name: "Hello, Vijay" });
        var str = "";
        var startTime = new Date().getTime();
        for (var i = 0; i < 100; i++) {
            //var data = JSON.stringify({ count: i });
            //self.renderHtmlString("<dashboard-item-component data-init=" + data + "></dashboard-item-component>", true);
            str += "<div data-component='dashboardItemComponent' data-init='{}'></div>", true;
        }
        this.element.style.backgroundColor = "green";
        self.addHtmlString(str);
        self.initChildrenComponent();
    };
    self.destroy = function () {
    };
});
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
app.component("registerComponent", ["ajax", "query", "router"], function (ajax, query, router) {
    var self = this;
    function saveUser() {
        ajax.get({
            url: "todo.txt",
            success: function () {
                query(self.element).find("#msg").html("Registered Successfully");
                router.goTo("/login");
            }
        })
    }
    self.events = [
        { event: "click", selector: "button", handler: saveUser }
    ];
    self.init = function () {
        self.render("registerTemplate");
    }
});