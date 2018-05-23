/*!/
 * liteJS framework v1.0
 * https://bitbucket.org/lite-js/litejs
 *
 * Copyright liteJS
 * Released under the MIT license
 */
(function (window, document) {
    var liteJSModules = {},
        finalDependencies = [],
        componentRepository = {},
        instanceRepository = {},
        configService = {},
        customElements = {},
        readyCallbacks = [],
        query;

    //base component definition
    var BaseComponent = function () { };
    BaseComponent.prototype.init = function () { };
    BaseComponent.prototype.destroy = function () { };
    BaseComponent.prototype.on = function (event, callback, subscriberKey) {
        if (!subscriberKey) {
            console.error("subscriber key is not passed ex: .on(eventName, callback, this.key). " + moreInfo("subscriberKeyMissing"));
        }
        return ps.on(event, callback, this, subscriberKey);
    };
    BaseComponent.prototype.off = function (event, subscriberKey) {
        ps.off(event, this, subscriberKey);
    };
    BaseComponent.prototype.trigger = function (event, params) {
        ps.publish(event, params, this);
    };
    BaseComponent.prototype.completeOff = function () {
        if (this.events) {
            for (var key in this.events) {
                for (var i = 0; i < this.events[key].length; i++) {
                    if (typeof this.events[key] !== "function") {
                        ps.off(key, this, this.events[key][i].subscriberKey);
                    }
                }
            }
        }
    };


    var UIComponent = function (parent) {
        this.notifyParent = function (event, data) {
            parent.trigger(event, data);
        }
        this.notifyParentExP = function (event, data) {
            var d = instanceFactory.get("q");
            var deferred = new d.Deferred();
            parent.trigger(event, { data: data, deferred: deferred });
            return deferred.promise;
        }
    };
    for (var protoKey in BaseComponent.prototype) {
        UIComponent.prototype[protoKey] = BaseComponent.prototype[protoKey];
    }
    UIComponent.prototype.render = function (templateName, obj, append) {
        this.config = {
            template: templateName,
            append: append
        };
        if (append) {
            var lpTemplate = query(this.element).find("[lpTemplate]");
            if (lpTemplate.elements.length) {
                lpTemplate.html(configService.templateFunc(templateName, obj));
            } else {
                this.element.innerHTML += "<div lpTemplate>" + configService.templateFunc(templateName, obj) + "</div>";
            }
        } else {
            this.element.innerHTML = configService.templateFunc(templateName, obj);
        }
        bindEvents(this);
    };
    UIComponent.prototype.reRender = function (data) {
        this.render(this.config.template, data, this.config.append);
    };
    UIComponent.prototype.addHtmlString = function (str, append) {
        if (append) {
            this.element.innerHTML += str;
        } else {
            this.element.innerHTML = str;
        }
    };
    UIComponent.prototype.bindEvents = function () {
        bindEvents();
    };
    /**
     * Renders the child directly embedded in template as data-component
     */
    UIComponent.prototype.initChildrenComponent = function () {
        var self = this;
        query(this.element).find("[data-component]").each(function (element) {
            var comp = element.getAttribute("data-component"),
                data = JSON.parse(element.getAttribute("data-init"));
            self.createChild(element.getAttribute("data-component"), data, element);
        });
    };
    UIComponent.prototype.createChild = function (childComponent, obj, element) {
        if (!childComponent) {
            console.error("child component name argument missing. " + moreInfo("childComponentNameMissing"));
        }
        if (!element) {
            console.error("child element agrument missing. " + moreInfo("missingChildElement"));
        }
        var childInstance = instanceFactory.get(childComponent, element, this);
        childInstance.init(obj);
        return childInstance;
    };
    UIComponent.prototype.appendChild = function (childElement, targetContainer) {
        if (!childElement) {
            console.error("child element is missing " + moreInfo("missingChildElement"));
        }
        if (targetContainer) {
            targetContainer.appendChild(childElement);
        } else {
            this.element.appendChild(childElement);
        }
    };
    UIComponent.prototype.createAppendChild = function (childComponent, obj, element, targetContainer) {
        if (!childComponent) {
            console.error("child component name argument missing. " + moreInfo("childComponentNameMissing"));
        }
        if (!element) {
            console.error("child element argument missing. " + moreInfo("missingChildElement"));
        }
        var childInstance = this.createChild(childComponent, obj, element);
        if (targetContainer) {
            targetContainer.appendChild(element);
        } else {
            this.element.appendChild(element);
        }
        return childInstance;
    };
    UIComponent.prototype.removeChild = function (element, directParent) {
        if (directParent) {
            directParent.removeChild(element);
        } else {
            this.element.removeChild(element);
        }
    };
    UIComponent.prototype.remove = function () {
        this.element.parentNode.removeChild(this.element);
    };

    /**
     * function will bind the events
     * @param {*} obj object to bind the events on.
     */
    function bindEvents(obj) {
        var events = obj.events;
        if (events) {
            for (var eventsKey in events) {
                var eventKeyArray = eventsKey.split(',');
                for (var i = 0; i < eventKeyArray.length; i++) {
                    var eventConfig = eventKeyArray[i].split(' ');

                    var event = eventConfig[0],
                        selector = eventConfig[1];

                    var queryElement = query(obj.element);
                    if (query.matchesSelector(obj.element, selector)) {
                        queryElement.on(event, events[eventsKey]);
                    }
                    var selectedElements = queryElement.find(selector);
                    selectedElements.each(function (selectedElement) {
                        query(selectedElement).on(event, events[eventsKey]);
                    });
                }
            }
        }
    }

    if (console) {
        console.error = function (msg) {
            throw msg;
        }
    }
    /**
     * Will help developer to find more info about error
     * @param {*} hash 
     */
    function moreInfo(hash) {
        return "https://vijaytanwar.github.com/liteJS#" + hash;
    }
    //Instance factory
    var _lastKey = 0;
    var instanceFactory = {
        export: function (obj) {
            for (var key in obj.export) {
                if (typeof obj.export[key] === "function") {
                    obj.export[key] = obj.export[key].bind(obj);
                }
            }
            return obj.export;
        },
        /**
         * will find or create instance of required component
         */
        get: function (componentName, uiElement, parent) {
            var instance,
                component = componentRepository[componentName];

            //for not single ton instance or first time call
            if (component) {
                instance = instanceRepository[component.name];
            } else {
                //singleTon Instances are deleted from componentRepository to reduce the memory usage
                instance = instanceRepository[componentName];
            }

            //if instance found return instance
            if (instance) {
                if (instance instanceof Function || !instance.export) {
                    return instance;
                } else {
                    return this.export(instance);
                }
            } else {
                if (!component) {
                    console.error("component " + componentName + " is not found. " + moreInfo("componentNameMissing"));
                }
                var dependencies = [];
                if (typeof component.dependencies === "function") {
                    component.class = component.dependencies;
                    component.dependencies = null;
                }
                if (component.dependencies && component.dependencies.length > 0) {
                    var length = component.dependencies.length;
                    for (var i = 0; i < length; i++) {
                        var comp = componentRepository[component.dependencies[i]]
                        if (comp && !comp.isSingleton) {
                            console.error(comp.name + " UI component can't be injected, instead use service/func or provider " + moreInfo("uiComponentMisuse"));
                        }
                        var dependency = this.get(component.dependencies[i]);
                        dependencies.push(dependency);
                    }
                }

                var instanceKey;
                if (!component.isFunction) {
                    if (uiElement) {
                        if (uiElement.getAttribute("data-instance") !== null) {
                            console.error(uiElement, " is already used for other component " + componentName + ". " + moreInfo("elementIsAlreadyInUser"));
                        }
                        instance = new UIComponent(parent);
                        instanceKey = "key_" + (_lastKey++);
                        instance.key = instanceKey;
                        instance.element = uiElement;

                        instanceRepository[instanceKey] = instance;
                        uiElement.setAttribute("data-instance", instanceKey);
                    } else {
                        instance = new BaseComponent();
                        instance.key = component.name;
                    }
                    component.class.apply(instance, dependencies);
                } else {
                    instance = component.class.apply({}, dependencies);
                }
                instance.typeof = component.name;
                instance.isProvider = component.isProvider;

                if (component.isSingleton) {
                    //no need to keep singleton in componentRepository
                    delete componentRepository[componentName];
                }

                //UI Elements will be saved by tracking key, so that they can be tracked when html node is deleted.
                //Singleton UI component will not be tracked
                if (!uiElement) {
                    instanceRepository[component.name] = instance;
                }

                if (component.isFunction || !instance.export) {
                    return instance;
                } else {
                    return this.export(instance);
                }
            }
        },
        /**
         * Will update the provider will leave on lt$get method
         */
        updateProvider: function () {
            for (var key in instanceRepository) {
                if (instanceRepository[key].isProvider) {
                    for (var key2 in instanceRepository[key].export) {
                        if (key2 !== "lt$get") {
                            delete instanceRepository[key].export[key2];
                        }
                    }
                    instanceRepository[key].export = instanceRepository[key].export.lt$get;
                }
            }

            for (var key in componentRepository) {
                if (componentRepository[key].isProvider) {
                    delete componentRepository[key];
                }
            }
        }
    };

    //Garbage collection functions
    var garbageElements = [];
    var gc = {
        lock: false,
        push: function (element) {
            garbageElements.push(element);
        },
        init: function () {
            var interval = setInterval(function () {
                if (!gc.lock && garbageElements.length) {
                    removeObjects();
                }
            }, 2000);
            function removeObjects() {
                var length = garbageElements.length;
                var key;
                while (key = garbageElements.pop()) {
                    var obj = instanceRepository[key];
                    if (obj) {
                        obj.completeOff();
                        obj.destroy();
                        var events = obj.events;
                        if (events) {
                            for (var eventsKey in events) {
                                var eventKeyArray = eventsKey.split(',');
                                for (var i = 0; i < eventKeyArray.length; i++) {
                                    var eventConfig = eventKeyArray[i].split(' ');

                                    var event = eventConfig[0],
                                        selector = eventConfig[1];

                                    var selectedElements = query(obj.element).find(selector);
                                    selectedElements.each(function (selectedElement) {
                                        query(selectedElement).off(event, events[eventsKey]);
                                    });
                                }
                            }
                        }
                        delete instanceRepository[key];
                    }
                }
                gc.lock = true;
            }
        }
    };

    /**
     * liteJs pub sub modules
     */
    var ps = {
        on: function (event, callback, obj, subscriberKey) {
            obj.events = obj.events || {};
            if (!obj.events[event]) {
                obj.events[event] = [];
            }

            var eventToken = query.token();
            obj.events[event].push({
                subscriberKey: subscriberKey,
                callback: callback,
                eventToken: eventToken
            });
            return eventToken;
        },
        off: function (eventName, obj, subscriberKey) {
            if (!obj.events) { return; }
            var event = obj.events[eventName];
            if (event) {
                for (var i = 0; i < event.length; i++) {
                    if (event[i].subscriberKey === subscriberKey) {
                        event.splice(i, 1);
                        break;
                    }
                }
            } else {
                for (var key in obj.events) {
                    for (var j = 0; j < obj.events[key].length; j++) {
                        if (obj.events[key][j].eventToken = eventName) {
                            obj.events[key].splice(j, 1);
                            return;
                        }
                    }
                }
            }
        },
        publish: function (eventName, params, obj) {
            if (!obj.events) { return; }
            var event = obj.events[eventName];
            if (event) {
                for (var i = 0; i < event.length; i++) {
                    if (event[i].subscriberKey in instanceRepository) {
                        if (typeof params == "object") {
                            if (params && params.deferred) {
                                var deferred = params.deferred;
                                delete params.deferred;
                                event[i].callback({ data: params.data, deferred: deferred });
                            } else {
                                event[i].callback({ data: params });
                            }
                        } else {
                            event[i].callback({ data: params });
                        }
                    } else {
                        obj.off(eventName, obj, event[i].subscriberKey)
                    }
                }
            }
        }
    };

    /**
    * Remove instance associated with DOM element when that element is removed 
    */
    function elementRemoved(e) {
        var element = query(e.target),
            instanceKey = element.data("instance");

        if (instanceKey) {
            //lock gc if adding elements to garbage list
            gc.lock = true;
            gc.push(instanceKey);
            gc.lock = false;
        }
        if (e.target && e.target.innerHTML) {
            element.find("[data-instance]").each(function (childComponent) {
                var childInstanceKey = query(childComponent).data("instance");
                gc.push(childInstanceKey);
            });
            gc.lock = false;
        }
    }

    /**
     * Initialize the default element having data-component name
     * @param {*} elements elements having data-component
     */
    function initUIComponents(elements) {
        elements.each(function (element) {
            var componentName = element.getAttribute("data-component"),
                data = element.getAttribute("data-init"),
                instance = instanceFactory.get(componentName, element);

            instance.element = element;
            instance.name = componentName;

            instance.init(JSON.parse(data));
        });
    }

    /**
     * Create custom components
     */
    function defineCustomComponent(elementStr) {
        var protoType = Object.create(HTMLElement.prototype);
        protoType.attachedCallback = function () {
            if (!query(this).attr("data-instance")) {
                var component;
                //init custom component
                var parentEl = query(this).parent("[data-instance]");
                if (parentEl) {
                    var parentInstance = instanceRepository[parentEl.attr("data-instance")];
                    component = instanceFactory.get(customElements[this.tagName], this, parentInstance);
                } else {
                    component = instanceFactory.get(customElements[this.tagName], this);
                }

                var data = JSON.parse(this.getAttribute("data-init"));
                component.init(data);
            }
        }
        protoType.detachedCallback = function () {
        }
        if ('registerElement' in document) {
            document.registerElement(elementStr, { prototype: protoType });
        } else {
            console.log("Custom component not supported, please load https://cdn.jsdelivr.net/webcomponentsjs/0.7.24/webcomponents-lite.min.js libs.");
        }
    }
    /**
     * register custom elements
     */
    function registerCustomComponents() {
        for (var key in customElements) {
            defineCustomComponent(key);
        }
    }
    /**
     * call app run func
     * @param {*} dependencies 
     * @param {*} callback 
     */
    function callAppRunFunc(dependencies, callback) {
        var dependenciesInstances = [];
        if (dependencies) {
            dependenciesInstances = [];
            for (var i = 0; i < dependencies.length; i++) {
                dependenciesInstances.push(instanceFactory.get(dependencies[i]));
            }
        }
        callback.apply(this, dependenciesInstances);
    }

    /**
     * fill app dependencies
     */
    function fillDependencies(moduleName) {
        var module = liteJSModules[moduleName];
        if (!module) {
            console.error(moduleName + " is not loaded");
        } else if (typeof module.dependencies !== "undefined") {
            for (var i = 0; i < module.dependencies.length; i++) {
                if (finalDependencies.indexOf(module.dependencies[i]) == -1) {
                    finalDependencies.push(module.dependencies[i]);
                    fillDependencies(module.dependencies[i]);
                }
            }
        }
        if (finalDependencies.indexOf(moduleName) == -1) {
            finalDependencies.push(moduleName);
        }
    }

    /**
     * fill all the components in Component Repository which are required.
     */
    function fillComponentRepository() {
        var moduleName;
        while (moduleName = finalDependencies.pop()) {
            var registeredComps = liteJSModules[moduleName].registeredComps,
                length = registeredComps.length;
            for (var i = 0; i < length; i++) {
                if (componentRepository[registeredComps[i].name]) {
                    //console.error("duplicate component found between module..");
                } else {
                    componentRepository[registeredComps[i].name] = registeredComps[i];
                }
            }
            //key registeredComps is not required as this is already pushed to componentRepository;
            delete liteJSModules[moduleName];
        }
    }
    /**
     * liteJS class
     */
    function liteJS(appName, dependencies) {
        this.appName = appName;
        this.dependencies = dependencies;
        this.registeredComps = [];
    }
    /**
     * Add lite JS comps
     * @param {*} componentName 
     * @param {*} dependencies 
     * @param {*} componentClass 
     * @param {*} isSingleton 
     * @param {*} isFunction 
     * @param {*} isProvider 
     */
    liteJS.prototype.addComponent = function (componentName, dependencies, componentClass, isSingleton, isFunction, isProvider) {
        this.registeredComps.push({
            name: componentName,
            class: componentClass,
            dependencies: dependencies,
            isSingleton: isSingleton,
            isFunction: isFunction,
            isProvider: isProvider
        });
        return this;
    }
    liteJS.prototype.component = function (componentName, dependencies, componentClass, isCustomElement) {
        if (typeof dependencies === "function") {
            isCustomElement = componentClass;
            componentClass = dependencies;
            dependencies = undefined;
        }
        if (isCustomElement) {
            if (!(/[A-Z]/.test(componentName))) {
                console.error("custom element name is invalid. " + moreInfo("invalidComponentName"));
            }
            var generatedElementName = componentName.replace(/([A-Z])/g, "-$1").toUpperCase();
            customElements[generatedElementName] = componentName;
        }
        return this.addComponent(componentName, dependencies, componentClass);
    }
    liteJS.prototype.service = function (serviceName, dependencies, serviceClass) {
        return this.addComponent(serviceName, dependencies, serviceClass, true);
    }
    liteJS.prototype.provider = function (providerName, dependencies, serviceClass) {
        return this.addComponent(providerName, dependencies, serviceClass, true, false, true);
    }
    liteJS.prototype.func = function (functionName, dependencies, functionDef) {
        return this.addComponent(functionName, dependencies, functionDef, true, true);
    }
    liteJS.prototype.run = function (hostSelector, dependencies, callback) {
        var self = this;
        document.addEventListener("DOMContentLoaded", function () {
            configService.hostSelector = hostSelector;
            var appModule = liteJSModules[self.appName];
            appModule.dependencies = appModule.dependencies || [];
            appModule.dependencies.push("ltQuery", "ltPromise");
            appModule.service("config", [], function () {
                this.export = configService;
            });
            appModule.service("instanceFactory", [], function () {
                this.export = {
                    initUIComponents: initUIComponents
                };
            });

            fillDependencies(self.appName);
            fillComponentRepository();
            query = instanceFactory.get("query");

            callAppRunFunc(dependencies, callback);

            if (!configService.templateFunc) {
                console.error("templateFunc is missing." + moreInfo("templateFuncMissing"));
            }
            if (!configService.defaultLayout) {
                console.error("default layout template name missing." + moreInfo("defaultLayoutTemplateMissing"));
            }
            //update providers
            instanceFactory.updateProvider();

            //initialize instance garbage collector
            gc.init();

            //subscribe to document node remove event
            query(document).on("DOMNodeRemoved", function (e) {
                if (e.target.getAttribute) {
                    elementRemoved(e);
                }
            });
            //register all component inside ltApp or hostSelector
            registerCustomComponents();

            //call all liteReady function
            for (var i = 0; i < readyCallbacks.length; i++) {
                readyCallbacks[i]();
            }
        });
    }
    liteJS.prototype.ready = function (callback) {
        readyCallbacks.push(callback);
    }
    window.liteJS = {
        module: function (appName, dependencies) {
            var module = new liteJS(appName, dependencies);
            if (!liteJSModules[appName]) {
                liteJSModules[appName] = module;
            }
            return module;
        }
    };

}(window, document));

liteJS.module("ltAjax", ["ltPromise"]).provider("ajax", ["q"], function (q) {
    var self = this;
    self.settings = {};

    function ajax(obj) {
        var request = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
            headers = obj.headers,
            deferred = new q.Deferred();
        if (headers) {
            for (var i = 0; i < headers.length; i++) {
                request.setRequestHeader(headers[i].key, headers[i].value);
            }
        }
        request.open(obj.method, obj.url, obj.async || true);
        if (obj.before) {
            obj.before(request);
        }
        if (self.settings.before) {
            self.settings.before(request);
        }
        request.onreadystatechange = function () {
            switch (request.readyState) {
                case 2: (obj.sent && obj.sent(request));
                    break;
                case 4:
                    if (self.settings.after) {
                        self.settings.after(request.responseText, request.status, request);
                    }
                    var jsonData,
                        contentTypeHeader = request.getResponseHeader("content-type");
                    if (contentTypeHeader && contentTypeHeader.toLowerCase().indexOf("json") != -1) {
                        jsonData = JSON.parse(request.responseText);
                    }
                    if (request.status == 200) {
                        if (obj.success) {
                            obj.success(jsonData || request.responseText, request, request.status);
                        }
                        deferred.resolve(jsonData || request.responseText);
                    } else {
                        if (obj.error) {
                            obj.error(jsonData || request.responseText, request, request.status);
                        }
                        deferred.reject(request);
                    }
                    break;
            }

        }
        setTimeout(function () {
            request.send();
        }, 0);
        return function () {
            return deferred.promise;
        };
    }
    this.export = {
        lt$get: {
            get: function (obj) {
                obj.method = "GET";
                return ajax(obj);
            },
            put: function (obj) {
                obj.method = "PUT";
                return ajax(obj);
            },
            post: function (obj) {
                obj.method = "POST";
                return ajax(obj);
            },
            delete: function (obj) {
                obj.method = "DELETE";
                return ajax(obj);
            }
        },
        before: function (callback) {
            self.settings.before = callback;
        },
        after: function (callback) {
            self.settings.after = callback;
        }
    }
});
//query service
liteJS.module("ltQuery").func("query", [], function () {
    var readyCallbacks = [],
        callbacks = [];

    var queryConfig = {
        addEventListener: document.addEventListener,
        removeEventListener: document.removeEventListener,
        createEvent: "createEvent" in document,
    };

    //basicPolyfill
    (function () {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(selector),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) { }
                    return i > -1;
                };
        }
    }());

    function find(selector, object) {
        if (object) {
            return object.elements[0].querySelectorAll(selector);
        } else {
            return document.querySelectorAll(selector);
        }
    }
    function parent(el, selector) {
        while ((el = el.parentElement) && !(queryFunc.matchesSelector(el, selector)));
        return el;
    }
    function liteJSElement(selector) {
        if (typeof selector == "object") {
            switch (selector) {
                case document: {
                    this.ready = function (callback) {
                        readyCallbacks.push(callback);
                    }
                }
            }
            if (selector.length >= 0) {
                this.elements = selector;
            } else {
                this.elements = [selector];
            }
        } else if (typeof selector === "string") {
            this.elements = find(selector);
        } else {
            this.elements = selector;
        }
    }
    liteJSElement.prototype = {
        find: function (selector) {
            return new liteJSElement(find(selector, this));
        },
        get: function (index) {
            return this.elements[index];
        },
        first: function (selector) {
            return new liteJSElement(this.elements[0]);
        },
        addClass: function (className) {
            var length = this.elements.length,
                elements = this.elements;
            for (var i = 0; i < length; i++) {
                if (elements[i].className.indexOf(className) == -1) {
                    elements[i].className = elements[i].className.length > 0 ? elements[i].className + " " + className : className;
                }
            }
            return this;
        },
        removeClass: function (className) {
            var length = this.elements.length;
            for (var i = 0; i < length; i++) {
                if (this.elements[i].className.length) {
                    this.elements[i].className = this.elements[i].className.replace(className, "");
                    this.elements[i].className = this.elements[i].className.trim();
                }
            }
            return this;
        },
        hasClass: function (className) {
            return this.elements[0].className.indexOf(className) > -1;
        },
        append: function (html) {
            var length = this.elements.length;
            for (var i = 0; i < length; i++) {
                if (typeof html === "string") {
                    this.elements[i].innerHTML = this.elements[i].innerHTML + html;
                } else {
                    if (html.elements.length & html.elements.length > 0)
                        this.elements[i].appendChild(html.elements[0]);
                }
            }
            return this;
        },
        html: function (html) {
            if (html || html === "") {
                var length = this.elements.length;
                for (var i = 0; i < length; i++) {
                    if (typeof html === "string") {
                        this.elements[i].innerHTML = html;
                    } else {
                        this.elements[i].innerHTML = "";
                        if (html.elements.length & html.elements.length > 0)
                            this.elements[i].appendChild(html.elements[0]);
                    }
                }
                return this;
            } else {
                return this.elements[0].innerHTML;
            }
        },
        on: function (event, callback) {
            for (var i = 0; i < this.elements.length; i++) {
                if (queryConfig.addEventListener)
                    this.elements[i].addEventListener(event, callback);
                else
                    this.elements[i].attachEvent("on" + event, callback);
            }
        },
        off: function (event, callback) {
            for (var i = 0; i < this.elements.length; i++) {
                if (queryConfig.removeEventListener) {
                    this.elements[i].removeEventListener(event, callback);
                }
                else
                    this.elements[i].detachEvent("on" + event, callback);
            }
        },
        each: function (callback) {
            var length = this.elements.length;
            for (var i = 0; i < length; i++) {
                callback(this.elements[i], i);
            }
        },
        trigger: function (event, data) {
            for (var i = 0; i < this.elements.length; i++) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true);
                evt.data = data
                this.elements[i].dispatchEvent(evt);
            }
        },
        prop: function (name, value) {
            if (typeof value !== "undefined") {
                var length = this.elements.length;
                for (var i = 0; i < length; i++) {
                    this.elements[i][name] = value;
                }
                return this;
            } else {
                return this.elements[0][name];
            }
        },
        attr: function (name, value) {
            if (typeof value !== "undefined") {
                var length = this.elements.length;
                for (var i = 0; i < length; i++) {
                    this.elements[i].setAttribute(name, value);
                }
                return this;
            } else {
                return this.elements[0].getAttribute(name);
            }
        },
        data: function (name, value) {
            return this.attr("data-" + name, value);
        },
        css: function (obj, value) {
            if (typeof obj == "string") {
                this.each(function (element) {
                    element.style[obj] = value;
                });
            } else {
                for (var key in obj) {
                    this.each(function (element) {
                        element.style[key] = obj[key];
                    });
                }
            }
        },
        parent: function (selector) {
            if (selector) {
                var parentElement = parent(this.elements[0], selector);
                if (parentElement) {
                    return new liteJSElement(parentElement);
                } else {
                    return null;
                }
            } else {
                return new liteJSElement(this.elements[0].parentElement);
            }
        }
    }
    document.addEventListener("DOMContentLoaded", function () {
        for (var i = 0; i < readyCallbacks.length; i++) {
            readyCallbacks[i].call();
        }
    });
    var queryFunc = function (selector) {
        return new liteJSElement(selector);
    };
    queryFunc.extend = function () {
        var extended = {};
        for (key in arguments) {
            var argument = arguments[key];
            for (prop in argument) {
                if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                    extended[prop] = argument[prop];
                }
            }
        }
        return extended;
    };
    queryFunc.queryParam = function (url) {
        var params = {}, pieces, parts, i;
        var question = url.lastIndexOf("?");
        if (question !== -1) {
            url = url.slice(question + 1);
            pieces = url.split("&");
            for (i = 0; i < pieces.length; i++) {
                parts = pieces[i].split("=");
                if (parts.length < 2) {
                    parts.push("");
                }
                params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            }
        }
        return params;
    }
    queryFunc.new = function (element, queryElement) {
        if (queryElement) {
            return queryFunc(document.createElement(element));
        }
        return document.createElement(element);
    };
    queryFunc.token = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    queryFunc.matchesSelector = function (elem, selector) {
        return elem.matches(selector);
    }
    return queryFunc;
});
//q promise services
liteJS.module("ltPromise").service("q", function () {
    function Promise() { }
    Promise.prototype.success = function (callback) {
        this.successCall = callback;
        return this;
    }
    Promise.prototype.error = function (callback) {
        this.errorCall = callback;
        return this;
    }
    function Deferred() {
        this.promise = new Promise();
    }
    Deferred.prototype.resolve = function (data) {
        //push will not be there without promise;
        if (this.promise.push) {
            this.promise.push(data);
        }
        if (this.promise.successCall) {
            this.promise.successCall(data);
        }

    };
    Deferred.prototype.reject = function (data) {
        this.promise.hasError = true;
        if (this.promise.push) {
            this.promise.push(data);
        }
        if (this.promise.errorCall) {
            this.promise.errorCall(data);
        }
    };

    /**
     * Defer class
     * @param {*} funcs: List of function which promise will call
     */
    function Defer(funcs) {
        var promises = [],
            taskDone = [],
            fullFilled = funcs.length,
            hasError = false,
            self = this;

        function pushPromiseData(i, args) {
            if (self.cancelled) {
                return;
            }
            taskDone[i] = args;
            hasError = this.hasError || hasError;
            fullFilled--;
            if (self.updateProgress) {
                self.updateProgress(i, args);
            }
            if (!fullFilled) {
                if (hasError) {
                    self.errorCall.apply({}, taskDone);
                } else {
                    self.successCall.apply({}, taskDone);
                }
            }
        }
        this.call = function (params) {
            var promise;
            for (var i = 0; i < funcs.length; i++) {
                //jQuery ajax promise support
                if (typeof funcs[i] == "object" && "done" in funcs[i] && "fail" in funcs[i]) {
                    var deferred = new Deferred();
                    promises.push(deferred.promise);
                    deferred.promise.push = pushPromiseData.bind(deferred.promise, i);

                    funcs[i].done(function (response) {
                        deferred.resolve(response);
                    }).fail(function (response) {
                        deferred.promise.hasError = true;
                        deferred.reject(response);
                    });
                    continue;
                }
                if (params[i]) {
                    promise = funcs[i].apply(self, params[i]);
                } else {
                    promise = funcs[i]();
                }
                promise.push = pushPromiseData.bind(promise, i);
                promises.push(promise);
            }
        }
    };
    Defer.prototype.success = function (func) {
        this.successCall = func;
        return this;
    };
    Defer.prototype.error = function (func) {
        this.errorCall = func;
        return this;
    };
    Defer.prototype.progress = function (func) {
        this.updateProgress = func;
        return this;
    }
    Defer.prototype.cancel = function () {
        this.cancelled = true;
        return this;
    };
    Defer.prototype.params = function () {
        this.params = arguments;
        return this;
    }

    function when(args) {
        var defer = new Defer(args);
        setTimeout(function () {
            defer.call(defer.params);
        }, 0);
        return defer;
    }
    this.export = {
        when: function () {
            return when(arguments);
        },
        Deferred: Deferred,

        /**
         * dynamicPromise convert the normal function to promise function
         * function return value will be passed in promise resolve
         * and any exception will be be passed in promise reject
         */
        dynamic: function (func) {
            return function () {
                var deferred = new Deferred(),
                    args = arguments;
                setTimeout(function () {
                    try {
                        var returnVal = func.apply({}, args);
                        deferred.resolve(returnVal);
                    } catch (ex) {
                        deferred.reject(ex);
                    }
                }, 0);

                return deferred.promise;
            };
        }
    }
});
(function () {
    var router = liteJS.module("ltRouter");
    router.provider("router", ["query", "config", "instanceFactory"], function (query, configService, instanceFactory) {
        var routes = [],
            defaultRoute,
            self = this;

        function registerRoutes(_routes) {
            for (var key in _routes) {
                if (key === "/") {
                    defaultRoute = {
                        path: key,
                        routeObj: _routes[key]
                    };
                } else {
                    routes.push({
                        path: key.split("?")[0],
                        routeObj: _routes[key]
                    });
                }
            }
        }
        function changeRoute(url) {
            if (self["before_route_change"]) {
                var routeConfig = getRouteInfo(url);
                routeConfig.done = function (obj) {
                    query(document).trigger("change_app_route", {
                        routeConfig: getRouteInfo(url),
                        params: query.queryParam(window.location.hash),
                        done: function () {
                            self.trigger("after_route_change", routeConfig);
                        }
                    });
                }
                self.trigger("before_route_change", routeConfig);
            } else {
                query(document).trigger("change_app_route", {
                    routeConfig: getRouteInfo(url),
                    params: query.queryParam(window.location.hash),
                    done: function () {
                        self.trigger("after_route_change", routeConfig);
                    }
                });
            }
        }
        function goTo(url, hasChanged) {
            if (hasChanged) {
                changeRoute(url);
            } else {
                window.location.hash = url;
            }
        }
        function getRouteInfo(url) {
            var routeName,
                routeObj;
            if (url) {
                routeName = url.split("?")[0];
            }
            for (var i = 0; i < routes.length; i++) {
                if (routeName === routes[i].path) {
                    routeObj = routes[i].routeObj;
                    break;
                }
            }
            if (!routeObj) {
                routeObj = defaultRoute.routeObj;
            }
            return routeObj;
        }
        function bindRouteChangeEvent() {
            var cachedView,
                cachedLayout,
                ltView;
            query(document).on("change_app_route", function (e) {
                var obj = e.data;
                var routeConfig = obj.routeConfig;
                if (!cachedView) {
                    cachedView = query.new("div", true);
                    query(configService.hostSelector).append(cachedView);
                }
                cachedLayout = cachedView.attr("layout");

                var jsonData = JSON.stringify(e.data.params);
                if (!cachedLayout) {
                    cachedView.html(configService.templateFunc(routeConfig.layout || configService.defaultLayout));
                    cachedView.attr("layout", routeConfig.layout || configService.defaultLayout);

                    ltView = cachedView.find("[ltView]").html("<div data-component='" + routeConfig.component + "' data-init='" + jsonData + "'></div>");
                    instanceFactory.initUIComponents(cachedView.find("[data-component]"));
                } else {
                    var layoutChanged;
                    if (routeConfig.layout && cachedLayout !== routeConfig.layout) {
                        cachedView.html(configService.templateFunc(routeConfig.layout));
                        cachedView.attr("layout", routeConfig.layout);
                        layoutChanged = true;
                    }
                    if (!routeConfig.layout && cachedLayout !== configService.defaultLayout) {
                        cachedView.html(configService.templateFunc(configService.defaultLayout));
                        cachedView.attr("layout", configService.defaultLayout);
                        layoutChanged = true;
                    }

                    ltView = cachedView.find("[ltView]");
                    var component = query.new("div", true);
                    component.attr("data-component", routeConfig.component);
                    component.attr("data-init", jsonData);
                    component.addClass((routeConfig.animation || configService.defaultAnimation) || "");
                    ltView.html(component);

                    instanceFactory.initUIComponents(layoutChanged ? cachedView.find("[data-component]") : component);
                }

                query(document).trigger("route_changed", cachedView);
                e.data.done();
            });
        };
        this.export = {
            registerRoutes: function (routes) {
                registerRoutes(routes);
            },
            beforeRouteChange: function (callback) {
                self.on("before_route_change", callback, self);
            },
            afterRouteChange: function (callback) {
                self.on("after_route_change", callback, self);
            },
            lt$get: {
                goTo: function (url) {
                    goTo(url);
                }
            }
        };

        router.ready(function () {
            instanceFactory.initUIComponents(query(configService.hostSelector).find("[data-component]"));

            bindRouteChangeEvent();
            window.addEventListener('hashchange', function () {
                goTo(location.hash.slice(1), true);
            });
            goTo(location.hash.slice(1), true);
        });

    });
}());