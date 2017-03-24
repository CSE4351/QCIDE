function iosDragDrop(a) {
    function b(b) {
        b = b || {}, n = navigator.userAgent.match(/OS [1-4](?:_\d+)+ like Mac/) ? "page" : "client";
        var e = m.createElement("div"),
            f = "draggable" in e,
            g = "ondragstart" in e && "ondrop" in e,
            h = !(f || g) || /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
        if (j((h ? "" : "not ") + "patching html5 drag drop"), h) {
            b.enableEnterLeave || (c.prototype.synthesizeEnterLeave = l);
            var i = m.getElementById(a);
            i.addEventListener("touchstart", d)
        }
    }

    function c(a, b) {
        this.dragData = {}, this.dragDataTypes = [], this.dragImage = null, this.dragImageTransform = null, this.dragImageWebKitTransform = null, this.customDragImage = null, this.customDragImageX = null, this.customDragImageY = null, this.el = b || a.target, j("dragstart"), this.dispatchDragStart() && (this.createDragImage(), this.listen())
    }

    function d(a) {
        var b = a.target;
        do
            if (b.draggable === !0) {
                if (!b.hasAttribute("draggable") && "a" == b.tagName.toLowerCase()) {
                    var d = document.createEvent("MouseEvents");
                    d.initMouseEvent("click", !0, !0, b.ownerDocument.defaultView, 1, a.screenX, a.screenY, a.clientX, a.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, 0, null), b.dispatchEvent(d), j("Simulating click to anchor");
                    break
                }
                a.preventDefault(), new c(a, b);
                break
            }
        while ((b = b.parentNode) && b !== m.body)
    }

    function e(a, b) {
        var c = b.changedTouches[0],
            d = m.elementFromPoint(c[n + "X"], c[n + "Y"]);
        return d
    }

    function f(a) {
        var b = a.getBoundingClientRect();
        return {
            x: b.left,
            y: b.top
        }
    }

    function g(a, b, c, d) {
        return d && (c = c.bind(d)), a.addEventListener(b, c), {
            off: function() {
                return a.removeEventListener(b, c)
            }
        }
    }

    function h(a, b, c, d) {
        function e(d) {
            return c(d), a.removeEventListener(b, e)
        }
        return d && (c = c.bind(d)), a.addEventListener(b, e)
    }

    function i(a, b) {
        if (1 == a.nodeType) {
            b.removeAttribute("id"), b.removeAttribute("class"), b.removeAttribute("style"), b.removeAttribute("draggable");
            for (var c = window.getComputedStyle(a), d = 0; d < c.length; d++) {
                var e = c[d];
                b.style.setProperty(e, c.getPropertyValue(e), c.getPropertyPriority(e))
            }
            b.style.pointerEvents = "none"
        }
        if (a.hasChildNodes())
            for (var f = 0; f < a.childNodes.length; f++) i(a.childNodes[f], b.childNodes[f])
    }

    function j(a) {
        console.log(a)
    }

    function k(a) {
        return 0 === a.length ? 0 : a.reduce(function(a, b) {
            return b + a
        }, 0) / a.length
    }

    function l() {}
    var m = document;
    if (m && a) {
        iosDragDropInitialized = !0, j = l;
        var n;
        c.prototype = {
            listen: function() {
                function a(a) {
                    this.dragend(a, a.target), b.call(this)
                }

                function b() {
                    return j("cleanup"), this.dragDataTypes = [], null !== this.dragImage && (this.dragImage.parentNode.removeChild(this.dragImage), this.dragImage = null, this.dragImageTransform = null, this.dragImageWebKitTransform = null), this.customDragImage = null, this.customDragImageX = null, this.customDragImageY = null, this.el = this.dragData = null, [c, d, e].forEach(function(a) {
                        return a.off()
                    })
                }
                var c = g(m, "touchmove", this.move, this),
                    d = g(m, "touchend", a, this),
                    e = g(m, "touchcancel", b, this)
            },
            move: function(a) {
                var b = [],
                    c = [];
                [].forEach.call(a.changedTouches, function(a) {
                    b.push(a.pageX), c.push(a.pageY)
                });
                var d = k(b) - (this.customDragImageX || parseInt(this.dragImage.offsetWidth, 10) / 2),
                    e = k(c) - (this.customDragImageY || parseInt(this.dragImage.offsetHeight, 10) / 2);
                this.translateDragImage(d, e), this.synthesizeEnterLeave(a)
            },
            translateDragImage: function(a, b) {
                var c = "translate(" + a + "px," + b + "px) ";
                null !== this.dragImageWebKitTransform && (this.dragImage.style["-webkit-transform"] = c + this.dragImageWebKitTransform), null !== this.dragImageTransform && (this.dragImage.style.transform = c + this.dragImageTransform)
            },
            synthesizeEnterLeave: function(a) {
                var b = e(this.el, a);
                b != this.lastEnter && (this.lastEnter && this.dispatchLeave(a), this.lastEnter = b, this.lastEnter && this.dispatchEnter(a)), this.lastEnter && this.dispatchOver(a)
            },
            dragend: function(a) {
                j("dragend"), this.lastEnter && this.dispatchLeave(a);
                var b = e(this.el, a);
                b ? (j("found drop target " + b.tagName), this.dispatchDrop(b, a)) : j("no drop target");
                var c = m.createEvent("Event");
                c.initEvent("dragend", !0, !0), this.el.dispatchEvent(c)
            },
            dispatchDrop: function(a, b) {
                var c = m.createEvent("Event");
                c.initEvent("drop", !0, !0);
                var d = b.changedTouches[0],
                    e = d[n + "X"],
                    g = d[n + "Y"],
                    i = f(a);
                c.offsetX = e - i.x, c.offsetY = g - i.y, c.dataTransfer = {
                    types: this.dragDataTypes,
                    getData: function(a) {
                        return this.dragData[a]
                    }.bind(this),
                    dropEffect: "move"
                }, c.preventDefault = function() {}.bind(this), h(m, "drop", function() {
                    j("drop event not canceled")
                }, this), a.dispatchEvent(c)
            },
            dispatchEnter: function(a) {
                var b = m.createEvent("Event");
                b.initEvent("dragenter", !0, !0), b.dataTransfer = {
                    types: this.dragDataTypes,
                    getData: function(a) {
                        return this.dragData[a]
                    }.bind(this)
                };
                var c = a.changedTouches[0];
                b.pageX = c.pageX, b.pageY = c.pageY, this.lastEnter.dispatchEvent(b)
            },
            dispatchOver: function(a) {
                var b = m.createEvent("Event");
                b.initEvent("dragover", !0, !0), b.dataTransfer = {
                    types: this.dragDataTypes,
                    getData: function(a) {
                        return this.dragData[a]
                    }.bind(this)
                };
                var c = a.changedTouches[0];
                b.pageX = c.pageX, b.pageY = c.pageY, this.lastEnter.dispatchEvent(b)
            },
            dispatchLeave: function(a) {
                var b = m.createEvent("Event");
                b.initEvent("dragleave", !0, !0), b.dataTransfer = {
                    types: this.dragDataTypes,
                    getData: function(a) {
                        return this.dragData[a]
                    }.bind(this)
                };
                var c = a.changedTouches[0];
                b.pageX = c.pageX, b.pageY = c.pageY, this.lastEnter.dispatchEvent(b), this.lastEnter = null
            },
            dispatchDragStart: function() {
                var a = m.createEvent("Event");
                return a.initEvent("dragstart", !0, !0), a.dataTransfer = {
                    setData: function(a, b) {
                        return this.dragData[a] = b, this.dragDataTypes.indexOf(a) == -1 && (this.dragDataTypes[this.dragDataTypes.length] = a), b
                    }.bind(this),
                    setDragImage: function(a, b, c) {
                        this.customDragImage = a, this.customDragImageX = b, this.customDragImageY = c
                    }.bind(this),
                    dropEffect: "move"
                }, this.el.dispatchEvent(a)
            },
            createDragImage: function() {
                this.customDragImage ? (this.dragImage = this.customDragImage.cloneNode(!0), i(this.customDragImage, this.dragImage)) : (this.dragImage = this.el.cloneNode(!0), i(this.el, this.dragImage)), this.dragImage.style.opacity = "0.5", this.dragImage.style.position = "absolute", this.dragImage.style.left = "0px", this.dragImage.style.top = "0px", this.dragImage.style.zIndex = "999999";
                var a = this.dragImage.style.transform;
                "undefined" != typeof a && (this.dragImageTransform = "", "none" != a && (this.dragImageTransform = a.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g, "")));
                var b = this.dragImage.style["-webkit-transform"];
                "undefined" != typeof b && (this.dragImageWebKitTransform = "", "none" != b && (this.dragImageWebKitTransform = b.replace(/translate\(\D*\d+[^,]*,\D*\d+[^,]*\)\s*/g, ""))), this.translateDragImage(-9999, -9999), m.body.appendChild(this.dragImage)
            }
        }, b(window.iosDragDropShim)
    }
}

function pad(a, b, c) {
    return c = c || "0", a += "", a.length >= b ? a : new Array(b - a.length + 1).join(c) + a
}

function reOrderValues(a, b) {
    for (var c = [], d = 0; d < a.length; d++) c.push(pad(d.toString(2), b));
    for (var e = [], f = 0; f <= b; f++)
        for (var d = 0; d < c.length; d++) {
            var g = c[d];
            g.count("1") === f && e.push(a[d])
        }
    return e
}

function pascalSimple(a) {
    for (var b, c = [
            [1]
        ], d = 0; d < a - 1; d++) {
        b = [1];
        for (var e = 1; e < c[d].length; e++) b[e] = c[d][e] + c[d][e - 1];
        b.push(1), c.push(b)
    }
    return c[a - 1]
}

function Line(a, b, c, d, e) {
    var f = {
            x: a,
            y: b
        },
        g = {
            x: c,
            y: d
        },
        h = function() {
            return "M" + f.x + " " + f.y + " L" + g.x + " " + g.y
        },
        i = function() {
            j.attr("path", h())
        },
        j = e.path(h());
    return j.attr({
        stroke: "#000",
        strokeWidth: 4
    }), j.updateStart = function(a, b) {
        return f.x = a, f.y = b, i(), this
    }, j.updateEnd = function(a, b) {
        return g.x = a, g.y = b, i(), this
    }, j
}
angular.module("qubitsApp", ["qubitsCommon", "ngAnimate", "ui.router", "ui.bootstrap", "lbServices", "formly", "formlyBootstrap", "textAngular", "ngFileUpload", "ui.select", "ngSanitize", "dragDrop", "ngHttpCache", "vcRecaptcha", "angular.filter", "ngtweet", "ui.codemirror", "angularMoment", "uiSwitch", "mentio", "angular-inview"]), angular.module("qubitsApp").config(["LoopBackResourceProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider", "ngHttpCacheConfigProvider", "$provide", "$compileProvider", "$qProvider", function(a, b, c, d, e, f, g, h) {
    g.debugInfoEnabled(!1), h.errorOnUnhandledRejections(!1), a.setAuthHeader("X-Access-Token"), e.urls = ["/api"], f.decorator("taOptions", ["taRegisterTool", "$delegate", "$uibModal", function(a, b, c) {
        return a("uploadImage", {
            buttontext: "Upload Image",
            iconclass: "fa fa-image",
            action: function(a, b) {
                var d = {};
                return d.data = function() {
                    var a = {};
                    return a.container = "community-images", a.typeFilesAllowed = ["image/png", "image/jpeg"], a
                }, c.open({
                    controller: "textAngularUploadFileModalInstanceController",
                    resolve: d,
                    templateUrl: "templates/text_angular_upload_image.html"
                }).result.then(function(c) {
                    b(), document.execCommand("insertImage", !1, c.linkFile), a.resolve()
                }, function() {
                    a.resolve()
                }), !1
            }
        }), b.toolbar[2].push("uploadImage"), b
    }]), f.decorator("taOptions", ["$delegate", "taRegisterTool", "taTranslations", "$window", function(a, b, c, d) {
        return b("insertLink2", {
            tooltiptext: c.insertLink.tooltip,
            iconclass: "fa fa-link",
            action: function() {
                var a;
                if (a = d.prompt(c.insertLink.dialogPrompt, "http://"), a && "" !== a && "http://" !== a) return this.$editor().wrapSelection("createLink", a, !0)
            },
            activeState: function(a) {
                return !!a && "A" === a[0].tagName
            },
            onElementSelect: {
                element: "a",
                action: function() {}
            }
        }), a.defaultTagAttributes.a.target = "_blank", a
    }]), f.decorator("taOptions", ["taRegisterTool", "$delegate", "$uibModal", function(a, b, c) {
        return a("uploadFile", {
            buttontext: "Upload File",
            iconclass: "fa fa-file-text",
            action: function(a, b) {
                var d = {};
                return d.data = function() {
                    var a = {};
                    return a.container = "community-documents", a.typeFilesAllowed = ["application/pdf"], a
                }, c.open({
                    controller: "textAngularUploadFileModalInstanceController",
                    resolve: d,
                    templateUrl: "templates/text_angular_upload_file.html"
                }).result.then(function(c) {
                    b(), document.execCommand("insertHTML", !1, '<a href="' + c.linkFile + '" target="_blank">' + c.nameFile + "</a>"), a.resolve()
                }, function() {
                    a.resolve()
                }), !1
            }
        }), b.toolbar = [
            ["h3", "quote", "bold", "italics", "underline", "ul", "clear"]
        ], b
    }]), d.interceptors.push(["$q", "$rootScope", "$location", "LoopBackAuth", "$injector", function(a, b, c, d, e) {
        return {
            responseError: function(c) {
                return 401 != c.status || c.config && (c.config.__isGetCurrentUser__ || "/api/users/login" == c.config.url) || (console.log("redirect to login"), d.clearUser(), d.clearStorage(), b.loggedInUser = void 0, b.myUser = void 0, e.invoke(["loginModal", function(a) {
                    a.show()
                }])), a.reject(c)
            }
        }
    }]), c.when("", "/"), c.when("/", ["$injector", "$location", function(a, b) {
        a.invoke(["$state", "$rootScope", function(a, b) {
            if (b.loggedInUser) {
                var c = b.loggedInUser;
                c.additionalData && c.additionalData.tutorialCompleted ? a.go("playground.section.community") : a.go("playground.section.tutorialLanding")
            } else a.go("playground.section.community")
        }])
    }]), b.state("displaycode", {
        url: "/display/code?:id&:idExecution",
        params: {
            id: void 0,
            idExecution: void 0
        },
        templateUrl: "templates/display_code.html",
        controller: "displayCodeController"
    }).state("playground", {
        url: "",
        templateUrl: "templates/playground_layout.html",
        controller: "commonController",
        "private": !0
    }).state("playground.section", {
        views: {},
        "private": !0
    }).state("playground.section.editor", {
        "abstract": !0,
        url: "?:codeId&{sharedCode:bool}",
        params: {
            codeId: void 0,
            executionCode: void 0,
            fromTutorial: !1,
            fromCommunity: void 0,
            sharedCode: void 0,
            warningChecked: !1
        },
        views: {
            "playground-main@playground": {
                templateUrl: "templates/playground.html",
                controller: "playgroundController"
            }
        },
        "private": !0
    }).state("playground.section.editor.composer", {
        url: "/editor",
        views: {
            "playground-editor": {
                templateUrl: "templates/playground_editor_composer.html"
            }
        },
        "private": !0
    }).state("playground.section.editor.qasm", {
        url: "/qasm",
        views: {
            "playground-editor": {
                templateUrl: "templates/playground_editor_qasm.html",
                controller: "qasmEditorController"
            }
        },
        "private": !0
    }).state("playground.section.codes", {
        url: "/codes",
        views: {
            "playground-main@playground": {
                templateUrl: "templates/playground_codes.html",
                controller: "codesController"
            }
        },
        "private": !0
    }).state("playground.section.tutorialLanding", {
        url: "/user-guide",
        views: {
            "playground-main@playground": {
                templateUrl: "templates/user_guide/landing.html",
                controller: "tutorialLanding"
            }
        }
    }).state("playground.section.tutorial", {
        url: "/tutorial?sectionId&pageIndex",
        params: {
            sectionId: void 0,
            pageIndex: void 0,
            goMain: !1,
            lastItemId: void 0
        },
        views: {
            "playground-main@playground": {
                templateUrl: "templates/user_guide/playground_tutorial.html",
                controller: "tutorialController"
            }
        }
    }).state("playground.section.tutorial.search", {
        url: "/search?searchQ",
        params: {
            lastItemId: void 0,
            searchQ: void 0
        },
        views: {
            "playground-main@playground": {
                templateUrl: "templates/user_guide/playground_tutorial_search.html",
                controller: "tutorialSearchController"
            }
        }
    }).state("playground.section.community", {
        url: "/community?:channel",
        params: {
            channel: {
                value: "forum",
                squash: !0
            },
            lastItemId: void 0,
            tagToFind: void 0
        },
        views: {
            "playground-main@playground": {
                templateUrl: "templates/community/playground_community.html",
                controller: "communityController"
            }
        },
        onEnter: ["$anchorScroll", "$timeout", "$stateParams", function(a, b, c) {
            c.lastItemId && b(function() {
                a(c.lastItemId)
            }, 500)
        }]
    }).state("playground.section.community.questionEdit", {
        url: "/question/edit?:questionId",
        params: {
            questionId: void 0
        },
        views: {
            "playground-main@playground": {
                templateUrl: "templates/community/playground_community_question_edit.html",
                controller: "communityQuestionController"
            }
        },
        "private": !0
    }).state("playground.section.community.question", {
        url: "/question?:questionId&:answerId",
        params: {
            questionId: void 0,
            answerId: void 0,
            questionObject: void 0
        },
        views: {
            "playground-main@playground": {
                templateUrl: "templates/community/playground_community_question.html",
                controller: "communityQuestionController"
            }
        }
    }).state("playground.section.executions", {
        url: "/executions?:executionId",
        params: {
            executionId: void 0
        },
        views: {
            "playground-main@playground": {
                templateUrl: "templates/playground_executions.html",
                controller: "executionListController"
            }
        },
        "private": !0
    }).state("playground.section.terms", {
        url: "/terms",
        views: {
            "playground-main@playground": {
                templateUrl: "templates/community/terms.html"
            }
        }
    }).state("playground.section.users", {
        url: "/user/:name",
        params: {
            name: void 0
        },
        views: {
            "playground-main@playground": {
                templateUrl: "templates/community/playground_community_user.html",
                controller: "userController"
            }
        }
    }).state("devices.list", {
        url: "/list",
        templateUrl: "templates/devices.list.html",
        "private": !0,
        controller: "devicesListController"
    }).state("loginthird", {
        url: "/loginthird",
        templateUrl: "templates/loginthird.html",
        controller: "loginthirdController"
    }).state("login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "loginController"
    }).state("reset", {
        url: "/reset",
        views: {
            "@": {
                templateUrl: "templates/login.reset.html",
                controller: "loginController"
            }
        }
    }).state("emailverified", {
        url: "/emailverified",
        views: {
            "@": {
                templateUrl: "templates/login.emailverified.html",
                controller: "loginController"
            }
        }
    }).state("resetPassword", {
        url: "/reset-password",
        views: {
            "@": {
                templateUrl: "templates/login.resetPassword.html",
                controller: "loginController"
            }
        }
    }).state("signup", {
        url: "/signup",
        templateUrl: "templates/signup.html",
        controller: "signupController"
    }).state("signupinvitation", {
        url: "/signupinvitation",
        templateUrl: "templates/signup_invitation.html",
        controller: "signupinvitationController"
    }).state("logout", {
        url: "/logout",
        controller: ["$rootScope", "$scope", "User", "playgroundFactory", "$location", "userService", function(a, b, c, d, e, f) {
            f.logout().then(function() {
                a.loggedin = !1, a.loggedInUser = void 0, a.myUser = void 0, e.path("/")
            }, function() {
                a.loggedin = !1, a.loggedInUser = void 0, a.myUser = void 0, e.path("/")
            })
        }]
    }).state("account", {
        url: "/account",
        templateUrl: "templates/account.html",
        controller: "accountController",
        "private": !0
    }).state("accountPreference", {
        url: "/account/preferences",
        templateUrl: "templates/account.html",
        controller: "accountController",
        "private": !0,
        params: {
            preferences: !0
        }
    }).state("communityterms", {
        url: "/community-terms",
        templateUrl: "templates/community/terms.html"
    })
}]).run(["$rootScope", "$window", "$location", "$state", "$timeout", "$anchorScroll", "$uibModal", "User", "userService", "loginModal", "formlyConfig", "playgroundFactory", function($rootScope, $window, $location, $state, $timeout, $anchorScroll, $uibModal, User, userService, loginModal, formlyConfig, playgroundFactory) {
    function camelize(a) {
        return a = a.replace(/[\-_\s]+(.)?/g, function(a, b) {
            return b ? b.toUpperCase() : ""
        }), a.replace(/^([A-Z])/, function(a, b) {
            return b ? b.toLowerCase() : ""
        })
    }

    function appendHtml(a, b) {
        var c = document.createElement("div");
        for (c.innerHTML = b; c.children.length > 0;) a.appendChild(c.children[0])
    }
    var attributes = ["date-disabled", "custom-class", "show-weeks", "starting-day", "init-date", "min-mode", "max-mode", "format-day", "format-month", "format-year", "format-day-header", "format-day-title", "format-month-title", "year-range", "shortcut-propagation", "datepicker-popup", "show-button-bar", "current-text", "clear-text", "close-text", "close-on-date-selection", "datepicker-append-to-body"],
        bindings = ["datepicker-mode", "min-date", "max-date"],
        ngModelAttrs = {};
    angular.forEach(attributes, function(a) {
        ngModelAttrs[camelize(a)] = {
            attribute: a
        }
    }), angular.forEach(bindings, function(a) {
        ngModelAttrs[camelize(a)] = {
            bound: a
        }
    }), formlyConfig.setType({
        name: "datepicker",
        templateUrl: "templates/formly/datepicker.html",
        wrapper: ["bootstrapLabel", "bootstrapHasError"],
        defaultOptions: {
            ngModelAttrs: ngModelAttrs,
            templateOptions: {
                datepickerOptions: {
                    format: "dd-MMMM-yyyy",
                    initDate: new Date
                }
            }
        },
        controller: ["$scope", function(a) {
            a.datepicker = {}, a.datepicker.opened = !1, a.datepicker.open = function(b) {
                a.datepicker.opened = !a.datepicker.opened
            }
        }]
    }), formlyConfig.setType({
        name: "imageupload",
        templateUrl: "templates/formly/imageupload.html",
        wrapper: ["bootstrapLabel", "bootstrapHasError"],
        defaultOptions: {
            templateOptions: {
                imageuploadOptions: {
                    typeFilesAllowed: ["image/png", "image/jpeg", "image/gif"]
                }
            }
        },
        controller: ["$scope", "$uibModal", function(a, b) {
            a.showModal = !1, a.showUploadDialog = function(b) {
                a.showModal = !0
            }
        }]
    }), CodeMirror.defineMode("customMode", function(config, parserConfig) {
        return {
            token: function(stream, state) {
                if (stream.match("//")) {
                    for (; null != (ch = stream.next()) && "\n" != ch;);
                    return "comment"
                }
                for (var specialGates = ["reset", "barrier", "if", "measure", "qreg", "creg", "gate", "include", "opaque"], i = 0; i < specialGates.length; i++) {
                    var exp = eval("/^" + specialGates[i] + "(\\s|\\()/"),
                        match = stream.match(exp, !0);
                    if (match) return stream.backUp(1), "string"
                }
                var exp = eval("/^[a-z][a-zA-Z0-9]*/");
                if (stream.match(exp)) {
                    stream.eatSpace();
                    var nextChar = stream.peek();
                    if (nextChar && nextChar.match(/(\(|[a-zA-Z])/)) return "atom";
                    if (nextChar && nextChar.match(/(\-|,|;|{|=)/)) return "blue-strong"
                }
                if (stream.match("[")) {
                    for (; null != (ch = stream.next()) && "]" != ch;);
                    return "blue"
                }
                for (; null != stream.next() && !stream.match("[", !1);) return null;
                return null
            }
        }
    }), $anchorScroll.yOffset = 70, $rootScope.loggedin = userService.isAuthenticated(), $rootScope.loggedInUser = angular.fromJson(sessionStorage.getItem("userProfile")), $rootScope.loggedin && userService.getCurrent().then(function(a) {
        $rootScope.loggedInUser = a, sessionStorage.setItem("userProfile", angular.toJson(a))
    }), $rootScope.$on("$stateChangeStart", function(a, b, c, d) {
        function e(a, b) {
            for (rUser in a)
                for (rPage in b)
                    if (a[rUser].name === b[rPage]) return !0;
            return !1
        }

        function f(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                if (d == a) return !0
            }
            return !1
        }
        if ("login" == b.name) {
            a.preventDefault();
            var g = loginModal.show();
            return void(d && d.name || g.then(function() {
                $location.path("/")
            }, function() {
                $location.path("/")
            }))
        }
        if (!c.warningChecked && ("playground.section.editor.composer" == b.name && "playground.section.editor.qasm" == d.name || "playground.section.editor.composer" == d.name && "playground.section.editor.qasm" == b.name)) {
            a.preventDefault();
            var h = "Warning, moving to the composer could modify your existing QASM code. Do you want to continue?",
                i = "Warning, moving to the qasm editor could modify the arragment of gates in your score. Do you want to continue?",
                j = "playground.section.editor.composer" == b.name ? h : i,
                k = '<div class="modal-body">' + j + "</div>";
            k += '<div class="modal-footer"><button class="btn btn-warning" ng-click="ok()">OK</button><button class="btn btn-default" ng-click="cancel()">Cancel</button></div>';
            var l = $uibModal.open({
                template: k,
                controller: ["$scope", "$uibModalInstance", function(a, b) {
                    a.ok = function() {
                        b.close()
                    }, a.cancel = function() {
                        b.dismiss("cancel")
                    }
                }]
            });
            l.result.then(function() {
                c.warningChecked = !0, c.codeId = void 0, $state.go(b, c)
            }, function() {})
        } else c.warningChecked && (c.warningChecked = !1);
        b["private"] && !userService.isAuthenticated() ? (a.preventDefault(), $rootScope.loggedInUser = void 0, b.params = c, loginModal.show().then(function(a) {
            var c;
            b && b.url.indexOf("login") == -1 && (c = b), c ? $state.go(c, c.params) : $location.path("/")
        })) : b["private"] && userService.isAuthenticated() && (b.roles && b.roles.length > 0 ? userService.getCurrentWithRoles().then(function(c) {
            e(c.roles, b.roles) || (a.preventDefault(), $window.location.href = "/errors/403.html")
        }) : b.userTypes && b.userTypes.length > 0 && userService.getCurrentWithUserType().then(function(c) {
            f(c.userType.type, b.userTypes) || (a.preventDefault(), $window.location.href = "/errors/403.html")
        }))
    });
    var html = '<div style="position:absolute;left:-9999cm;top:-9999cm;visibility:hidden;">                <svg id="hiddenSymbols" xmlns="http://www.w3.org/2000/svg"></svg>              </div>';
    appendHtml(document.body, html)
}]);
var mod = angular.module("dragDrop", []);
mod.factory("dragContext", ["$rootElement", function(a) {
    function b() {
        return angular.extend(d, {
            data: null,
            reset: b,
            start: c
        })
    }

    function c(a) {
        return d.data = a, a
    }
    var d = {};
    return b()
}]), mod.run(["$rootElement", "$timeout", function(a, b) {
    function c(c) {
        b(function() {
            a.removeClass("drag-active")
        })
    }
    a[0].addEventListener("dragend", c, !0)
}]), mod.directive("dragContainer", ["$rootElement", "$parse", "$timeout", "dragContext", function(a, b, c, d) {
    return {
        restrict: "A",
        link: function(e, f, g) {
            function h(b) {
                var h = g.dragData ? JSON.stringify(e.$eval(g.dragData)) : "";
                if (b.dataTransfer ? b.dataTransfer.setData("text", h) : b.originalEvent.dataTransfer.setData("text", h), c(function() {
                        a.addClass("drag-active")
                    }, 0, !1), d.start(g.dragData ? e.$eval(g.dragData) : f), f.addClass("drag-container-active"), j) {
                    var i = {
                        $event: b,
                        $dragData: d.data
                    };
                    e.$apply(function() {
                        j(e, i)
                    })
                }
            }

            function i(b) {
                if (c(function() {
                        a.removeClass("drag-active")
                    }, 0, !1), f.removeClass("drag-container-active"), k) {
                    var g = {
                        $event: b,
                        $dragData: d.data
                    };
                    e.$apply(function() {
                        k(e, g)
                    })
                }
                d.lastTarget && d.lastTarget.$attrs.$removeClass("drag-over")
            }
            var j = g.onDragStart ? b(g.onDragStart) : null,
                k = g.onDragEnd ? b(g.onDragEnd) : null;
            g.$addClass("drag-container"), e.$watch(g.dragContainer, function(a) {
                g.$set("draggable", "undefined" == typeof a || a)
            }), f.on("dragstart", h), f.on("dragend", i)
        }
    }
}]), mod.directive("dropContainer", ["$document", "$parse", "$window", "dragContext", function(a, b, c, d) {
    function e(a) {
        return a[0] || a
    }

    function f(b) {
        b = e(b);
        var d = b.getBoundingClientRect();
        return {
            width: Math.round(angular.isNumber(d.width) ? d.width : b.offsetWidth),
            height: Math.round(angular.isNumber(d.height) ? d.height : b.offsetHeight),
            top: Math.round(d.top + (c.pageYOffset || a[0].documentElement.scrollTop)),
            left: Math.round(d.left + (c.pageXOffset || a[0].documentElement.scrollLeft))
        }
    }
    return {
        restrict: "A",
        link: function(a, c, e, g) {
            function h(b) {
                d.lastTarget && d.lastTarget !== c && d.lastTarget.$attrs.$removeClass("drag-over"), d.lastTarget = {
                    $attrs: e,
                    $element: c
                };
                var f = {
                    $event: b,
                    $dragData: d.data
                };
                l(a, f) && (b.preventDefault(), e.$addClass("drag-over"), m && a.$apply(function() {
                    m(a, f)
                }))
            }

            function i(b) {
                var g = {
                    $event: b,
                    $dragData: d.data
                };
                if (l(a, g)) {
                    b.preventDefault();
                    var h = f(c);
                    e.$addClass("drag-over");
                    Number.MAX_VALUE, h.width, h.height, b.pageX - h.left, b.pageY - h.top;
                    n && a.$apply(function() {
                        n(a, g)
                    })
                }
            }

            function j(b) {
                e.$removeClass("drag-over");
                var c = {
                    $event: b,
                    $dragData: d.data
                };
                a.$apply(function() {
                    o && o(a, c)
                })
            }

            function k(b) {
                d.lastTarget && d.lastTarget.$attrs.$removeClass("drag-over");
                var c = {
                    $event: b,
                    $dragData: d.data
                };
                l(a, c) && (b.preventDefault(), d.reset(), a.$apply(function() {
                    p && p(a, c)
                }))
            }
            var l = e.dropAccepts ? b(e.dropAccepts) : function(a, b) {
                    return "undefined" != typeof b.$dragData
                },
                m = e.onDragEnter ? b(e.onDragEnter) : null,
                n = e.onDragOver ? b(e.onDragOver) : null,
                o = e.onDragLeave ? b(e.onDragLeave) : null,
                p = e.onDrop ? b(e.onDrop) : null;
            e.$addClass("drop-container"), c.on("dragover", i), c.on("dragenter", h), c.on("dragleave", j), c.on("drop", k)
        }
    }
}]);
var plotXYZ = function(a, b, c, d, e, f, g, h) {
        plotXYZQ(a, b, [{
            x: c,
            y: d,
            z: e,
            q: f
        }], !1, g, h)
    },
    plotXYZQ = function(a, b, c, d, e, f) {
        function g(a, b) {
            var c = a.x,
                d = a.y,
                e = a.z,
                f = qubitColors[a.q % 5];
            r = Math.sqrt(c * c + d * d + e * e);
            var g = 1;
            r > 1 && (g = 1 / r), x0 = g * c, y0 = g * d, z0 = g * e, subx = (y0 - x0) * t * u, suby = -z0 + (x0 + y0) * t * v, radio2 = Math.sqrt(subx * subx + suby * suby), radio2 > 1 && (g = 1 / radio2, subx *= g, suby *= g), p.x = n.x + subx * o, p.y = n.y + suby * o;
            var h = (k.circle(n.x, n.y, .03 * o).attr({
                    fill: f,
                    opacity: .5
                }), k.circle(n.x, n.y, .07 * o).attr({
                    fill: f,
                    opacity: 1
                })),
                i = k.line(n.x, n.y, n.x, n.y).attr({
                    stroke: f,
                    strokeWidth: 2,
                    opacity: .5,
                    "fill-opacity": .5
                });
            i.animate({
                x2: p.x,
                y2: p.y
            }, 400), h.animate({
                cx: p.x,
                cy: p.y
            }, 400)
        }

        function h() {
            k.circle(n.x, n.y, o).attr({
                fill: "none",
                stroke: w.lineBackColor,
                strokeWidth: w.sphere.strokeWidth,
                "fill-opacity": w.sphere.opacity
            }), k.ellipse(n.x, n.y, o, o * q / 60).attr({
                fill: "none",
                stroke: w.lineBackColor,
                strokeWidth: w.subCircle.strokeWidth,
                strokeDasharray: "4",
                strokeDashoffset: 100,
                "fill-opacity": w.subCircle.opacity
            });
            if (c.length > 1) {
                var a = .7,
                    e = .68;
                k.ellipse(n.x, n.y + o * a, o * e, o * e * q / 60).attr({
                    fill: "none",
                    stroke: w.lineBackColor,
                    strokeWidth: w.subCircle.strokeWidth,
                    strokeDasharray: "4",
                    strokeDashoffset: 100,
                    "fill-opacity": w.subCircle.opacity
                }), k.ellipse(n.x, n.y - o * a, o * e, o * e * q / 60).attr({
                    fill: "none",
                    stroke: w.lineBackColor,
                    strokeWidth: w.subCircle.strokeWidth,
                    strokeDasharray: "4",
                    strokeDashoffset: 100,
                    "fill-opacity": w.subCircle.opacity
                })
            }
            i(), d || k.text(m + l.width / 4, l.height, b).attr({
                fill: w.axisColor
            })
        }

        function i() {
            var a = {
                    stroke: w.axisColor,
                    strokeWidth: 1,
                    strokeDasharray: "1",
                    strokeDashoffset: 100
                },
                b = {
                    stroke: w.axisColorNegative,
                    strokeWidth: 1,
                    strokeDasharray: "1",
                    strokeDashoffset: 100
                };
            k.line(n.x, n.y, n.x + 1.1 * o * u, n.y + 1.1 * o * v).attr(a), k.line(n.x, n.y, n.x + o * -1.1 * u, n.y + o * -1.1 * v).attr(b), k.line(n.x, n.y, n.x, n.y - 1.2 * o).attr(a), k.line(n.x, n.y, n.x, n.y - o * -1.2).attr(b), k.line(n.x, n.y, n.x - 1.1 * o * u, n.y + 1.1 * o * v).attr(a), k.line(n.x, n.y, n.x - o * -1.1 * u, n.y + o * -1.1 * v).attr(b)
        }

        function j() {
            var a = {
                stroke: w.axisColor,
                strokeWidth: 1,
                "fill-opacity": .5
            };
            k.line(n.x, n.y, n.x + 1.1 * o * u, n.y + 1.1 * o * v).attr(a), k.line(n.x, n.y, n.x, n.y - 1.2 * o).attr(a), k.line(n.x, n.y, n.x - 1.1 * o * u, n.y + 1.1 * o * v).attr(a);
            k.text(n.x + 1.2 * o * u + 5, n.y + 1.2 * o * v + 3, "y").attr({
                fill: w.axisColor
            }), k.text(n.x - 4, n.y - 1.2 * o - 6, "z").attr({
                fill: w.axisColor
            }), k.text(n.x - o - 14, n.y + o - 18, "x").attr({
                fill: w.axisColor
            })
        }
        var k = Snap(a),
            l = {
                height: 150,
                width: 150
            } || e,
            m = 0,
            n = {
                x: m + l.width / 2,
                y: l.height / 2
            },
            o = l.height / 3,
            p = {},
            q = 20,
            s = Math.PI / 180 * q,
            t = .707,
            u = Math.cos(s),
            v = Math.sin(s),
            w = {
                lineBackColor: "#494949",
                gradientMainColor: "#d853e3",
                gradientSecondColor: "#9957e5",
                axisColor: "#696969",
                axisColorNegative: "#a4a4a4",
                sphere: {
                    strokeWidth: .4,
                    opacity: .6
                },
                subCircle: {
                    strokeWidth: .4,
                    opacity: .4
                }
            } || f;
        k.attr({
            viewBox: "-10 -10 " + (l.width + 20) + " " + (l.height + 20)
        }), qubitColors = ["#FF3B43", "#FF9B43", "#FFD700", "#58D447", "#149AE1"], h(), d || j(), c.forEach(g)
    },
    plotXYZ3D = function(a, b, c) {
        function d(a) {
            var b = a.radius || 100,
                c = a.resolution || 30,
                d = a.color || 255,
                e = a.opacity || .5,
                f = new THREE.MeshLambertMaterial({
                    transparent: !0,
                    color: d,
                    emissive: d,
                    opacity: e,
                    depthWrite: !1
                }),
                g = new THREE.Mesh(new THREE.SphereGeometry(b, c, c), f);
            return g.position.set(a.p.x, a.p.y, a.p.z), g
        }

        function e(a) {
            var b = a.p2 || {},
                c = b.x || 0,
                d = b.y || 0,
                e = b.z || 0,
                f = a.stroke || 1,
                g = a.color || 255,
                h = new THREE.Geometry;
            h.vertices.push(new THREE.Vector3(a.p.x, a.p.y, a.p.z)), h.vertices.push(new THREE.Vector3(c, d, e));
            var i = new THREE.Line(h, new THREE.LineBasicMaterial({
                color: g,
                linewidth: f
            }));
            return i
        }

        function f(a) {
            var b = a.p.x || 0,
                c = a.p.y || 0,
                d = a.p.z || 0,
                e = a.radius || 100,
                f = (a.opacity || .5, a.stroke || 1),
                g = a.color || 255,
                h = new THREE.Shape;
            h.absarc(0, 0, e, -7, 2 * Math.PI, !1);
            var i = h.createSpacedPointsGeometry();
            i.computeLineDistances();
            var j = new THREE.Line(i, new THREE.LineDashedMaterial({
                color: g,
                dashSize: 15,
                gapSize: 20,
                linewidth: f
            }));
            return j.position.set(b, c, d), j.rotation.set(Math.PI / 2, 0, 0), j
        }

        function g(a) {
            w.add(f(a))
        }

        function h(a) {
            w.add(d(a))
        }

        function i(a) {
            w.add(e(a))
        }

        function j() {
            for (var a = 0; a < o.length; a++) w.add(o[a]), w.add(p[a])
        }

        function k() {
            h({
                p: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                radius: 200,
                color: 2236962,
                opacity: .1
            }), i({
                p: {
                    x: -200,
                    y: 0,
                    z: 0
                },
                p2: {
                    x: 200,
                    y: 0,
                    z: 0
                },
                color: 12303291,
                stroke: 1
            }), i({
                p: {
                    x: 0,
                    y: -200,
                    z: 0
                },
                p2: {
                    x: 0,
                    y: 200,
                    z: 0
                },
                color: 12303291,
                stroke: 1
            }), i({
                p: {
                    x: 0,
                    y: 0,
                    z: -200
                },
                p2: {
                    x: 0,
                    y: 0,
                    z: 200
                },
                color: 12303291,
                stroke: 1
            }), g({
                p: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                radius: 201,
                color: 11184810,
                stroke: 1
            })
        }

        function l() {
            x = new THREE.WebGLRenderer({
                antialias: !0,
                alpha: !0,
                preserveDrawingBuffer: !0
            }), x.setPixelRatio(window.devicePixelRatio), x.setSize(A.width, A.height), z.innerHTML = "", z.appendChild(x.domElement), x.gammaInput = !0, x.gammaOutput = !0, x.shadowMap.enabled = !0, x.shadowMap.type = THREE.PCFSoftShadowMap, v = new THREE.PerspectiveCamera(40, A.width / A.height, 1, 2e3), v.position.set(500, 200, 500), w = new THREE.Scene, w.add(v), w.add(new THREE.AmbientLight(2236962));
            var a = new THREE.DirectionalLight(16777215, 1);
            a.position.set(200, 450, 500), y = new THREE.OrbitControls(v, x.domElement), y.enableZoom = !1, y.target.set(0, 0, 0)
        }

        function m() {
            requestAnimationFrame(m), n()
        }

        function n() {
            x.render(w, v)
        }
        for (var o = [], p = [], q = 0; q < c.length; q++) {
            var r = parseFloat(c[q].x);
            r < -1 && (r = -1), r > 1 && (r = 1);
            var s = parseFloat(c[q].y);
            s < -1 && (s = -1), s > 1 && (s = 1);
            var t = parseFloat(c[q].z);
            t < -1 && (t = -1), t > 1 && (t = 1), p0 = {
                x: 0,
                y: 0,
                z: 0
            }, p1 = {
                x: 200 * s,
                y: 200 * t,
                z: 200 * r
            }, unit = Math.sqrt(p1.x * p1.x + p1.y * p1.y + p1.z * p1.z), unit > 0 && (p1 = {
                x: p1.x / unit * 200,
                y: p1.y / unit * 200,
                z: p1.z / unit * 200
            });
            var u = {};
            u.p = p0, u.p2 = p1, u.stroke = 2, u.color = qubitColors[c[q].q % 5], o.push(e(u)), u = {}, u.p = p1, u.radius = 10, u.color = qubitColors[c[q].q % 5], p.push(d(u))
        }
        var v, w, x, y, z = document.getElementById(a),
            A = {
                height: 156,
                width: 156
            } || plotSize;
        ({
            lineBackColor: "#494949",
            gradientMainColor: "#d853e3",
            gradientSecondColor: "#9957e5",
            axisColor: "#696969",
            axisColorNegative: "#a4a4a4",
            sphere: {
                strokeWidth: .4,
                opacity: .6
            },
            subCircle: {
                strokeWidth: .4,
                opacity: .4
            }
        }) || config;
        l(), k(), j(), m()
    };
String.prototype.count = function(a) {
    return (this.length - this.replace(new RegExp(a, "g"), "").length) / a.length
};
var qsphere = function(a, b) {
    function c(a, b, c, d, e) {
        var f = 2,
            g = 1,
            l = H;
        b || (g = -1, l = I), k({
            p: {
                x: 0,
                y: 198 * g,
                z: 0
            },
            radius: 30,
            color: l[0],
            stroke: f
        });
        var m = {};
        if (m.p = {}, m.p.x = 0, m.p.y = 198 * g, m.p.z = 0, b) var n = d[0];
        else {
            var n = d.pop();
            d.unshift(0), c.pop(), c.unshift(0)
        }
        switch (m.radius = 10, n > .7 ? m.stroke = 10 * n : n > .2 ? (m.stroke = 5 * n, m.radius = m.radius / 1.2) : (m.stroke = n, m.radius = m.radius / 1.8), n > 0 ? (m.color = l[0], m.opacity = .8) : (m.stroke = 1, m.color = 10855845, m.radius = 5), i({
            p: {
                x: 0,
                y: 198 * g,
                z: 0
            },
            radius: m.radius,
            color: m.color,
            opacity: m.opacity
        }), n < .1 && (m.color = 5592405, m.opacity = .1), j(m), a) {
            case 2:
                b && (k({
                    p: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 201,
                    color: l[3],
                    stroke: f
                }), h({
                    spheres: 2 * c[1],
                    values: d.splice(1, c[1]).concat(e.splice(0, c[1])),
                    gradius: 201,
                    p: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    radius: 10,
                    color: l[3],
                    opacity: .8
                }));
                break;
            case 3:
                k({
                    p: {
                        x: 0,
                        y: 150 * g,
                        z: 0
                    },
                    radius: 135,
                    color: l[1],
                    stroke: f
                });
                var o = d.splice(1, c[1]);
                g < 0 && (o = o.reverse()), h({
                    spheres: c[1],
                    values: o,
                    gradius: 135,
                    p: {
                        x: 0,
                        y: 150 * g,
                        z: 0
                    },
                    radius: 10,
                    color: l[1],
                    opacity: .8
                });
                break;
            case 4:
                if (b) {
                    k({
                        p: {
                            x: 0,
                            y: 150 * g,
                            z: 0
                        },
                        radius: 135,
                        color: l[1],
                        stroke: f
                    });
                    var o = d.splice(1, c[1]);
                    g < 0 && (o = o.reverse()), h({
                        spheres: c[1],
                        values: o,
                        gradius: 135,
                        p: {
                            x: 0,
                            y: 150 * g,
                            z: 0
                        },
                        radius: 10,
                        color: l[1],
                        opacity: .8
                    }), k({
                        p: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        radius: 201,
                        color: l[3],
                        stroke: f
                    }), o = d.splice(1, c[2]).concat(e.splice(0, c[2]).reverse()), h({
                        spheres: 2 * c[2],
                        values: o,
                        gradius: 201,
                        p: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        radius: 10,
                        color: l[3],
                        opacity: .8
                    })
                } else {
                    k({
                        p: {
                            x: 0,
                            y: 150 * g,
                            z: 0
                        },
                        radius: 135,
                        color: l[1],
                        stroke: f
                    });
                    var o = d.splice(4, c[2]);
                    g < 0 && (o = o.reverse()), h({
                        spheres: c[2],
                        values: o,
                        gradius: 135,
                        p: {
                            x: 0,
                            y: 150 * g,
                            z: 0
                        },
                        radius: 10,
                        color: l[1],
                        opacity: .8
                    })
                }
                break;
            case 5:
                var p = {
                        y: 150,
                        r: 135,
                        c: l[1]
                    },
                    q = {
                        y: 75,
                        r: 186,
                        c: l[2]
                    };
                b || (p = {
                    y: 75,
                    r: 186,
                    c: l[2]
                }, q = {
                    y: 150,
                    r: 135,
                    c: l[1]
                }), k({
                    p: {
                        x: 0,
                        y: p.y * g,
                        z: 0
                    },
                    radius: p.r,
                    color: p.c,
                    stroke: f
                });
                var o = d.splice(1, c[1]);
                g < 0 && (o = o.reverse()), h({
                    spheres: c[1],
                    values: o,
                    gradius: p.r,
                    p: {
                        x: 0,
                        y: p.y * g,
                        z: 0
                    },
                    radius: 10,
                    color: p.c,
                    opacity: .8
                }), k({
                    p: {
                        x: 0,
                        y: q.y * g,
                        z: 0
                    },
                    radius: q.r,
                    color: q.c,
                    stroke: f
                }), o = d.splice(1, c[2]), g < 0 && (o = o.reverse()), h({
                    spheres: c[2],
                    values: o,
                    gradius: q.r,
                    p: {
                        x: 0,
                        y: q.y * g,
                        z: 0
                    },
                    radius: 10,
                    color: q.c,
                    opacity: .8
                })
        }
    }

    function d() {
        i({
            p: {
                x: 0,
                y: 0,
                z: 0
            },
            radius: 200,
            color: 2236962,
            opacity: .1
        }), j({
            p: {
                x: -200,
                y: 0,
                z: 0
            },
            p2: {
                x: 200,
                y: 0,
                z: 0
            },
            color: 12303291,
            stroke: 1
        }), j({
            p: {
                x: 0,
                y: -200,
                z: 0
            },
            p2: {
                x: 0,
                y: 200,
                z: 0
            },
            color: 12303291,
            stroke: 1
        }), j({
            p: {
                x: 0,
                y: 0,
                z: -200
            },
            p2: {
                x: 0,
                y: 0,
                z: 200
            },
            color: 12303291,
            stroke: 1
        })
    }

    function e() {
        B = new THREE.WebGLRenderer({
                antialias: !0,
                alpha: !0,
                preserveDrawingBuffer: !0
            }), B.setPixelRatio(window.devicePixelRatio), B.setSize(E.width, E.height), D.innerHTML = "", D.appendChild(B.domElement), B.gammaInput = !0, B.gammaOutput = !0, B.shadowMap.enabled = !0, B.shadowMap.type = THREE.PCFSoftShadowMap, z = new THREE.PerspectiveCamera(40, E.width / E.height, 1, 2e3), z.position.set(500, 200, 500), A = new THREE.Scene, A.add(z),
            A.add(new THREE.AmbientLight(2236962));
        var a = new THREE.DirectionalLight(16777215, 1);
        a.position.set(200, 450, 500), C = new THREE.OrbitControls(z, B.domElement), C.enableZoom = !1, C.target.set(0, 0, 0)
    }

    function f() {
        requestAnimationFrame(f), g()
    }

    function g() {
        B.render(A, z)
    }

    function h(a) {
        var b = a.gradius || 100,
            c = (a.color || 255, a.opacity || .5, 2 * Math.PI / a.spheres),
            d = 0;
        a.p.y < 0 && (d = Math.PI);
        for (var e = 0; e < a.spheres; e++) {
            var f = a,
                g = {};
            if (g.radius = f.radius, f.p.x = b * Math.cos(d), f.p.z = b * Math.sin(d), g.p = f.p, parseFloat(f.values[e]) > 0) {
                g.color = a.color;
                var h = f.values[e];
                h > .7 ? g.stroke = 10 * h : h > .2 ? (g.stroke = 5 * h, g.radius = g.radius / 1.2) : (g.stroke = h, g.radius = g.radius / 1.8, h < .1 && (g.color = 5592405, g.opacity = .1)), j(g), g.opacity = .8, g.color = a.color, i(g)
            } else g.color = 10855845, g.radius = g.radius / 2, i(g), g.stroke = .5, g.color = 5592405, g.opacity = .1, j(g);
            d += c
        }
    }

    function i(a) {
        var b = a.radius || 100,
            c = a.resolution || 30,
            d = a.color || 255,
            e = a.opacity || .5,
            f = new THREE.MeshLambertMaterial({
                transparent: !0,
                color: d,
                emissive: d,
                opacity: e,
                depthWrite: !1
            }),
            g = new THREE.Mesh(new THREE.SphereGeometry(b, c, c), f);
        g.position.set(a.p.x, a.p.y, a.p.z), A.add(g)
    }

    function j(a) {
        var b = a.p2 || {},
            c = b.x || 0,
            d = b.y || 0,
            e = b.z || 0,
            f = a.stroke || 1,
            g = a.opacity || 1,
            h = a.color || 255,
            i = new THREE.Geometry;
        i.vertices.push(new THREE.Vector3(a.p.x, a.p.y, a.p.z)), i.vertices.push(new THREE.Vector3(c, d, e));
        var j = new THREE.Line(i, new THREE.LineBasicMaterial({
            color: h,
            opacity: g,
            transparent: !0,
            linewidth: f
        }));
        A.add(j)
    }

    function k(a) {
        var b = a.p.x || 0,
            c = a.p.y || 0,
            d = a.p.z || 0,
            e = a.radius || 100,
            f = (a.opacity || .5, a.stroke || 1),
            g = a.color || 255,
            h = new THREE.Shape;
        h.absarc(0, 0, e, -7, 2 * Math.PI, !1);
        var i = h.createSpacedPointsGeometry(),
            j = new THREE.Line(i, new THREE.LineBasicMaterial({
                color: g,
                transparent: !0,
                linewidth: f
            }));
        j.position.set(b, c, d), j.rotation.set(Math.PI / 2, 0, 0), A.add(j)
    }
    for (var l = b.qubits.length, m = pascalSimple(l + 1), n = Math.pow(2, l), o = b.labels, p = {}, q = 0; q < o.length; q++) p[parseInt(o[q], 2)] = b.values[q];
    for (var q = 0; q < n; q++) p[q] || (p[q] = 0);
    var r = Object.keys(p).map(function(a) {
        return p[a]
    });
    r = reOrderValues(r, l);
    var s = Math.ceil(r.length / 2),
        t = r.splice(0, s),
        u = r,
        v = [],
        w = [];
    if (m.length % 2 === 0) {
        var x = Math.ceil(m.length / 2);
        v = m.splice(0, x), w = m
    } else {
        var x = Math.floor(m.length / 2);
        v = m.splice(0, x);
        var y = m[0];
        v.push(y / 2), w = v.slice().reverse()
    }
    var z, A, B, C, D = document.getElementById(a),
        E = {
            height: 400,
            width: 400
        } || plotSize,
        F = {
            red: 16737894,
            orange: 16752669,
            yellow: 16771869,
            yellow2: 14740317,
            green: 11397981,
            blue: 9366473,
            blue2: 6532297,
            grey: 8421504,
            axis: 12303291
        },
        G = {
            blue2: 6532297,
            blue: 9366473,
            green: 11397981,
            yellow2: 14740317,
            red: 16737894,
            orange: 16752669,
            yellow: 16771869,
            grey: 8421504,
            axis: 12303291
        },
        H = Object.keys(F).map(function(a) {
            return F[a]
        }),
        I = Object.keys(G).map(function(a) {
            return G[a]
        });
    ({
        lineBackColor: "#494949",
        gradientMainColor: "#d853e3",
        gradientSecondColor: "#9957e5",
        axisColor: "#696969",
        axisColorNegative: "#a4a4a4",
        sphere: {
            strokeWidth: .4,
            opacity: .6
        },
        subCircle: {
            strokeWidth: .4,
            opacity: .4
        }
    }) || config;
    e(), d();
    var J = u.slice(),
        K = t.slice();
    c(l, !0, v, t, J), c(l, !1, w, u, K), f()
};
Snap.plugin(function(a, b, c, d) {
    b.prototype.getRealBBox = function() {
        var b = this.getBBox();
        if (0 == b.height && 0 == b.width) {
            var c = a("#hiddenSymbols");
            if (c) {
                var d = this;
                try {
                    d = this.clone()
                } catch (e) {}
                c.append(d), b = d.getBBox(), d.remove()
            }
        }
        return b
    }, b.prototype.getCenter = function() {
        var a = this.getRealBBox();
        return {
            x: a.cx,
            y: a.cy
        }
    }, b.prototype.getSize = function(a) {
        var b = this.getRealBBox(),
            c = {
                w: Math.round(1e3 * b.width) / 1e3,
                h: Math.round(1e3 * b.height) / 1e3
            };
        return c
    }, b.prototype.show = function() {
        this.attr("display", "")
    }, b.prototype.hide = function() {
        this.attr("display", "none")
    }, b.prototype.getPos = function() {
        var a = this.getBBox();
        return {
            x: a.x,
            y: a.y
        }
    }, b.prototype.getTransformRelative = function(a, b, c, d, e) {
        var f = 0,
            g = 0;
        switch (b) {
            case "center":
                var h = a.getCenter(),
                    i = this.getPos(),
                    j = this.getSize(),
                    f = h.x - j.w / 2,
                    g = h.y - j.h / 2;
                f = i.x > f ? 0 - (i.x - f) : f - i.x, g = i.y > g ? 0 - (i.y - g) : g - i.y;
                break;
            case "topleft":
                var k = a.getPos(),
                    i = this.getPos();
                f = i.x > k.x ? 0 - (i.x - k.x) : k.x - i.x, g = i.y > k.y ? 0 - (i.y - k.y) : k.y - i.y;
                break;
            case "bottomleft":
                var k = a.getPos(),
                    i = this.getPos();
                f = i.x > k.x ? 0 - (i.x - k.x) : k.x - i.x, g = i.y > k.y2 ? 0 - (i.y - k.y2) : k.y2 - i.y;
                break;
            case "topright":
                var k = a.getPos(),
                    l = a.getSize(),
                    j = this.getSize(),
                    i = this.getPos();
                f = i.x > k.x ? 0 - (i.x - k.x) : k.x - i.x, g = i.y > k.y ? 0 - (i.y - k.y) : k.y - i.y, f += l.w - j.w;
                break;
            case "bottomright":
                var k = a.getBBox(),
                    l = a.getSize(),
                    j = this.getSize(),
                    i = this.getPos();
                f = i.x > k.x2 ? 0 - (i.x - k.x2) : k.x2 - i.x, g = i.y > k.y2 ? 0 - (i.y - k.y2) : k.y2 - i.y;
                break;
            case "topcenter":
                var h = a.getCenter(),
                    m = a.getPos(),
                    i = this.getPos(),
                    j = this.getSize(),
                    f = h.x - j.w / 2;
                f = i.x > f ? 0 - (i.x - f) : f - i.x, g = i.y > m.y ? 0 - (i.y - m.y) : m.y - i.y;
                break;
            case "bottomcenter":
                var h = a.getCenter(),
                    m = a.getBBox(),
                    i = this.getPos(),
                    j = this.getSize(),
                    f = h.x - j.w / 2;
                f = i.x > f ? 0 - (i.x - f) : f - i.x, g = i.y > m.y2 ? 0 - (i.y - m.y2) : m.y2 - i.y;
                break;
            case "leftcenter":
                var h = a.getCenter(),
                    m = a.getPos(),
                    i = this.getPos(),
                    j = this.getSize(),
                    g = h.y - j.h / 2;
                f = i.x > m.x ? 0 - (i.x - m.x) : m.x - i.x, g = i.y > g ? 0 - (i.y - g) : g - i.y;
                break;
            case "rightcenter":
                var h = a.getCenter(),
                    n = a.getBBox(),
                    i = this.getPos(),
                    j = this.getSize(),
                    g = h.y - j.h / 2;
                f = i.x > n.x2 ? 0 - (i.x - n.x2) : n.x2 - i.x, g = i.y > g ? 0 - (i.y - g) : g - i.y;
                break;
            default:
                console.log("ERROR: Unknown transform type in getTransformRelative!")
        }
        return "undefined" == typeof d && (d = 0), "undefined" == typeof e && (e = 0), f += d, g += e, c ? "T" + f + "," + g : "t" + f + "," + g
    }
}), Snap.plugin(function(a, b, c, d) {
    var e = b.prototype;
    e.toBack = function() {
        this.prependTo(this.paper)
    }, e.toFront = function() {
        this.appendTo(this.paper)
    }
}), angular.module("qubitsApp").directive("gateSvg", ["gatesSVGFactory", function(a) {
    var b = 1;
    return {
        replace: !0,
        scope: {
            gate: "=",
            dragStartFunction: "=",
            dragEndFunction: "="
        },
        template: '<div drag-container drag-data="gate" on-drag-start="dragStartFunction($event, gate)" on-drag-end="dragEndFunction($event, gate)" style="width: 100%; height: 0; margin: 0 auto; position: relative;">                 <svg id="{{::uniqueId}}" style="position: absolute; top:0; left:0;" ></svg>               </div>',
        link: function(c, d, e) {
            c.uniqueId = "gateitem" + b++;
            var f = Snap(d.children()[0]),
                g = {
                    width: 50,
                    height: 50
                };
            f.attr({
                viewBox: "0 0 " + g.width + " " + g.height
            }), d[0].style.paddingTop = Math.round(g.height / g.width * 100) + "%", a.getGateSVG(c.gate).then(function(b) {
                void 0 == b.gateLabel && (b.gateLabel = a.getDefaultGateLabel(f, c.gate, b.background)), f.append(b.background), f.append(b.gateLabel);
                var d = f.getSize(),
                    e = Math.max(d.w, d.h) + 10;
                g.width = e, g.height = e, f.attr({
                    viewBox: "0 0 " + g.width + " " + g.height
                }), node = f.group(b.background, b.gateLabel), node.transform("T" + (g.width / 2 - node.getSize().w / 2) + "," + (g.height / 2 - node.getSize().h / 2))
            }, function(a) {
                var b = f.rect(0, 0, nodeWidth, nodeHeight);
                b.attr({
                    fill: "#fff"
                });
                var c = f.text(10, 30, data.name);
                c.attr({
                    fill: "#000"
                }), node = f.group(b, c)
            })
        }
    }
}]), angular.module("qubitsApp").directive("imgQasm", ["$q", "Code", "$uibModal", "$timeout", "playgroundFactory", "jsonQasmParser", function(a, b, c, d, e, f) {
    function g(a, c, e) {
        if (!a) return void e({
            error: "ERROR"
        });
        if (a.displayUrls && a.displayUrls[c]) e(null, {
            url: a.displayUrls[c],
            sync: !0
        });
        else {
            var f = a.id || a.codeId;
            d(function() {
                b.getCodeImageUrl({
                    id: f,
                    format: c
                }, function(a) {
                    return e(null, {
                        url: a.url,
                        sync: !1
                    })
                }, function(a) {
                    return e(a)
                })
            }, 200)
        }
    }
    return {
        restrict: "E",
        replace: !0,
        scope: {
            code: "=",
            format: "@",
            hideButtons: "=?",
            downloadDisabled: "="
        },
        templateUrl: "templates/imgQasm.html",
        link: function(b, h, i) {
            b.hideButtons = !0, b.performingAction = !1, b.format = b.format || "svg", e.getTopologyFromCode(b.code).then(function(a) {
                b.topology = a
            }), d(function() {
                b.code && g(b.code, b.format, function(a, c) {
                    if (a || !c) return void(b.hideButtons = !0);
                    b.hideButtons = !1;
                    var d = c.url;
                    b.code.displayUrls || (b.code.displayUrls = {}), b.code.displayUrls[b.format] = d
                })
            }), b.zoomImage = function() {
                c.open({
                    animation: b.animationsEnabled,
                    template: '<img-qasm code="code" format="{{format}}" hide-buttons="true"></img-qasm>',
                    controller: "executionController",
                    size: "extralarge",
                    scope: b
                })
            }, b.exportQasm = function() {
                var a = b.code.name || "myCode",
                    c = b.code.qasm.replace('include "stdlib.inc";\n', "");
                f.downloadQASM(b.code.id, void 0, c, a)
            }, b.exportImage = function(c) {
                var e = a.defer();
                return b.performingAction = !0, g(b.code, c, function(a, f) {
                    if (b.performingAction = !1, a || !f) return e.reject();
                    var g = f.url;
                    b.code.displayUrls || (b.code.displayUrls = {}), b.code.displayUrls[c] = g, f.sync ? window.open(g, "_blank") : (b.displayMessage = '<a class="text-info" href="' + f.url + '" target="_blank">Your image has been generated, click here to display it</a>', d(function() {
                        b.displayMessage = void 0
                    }, 1e4)), e.resolve()
                }), e.promise
            }
        },
        controller: "executionController"
    }
}]), angular.module("qubitsApp").directive("mathjaxFormula", ["$q", "$compile", "$timeout", function(a, b, c) {
    return {
        restrict: "E",
        replace: !0,
        scope: {
            value: "="
        },
        template: '<span class="mathjax"></span>',
        link: function(a, d, e) {
            a.$watch("value", function() {
                var e = '<span class="mathjax">{{value}}</span>';
                d.html(e), b(d.contents())(a), c(function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub])
                })
            })
        }
    }
}]), app.directive("qasmExpression", function() {
    return {
        require: "ngModel",
        link: function(a, b, c, d) {
            d.$validators.qasmExpresion = function(a, b) {
                if (d.$isEmpty(a)) return !1;
                try {
                    return expressionParser.parse(b), !0
                } catch (c) {
                    return !1
                }
            }
        }
    }
}), app.directive("regName", function() {
    return {
        require: "ngModel",
        link: function(a, b, c, d) {
            d.$validators.regName = function(a, b) {
                if (d.$isEmpty(a)) return !1;
                try {
                    return regNameParser.parse(b), !0
                } catch (c) {
                    return !1
                }
            }
        }
    }
}), angular.module("qubitsApp").directive("topologyDiagram", ["$timeout", "gatesSVGFactory", function(a, b) {
    return {
        replace: !0,
        scope: {
            topology: "=",
            qubitHandler: "&"
        },
        template: '<div><svg id="topologyDiagram" ></svg></div>',
        controller: ["$scope", "$element", "$attrs", function(b, c, d) {
            var e = {
                height: 40,
                width: 55
            };
            a(function() {
                if (b.topology.diagram) {
                    var a = Snap(c.children()[0]);
                    Snap.load(b.topology.diagram, function(c) {
                        var d = c.selectAll("g");
                        a.attr({
                            viewBox: "0 0 " + e.width + " " + e.height
                        }), a.append(d);
                        for (var f = a.selectAll(".qubit"), g = 0; g < f.length; g++) {
                            var h = f[g];
                            "q" === h.node.id.charAt(0) && (h.mouseover(function() {
                                this.data("originalFill", this.select("circle").attr("fill")), this.select("circle").attr({
                                    fill: "#6d7978"
                                })
                            }), h.mouseout(function() {
                                this.select("circle").attr({
                                    fill: this.data("originalFill")
                                })
                            })), h.click(function() {
                                void 0 != b.qubitHandler && b.qubitHandler({
                                    qubitId: this.node.id
                                })
                            })
                        }
                    })
                }
            })
        }]
    }
}]), angular.module("qubitsApp").directive("gateBarrier", ["$q", "$timeout", "playgroundFactory", "visualQasmSettings", "svgSymbols", function(a, b, c, d, e) {
    var f = "barrier",
        g = "multiline",
        h = 12;
    return {
        restrict: "E",
        replace: !0,
        template: '<g visualqasmgate:type="barrier"></g>',
        templateNamespace: "svg",
        require: ["^^visualQasm", "^visualQasmGatesSet", "gateBarrier"],
        controller: ["$scope", "$element", function(i, j) {
            function k(a, b) {
                var c = m.VisualQasmController.getNumOfLines();
                a.linkedGates = [];
                for (var e = 0; e < c; e++) a.linkedGates.push({
                    i: e,
                    j: b.j
                }), m.VisualQasmController.modifyGatesMatrix(e * d.pointsPerLine + b.j, {
                    isBusy: !0
                })
            }

            function l(a) {
                var b = Snap(j[0]),
                    c = {
                        width: 20,
                        height: m.VisualQasmController.getLineHeight(m.VisualQasmController.getNumOfQubits() - 1) - m.VisualQasmController.getLineHeight(0) + 2 * h
                    },
                    d = {
                        x: a.x - c.width / 2,
                        y: m.VisualQasmController.getLineHeight(0) - h
                    },
                    f = e.getColumnRectangle(b, d.x, d.y, c.width, c.height);
                f.addClass("background");
                var g = b.group();
                return g.append(f), g
            }
            var m = this;
            this.addGate = function(b, d, e, f) {
                var g = Snap(j[0]),
                    h = a.defer(),
                    i = m.VisualQasmController.getCanvasCenter(f),
                    n = m.VisualQasmController.arrayPositionToIJ(f);
                if (m.VisualQasmController.isEditable() && !b.affectedLines) {
                    var o;
                    if (m.VisualQasmController.isColumnEmpty(f)) {
                        o = l(i);
                        m.VisualQasmController.getNumOfQubits();
                        b.affectedLines = []
                    } else b = c.getGateFromMatrix(n.j), m.VisualQasmController.clearNodeByPosition(n.j), o = m.drawBarrier(i, b.affectedLines);
                    m.VisualQasmController.lastGate = b, this.askUserToSelectMutilinePart(b, i, n).then(function(a) {
                        for (var c = a.from; c <= a.to; c++) b.affectedLines[c] = !0;
                        o.remove();
                        var d = m.drawBarrier(i, b.affectedLines);
                        k(b, n), h.resolve({
                            node: d,
                            gate: b,
                            arrayPosition: n.j
                        })
                    }, function(a) {
                        o && o.remove(), h.reject()
                    })
                } else {
                    var p;
                    m.VisualQasmController.isEditable() || (p = g.g());
                    var q = this.drawBarrier(i, b.affectedLines, p);
                    k(b, n), h.resolve({
                        node: q,
                        gate: b,
                        arrayPosition: n.j
                    })
                }
                return h.promise
            }, this.askUserToSelectMutilinePart = function(d, f, g) {
                var i = a.defer(),
                    j = m.VisualQasmController.getPaper(),
                    k = m.VisualQasmController.getLineHeight(g.i) - h,
                    l = m.VisualQasmController.getLineHeight(g.i) + h,
                    n = e.getDashedLine(j, f.x, k, f.x, l);
                b(function() {
                    m.VisualQasmController.toggleCircles(!0, g.j)
                }, 100);
                var o = function(a) {
                        if (m.VisualQasmController.toggleCircles(!1, g.j), j.unmousemove(p), j.unmousedown(o), n.remove(), m.VisualQasmController.lastGate == d) {
                            var b = c.getMouseEventPos(a, m.VisualQasmController.getUniqueId()),
                                e = m.VisualQasmController.getCanvasScale();
                            b.scale(e);
                            var h = m.VisualQasmController.findMatrixPosition({
                                x: f.x,
                                y: b.y
                            });
                            h.i >= m.VisualQasmController.getNumOfQubits() ? i.reject("Drop error") : i.resolve({
                                from: Math.min(g.i, h.i),
                                to: Math.max(g.i, h.i)
                            })
                        } else i.reject("Drop error")
                    },
                    p = function(a, b, e) {
                        if (m.VisualQasmController.lastGate == d) {
                            var h = c.getMouseEventPos(a, m.VisualQasmController.getUniqueId()),
                                k = m.VisualQasmController.getCanvasScale();
                            h.scale(k), n.updateEnd(f.x, h.y);
                            var l = m.VisualQasmController.findMatrixPosition({
                                x: f.x,
                                y: h.y
                            });
                            m.VisualQasmController.highlightCircle(l)
                        } else m.VisualQasmController.toggleCircles(!1, g.j), n.remove(), i.reject("Drop error"), j.unmousemove(p), j.unmousedown(o)
                    };
                return j.mousemove(p), j.mousedown(o), i.promise
            }, this.drawBarrier = function(a, b, c) {
                var d = Snap(j[0]);
                c || (c = l(a));
                for (var f, g, i = 0; i < b.length; i++) {
                    var k = b[i];
                    if (k) void 0 == g ? (g = i, f = i) : f = i;
                    else if (void 0 !== g) {
                        var n = m.VisualQasmController.getLineHeight(g) - h,
                            o = m.VisualQasmController.getLineHeight(f) + h,
                            p = e.getDashedLine(d, a.x, n, a.x, o);
                        c.append(p), g = void 0, f = void 0
                    }
                }
                if (void 0 !== g) {
                    var n = m.VisualQasmController.getLineHeight(g) - h,
                        o = m.VisualQasmController.getLineHeight(f) + h,
                        p = e.getDashedLine(d, a.x, n, a.x, o);
                    c.append(p)
                }
                return c
            }, this.canMoveGateToPosition = function(a, b) {
                var c = m.VisualQasmController.arrayPositionToIJ(b);
                return m.VisualQasmController.isColumnEmpty(c.j)
            }, this.canAddGateIntoPosition = function(a, b) {
                var d = m.VisualQasmController.arrayPositionToIJ(b),
                    e = c.getGateFromMatrix(d.j);
                return m.VisualQasmController.isColumnEmpty(d.j) || e && e.type == f && e.subtype == g
            }
        }],
        link: function(a, b, c, d) {
            var e = d[0],
                h = d[1],
                i = d[2];
            i.VisualQasmController = e, i.VisualQasmGatesController = h, e.registerGateController(f, g, i)
        }
    }
}]), angular.module("qubitsApp").directive("gateCnot", ["$q", "$timeout", "playgroundFactory", "visualQasmSettings", "svgSymbols", function(a, b, c, d, e) {
    return {
        restrict: "E",
        replace: !0,
        template: '<g visualqasmgate:type="cnot"></g>',
        templateNamespace: "svg",
        require: ["^^visualQasm", "^visualQasmGatesSet", "gateCnot"],
        controller: ["$scope", "$element", function(e, f) {
            var g = this;
            this.addGate = function(h, i, j, k) {
                var l = a.defer(),
                    m = Snap(f[0]);
                return g.VisualQasmController.getDefaultGateNode(h, k).then(function(a) {
                    a.appendTo(m);
                    var f = g.VisualQasmController.arrayPositionToIJ(k);
                    if (!g.VisualQasmController.canGateBePlacedInLine(h, f.i)) return g.VisualQasmController.clearPositionAndNode(a), void l.reject({
                        code: "GATE_DROP_ERROR"
                    });
                    g.VisualQasmController.toggleLinkableLines(!1);
                    var i = a.getCenter(),
                        j = i.x,
                        n = i.y;
                    if (h.linkedGates && 1 == h.linkedGates.length && h.linkedGates[0].i != f.i) {
                        h.linkedGates[0].j = f.j;
                        var o = g.VisualQasmController.getCanvasPosition(h.linkedGates[0]);
                        j = o.x, n = o.y
                    } else if (h.linkedGates) return g.VisualQasmController.clearPositionAndNode(a), void l.reject({
                        code: "GATE_DROP_ERROR"
                    });
                    var p = Line(i.x, i.y, j, n, m);
                    p.insertBefore(a);
                    var q = h.displayProperties.color || d.nodeColor2;
                    if (p.attr({
                            stroke: q
                        }), g.VisualQasmController.isEditable() && !h.linkedGates) {
                        var f = g.VisualQasmController.arrayPositionToIJ(k),
                            r = g.VisualQasmController.getTopology();
                        b(function() {
                            g.VisualQasmController.toggleCircles(!0)
                        }, 300);
                        var s = c.getLinesCanLink(r, f.i),
                            t = g.VisualQasmController.getPaper(),
                            u = a.getCenter(),
                            v = function(b) {
                                g.VisualQasmController.toggleLinkableLines(!1), g.VisualQasmController.toggleCircles(!1);
                                var i = c.getMouseEventPos(b, e.uniqueId),
                                    j = g.VisualQasmController.getCanvasScale();
                                i.scale(j);
                                var m = g.VisualQasmController.findMatrixPosition({
                                        x: u.x,
                                        y: i.y
                                    }),
                                    n = m.i * d.pointsPerLine + m.j,
                                    o = g.VisualQasmController.getCanvasPosition(m);
                                if (c.existsGate(n) || k == n) a.remove(), p.remove(), l.reject({
                                    INVALID_POSITION_ERROR: "Please, select a valid final position for the gate."
                                });
                                else if (c.canLinkLines(r, m.i, f.i)) {
                                    p.updateEnd(o.x, o.y);
                                    var s = t.circle(o.x, o.y, d.dotsRad);
                                    s.show(), s.attr({
                                        fill: q
                                    }), s.transform("s2"), s.insertAfter(p), a.data("arrayPositionTo", n), h.linkedGates = [{
                                        i: m.i,
                                        j: m.j
                                    }], g.VisualQasmController.modifyGatesMatrix(k, h), g.VisualQasmController.modifyGatesMatrix(n, {
                                        endline: !0,
                                        data: h
                                    }), l.resolve({
                                        node: a,
                                        parts: [s, p],
                                        gate: h,
                                        arrayPosition: k
                                    })
                                } else l.reject({
                                    LINK_GATES_ERROR: "Connecting line " + f.i + " with line " + m.i + " is not possible."
                                }), a.remove(), p.remove();
                                t.unmousemove(w), t.unmousedown(v)
                            },
                            w = function(b, d, f) {
                                if (g.VisualQasmController.lastGate == h) {
                                    g.VisualQasmController.toggleLines(s, !0);
                                    var i = c.getMouseEventPos(b, e.uniqueId),
                                        j = g.VisualQasmController.getCanvasScale();
                                    i.scale(j), p.updateEnd(u.x, i.y);
                                    var k = g.VisualQasmController.findMatrixPosition({
                                        x: u.x,
                                        y: i.y
                                    });
                                    g.VisualQasmController.highlightCircle(k)
                                } else g.VisualQasmController.toggleLines(s, !1), g.VisualQasmController.clearPositionAndNode(a), p.remove(), a.remove(), t.unmousemove(w), t.unmousedown(v), l.reject({
                                    INVALID_POSITION_ERROR: "Please, select a valid final position for the gate."
                                })
                            };
                        t.mousemove(w), t.mousedown(v)
                    } else {
                        var t = g.VisualQasmController.getPaper(),
                            x = h.linkedGates && h.linkedGates.length > 0 ? h.linkedGates[0] : {
                                i: h.to,
                                j: h.position
                            },
                            r = g.VisualQasmController.getTopology();
                        if (c.canLinkLines(r, x.i, f.i)) {
                            var y = x.i * d.pointsPerLine + x.j;
                            g.VisualQasmController.modifyGatesMatrix(y, {
                                endline: !0,
                                data: h
                            });
                            var o = g.VisualQasmController.getCanvasPosition(x),
                                z = t.circle(o.x, o.y, d.dotsRad);
                            z.show(), z.attr({
                                fill: q
                            }), z.transform("s2"), z.insertAfter(p), l.resolve({
                                node: a,
                                parts: [z, p],
                                gate: h,
                                arrayPosition: k
                            })
                        } else l.reject({
                            LINK_GATES_ERROR: "Connecting line " + f.i + " with line " + x.i + " is not possible."
                        }), a.remove(), p.remove()
                    }
                }, l.reject), l.promise
            }, this.canAddGateIntoPosition = function(a, b) {
                if (void 0 != a.to || a.linkedGates && 1 == a.linkedGates.length) {
                    var c = g.VisualQasmController.arrayPositionToIJ(b),
                        d = {};
                    if (void 0 !== a.to) d = {
                        i: a.to,
                        j: c.j
                    };
                    else {
                        if (a.linkedGates[0].j == c.j) return !0;
                        d = {
                            i: a.linkedGates[0].i,
                            j: c.j
                        }
                    }
                    var e = g.VisualQasmController.IJToArrayPosition(d);
                    return g.VisualQasmController.positionIsAvailable(e)
                }
                return !0
            }, this.canMoveGateToPosition = function(a, b, c) {
                return g.canAddGateIntoPosition(a, b)
            }
        }],
        link: function(a, b, c, d) {
            var e = d[0],
                f = d[1],
                g = d[2];
            g.VisualQasmController = e, g.VisualQasmGatesController = f, e.registerGateController("gates", "link", g)
        }
    }
}]), angular.module("qubitsApp").directive("gateConditionals", ["$q", "$timeout", "playgroundFactory", "visualQasmSettings", "svgSymbols", "promptDialog", function(a, b, c, d, e, f) {
    var g = "operations",
        h = "conditional";
    return {
        restrict: "E",
        replace: !0,
        template: '<g visualqasmgate:type="conditionals"></g>',
        templateNamespace: "svg",
        require: ["^^visualQasm", "^visualQasmGatesSet", "gateConditionals"],
        controller: ["$scope", "$element", function(b, e) {
            function g(a) {
                return a && a["if"] && a["if"].gate && "subroutine" === a["if"].gate.type
            }

            function h(a, b, c) {
                var d = {
                    i: b.i,
                    j: b.j
                };
                c && c.i > b.i && (d = {
                    i: c.i,
                    j: c.j
                });
                var e = g(a);
                if (!(a && a.linkedGates && a.linkedGates.length > 0) && a && a["if"] && a["if"].gate && (a = a["if"].gate), a && a.linkedGates && a.linkedGates.length > 0) {
                    for (var f = 0; f < a.linkedGates.length; f++) d.i < a.linkedGates[f].i && (d.i = a.linkedGates[f].i);
                    e && (d.i = d.i - m.VisualQasmController.getNumOfCRegs())
                }
                return d
            }

            function i(a, b, c) {
                var d = {
                    i: b.i,
                    j: b.j
                };
                if (c && c.i < b.i && (d = {
                        i: c.i,
                        j: c.j
                    }), a && a.linkedGates && a.linkedGates.length > 0)
                    for (var e = 0; e < a.linkedGates.length; e++) d.i > a.linkedGates[e].i && (d.i = a.linkedGates[e].i);
                return d
            }

            function j(a, b, c, e) {
                b.linkedGates = [], b["if"] && b["if"].gate && b["if"].gate.linkedGates && (b.linkedGates = [].concat(b["if"].gate.linkedGates));
                var f = h(b, c),
                    g = m.VisualQasmController.getCanvasPosition(f, b),
                    i = m.VisualQasmController.getLineHeight(b["if"].line),
                    j = Line(a.x, g.y, a.x, i, n);
                j.attr({
                    fill: "none",
                    stroke: d.lineColor2,
                    strokeWidth: d.lineWidth,
                    strokeLinecap: "round"
                });
                var l = n.text(a.x - 10, i + 15, "== " + b["if"].value);
                l.attr({
                    fill: "#000"
                });
                for (var o = m.VisualQasmController.getNumOfQubits(), p = f.i + 1; p < o; p++) {
                    var q = p * d.pointsPerLine + c.j;
                    b.linkedGates.push({
                        i: p,
                        j: c.j
                    }), m.VisualQasmController.modifyGatesMatrix(q, {
                        isBusy: !0
                    })
                }
                m.VisualQasmController.isEditable() && l.click(function() {
                    k(b, c, e).then(function(a) {
                        var b = m.VisualQasmController.getGateInPosition(e);
                        b["if"].value = a, m.VisualQasmController.modifyGatesMatrix(e, b), l.attr({
                            text: "== " + a
                        })
                    })
                });
                var r = {
                    parts: [j, l],
                    gate: b
                };
                return r
            }

            function k(a, b, c) {
                return f({
                    title: "Input the integer value that this classical register should have to execute the conditional operation.",
                    input: !0,
                    label: "Integer Value",
                    value: a["if"].value || 0,
                    numeric: !0,
                    min: 0,
                    max: Math.pow(2, m.VisualQasmController.getCreg(a["if"].line).size) - 1
                })
            }

            function l(b, e, f, g) {
                var i = a.defer();
                m.VisualQasmController.lastGate = e;
                var j = m.VisualQasmController.getCregs();
                if (j && 1 == j.length) i.resolve(m.VisualQasmController.getNumOfQubits());
                else {
                    m.VisualQasmController.hightlightCregs(!0);
                    var k = n.circle(4, 4, 2).attr({
                            fill: d.lineColor2
                        }),
                        l = k.marker(0, 0, 7, 7, 4, 4),
                        o = h(e, f),
                        p = m.VisualQasmController.getCanvasPosition(o, e),
                        q = m.VisualQasmController.getPaper(),
                        r = Line(b.x, p.y, b.x, m.VisualQasmController.getLineHeight(f.i), n);
                    r.attr({
                        markerEnd: l,
                        fill: "none",
                        stroke: d.lineColor2,
                        strokeWidth: d.lineWidth,
                        strokeLinecap: "round"
                    });
                    var s = function(a) {
                            if (m.VisualQasmController.toggleCircles(!1, f.j), q.unmousemove(t), q.unmousedown(s), r.remove(), m.VisualQasmController.hightlightCregs(!1), m.VisualQasmController.lastGate == e) {
                                var d = c.getMouseEventPos(a, m.VisualQasmController.getUniqueId()),
                                    g = m.VisualQasmController.getCanvasScale();
                                d.scale(g);
                                var h = m.VisualQasmController.findMatrixPosition({
                                    x: b.x,
                                    y: d.y
                                });
                                h.i >= m.VisualQasmController.getNumOfQubits() && h.i < m.VisualQasmController.getNumOfLines() ? i.resolve(h.i) : i.reject()
                            } else i.reject("Drop error")
                        },
                        t = function(a, d, f) {
                            if (m.VisualQasmController.lastGate == e) {
                                var g = c.getMouseEventPos(a, m.VisualQasmController.getUniqueId()),
                                    h = m.VisualQasmController.getCanvasScale();
                                g.scale(h), r.updateEnd(b.x, g.y);
                                m.VisualQasmController.findMatrixPosition({
                                    x: b.x,
                                    y: g.y
                                })
                            } else m.VisualQasmController.hightlightCregs(!1), r.remove(), i.reject("Drop error"), q.unmousemove(t), q.unmousedown(s)
                        };
                    q.mousemove(t), q.mousedown(s)
                }
                return i.promise
            }
            var m = this,
                n = Snap(e[0]);
            this.addGate = function(b, d, e, f, h) {
                var i = a.defer();
                (h && h.isBusy || g(b)) && (f = c.getFirstLineArrayPosition(f), h = c.getGateFromMatrix(f), m.VisualQasmController.clearNodeByPosition(f, !0));
                var n = m.VisualQasmController.arrayPositionToIJ(f),
                    o = m.VisualQasmController.getCanvasCenter(f);
                if (b["if"] && b["if"].gate && (h = b["if"].gate), !h) return void i.reject();
                var p = 44;
                ({
                    x1: o.x - p / 2,
                    y1: o.y + p / 2,
                    x2: o.x + p / 2,
                    y2: o.y + p / 2
                });
                if (!h.type) {
                    var q = h.qasm || h.name,
                        r = c.getGateByQASM(q);
                    h = angular.extend({}, r, h)
                }
                var s = c.getGateJsonQasm(h, h.position);
                return h = angular.extend({}, s, h), m.VisualQasmController.addGate(h, d, e, f, !0).then(function(a) {
                    if (b["if"] || (b["if"] = {}), b["if"].gate = a.gate, b["if"].gate.name = a.gate.qasm, b["if"] && void 0 !== b["if"].line && void 0 !== b["if"].value) {
                        b["if"].line >= m.VisualQasmController.getNumOfLines() && (b["if"].line = m.VisualQasmController.getNumOfLines() - 1), b["if"].line < m.VisualQasmController.getNumOfQubits() && (b["if"].line = m.VisualQasmController.getNumOfQubits());
                        var c = j(o, b, n, f);
                        a.parts && (c.parts = c.parts.concat(a.parts)), i.resolve({
                            gate: b,
                            node: a.node,
                            parts: c.parts,
                            arrayPosition: f
                        })
                    } else if (m.VisualQasmController.isEditable()) l(o, b, n, f).then(function(c) {
                        b["if"].line = c, k(b, n, f).then(function(c) {
                            if (void 0 == c) return void i.reject({
                                node: a.node
                            });
                            b["if"].value = c;
                            var d = j(o, b, n, f);
                            a.parts && (d.parts = d.parts.concat(a.parts)), i.resolve({
                                gate: b,
                                node: a.node,
                                parts: d.parts,
                                arrayPosition: f
                            })
                        }, function() {
                            if (a.parts)
                                for (var b = 0; b < a.parts.length; b++) a.parts[b].remove();
                            i.reject({
                                node: a.node
                            })
                        })
                    }, function() {
                        if (a.parts)
                            for (var b = 0; b < a.parts.length; b++) a.parts[b].remove();
                        i.reject({
                            node: a.node
                        })
                    });
                    else {
                        if (a.parts)
                            for (var d = 0; d < a.parts.length; d++) a.parts[d].remove();
                        i.reject({
                            node: a.node
                        })
                    }
                }, i.reject), i.promise
            }, this.canMoveGateToPosition = function(a, b, c) {
                var d = m.VisualQasmController.arrayPositionToIJ(c),
                    e = m.VisualQasmController.arrayPositionToIJ(b),
                    f = i(a["if"].gate, d);
                return d.j == e.j && (d.i < e.i || m.VisualQasmController.isColumnEmptyFromTo(e.j, e.i + 1, f.i)) || m.VisualQasmController.canMoveGateToPosition(a["if"].gate, b, c) && m.VisualQasmController.isColumnEmptyFromTo(e.j, e.i + 1)
            }, this.canAddGateIntoPosition = function(a, b) {
                var d = a["if"] && a["if"].gate ? a["if"].gate : m.VisualQasmController.getGateInPosition(b);
                if (d && d.isBusy && (b = c.getFirstLineArrayPosition(b), d = c.getGateFromMatrix(b)), d && d["if"] && d["if"].gate) return !1;
                var e = m.VisualQasmController.arrayPositionToIJ(b),
                    f = h(d, e);
                return d && !d.isBusy && !d.endline && ("operations" != d.type || "reset" === d.qasm) && "measure" != d.type && "barrier" != d.type && m.VisualQasmController.isColumnEmptyFromTo(e.j, f.i + 1)
            }
        }],
        link: function(a, b, c, d) {
            var e = d[0],
                f = d[1],
                i = d[2];
            i.VisualQasmController = e, i.VisualQasmGatesController = f, e.registerGateController(g, h, i)
        }
    }
}]), angular.module("qubitsApp").directive("gateCustom", ["$q", "$timeout", "playgroundFactory", "visualQasmSettings", "svgSymbols", "$uibModal", function(a, b, c, d, e, f) {
    var g = "subroutine",
        h = "multiline",
        i = {
            rectVerticalPadding: 42,
            maxParamsToShow: 5,
            params: {
                margin: 1,
                background: "none"
            },
            defaultGateOpts: {
                width: 66,
                font: {
                    color: "#444444",
                    size: 11,
                    border: 1
                }
            }
        };
    return {
        restrict: "E",
        replace: !0,
        template: '<g visualqasmgate:type="custom"></g>',
        templateNamespace: "svg",
        require: ["^^visualQasm", "^visualQasmGatesSet", "gateCustom"],
        controller: ["$scope", "$element", function(b, c) {
            function g(a, b) {
                var c = m.VisualQasmController.getNumOfLines();
                a.linkedGates = [];
                for (var e = 0; e < c; e++) a.linkedGates.push({
                    i: e,
                    j: b.j
                }), m.VisualQasmController.modifyGatesMatrix(e * d.pointsPerLine + b.j, {
                    isBusy: !0
                })
            }

            function h(a) {
                b.gate = a, b.descriptions = {};
                var c = f.open({
                    animation: b.animationsEnabled,
                    templateUrl: "templates/visualQasm/gates/paramsPopup.html",
                    size: "large",
                    scope: b,
                    controller: ["$scope", "$uibModalInstance", function(a, b) {
                        a.saveParameters = function() {
                            a.gateParametersForm.$valid && b.close(a.gate)
                        }
                    }]
                });
                return c.result
            }

            function j(a, b, c, d) {
                var e = a.getSize();
                d = void 0 != d ? d : 1, b.attr({
                    text: k,
                    fill: i.defaultGateOpts.font.color,
                    "font-size": i.defaultGateOpts.font.size
                });
                var f = c.map(function(a, b) {
                        return b < i.maxParamsToShow ? a.value : void 0
                    }),
                    g = "(" + f.join(", ") + ")";
                g.length > 100 && (g = g.substring(0, 100) + " ..."), b.attr("text", g);
                for (var h = b.getSize(), j = (new Snap.Matrix, f.length), k = [g]; j > 0 && h.w > e.w;) {
                    k[0] = "(" + f.slice(0, j).join(",");
                    j < f.length ? k[1] = f.slice(j - 1, f.length).join(",") + ")" : k[0] += ")", j--, b.attr({
                        text: k,
                        fill: i.defaultGateOpts.font.color,
                        "font-size": i.defaultGateOpts.font.size,
                        stroke: i.defaultGateOpts.font.borderColor,
                        "stroke-width": i.defaultGateOpts.font.border
                    });
                    var l = b.selectAll("tspan");
                    2 == l.length && (l[0].attr({
                        x: 0,
                        y: -12
                    }), l[1].attr({
                        x: 0,
                        y: 0
                    })), h = b.getSize()
                }
                b.getRealBBox();
                return b
            }

            function k(a) {
                var b = Snap(c[0]),
                    d = m.VisualQasmController.getLineHeight(m.VisualQasmController.getNumOfQubits() - 1),
                    f = i.rectVerticalPadding + 4;
                d = d - m.VisualQasmController.getLineHeight(0) + f;
                var g = {
                        width: i.defaultGateOpts.width,
                        height: d
                    },
                    h = {
                        x: a.x - g.width / 2,
                        y: m.VisualQasmController.getLineHeight(0) - f / 2
                    },
                    j = e.getColumnRectangle(b, h.x, h.y, g.width, g.height);
                return j.attr({
                    stroke: "#6e6d6d",
                    strokeWidth: 2
                }), j
            }

            function l(b, d, e, f) {
                var g = Snap(c[0]),
                    h = [];
                for (var i in b.lineParams) {
                    var j = b.lineParams[i],
                        k = {
                            type: "gates",
                            name: j.name,
                            qasm: j.name,
                            displayProperties: {
                                shape: "rectangle2",
                                color: "#00bff2"
                            }
                        },
                        l = {
                            i: j.value,
                            j: d.j
                        },
                        n = m.VisualQasmController.IJToArrayPosition(l),
                        o = a.defer();
                    h.push(o.promise),
                        function(a, c, h) {
                            m.VisualQasmController.getDefaultGateNode(k, n, {
                                textLabel: !0
                            }).then(function(i) {
                                var j = i.clone();
                                i.remove(), g.append(j), m.VisualQasmController.isEditable() && j.drag(function(a, b, c, d, e) {
                                    var f = this.transform().diffMatrix.invert();
                                    f.e = f.f = 0;
                                    var g = f.y(a, b);
                                    this.transform("t" + [0, g] + this.data("origTransform"))
                                }, function() {
                                    g.append(this), this.data("origTransform", this.transform().local)
                                }, function() {
                                    var a = this.getCenter(),
                                        g = m.VisualQasmController.findMatrixPosition({
                                            x: a.x,
                                            y: a.y
                                        });
                                    if (g.i == h.i || g.i >= m.VisualQasmController.getNumOfQubits()) this.attr({
                                        transform: this.data("origTransform")
                                    });
                                    else {
                                        for (var i in b.lineParams) b.lineParams[i].value == g.i && (b.lineParams[i].value = h.i), b.lineParams[i].name == c.name && (b.lineParams[i].value = g.i);
                                        m.VisualQasmController.clearNodeByPosition(d.j), m.VisualQasmController.drawGate(b, e, f)
                                    }
                                }), a.resolve(j)
                            }, a.reject)
                        }(o, j, l)
                }
                return a.all(h)
            }
            var m = this;
            this.addGate = function(b, d, e, f) {
                var n = Snap(c[0]),
                    o = a.defer();
                if (b.gateDefinition && b.gateDefinition.lines.length > m.VisualQasmController.getNumOfQubits()) return o.reject(), o.promise;
                var p = m.VisualQasmController.arrayPositionToIJ(f),
                    q = m.VisualQasmController.getCanvasCenter(p.j),
                    r = k(q),
                    s = n.g();
                if (s.append(r), !b.lineParams && b.gateDefinition) {
                    b.lineParams = [];
                    for (var t in b.gateDefinition.lines) {
                        var u = b.gateDefinition.lines[t];
                        b.lineParams.push({
                            name: u,
                            value: t
                        })
                    }
                }
                var v = {
                        x: s.getPos().x,
                        y: s.getPos().y + s.getSize().h + 12
                    },
                    w = n.text(v.x, v.y, b.name);
                if (w.attr({
                        fill: i.defaultGateOpts.font.color,
                        "font-size": i.defaultGateOpts.font.size
                    }), s.append(w), !b.params && b.gateDefinition && b.gateDefinition.params && (b.params = b.gateDefinition.params), b.params)
                    if (b.params.length > 0 && "string" == typeof b.params[0]) {
                        for (var x = [], y = 0; y < b.params.length; y++) x.push({
                            name: b.params[y]
                        });
                        b.params = x, h(b).then(function(a) {
                            var c = {
                                    x: v.x,
                                    y: v.y + 12
                                },
                                f = n.text(c.x, c.y, ""),
                                h = (f.getRealBBox(), i.params.margin);
                            f = j(s, f, b.params, h), s.append(f), l(b, p, d, e).then(function(a) {
                                g(b, p), o.resolve({
                                    node: s,
                                    arrayPosition: p.j,
                                    parts: a,
                                    gate: b
                                })
                            }, function(a) {
                                s.remove(), o.reject(a)
                            })
                        }, function(a) {
                            s.remove(), o.reject(a)
                        })
                    } else {
                        var z = {
                                x: v.x,
                                y: v.y + 12
                            },
                            A = n.text(z.x, z.y, ""),
                            B = (A.getRealBBox(), i.params.margin);
                        A = j(s, A, b.params, B), s.append(A), l(b, p, d, e).then(function(a) {
                            g(b, p), o.resolve({
                                node: s,
                                arrayPosition: p.j,
                                parts: a,
                                gate: b
                            })
                        }, function(a) {
                            s.remove(), o.reject(a)
                        })
                    }
                else l(b, p, d, e).then(function(a) {
                    g(b, p), o.resolve({
                        node: s,
                        arrayPosition: p.j,
                        parts: a,
                        gate: b
                    })
                }, function(a) {
                    s.remove(), o.reject(a)
                });
                return o.promise
            }, this.canMoveGateToPosition = function(a, b) {
                var c = m.VisualQasmController.arrayPositionToIJ(b);
                return m.VisualQasmController.isColumnEmpty(c.j)
            }, this.canAddGateIntoPosition = function(a, b) {
                var c = m.VisualQasmController.arrayPositionToIJ(b);
                return m.VisualQasmController.isColumnEmpty(c.j)
            }
        }],
        link: function(a, b, c, d) {
            var e = d[0],
                f = d[1],
                i = d[2];
            i.VisualQasmController = e, i.VisualQasmGatesController = f, e.registerGateController(g, h, i)
        }
    }
}]), angular.module("qubitsApp").directive("gateMeasure", ["$q", "$timeout", "playgroundFactory", "visualQasmSettings", "svgSymbols", "promptDialog", function(a, b, c, d, e, f) {
    var g = [{
        type: "measure"
    }, {
        type: "operations",
        subtype: "measure"
    }];
    return {
        restrict: "E",
        replace: !0,
        template: '<g visualqasmgate:type="measure"></g>',
        templateNamespace: "svg",
        require: ["^^visualQasm", "^visualQasmGatesSet", "gateMeasure"],
        controller: ["$scope", "$element", function(b, e) {
            function h(a) {
                var b = !1;
                if (a)
                    for (var c = 0; c < g.length; c++) {
                        var d = g[c];
                        if (b = d.type == a.type, d.subtype && (b = b && d.subtype == a.subtype), b) break
                    }
                return b
            }
            var i = this;
            this.addGate = function(b, g, h, j) {
                var k = Snap(e[0]),
                    l = a.defer();
                return i.VisualQasmController.getDefaultGateNode(b, j).then(function(e) {
                    function g(a, b, c, e) {
                        for (var f = c.j + 1; f < d.pointsPerLine; f++) {
                            var g = c.i * d.pointsPerLine + f;
                            b.linkedGates.push({
                                i: c.i,
                                j: f
                            }), i.VisualQasmController.modifyGatesMatrix(g, {
                                isBusy: !0
                            })
                        }
                        var h = i.VisualQasmController.getLineHeight(c.i) + 10,
                            j = Line(p.x, h, d.lengthOfLines + d.initialX, h, k);
                        j.attr({
                            fill: "none",
                            stroke: d.lineColor2,
                            strokeWidth: d.lineWidth,
                            strokeLinecap: "round"
                        }), a.appendTo(k);
                        var l = {
                            node: a,
                            parts: [j],
                            gate: b,
                            arrayPosition: e
                        };
                        return l
                    }

                    function h(a, b, c, e) {
                        for (var f = c.i + 1; f < b.measureCreg.line; f++) {
                            var g = f * d.pointsPerLine + c.j;
                            b.linkedGates.push({
                                i: f,
                                j: c.j
                            }), i.VisualQasmController.modifyGatesMatrix(g, {
                                isBusy: !0
                            })
                        }
                        var h = Line(p.x, p.y, p.x, i.VisualQasmController.getLineHeight(b.measureCreg.line) - 1, k);
                        h.attr({
                            fill: "none",
                            stroke: d.lineColor2,
                            strokeWidth: d.lineWidth,
                            strokeLinecap: "round"
                        });
                        var j = i.VisualQasmController.getPaper().polyline("16,0 7.625,11.75 0,0 ").attr({
                                fill: "none",
                                stroke: d.lineColor2,
                                strokeWidth: d.lineWidth
                            }),
                            l = new Snap.Matrix;
                        l.translate(p.x - j.getSize().w / 2, i.VisualQasmController.getLineHeight(b.measureCreg.line) - j.getSize().h - 1), j.transform(l), j.appendTo(k), a.appendTo(k);
                        var n = i.VisualQasmController.getCanvasPosition({
                                i: b.measureCreg.line,
                                j: c.j
                            }),
                            o = k.text(n.x - 4, n.y + 15, b.measureCreg.bit + "");
                        o.attr({
                            fill: "#000"
                        }), i.VisualQasmController.isEditable() && !i.VisualQasmController.isRealDevice() && o.click(function() {
                            m(a, b, c, e).then(function(a) {
                                var b = i.VisualQasmController.getGateInPosition(e);
                                b.measureCreg.bit = a, i.VisualQasmController.modifyGatesMatrix(e, b), o.attr({
                                    text: a
                                })
                            })
                        });
                        var q = {
                            node: a,
                            parts: [h, j, o],
                            gate: b,
                            arrayPosition: e
                        };
                        return q
                    }

                    function m(a, b, c, d) {
                        return f({
                            title: "Select the bit on this classical register where the measure will write its value.",
                            input: !0,
                            label: "Bit number",
                            value: b.measureCreg.bit || 0,
                            numeric: !0,
                            min: 0,
                            max: i.VisualQasmController.getCreg(b.measureCreg.line).size - 1
                        })
                    }

                    function n(b, e, f, g) {
                        var h = a.defer();
                        i.VisualQasmController.lastGate = e;
                        var j = i.VisualQasmController.getCregs();
                        if (j && 1 == j.length) h.resolve(i.VisualQasmController.getNumOfQubits());
                        else {
                            i.VisualQasmController.hightlightCregs(!0);
                            var l = k.circle(4, 4, 2).attr({
                                    fill: d.lineColor2
                                }),
                                m = l.marker(0, 0, 7, 7, 4, 4),
                                n = i.VisualQasmController.getPaper(),
                                o = Line(p.x, p.y, p.x, i.VisualQasmController.getLineHeight(f.i), k);
                            o.attr({
                                markerEnd: m,
                                fill: "none",
                                stroke: d.lineColor2,
                                strokeWidth: d.lineWidth,
                                strokeLinecap: "round"
                            });
                            var q = function(a) {
                                    if (i.VisualQasmController.toggleCircles(!1, f.j), n.unmousemove(r), n.unmousedown(q), o.remove(), m.remove(), l.remove(), i.VisualQasmController.hightlightCregs(!1), i.VisualQasmController.lastGate == e) {
                                        var b = c.getMouseEventPos(a, i.VisualQasmController.getUniqueId()),
                                            d = i.VisualQasmController.getCanvasScale();
                                        b.scale(d);
                                        var g = i.VisualQasmController.findMatrixPosition({
                                            x: p.x,
                                            y: b.y
                                        });
                                        g.i >= i.VisualQasmController.getNumOfQubits() && g.i < i.VisualQasmController.getNumOfLines() ? h.resolve(g.i) : h.reject()
                                    } else h.reject("Drop error")
                                },
                                r = function(a, b, d) {
                                    if (i.VisualQasmController.lastGate == e) {
                                        var f = c.getMouseEventPos(a, i.VisualQasmController.getUniqueId()),
                                            g = i.VisualQasmController.getCanvasScale();
                                        f.scale(g), o.updateEnd(p.x, f.y);
                                        i.VisualQasmController.findMatrixPosition({
                                            x: p.x,
                                            y: f.y
                                        })
                                    } else i.VisualQasmController.hightlightCregs(!1), o.remove(), m.remove(), l.remove(), h.reject("Drop error"), n.unmousemove(r), n.unmousedown(q)
                                };
                            n.mousemove(r), n.mousedown(q)
                        }
                        return h.promise
                    }
                    var o = i.VisualQasmController.arrayPositionToIJ(j),
                        p = e.getCenter();
                    if (b.linkedGates = [], i.VisualQasmController.isRealDevice() && !i.VisualQasmController.isLoadingGates()) {
                        b.measureCreg = {
                            line: i.VisualQasmController.getNumOfQubits(),
                            bit: o.i
                        };
                        var q = h(e, b, o, j);
                        l.resolve(q)
                    } else if (b.measureCreg && !b.oldMeasure) {
                        b.measureCreg.line >= i.VisualQasmController.getNumOfLines() && (b.measureCreg.line = i.VisualQasmController.getNumOfLines() - 1), b.measureCreg.line < i.VisualQasmController.getNumOfQubits() && (b.measureCreg.line = i.VisualQasmController.getNumOfQubits());
                        var q = h(e, b, o, j);
                        l.resolve(q)
                    } else if (i.VisualQasmController.isEditable() && !i.VisualQasmController.isLoadingGates()) n(e, b, o, j).then(function(a) {
                        b.measureCreg = {
                            line: a,
                            bit: o.i
                        }, m(e, b, o, j).then(function(a) {
                            b.measureCreg.bit = parseInt(a);
                            var c = h(e, b, o, j);
                            l.resolve(c)
                        }, function(a) {
                            e.remove(), l.reject(a)
                        })
                    }, function(a) {
                        e.remove(), l.reject(a)
                    });
                    else {
                        b.measureCreg = {
                            line: i.VisualQasmController.getNumOfQubits(),
                            bit: o.i
                        }, b.oldMeasure = !0;
                        var q = g(e, b, o, j);
                        l.resolve(q)
                    }
                }, l.reject), l.promise
            }, this.canMoveGateToPosition = function(a, b, c) {
                var d = i.VisualQasmController.arrayPositionToIJ(b),
                    e = i.VisualQasmController.arrayPositionToIJ(c),
                    f = d.j == e.j && (d.i > e.i || i.VisualQasmController.isColumnEmptyFromTo(d.j, d.i, e.i)) || i.VisualQasmController.isColumnEmptyFromTo(d.j, d.i);
                if (i.VisualQasmController.isRealDevice()) {
                    var g = function(a) {
                        return function(b, c, d) {
                            return c == a.i && d == a.j || !h(b)
                        }
                    }(e);
                    return f && i.VisualQasmController.checkLine(d.i, g)
                }
                return f
            }, this.canAddGateIntoPosition = function(a, b) {
                function c(a, b) {
                    return function(c, d, e) {
                        return !(c && h(c) && (c.qasm != a.qasm || i.VisualQasmController.isRealDevice() && d == b.i && e != b.j))
                    }
                }
                var d = i.VisualQasmController.arrayPositionToIJ(b);
                return i.VisualQasmController.isGateAllowed(c(a, d)) && i.VisualQasmController.isColumnEmptyFromTo(d.j, d.i)
            }
        }],
        link: function(a, b, c, d) {
            var e = d[0],
                f = d[1],
                h = d[2];
            h.VisualQasmController = e, h.VisualQasmGatesController = f;
            for (var i = 0; i < g.length; i++) {
                var j = g[i];
                e.registerGateController(j.type, j.subtype, h)
            }
        }
    }
}]), angular.module("qubitsApp").directive("gateUnitary", ["$q", "$timeout", "playgroundFactory", "visualQasmSettings", "svgSymbols", "$uibModal", function(a, b, c, d, e, f) {
    var g = "gates",
        h = "unitary",
        i = {
            maxParamsToShow: 5,
            params: {
                margin: 1,
                background: "none"
            },
            defaultGateOpts: {
                font: {
                    color: "#fff",
                    size: 11,
                    border: 1,
                    borderColor: "#fff"
                },
                position: {
                    top: 12
                },
                labelPosition: "middle"
            }
        };
    return {
        restrict: "E",
        replace: !0,
        template: '<g visualqasmgate:type="unitary"></g>',
        templateNamespace: "svg",
        require: ["^^visualQasm", "^visualQasmGatesSet", "gateUnitary"],
        controller: ["$scope", "$element", function(d, e) {
            function g(a, b, c, d, e) {
                var f = a.getSize();
                e = void 0 != e ? e : 1, c.attr({
                    text: m,
                    fill: i.defaultGateOpts.font.color,
                    "font-size": i.defaultGateOpts.font.size,
                    stroke: i.defaultGateOpts.font.borderColor,
                    "stroke-width": i.defaultGateOpts.font.border
                });
                var g = d.map(function(a, b) {
                        return b < i.maxParamsToShow ? a.value.length > 10 ? a.value.substring(0, 8) + "..." : a.value : void 0
                    }),
                    h = "(" + g.join(", ") + ")";
                h.length > 40 && (h = h.substring(0, 40) + " ..."), c.attr("text", h);
                for (var j = c.getSize(), k = new Snap.Matrix, l = g.length, m = [h]; l > 0 && j.w > f.w;) {
                    m[0] = "(" + g.slice(0, l).join(",") + ",";
                    l < g.length ? (m[1] = g.slice(l, g.length).join(",") + ")", m[1].length > 10 && (m[1] = m[1].substring(0, 8) + " ...")) : m[0] += ")", l--, c.attr({
                        text: m,
                        fill: i.defaultGateOpts.font.color,
                        "font-size": i.defaultGateOpts.font.size,
                        stroke: i.defaultGateOpts.font.borderColor,
                        "stroke-width": i.defaultGateOpts.font.border
                    });
                    var n = c.selectAll("tspan");
                    2 == n.length && (n[0].attr({
                        x: 0,
                        y: -12
                    }), n[1].attr({
                        x: 0,
                        y: 0
                    })), j = c.getSize()
                }
                k.translate(f.w / 2 - j.w / 2, f.h - 5), c.transform(k);
                var o = c.getRealBBox();
                return b.attr({
                    x: o.x - e,
                    y: o.y - e,
                    width: o.width + 2 * e,
                    height: o.height + 2 * e
                }), b.attr("fill", i.params.background), b.insertBefore(c), c
            }

            function h(a) {
                d.gate = a, d.descriptions = {
                    lambda: "Please enter a " + ("u1" == a.qasm ? "" : "post-") + "phase rotation angle  $$\\lambda$$ in radians (you can use real numbers or fractions of pi)",
                    theta: "Please enter a Y rotation angle  $$\\theta$$ in radians (you can use real numbers or fractions of pi)",
                    phi: "Please enter a pre-phase rotation angle  $$\\phi$$ in radians (you can use real numbers or fractions of pi)"
                };
                var c = f.open({
                    animation: d.animationsEnabled,
                    templateUrl: "templates/visualQasm/gates/paramsPopup.html",
                    size: "large",
                    scope: d,
                    controller: ["$scope", "$uibModalInstance", function(a, c) {
                        b(function() {
                            MathJax.Hub.Queue(["Typeset", MathJax.Hub])
                        }), a.saveParameters = function() {
                            a.gateParametersForm.$valid && c.close(a.gate)
                        }
                    }]
                });
                return c.result
            }

            function j(a, b, c) {
                var d = i.params.margin,
                    e = a.text(0, 0, ""),
                    f = e.getRealBBox(),
                    h = a.rect(f.x - d, f.y - d, f.width + 2 * d, f.height + 2 * d);
                return e = g(a, h, e, b.params, d), {
                    node: a,
                    arrayPosition: c,
                    gate: b
                }
            }
            var k = this;
            this.addGate = function(b, c, d, f) {
                var g = (Snap(e[0]), a.defer());
                return k.VisualQasmController.getDefaultGateNode(b, f, i.defaultGateOpts).then(function(a) {
                    if (b.params && b.params.length > 0 && "string" != typeof b.params[0]) {
                        var c = j(a, b, f);
                        g.resolve(c)
                    } else {
                        if (b.params && b.params.length) {
                            for (var d = [], e = 0; e < b.params.length; e++) d.push({
                                name: b.params[e]
                            });
                            b.params = d
                        } else b.params = [{
                            name: "theta"
                        }, {
                            name: "alpha"
                        }, {
                            name: "lambda"
                        }];
                        h(b, f).then(function(b) {
                            var c = j(a, b, f);
                            g.resolve(c)
                        }, function() {
                            g.reject({
                                node: a
                            })
                        })
                    }
                }, g.reject), g.promise
            }, this.canMoveGateToPosition = function(a, b) {
                return k.VisualQasmController.positionIsAvailable(b)
            }, this.canAddGateIntoPosition = function(a, b) {
                var d = c.getGateFromMatrix(b),
                    e = d && (d.isBusy || d.endline);
                return !e
            }
        }],
        link: function(a, b, c, d) {
            var e = d[0],
                f = d[1],
                i = d[2];
            i.VisualQasmController = e, i.VisualQasmGatesController = f, e.registerGateController(g, h, i)
        }
    }
}]), angular.module("qubitsApp").directive("visualQasmGatesSet", ["$q", "$timeout", function(a, b) {
    return {
        restrict: "E",
        replace: !0,
        transclude: !0,
        template: '<g ng-transclude="">  <gate-unitary></gate-unitary>  <gate-conditionals></gate-conditionals>  <gate-barrier></gate-barrier>  <gate-measure></gate-measure>  <gate-cnot></gate-cnot>  <gate-custom></gate-custom></g>',
        templateNamespace: "svg",
        require: ["^^visualQasm", "visualQasmGatesSet"],
        controller: ["$scope", "$element", function(a, b) {}]
    }
}]), angular.module("qubitsApp").directive("visualQasmPlusMinus", ["$q", "visualQasmSettings", "$timeout", "$compile", function(a, b, c, d) {
    return {
        restrict: "E",
        require: ["^visualQasm", "visualQasmPlusMinus"],
        replace: !0,
        scope: {
            innerValue: "@",
            x: "@?",
            y: "@?",
            isWidget: "=?",
            sayHi: "&?"
        },
        templateNamespace: "svg",
        templateUrl: "templates/visualQasm/visualQasmPlusMinus.html",
        controller: ["$scope", "$element", function(a, b) {
            var c = this;
            this.addPlusMinus = function(b) {
                if (console.log("addPlusMinus", b), b.widgetPosition) {
                    var e = angular.element();
                    console.log("templateElement created!", b.widgetPosition);
                    var f = c.VisualQasmController.getCanvasPosition(b.widgetPosition);
                    a.sayHi = function() {
                        console.log("HIIIIIII")
                    };
                    var e = angular.element('<visual-qasm-plus-minus is-widget="true" inner-value="' + b.widgetValue + '" x="' + f.x + '"  y="' + f.y + '"></visual-qasm-plus-minus>');
                    d(e)(a, function(a, c) {
                        b.node.parent().append(a[0])
                    })
                }
            }
        }],
        link: {
            pre: function(a, b, c, d) {
                if (c.isWidget) a.display = "", a.innerValue = 3;
                else {
                    a.display = "none";
                    var e = d[0],
                        f = d[1];
                    f.VisualQasmController = e, a.uniqueId = e.getUniqueId(), e.registerPlugin(f)
                }
            },
            post: function(a, b, d, e) {
                e[0];
                c(function() {
                    if (d.isWidget) {
                        console.log("$scope", a);
                        var c = Snap(b[0]),
                            e = new Snap.Matrix;
                        e.translate(parseInt(a.x) + 10, parseInt(a.y) - 30), c.transform(e)
                    }
                })
            }
        }
    }
}]), angular.module("qubitsApp").directive("visualQasmScroll", ["$q", "visualQasmSettings", "$timeout", function(a, b, c) {
    var d = b.defaultScrollableArea;
    return {
        restrict: "E",
        require: ["^^visualQasm", "visualQasmScroll"],
        replace: !0,
        templateNamespace: "svg",
        templateUrl: "templates/visualQasm/visualQasmScroll.html",
        controller: ["$scope", function(a) {
            a.initialized = !1, a.display = "", this.resized = function(b) {
                a.viewBoxSize = b
            }, this.toggleScrollBar = function(b) {
                b ? a.display = "" : a.display = "none"
            }
        }],
        link: {
            pre: function(a, e, f, g) {
                function h() {
                    return a.viewBoxSize.width / j.getElementWidth()
                }

                function i() {
                    if (a.initialized && a.viewBoxSize) {
                        var c = a.viewBoxSize;
                        b.scrollCircleWidth = b.scrollWidth / (b.lengthOfLines / c.width), s = (b.lengthOfLines - c.width + b.initialX + 120) / (b.scrollWidth - b.scrollCircleWidth), l.attr("x2", b.scrollWidth / (b.lengthOfLines / c.width)), j.setScrollableArea(b.initialX - d.margin, 0, c.width - b.initialX, c.height);
                        var e = c.width / 2 - b.scrollWidth / 2;
                        m.transform("t" + e + "," + (c.height - d.margin - m.getSize().h)), n.attr("x2", b.scrollWidth), o.transform("t" + (c.width - d.margin) + "," + (b.initialY - d.margin)), o.select("line").attr({
                            y2: c.height - b.initialY
                        }), p.transform("t" + (b.initialX - d.margin) + "," + (b.initialY - d.margin)), p.select("line").attr({
                            y2: c.height - b.initialY
                        })
                    }
                }
                var j = g[0],
                    k = g[1];
                a.uniqueId = j.getUniqueId();
                var l, m, n, o, p, q, r = {
                        tdx: 0,
                        position: 0,
                        movableAreaOffset: 0
                    },
                    s = 1;
                a.$watch("initialized", function(a, b) {
                    i()
                }), a.$watch("viewBoxSize", function(a, b) {
                    i()
                }, !0), c(function() {
                    q = e[0];
                    var c = Snap(q);
                    l = c.select("#" + a.uniqueId + "-scrollBarCircle"), m = c.select("#" + a.uniqueId + "-scrollBar"), n = c.select("#" + a.uniqueId + "-scrollBarLine"), o = c.select("#" + a.uniqueId + "-rightShadow"), p = c.select("#" + a.uniqueId + "-leftShadow"), m.show(), o.show(), p.hide(), a.initialized = !0, l.drag(function(a, c, d, e) {
                        var f = h(),
                            g = a * f,
                            i = r.position + g;
                        i < 0 ? g = -r.position : i > b.scrollWidth - b.scrollCircleWidth && (g = b.scrollWidth - b.scrollCircleWidth - r.position);
                        var k = s * -g;
                        i > 3 ? p.show() : p.hide(), i < b.scrollWidth - b.scrollCircleWidth - .02 * b.scrollWidth ? o.show() : o.hide(), r.tdx = g, l.transform("t" + [g, 0] + l.data("origTransform")), j.moveDrawableArea(k)
                    }, function() {
                        r.tdx = 0, scale = h(), j.moveDrawableArea(null, !0), l.data("origTransform", l.transform().local), j.toggleCircles(!0)
                    }, function() {
                        r.position = r.position + r.tdx, r.tdx = 0, r.movableAreaOffset = r.position * s, j.updateScrollingOffset(r.movableAreaOffset), j.toggleCircles(!1)
                    })
                }), j.registerPlugin(k)
            }
        }
    }
}]), angular.module("qubitsApp").factory("visualQasmSettings", ["$q", function(a) {
    var b = 5440,
        c = 80,
        d = 1100,
        e = 500;
    return {
        lineColor: "#414141",
        lineColor2: "#aba7a7",
        nodeColor: "#2d5990",
        nodeColor2: "#2d8d90",
        dotHighlightColor: "#48e687",
        pointsPerLine: c,
        lengthOfLines: b,
        verticalSpacing: 48,
        dotsRad: 4,
        lineWidth: 3,
        initialX: 140,
        initialY: 65,
        bottomMargin: 80,
        drawableAreaMargin: 50,
        dropPointsSpacing: b / (c - 1),
        dropPointsOffset: b % c / 2,
        scrollWidth: 400,
        defaultScrollableArea: {
            x: 70,
            y: 0,
            width: 900,
            height: 410,
            margin: 40
        },
        defaultSize: {
            width: d,
            height: e
        }
    }
}]), angular.module("qubitsApp").directive("visualQasm", ["$q", "visualQasmSettings", "playgroundFactory", "gatesSVGFactory", "svgSymbols", "$timeout", function(a, b, c, d, e, f) {
    var g = 1,
        h = e.getSymbol("qubitLabel"),
        i = e.getSymbol("bitLabel");
    return {
        restrict: "EA",
        require: "visualQasm",
        replace: !0,
        transclude: {
            scroll: "?visualQasmScroll",
            gates: "?visualQasmGatesSet"
        },
        scope: {
            topology: "=",
            showDots: "=?",
            showLinkableLines: "=?",
            gatesMatrix: "=?",
            isEditable: "=",
            width: "=?",
            printable: "=?",
            displayStrict: "=?",
            isRealDevice: "=?"
        },
        templateUrl: "templates/visualQasm/visualQasm.html",
        controller: ["$scope", "$element", function(d, e) {
            function f(a, b) {
                var c = k[h(a, b)];
                return c || (c = k[h(a)]), c
            }

            function h(a, b) {
                return b ? a + ":" + b : a
            }
            var i = this;
            d.uniqueId = "visualQasm" + g++, d.scrollableArea = angular.copy(b.defaultScrollableArea);
            var j = [],
                k = {};
            this.lastGate = void 0;
            var l = [],
                m = [];
            d.$watch("topology", function(a, b) {
                a && (l = c.getLinesLinkables(a))
            }, !0), this.registerPlugin = function(a) {
                j.push(a)
            }, d.notifyPlugins = function(a, b) {
                for (var c = 0, d = j.length; c < d; c++) {
                    var e = j[c];
                    "function" == typeof e[a] && e[a](b)
                }
            }, d.$on("notify-plugin", function(a, b) {
                d.notifyPlugins(b.eventName, b.data)
            }), this.registerGateController = function(a, b, c) {
                b && !c && (c = b, b = void 0);
                var d = h(a, b);
                k[d] = c
            }, this.notifyGateControllers = function(a, b) {
                for (var c in k)
                    if (k.hasOwnProperty(c)) {
                        var d = k[c];
                        "function" == typeof d[a] && d[a](b)
                    }
            }, this.getDefaultGateNode = function(a, b, c) {
                return d.drawDefaultGate(a, b, c)
            }, this.drawGate = function(a, b, c, e) {
                return d.drawGate(a, b, c, e)
            }, this.addGate = function(b, c, e, g, h) {
                var i = f(b.type, b.subtype);
                if (void 0 != i && "function" == typeof i.addGate) return i.addGate(b, c, e, g, h);
                var j = a.defer();
                return d.drawDefaultGate(b, g).then(function(a) {
                    j.resolve({
                        node: a,
                        arrayPosition: g,
                        gate: b
                    })
                }, j.reject), j.promise
            }, d.canAddGateIntoPosition = function(a, b) {
                var e = f(a.type, a.subtype),
                    g = i.arrayPositionToIJ(b);
                if (d.isRealDevice && i.hasMeasureBeforePosition(g.i, g.j, a)) return !1;
                if (void 0 != e && "function" == typeof e.canAddGateIntoPosition) return e.canAddGateIntoPosition(a, b);
                var h = c.getGateFromMatrix(b),
                    j = h && (h.isBusy || h.endline);
                return d.getCircle(b) && !j
            }, this.canMoveGateToPosition = function(a, b, c) {
                if (b == c) return !1;
                var d = (this.arrayPositionToIJ(b), this.arrayPositionToIJ(c), f(a.type, a.subtype));
                return void 0 != d && "function" == typeof d.canMoveGateToPosition ? d.canMoveGateToPosition(a, b, c) : this.positionIsAvailable(b)
            }, this.getElementWidth = function() {
                return e[0].getBoundingClientRect().width
            }, this.updateScrollingOffset = function(a) {
                d.scrollingOffset = a
            }, this.setScrollableArea = function(a, b, c, e) {
                d.scrollableArea.attr("x", a), d.scrollableArea.attr("y", b), d.scrollableArea.attr("width", c), d.scrollableArea.attr("height", e)
            }, this.moveDrawableArea = function(a, b) {
                void 0 != a && d.movableArea.transform("t" + [a, 0] + d.movableArea.data("origTransform")), b && d.movableArea.data("origTransform", d.movableArea.transform().local)
            }, this.getUniqueId = function() {
                return d.uniqueId
            }, this.modifyGatesMatrix = function(a, b) {
                void 0 === b ? delete m[a] : m[a] = b, d.isEditable && (c.addGateToMatrix(a, b), d.$emit("gates-matrix-modified", b, a))
            }, this.clearGatesMatrix = function() {
                m = []
            }, this.positionIsAvailable = function(a) {
                return void 0 != a && void 0 == m[a]
            }, this.getGateInPosition = function(a) {
                return m[a]
            }, this.getGatesMatrix = function() {
                return m
            }, this.findLatestColumnWithGates = function(a) {
                a = a || m;
                for (var c = 0, d = 0; d < this.getNumOfLines(); d++)
                    for (var e = 0; e < b.pointsPerLine; e++) {
                        var f = this.IJToArrayPosition({
                            i: d,
                            j: e
                        });
                        a[f] && a[f] && a[f].qasm && e > c && (c = e)
                    }
                return c
            }, this.isRealDevice = function() {
                return d.isRealDevice
            }, this.isGateAllowed = function(a) {
                if (!a) return !0;
                for (var d = 0; d < this.getNumOfLines(); d++)
                    for (var e = 0; e < b.pointsPerLine; e++) {
                        var f = this.IJToArrayPosition({
                                i: d,
                                j: e
                            }),
                            g = c.getGateFromMatrix(f),
                            h = a(g, d, e);
                        if (!h) return !1
                    }
                return !0
            }, this.checkLine = function(a, d, e) {
                if (e || "function" != typeof d || (e = d, d = 0), !e) return !0;
                if (a < 0 || a >= this.getNumOfLines()) return !1;
                for (var f = d; f < b.pointsPerLine; f++) {
                    var g = this.IJToArrayPosition({
                            i: a,
                            j: f
                        }),
                        h = c.getGateFromMatrix(g),
                        i = e(h, a, f);
                    if (!i) return !1
                }
                return !0
            }, this.hasMeasureBeforePosition = function(a, b, c) {
                return !c || "measure" != c.qasm && "measure" != c.name ? !this.checkLine(a, 0, function(a, c, d) {
                    return !a || !a.qasm || d >= b || "measure" != a.qasm & "measure" != a.name
                }) : !this.checkLine(a, 0, function(a, c, d) {
                    return d <= b || !a || !a.qasm
                })
            }, this.isColumnEmpty = function(a) {
                return this.isColumnEmptyFromTo(a, 0)
            }, this.isColumnEmptyFromTo = function(a, b, c) {
                void 0 == c && (c = this.getNumOfQubits());
                for (var d = b; d < c; d++) {
                    var e = this.IJToArrayPosition({
                        i: d,
                        j: a
                    });
                    if (void 0 != m[e]) return !1
                }
                return !0
            }, this.isLineEmpty = function(a, c, d) {
                var e = c || 0;
                for (d = d || b.pointsPerLine, e; e < d; e++) {
                    var f = this.IJToArrayPosition({
                        i: a,
                        j: column
                    });
                    if (void 0 != m[f]) return !1
                }
                return !0
            }, this.getCregs = function() {
                return d.topology.cregs
            }, this.getCreg = function(a) {
                return a -= this.getNumOfQubits(), d.topology.cregs[a]
            }, this.getNumOfQubits = function() {
                return c.getNumOfQubits(d.topology)
            }, this.getNumOfCRegs = function() {
                return c.getNumOfCRegs(d.topology)
            }, this.getNumOfLines = function() {
                return c.getNumOfLines(d.topology)
            }, this.getLinkableQubitsIndexes = function() {
                return l
            }, this.getLineHeight = function(a) {
                return d.lines[a] ? d.lines[a].getCenter().y : b.verticalSpacing * a + b.initialY
            }, this.getCanvasCenter = function(a) {
                var b = d.getCircle(a);
                return b ? b.getCenter() : void 0
            }, this.canGateBePlacedInLine = function(a, b) {
                var c = !0;
                switch (a.subtype) {
                    case "link":
                        c = !l || 0 == l.length || l.indexOf(b) !== -1
                }
                return c
            }, this.hightlightCregs = function(a) {
                for (var c = a ? b.nodeColor2 : b.lineColor2, e = a ? b.lineWidth + 2 : b.lineWidth, f = this.getNumOfLines(), g = this.getNumOfQubits(); g < f; g++) d.lines[g].attr({
                    stroke: c,
                    strokeWidth: e
                })
            }, this.toggleLinkableLines = function(a) {
                var b = this.getLinkableQubitsIndexes();
                i.toggleLines(b, a)
            }, this.toggleLines = function(a, c) {
                var e = c ? b.nodeColor2 : b.lineColor,
                    f = c ? b.lineWidth + 2 : b.lineWidth;
                if (!a || 0 == a.length || !c) {
                    var g = this.getNumOfQubits();
                    c || (g = this.getNumOfQubits()), a = Array.apply(null, {
                        length: g
                    }).map(Number.call, Number)
                }
                for (var h = 0; h < a.length; h++) d.lines[a[h]] && d.lines[a[h]].attr({
                    stroke: e,
                    strokeWidth: f
                })
            }, this.getCanvasScale = function() {
                var a = (d.viewBoxSize.width / this.getElementWidth()).toFixed(6);
                return a
            }, this.getCanvasPosition = function(a, c) {
                var d = b.dropPointsSpacing * a.j,
                    e = b.initialX + b.dropPointsOffset,
                    f = e + d,
                    g = this.getLineHeight(a.i);
                return c && c["if"] && c["if"].gate && "subroutine" === c["if"].gate.type && (g += b.verticalSpacing / 2), {
                    x: f,
                    y: g
                }
            }, this.clearPositionAndNode = function(a, b) {
                b = "undefined" == typeof b || b;
                var c = a.data("arrayPosition"),
                    e = this.getGateInPosition(c);
                if (b && this.modifyGatesMatrix(c, void 0), e && e.linkedGates)
                    for (var f = 0; f < e.linkedGates.length; f++) {
                        var g = this.IJToArrayPosition(e.linkedGates[f]);
                        b && this.modifyGatesMatrix(g, void 0)
                    }
                if (a.remove(), d.gatesNodesMatrix[c]) {
                    var h = d.gatesNodesMatrix[c].parts;
                    if (h)
                        for (var i = 0; i < h.length; i++) h[i].undrag(), h[i].remove();
                    d.gatesNodesMatrix[c] = void 0
                }
            }, this.clearNodeByPosition = function(a, b) {
                b = "undefined" == typeof b || b;
                var c = d.gatesNodesMatrix[a];
                c && c.node ? this.clearPositionAndNode(c.node, b) : b && this.modifyGatesMatrix(a, void 0)
            }, this.arrayPositionToIJ = function(a) {
                var c = Math.floor(a / b.pointsPerLine),
                    d = a % b.pointsPerLine;
                return {
                    i: c,
                    j: d
                }
            }, this.IJToArrayPosition = function(a) {
                return a.i * b.pointsPerLine + a.j
            }, this.findMatrixPosition = function(a) {
                for (var c = Math.round((a.x - b.initialX - b.dropPointsOffset) / b.dropPointsSpacing), e = d.lines.length - 1, f = 0; f < d.lines.length; f++) {
                    var g = this.getLineHeight(f);
                    if (a.y < g + 15) {
                        if (f > 0 && a.y - this.getLineHeight(f - 1) <= g - a.y) {
                            e = f - 1;
                            break
                        }
                        e = f;
                        break
                    }
                }
                return c <= 0 && (c = 0), {
                    i: e,
                    j: c
                }
            }, this.highlightCircle = function(a) {
                d.highlightCircle(a)
            }, this.toggleCircles = function(a, b) {
                d.toggleCircles(a, b)
            }, this.getPaper = function() {
                return d.s
            }, this.isEditable = function() {
                return d.isEditable
            }, this.isLoadingGates = function() {
                return d.loadingGates
            }, this.getTopology = function() {
                return d.topology
            }
        }],
        link: {
            pre: function(g, j, k, l) {
                var m = l;
                g.showLoading = !0, f(function() {
                    function k(a) {
                        return function(b) {
                            console.log("getGatesParamsHandler", b), m.clearNodeByPosition(a.arrayPosition);
                            var c = E[a.arrayPosition],
                                d = c.getCenter(),
                                e = angular.copy(a.gate);
                            e.params = b, g.drawGate(e, d.x, d.y)
                        }
                    }

                    function l(a) {
                        var c = m.getNumOfLines();
                        g.viewBoxSize.width = a || g.width || b.defaultSize.width, c ? g.viewBoxSize.height = b.bottomMargin + m.getLineHeight(c - 1) : g.viewBoxSize.height = b.defaultSize.height, B.attr({
                            viewBox: "0 0 " + g.viewBoxSize.width + " " + g.viewBoxSize.height,
                            height: "100%",
                            width: "100%"
                        }), j[0].style.paddingTop = Math.round(g.viewBoxSize.height / g.viewBoxSize.width * 100) + "%", g.notifyPlugins("resized", g.viewBoxSize)
                    }

                    function n(a) {
                        for (var b in g.gatesNodesMatrix) {
                            var c = parseInt(b);
                            g.gatesNodesMatrix[c] && g.gatesNodesMatrix[c].node && m.clearPositionAndNode(g.gatesNodesMatrix[c].node, a)
                        }
                        a && m.clearGatesMatrix()
                    }

                    function o(b) {
                        return a(function(a, c) {
                            m.initializedPromise ? m.initializedPromise.then(function() {
                                n(!0), m.initializedPromise = p(b), m.initializedPromise.then(function() {
                                    a()
                                }, c)
                            }, c) : (n(!0), m.initializedPromise = p(b), m.initializedPromise.then(function() {
                                a()
                            }, c))
                        })
                    }

                    function p(d) {
                        g.loadingGates = !0;
                        var e = [],
                            f = Math.round((g.viewBoxSize.width - b.initialX) / b.dropPointsSpacing);
                        if (d) {
                            g.isEditable && c.setGatesMatrix([]);
                            var h = !1,
                                i = c.getNumOfQubits(g.topology);
                            for (var j in d) {
                                var k = d[j];
                                if (k && k.type && !k.endline) {
                                    var n = m.arrayPositionToIJ(j);
                                    if (n && n.i < i) {
                                        var o = b.dropPointsSpacing * n.j,
                                            p = b.initialX + b.dropPointsOffset,
                                            q = m.getLineHeight(n.i),
                                            r = o + p;
                                        h = h || n.j >= f;
                                        var s = g.drawGate(k, r, q, !g.displayStrict);
                                        e.push(s)
                                    }
                                }
                            }
                            if (g.isEditable || g.notifyPlugins("toggleScrollBar", h), g.printable) {
                                var t = 0,
                                    u = m.findLatestColumnWithGates(d);
                                u < f && (u = f - 2), t = (u + 3) * b.dropPointsSpacing, g.notifyPlugins("toggleScrollBar", !1), l(t)
                            } else l()
                        }
                        var v = a.all(e);
                        return v.then(function(a) {
                            g.loadingGates = !1
                        }, function(a) {
                            g.loadingGates = !1
                        }), v
                    }

                    function q() {
                        var b = a.defer();
                        return m.initializedPromise ? m.initializedPromise.then(function() {
                            n(!0), m.initializedPromise = r(), m.initializedPromise.then(function() {
                                g.toggleCircles(!1), b.resolve()
                            }, b.reject)
                        }, b.reject) : (n(!0), m.initializedPromise = r(), m.initializedPromise.then(function() {
                            g.toggleCircles(!1), b.resolve()
                        }, b.reject)), b.promise
                    }

                    function r() {
                        if (g.lines && g.lines.length > 0) {
                            for (var c = 0; c < g.lines.length; c++) {
                                var d = g.lines[c];
                                d && (d.label && d.label.remove(), d.parts && d.parts.remove(), d.remove())
                            }
                            g.lines = []
                        }
                        D && D.remove(), D = g.playgroundArea.g();
                        var f = [],
                            j = g.topology;
                        if (j) {
                            var k = 0,
                                l = .4,
                                n = [];
                            if ((!j.qregs || 1 === j.qregs.length && !j.qregs[0].size) && !j.qubits) return a.all(f);
                            j.qregs || (j.qregs = [{
                                name: "q",
                                size: j.qubits
                            }]), f.push(h);
                            for (var o = 0; o < j.qregs.length; o++) {
                                var p = j.qregs[o];
                                p.size = parseInt(p.size);
                                for (var c = 0; c < p.size; c++) {
                                    var q = c + k,
                                        r = b.verticalSpacing * (c + k + o * l),
                                        s = b.lengthOfLines + b.initialX,
                                        d = g.playgroundArea.line(0, b.initialY + r, s, b.initialY + r).attr({
                                            fill: "none",
                                            stroke: b.lineColor,
                                            strokeWidth: b.lineWidth,
                                            strokeLinecap: "round"
                                        });
                                    d.data("index", q), d.data("qreg", p), g.lines[q] = d,
                                        function(a, c, d, f) {
                                            h.then(function(h) {
                                                var i = h.clone(),
                                                    j = a + "[" + c + "]",
                                                    k = e.getTextLabel(B, 0, 5, j),
                                                    l = B.g();
                                                i.transform("translate(" + (k.getSize().w + 5) + ", 0)"), l.append(i), l.append(k);
                                                var m = new Snap.Matrix,
                                                    n = 1.7;
                                                m.translate(b.defaultScrollableArea.x - l.getSize().w * n + b.drawableAreaMargin / 2, b.initialY + f + 2 - l.getSize().h * n / 2), m.scale(n), l.transform(m), g.lines[d].label = l, B.select("#" + g.uniqueId + "-fixedGroup").append(l)
                                            })
                                        }(p.name.substring(0, 5), c, q, r);
                                    for (var t = 0; t < b.pointsPerLine; t++) {
                                        n[t] || (n[t] = D.g());
                                        var u = m.IJToArrayPosition({
                                                i: q,
                                                j: t
                                            }),
                                            v = b.dropPointsSpacing * t,
                                            w = b.initialX + b.dropPointsOffset,
                                            x = w + v,
                                            y = b.initialY + r,
                                            z = B.circle(x, y, b.dotsRad);
                                        z.data("i", q), z.data("j", t), E[u] = z, n[t].add(z)
                                    }
                                }
                                k += parseInt(p.size)
                            }
                            var A = m.getLineHeight(k - 1) + b.verticalSpacing * (1 + l);
                            j.cregs || (j.cregs = [{
                                name: "c",
                                size: j.qregs[0].size
                            }]);
                            for (var c = 0; c < j.cregs.length; c++) {
                                var C = j.cregs[c],
                                    s = b.lengthOfLines + b.initialX,
                                    r = A + b.verticalSpacing * c,
                                    F = b.lineWidth,
                                    d = g.playgroundArea.line(b.initialX - 35, r, s, r).attr({
                                        fill: "none",
                                        stroke: b.lineColor2,
                                        strokeWidth: F,
                                        strokeLinecap: "round"
                                    }),
                                    G = g.playgroundArea.line(b.initialX - 23, r - 14, b.initialX - 33, r + 10).attr({
                                        fill: "none",
                                        stroke: b.lineColor2,
                                        strokeWidth: F,
                                        strokeLinecap: "round"
                                    }),
                                    H = g.playgroundArea.text(b.initialX - 40, r - 9, parseInt(C.size)).attr({
                                        fill: "#000",
                                        "font-size": "11px"
                                    }),
                                    q = c + k;
                                d.data("index", q), d.data("creg", C);
                                var I = g.playgroundArea.g(G, H);
                                d.parts = I, g.lines[q] = d,
                                    function(a, c, d, h) {
                                        f.push(i), i.then(function(c) {
                                            var f = c.clone(),
                                                i = e.getTextLabel(B, 0, 2, a),
                                                j = B.g();
                                            f.transform("translate(" + (i.getSize().w + 6) + ", 0)"), j.append(f), j.append(i);
                                            var k = new Snap.Matrix,
                                                l = 1.7;
                                            k.translate(b.defaultScrollableArea.x - j.getSize().w * l + b.drawableAreaMargin / 2, h + 2 - j.getSize().h * l / 2), k.scale(l), j.transform(k), g.lines[d].label = j, B.select("#" + g.uniqueId + "-fixedGroup").append(j)
                                        })
                                    }(C.name.substring(0, 5), c, q, r)
                            }
                            return a.all(f)
                        }
                    }

                    function s(a, b) {
                        var c = a.data("arrayPosition");
                        if (g.gatesNodesMatrix[c]) {
                            var d = g.gatesNodesMatrix[c].parts;
                            if (d)
                                for (var e = 0; e < d.length; e++) b ? d[e].show() : d[e].hide()
                        }
                    }

                    function t(a) {
                        if (g.trash)
                            if (C && C.stop(), a) {
                                var c = b.initialX - b.drawableAreaMargin / 2;
                                c = c.toFixed(2);
                                var d = new Snap.Matrix;
                                d.translate(c, 2), g.trash.transform(d), g.trash.show(), C = g.trash.animate({
                                    opacity: 1
                                }, 200)
                            } else C = g.trash.animate({
                                opacity: 0
                            }, 200, function() {
                                this.hide()
                            })
                    }

                    function u(a, b) {
                        m.modifyGatesMatrix(a, b)
                    }

                    function v(a) {
                        return a.x >= b.initialX - b.dotsRad - b.drawableAreaMargin && a.x <= b.initialX + b.lengthOfLines + b.dotsRad + b.drawableAreaMargin && a.y >= b.initialY - b.dotsRad - b.drawableAreaMargin && a.y <= m.getLineHeight(m.getNumOfLines() - 1) + b.dotsRad + b.drawableAreaMargin
                    }

                    function w(a) {
                        var b, d = function(a, b, c, d, e) {
                                var f = this.transform().diffMatrix.invert();
                                f.e = f.f = 0;
                                var h = f.x(a, b),
                                    i = f.y(a, b);
                                this.transform("t" + [h, i] + this.data("origTransform"));
                                var j = this.getCenter();
                                if (v(j)) {
                                    var k = m.findMatrixPosition(j);
                                    g.highlightCircle(k)
                                }
                            },
                            e = function() {
                                s(this, !1), this.data("origTransform") || this.data("origTransform", this.transform().local), b && f.cancel(b), b = f(function() {
                                    g.toggleCircles(!0), t(!0)
                                }, 200);
                                var a = this.data("arrayPosition"),
                                    d = c.getGateFromMatrix(a);
                                d && d.subtype && "link" == d.subtype && m.toggleLinkableLines(!0)
                            },
                            h = function(a) {
                                b && f.cancel(b), g.toggleCircles(!1), t(!1), m.toggleLinkableLines(!1);
                                var d = x(this),
                                    e = this.data("arrayPosition"),
                                    h = c.getGateFromMatrix(e);
                                if (Snap.path.isBBoxIntersect(this.getBBox(), g.trash.getBBox())) return g.$emit("show-notification", "Gate deleted.", "info"), m.clearPositionAndNode(this), void g.toggleSelectedGate();
                                if (h && void 0 != d) {
                                    var i = e,
                                        j = E[d];
                                    if (j) {
                                        var k = j.clone().attr({
                                            fill: "none"
                                        });
                                        if (k.transform("s1.8"), Snap.path.isBBoxIntersect(this.getBBox(), k.getBBox()) && m.canMoveGateToPosition(h, d, i)) {
                                            m.clearPositionAndNode(this);
                                            var l = j.getCenter();
                                            g.toggleSelectedGate(), g.drawGate(h, l.x, l.y)
                                        } else this.attr({
                                            transform: this.data("origTransform")
                                        });
                                        k.remove()
                                    } else this.attr({
                                        transform: this.data("origTransform")
                                    })
                                } else this.attr({
                                    transform: this.data("origTransform")
                                });
                                s(this, !0)
                            };
                        a.drag(d, e, h)
                    }

                    function x(a) {
                        var b = a.getCenter();
                        return y(b)
                    }

                    function y(a) {
                        if (v(a)) {
                            var b = m.findMatrixPosition(a);
                            return m.IJToArrayPosition(b)
                        }
                    }

                    function z(a, b) {
                        if (void 0 != b) {
                            var c = new Snap.Matrix,
                                d = b.getCenter().x - a.getSize().w / 2;
                            d = d.toFixed(2);
                            var e = b.getCenter().y - a.getSize().h / 2;
                            e = e.toFixed(2), c.translate(d, e), a.transform(c)
                        }
                    }
                    var A = j.children()[0],
                        B = Snap(A);
                    g.s = B, B.mousedown(function(a) {
                        a.defaultPrevented || g.toggleSelectedGate()
                    }), g.toggleSelectedGate = function(a, b) {
                        g.$apply(function() {
                            var c = !1;
                            a && a.hasClass("gateSelected") ? (g.selectedGateResult = void 0, a.removeClass("gateSelected")) : (g.selectedGateResult && g.selectedGateResult.node.removeClass("gateSelected"), g.selectedGateResult = b, c = void 0 !== b, a && a.addClass("gateSelected"));
                            var d = c ? b.gate : void 0;
                            g.$emit("gate-selected", d, k(b))
                        })
                    }, g.showMatrix = function() {
                        console.log(m.getGatesMatrix()), console.log(c.getGatesMatrix())
                    };
                    var C;
                    g.gatesNodesMatrix = [], g.lines = [], g.loadingGates = !1, g.scrollingOffset = 0, g.scrollableArea = B.select("#" + g.uniqueId + "-scrollableAreaClipPath-rect"), g.movableArea = B.select("#" + g.uniqueId + "-movableArea"), g.gatesArea = B.select("#" + g.uniqueId + "-gates"), g.playgroundArea = B.select("#" + g.uniqueId + "-playground"), g.movableArea.data("origTransform", g.movableArea.transform().local), g.viewBoxSize = {
                        width: g.width || b.defaultSize.width,
                        height: b.defaultSize.height
                    };
                    var D, E = [];
                    g.getCircle = function(a) {
                        return E[a]
                    }, g.isEditable && Snap.load("/img/trash.svg", function(a) {
                        var b = a.select("g");
                        t(!1), b.attr({
                            display: "none"
                        }), B.select("#" + g.uniqueId + "-fixedGroup").prepend(b), g.trash = b
                    }), g.drawDefaultGate = function(b, c, e) {
                        var f = a.defer();
                        return d.getGateSVG(b).then(function(a) {
                            (!a.gateLabel || e && e.textLabel) && (a.gateLabel = d.getDefaultGateLabel(B, b, a.background, e)), B.append(a.background), B.append(a.gateLabel);
                            var h = B.group(a.background, a.gateLabel);
                            g.gatesArea.append(h), z(h, E[c]), f.resolve(h)
                        }, f.reject), f.promise
                    }, l(), g.$on("clear-playground", function(a) {
                        n()
                    }), g.$watch("topology", function(a, b) {
                        void 0 == a || a.id && a.id == b.id || angular.equals(a, b) ? l() : (q(), l())
                    }, !0), g.$watch("gatesMatrix", function(a, b) {
                        a && a.length && o(a).then(function() {
                            f(function() {
                                g.$emit("visual-qasm-refreshed", {
                                    error: !1
                                })
                            }, 100)
                        }, function() {
                            g.$emit("visual-qasm-refreshed", {
                                error: !0
                            })
                        })
                    }), g.$watch("width", function(a, b) {
                        a != b && l(a)
                    }), m.initializedPromise = q(), m.initializedPromise.then(function() {
                        g.showLoading = !1
                    }), g.highlightCircle = function(a) {
                        var c = m.IJToArrayPosition(a),
                            d = E[c];
                        d && d.animate({
                            fill: b.dotHighlightColor
                        }, 300, mina.easein, function() {
                            d.animate({
                                fill: b.lineColor
                            }, 300, mina.easein, function() {})
                        })
                    }, g.toggleCircles = function(a, b) {
                        if (D) {
                            var c = D.selectAll("g");
                            a ? c.forEach(function(a, c) {
                                void 0 != b && b != c || a.show()
                            }) : c.forEach(function(a, c) {
                                void 0 != b && b != c || a.hide()
                            })
                        }
                    }, g.toggleCircles(!1), angular.isDefined(g.showDots) && g.$watch("showDots", function(a, b) {
                        g.toggleCircles(a)
                    }), angular.isDefined(g.showLinkableLines) && g.$watch("showLinkableLines", function(a, b) {
                        m.toggleLinkableLines(a)
                    }), g.onGateDrop = function(a, b) {
                        if (b && b.type) {
                            var d = m.getCanvasScale(),
                                e = c.getMouseEventPos(a, g.uniqueId),
                                f = e.x * d;
                            f += g.scrollingOffset;
                            var h = e.y * d,
                                i = {};
                            angular.copy(b, i), g.drawGate(i, f, h)
                        }
                    }, g.drawGate = function(b, d, e, f) {
                        var h = a.defer();
                        m.lastGate = b;
                        var i, j = y({
                            x: d,
                            y: e
                        });
                        void 0 !== j && (i = c.getGateFromMatrix(j));
                        m.arrayPositionToIJ(j);
                        if (f || g.canAddGateIntoPosition(b, j)) {
                            if (!m.positionIsAvailable(j)) {
                                var k = g.gatesNodesMatrix[j];
                                k && k.node && m.clearPositionAndNode(k.node, !0)
                            }
                            m.addGate(b, d, e, j, i).then(function(a) {
                                u(a.arrayPosition, a.gate), a.node.data("arrayPosition", a.arrayPosition), g.gatesNodesMatrix[a.arrayPosition] = {
                                    node: a.node,
                                    parts: a.parts
                                }, g.isEditable && (a.node.mousedown(function(b) {
                                    b.preventDefault(), g.toggleSelectedGate(a.node, a)
                                }), a.node.dblclick(function(b) {
                                    b.preventDefault(), m.clearPositionAndNode(this), g.toggleSelectedGate(a.node)
                                }), w(a.node)), m.notifyGateControllers("onGateAdded", {
                                    gate: a.gate,
                                    canvas: {
                                        x: d,
                                        y: e
                                    }
                                }), h.resolve(a.node)
                            }, function(a) {
                                a && a.node ? m.clearPositionAndNode(a.node) : m.clearNodeByPosition(j), i && g.drawGate(i, d, e);
                                var b = a && a.message ? a.message : "You can't drop the gate there.";
                                g.$emit("show-notification", b, "warning"), h.reject({
                                    code: "GATE_DROP_ERROR"
                                })
                            })
                        } else m.toggleLinkableLines(!1), g.$emit("show-notification", "Can't drop the gate there.", "warning"), h.reject({
                            code: "GATE_DROP_ERROR"
                        });
                        return h.promise
                    }
                })
            }
        }
    }
}]), angular.module("qubitsApp").controller("accountController", ["$scope", "User", "$location", "User", "UpgradeRequest", "userService", "$uibModal", "$stateParams", function(a, b, c, b, d, e, f, g) {
    function h(c) {
        return /^\w+$/.test(c.usernamePublic) ? c.usernamePublic.length < 5 ? void a.$emit("show-notification", "Username is too short", "error") : c.usernamePublic.length > 21 ? void a.$emit("show-notification", "Username is too long", "error") : void b.updateUsernamePublic({
            id: c.id,
            usernamePublic: c.usernamePublic
        }, function(b) {
            e.getCurrent(!0).then(function(b) {
                a.msg = {
                    type: "success",
                    text: "User updated correctly"
                }
            }, function(b) {
                a.msg = {
                    type: "error",
                    text: "Can't update user correctly"
                }
            })
        }, function(b) {
            422 === b.status ? a.$emit("show-notification", "This username already exists. Set a different one.", "error") : "PUBLIC_USERNAME_SHORT_LENGHT" === b.data.error.code || "PUBLIC_USERNAME_NOT_VALID" === b.data.error.code ? a.$emit("show-notification", "Username is too short", "error") : a.$emit("show-notification", "An error ocurred.", "error")
        }) : void a.$emit("show-notification", "Invalid username. Only allow [a-zA-Z0-9_] characters", "error");
    }

    function i(b) {
        return e.getApiToken(b).then(function(b) {
            a.apiToken = b
        }, function(b) {
            a.$emit("show-notification", "Error regenerating api token.", "error")
        })
    }
    a.code = "", a.story = "", a.isUserWithPrivileges = !1, a.apiToken = "";
    var j, k;
    e.isUserWithPrivileges().then(function(b) {
        b ? a.isUserWithPrivileges = !0 : a.isUserWithPrivileges = !1
    }), e.getCurrent().then(function(b) {
        a.usernamePublic = b.usernamePublic, a.user = b, d.isRequestAllow({}, {}, function(b) {
            b && !b.isAllow ? a.requestPending = !0 : a.requestPending = !1
        }, function(b) {
            console.log("Error: ", b), a.requestPending = !1
        })
    }), i(!1), a.regenerateToken = function() {
        var a = !0;
        return i(a)
    }, a.backSection = function() {
        window.history.go(-1)
    }, a.insertRequest = function(b, c) {
        a.sendingRequest = !0, d.request({
            story: b,
            institution: c
        }, function(b) {
            a.sendingRequest = !1, j && (a.$emit("show-notification", "Thanks, your request has been sent!", "success"), a.requestPending = !0, j.dismiss("close"))
        }, function(b) {
            a.sendingRequest = !1, a.$emit("show-notification", "Sorry, there was an error trying to send your request.", "error")
        })
    }, a.upgradeRequest = function() {
        j = f.open({
            animation: a.animationsEnabled,
            templateUrl: "templates/account_upgrade_request.html",
            size: "large",
            scope: a,
            controller: ["$scope", "$uibModalInstance", function(a, b) {
                a.sendUpgradeRequest = function() {
                    a.requestUpgradeForm.$valid && a.insertRequest(a.story, a.user.institution)
                }
            }]
        })
    }, a.sendVerifyEmailAddressRequest = function(c) {
        a.requestVerification = !0, b.sendVerificationRequest({
            id: b.getCurrentId()
        }, {
            email: c
        }, function(b) {
            a.requestVerification = !1, j && (a.$emit("show-notification", "An email has been sent to " + c + ". Please review your inbox.", "success"), j.dismiss("close"), e.getCurrent(!0), a.user.email = c)
        }, function(b) {
            a.requestVerification = !1, b && b.data && b.data.error && "EMAIL_NOT_VALID" === b.data.error.code ? a.$emit("show-notification", "Sorry, the email that you provide is not valid.", "error") : a.$emit("show-notification", "Sorry, there was an error trying to verify your email.", "error")
        })
    }, a.openVerifyEmail = function() {
        var b = a.user.email.indexOf("@quantumexperience.ibm.com") === -1 ? a.user.email : "";
        a.emailToVerify = a.emailToVerify || b, j = f.open({
            animation: a.animationsEnabled,
            templateUrl: "templates/email_verification_request.html",
            size: "large",
            scope: a,
            controller: ["$scope", "$uibModalInstance", function(a, b) {
                a.verifyEmailAddress = function() {
                    a.verifyEmailForm.$valid && a.sendVerifyEmailAddressRequest(a.emailToVerify)
                }
            }]
        })
    }, a.applyCode = function(c, d) {
        d ? b.applyCreditPromotional({
            id: c.id,
            code: d
        }, {}, function(b) {
            e.getCurrent(!0).then(function(b) {
                a.user = b
            }), a.$emit("show-notification", "Promotional Code added Successfully", "success")
        }, function(b) {
            a.$emit("show-notification", "Promotional Code is not valid or already used", "error")
        }) : a.$emit("show-notification", "Promotional Code EMPTY", "error")
    }, a.saveUser = function(c) {
        var d = !0;
        return a.usernamePublic !== c.usernamePublic && (d = !1, h(c)), a.user = c, b.prototype$updateAttributes({
            id: a.user.id
        }, {
            institution: a.user.institution
        }).$promise.then(function() {
            e.clearCurrent(), d && (a.msg = {
                type: "success",
                text: "User updated correctly"
            })
        }, function() {
            d && (a.msg = {
                type: "error",
                text: "Can't update user correctly"
            })
        })
    }, a.subscriptionsCommunity = function() {
        k = f.open({
            animation: a.animationsEnabled,
            templateUrl: "templates/community/subscriptionsPopup.html",
            size: "large",
            scope: a,
            controller: "subscriptionsCommunityPopUpController"
        })
    }, g.preferences === !0 && a.subscriptionsCommunity()
}]), angular.module("qubitsApp").controller("codesController", ["$rootScope", "$scope", "$state", "User", function(a, b, c, d) {
    var e = d.getCurrentId();
    d.getLastCodes({
        id: e
    }, function(a) {
        b.codes = a.codes, b.countCodes = a.count
    })
}]), angular.module("qubitsApp").controller("commonController", ["$rootScope", "$scope", "$timeout", "$location", "$state", "$stateParams", "$uibModal", "$q", "promptDialog", "userService", "User", "Code", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    function m() {
        j.isAuthenticated() && (j.getCurrentWithUserType().then(function(a) {
            a.userType && (b.isExpert = "Expert" == a.userType.type, b.isStudent = "Student" == a.userType.type)
        }), j.getCurrentWithRoles().then(function(a) {
            b.isAdmin = j.isAdmin(), b.isAdminOrStaff = j.isAdminOrStaff()
        }))
    }
    console.log("commonController"), a.$state = e, !a.loggedInUser || a.loggedInUser.additionalData && a.loggedInUser.additionalData.viewedWelcome || (k.prototype$updateAttributes({
        id: k.getCurrentId()
    }, {
        additionalData: {
            viewedWelcome: !0
        }
    }, function(b) {
        a.loggedInUser.additionalData.viewedWelcome = !0
    }, function(a) {}), c(function() {
        g.open({
            templateUrl: "templates/welcomePopup.html",
            size: "lg",
            scope: b
        })
    })), b.isExpert = !1, b.isStudent = !1, b.isAdmin = !1, b.isAdminOrStaff = !1, m(), b.$on("userLoginEvent", function(a, b) {
        m()
    }), b.setCodeDescription = function(a) {
        return h(function(c, d) {
            i({
                title: "Set a description for your experiment",
                input: !0,
                textarea: !0,
                label: "Description",
                value: a.description ? a.description.en : ""
            }).then(function(e) {
                a && a.id && !a.fromTutorial ? l.prototype$updateAttributes({
                    id: a.id
                }, {
                    description: {
                        en: e
                    },
                    updateSpecificAttributes: !0
                }, function(a) {
                    c(a)
                }, function(a) {
                    b.$emit("show-notification", "We couldn't save your code description.", "danger"), d(a)
                }) : (a.description = {
                    en: e
                }, c(a))
            }, function(a) {
                d(a)
            })
        })
    }, b.getRoleUser = function(a) {
        var b;
        if (a && a.roles && a.roles.length > 0)
            for (var c = 0; c < a.roles.length; c++) {
                var d = a.roles[c];
                "admin" === d || "staff" === d && (b = "IBM Staff")
            }
        return b
    }
}]), angular.module("qubitsApp").controller("communityController", ["$rootScope", "$scope", "$q", "userService", "User", "$location", "$timeout", "$anchorScroll", "$stateParams", "loginModal", "Stats", "CommunityQuestion", "CommunityAnswer", "CommunityCategory", "CommunityReaction", "communityService", "$uibModal", "$state", "loopbackClientCache", "NotifyingService", "amMoment", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u) {
    function v(a) {
        b.loadingBackground = a
    }

    function w(c) {
        b.isQuestion = c, b.user = angular.copy(a.loggedInUser), b.user.usernamePublic = b.user.username.split("@")[0].split(".").join(""), b.modalInstanceUsername = q.open({
            animation: b.animationsEnabled,
            templateUrl: "templates/community/usernamePublicPopup.html",
            controller: "userNamePublicPopupController",
            backdrop: "static",
            scope: b
        })
    }

    function x(c, d, e) {
        b.searchingQuestions = !0, e || (a.loadingCommunity = !0);
        var f = {},
            g = !1,
            h = {},
            i = !1;
        if (h = angular.copy(c, h), h.where.text && h.where.text.regexp && (f.text = h.where.text.regexp.toLowerCase(), g = !0, i = !0), attr = "byUser", h.where.byuser && h.where.byuser.regexp && (f[attr] = h.where.byuser.regexp.toLowerCase(), i = !0), attr = "categories", h.where[attr] && h.where[attr].regexp) f[attr] = [h.where[attr].regexp.toLowerCase()], i = !0;
        else {
            var j = b.categoriesQuestion.filter(function(a) {
                return void 0 !== a.id
            });
            f[attr] = j.map(function(a) {
                return a.id
            })
        }
        attr = "tag", h.where[attr] && h.where[attr].regexp && (f[attr] = h.where[attr].regexp.toLowerCase(), i = !0), i || (f.title = "/.*/");
        var k = {};
        f && (k.q = f), void 0 !== h.bookmark && (k.bookmark = h.bookmark), k.limit = h.limit || 10, s.get(l, "searchIndex", {
            query: k
        }, {}, function(c) {
            if (a.typeTextFound = {}, a.infoSearch = {}, a.searchText = b.searchFor, b.categoriesQuestion.selected && b.categoriesQuestion.selected.id && (a.categorySelected = b.categoriesQuestion.selected), a.questionsFind = c.results, g || b.searchByUser ? (a.searchUser = b.searchByUser, a.viewFind = !0) : (a.searchUser = void 0, a.viewFind = !1), a.questions = c.results, v(!1), d && (a.bookmarks.index++, void 0 === a.bookmarks.values[a.bookmarks.index] && (a.bookmarks.values[a.bookmarks.index] = c.bookmark)), a.totalQuestions = c.total, b.noMore = a.bookmarks.skip + E >= a.totalQuestions, a.loadingCommunity = !1, b.searchingQuestions = !1, !b.noMore) {
                var e = {};
                e.q = k.q, e.bookmark = c.bookmark, e.limit = k.limit, s.get(!1, l, "searchIndex", {
                    query: e
                }, {}, function(a) {}, function(a) {
                    console.log("Error: ", a)
                })
            }
        }, function(c) {
            b.$emit("show-notification", "Error trying to get entries.", "error"), b.inSearch = !1, b.searchingQuestions = !1, a.loadingCommunity = !1, v(!1)
        })
    }

    function y() {
        a.bookmarks || (a.bookmarks = {}, a.bookmarks.filter = {
            limit: E,
            where: {}
        }), a.questionsFind && 0 !== a.questionsFind.length ? (b.searchingQuestions = !1, b.noMore = a.bookmarks.skip + E >= a.totalQuestions, a.loadingCommunity = !1) : (a.questionsFind = [], a.questions = [], D.then(function() {
            b.findQuestions()
        }))
    }

    function z(a) {
        d.getCurrent().then(function(c) {
            c.usernamePublic ? a ? r.go("playground.section.community.questionEdit") : (b.checkUserNamePublic = !0, y()) : a ? w(a) : y()
        }, function(a) {
            y()
        })
    }

    function A(a, b) {
        if (a.length > 80) {
            for (var c = b.length, d = b.split(" "), e = 0, f = 0; f < d.length; f++)
                if (a.toLowerCase().indexOf(d[f].toLowerCase()) >= 0) {
                    e = a.toLowerCase().indexOf(d[f].toLowerCase()), c = d[f].length;
                    break
                }
            return e >= 0 ? e < 40 ? a.length > 80 ? a.substring(0, 80) + "..." : a.substring(0, 80) : e + 40 > a.length ? "..." + a.substring(e - 40 - (40 - (a.length - e)), a.length) : "..." + a.substring(e - 40, e + 40 + c) + "..." : a.length > 80 ? a.substring(0, 80) + "..." : a.substring(0, 80)
        }
        return a
    }

    function B(a, b) {
        for (var c = a.split(" "), d = 0, e = 0; e < c.length; e++) b.toLowerCase().indexOf(c[e].toLowerCase()) >= 0 && d++;
        return d
    }

    function C(a, b) {
        for (var c = a.split(" "), d = 0; d < c.length; d++) {
            var e = new RegExp(c[d], "ig"),
                f = "<b>" + c[d] + "</b>";
            b = b.replace(e, f)
        }
        return b
    }
    a.loadingCommunity = !0, b.loadingBackground = !1, b.checkUserNamePublic = !1, b.noMore = !0, b.searchFor = "", b.searchAdvanced = !1, b.searchByUser = "", b.channel = i.channel;
    var D = c(function(c, d) {
        p.categories().then(function(d) {
            for (var e = {}, f = d.filter(function(a) {
                    return "forum" == b.channel && !a.type || b.channel == a.type
                }), g = 0; g < f.length; ++g) {
                var h = f[g];
                e[h.id] = h
            }
            b.categoriesMap = e, b.categoriesQuestion = f, b.categoriesQuestion.unshift(F), a.categorySelected ? b.categoriesQuestion.selected = a.categorySelected : b.categoriesQuestion.selected = F, i.tagToFind ? (b.checkUserNamePublic = !0, b.findQuestionsByTag(i.tagToFind)) : z(), c(b.categoriesQuestion)
        }, d)
    });
    b.$watch("channel", function(a) {
        b.clearSearch()
    }), a.typeTextFound || (a.typeTextFound = {}), a.infoSearch || (a.infoSearch = {}), a.searchText && (b.searchFor = a.searchText), a.searchUser && (b.searchByUser = a.searchUser, b.searchAdvanced = !0), a.viewFind || (a.viewFind = !1), p.categories().then(function(a) {
        b.groupCategories = a.filter(function(a) {
            return a.type
        }), b.groupCategories[0].active = !0
    }), s.get(!0, !1, l, "getTags", {}, function(a) {
        b.allTags = a
    }), s.get(!0, !1, k, "getCommunityTopUsers", {}, {}, function(a) {
        if (a && a.values) {
            b.topUsersCommunity = [];
            for (var c = 0; c < a.values.length; c++)
                if (b.topUsersCommunity.push(a.values[c].key), 11 === c) return
        }
    }), b.popupUserName = w, b.showLoginModal = function() {
        j.show()
    }, b.$on("changeUserNamePublic", function(c, d) {
        b.isQuestion ? d.changed ? r.go("playground.section.community.questionEdit") : a.loggedin ? b.$emit("show-notification", "You need a username to interact in Community.", "error") : b.$emit("show-notification", "You need to be logged in.", "error") : (b.checkUserNamePublic = b.checkUserNamePublic || d.changed, y())
    }), b.newQuestion = function() {
        z(!0)
    };
    var E = 20;
    b.questionsPerPage = E, b.findQuestions = function(c, d) {
        if (a.bookmarks || (a.bookmarks = {}), a.bookmarks.skip = 0, a.bookmarks.index = 0, a.bookmarks.values = [], a.bookmarks.filter || (a.bookmarks.filter = {
                limit: E,
                where: {}
            }), a.bookmarks.filter.bookmark = void 0, b.categoriesQuestion.selected && b.categoriesQuestion.selected.id) a.bookmarks.filter.where.categories = {}, a.bookmarks.filter.where.categories.regexp = b.categoriesQuestion.selected.id;
        else {
            var e = b.categoriesQuestion.map(function(a) {
                return a.id
            });
            a.bookmarks.filter.where.categories = {
                "in": e
            }
        }
        a.bookmarks.filter.where.text = {}, a.bookmarks.filter.where.text.regexp = b.searchFor, b.searchAdvanced && (a.bookmarks.filter.where.byuser = {}, a.bookmarks.filter.where.byuser.regexp = b.searchByUser), a.bookmarks.filter.where.tag = {}, d && (a.bookmarks.filter.where.tag.regexp = d), x(a.bookmarks.filter, !0, c)
    }, b.updatePage = function() {
        var c = b.currentPage;
        a.bookmarks.skip = (c - 1) * E, void 0 !== a.bookmarks.values[a.bookmarks.index] && (a.bookmarks.filter.bookmark = a.bookmarks.values[a.bookmarks.index]), x(a.bookmarks.filter, !0)
    }, b.nextPage = function() {
        a.bookmarks.skip = a.bookmarks.skip + E, void 0 !== a.bookmarks.values[a.bookmarks.index] && (a.bookmarks.filter.bookmark = a.bookmarks.values[a.bookmarks.index]), x(a.bookmarks.filter, !0), h("questions-container")
    }, b.previousPage = function() {
        a.bookmarks.skip = a.bookmarks.skip > E ? a.bookmarks.skip - E : 0, a.bookmarks.index > 0 && (a.bookmarks.index--, a.bookmarks.index > 0 && void 0 !== a.bookmarks.values[a.bookmarks.index - 1] ? a.bookmarks.filter.bookmark = a.bookmarks.values[a.bookmarks.index - 1] : a.bookmarks.filter.bookmark = void 0), x(a.bookmarks.filter, !1), h("questions-container")
    }, t.subscribe(l, "loading", b, function(a, b) {
        v(!0)
    }), t.subscribe(l, "change", b, function(b, c) {
        v(!1), a.questionsFind = c.results, a.questions = c.results, c.total && (a.totalQuestions = c.total)
    });
    var F = {
        name: "All Categories"
    };
    b.categoriesQuestion = [], b.categoriesMap = {}, b.categoryAll = F, b.clearSearch = function() {
        a.categorySelected = void 0, b.searchFor = "", b.searchByUser = "", b.searchAdvanced = !1, b.categoriesQuestion.selected = b.categoryAll, a.questionsFind = [], a.bookmarks ? a.bookmarks.filter = {
            limit: E,
            where: {}
        } : (a.bookmarks = {}, a.bookmarks.filter = {
            limit: E,
            where: {}
        }), y()
    }, g(function() {
        twttr.widgets.load()
    }, 500), b.getTextFound = function(c) {
        if (c) {
            var d = a.searchText,
                e = "",
                f = !1;
            if (d ? e = c.description.replace(/<(?:.|\n)*?>/gm, "") : (d = b.searchByUser, f = !0, e = c.user.username), B(d, e) > 0) {
                a.typeTextFound[c.id] = "Q:", a.infoSearch[c.id] = {}, a.infoSearch[c.id].user = c.user, a.infoSearch[c.id].creationDate = c.creationDate, a.infoSearch[c.id].type = "asked by";
                var g = "";
                return f ? (e = c.description.replace(/<(?:.|\n)*?>/gm, ""), e = A(e, d), g = e) : (e = A(e, d), g = C(d, e)), g
            }
            if (B(d, c.title) > 0 && !f) {
                a.typeTextFound[c.id] = "Q:", a.infoSearch[c.id] = {}, a.infoSearch[c.id].user = c.user, a.infoSearch[c.id].creationDate = c.creationDate, a.infoSearch[c.id].type = "asked by", e = c.title, e = A(e, d);
                var g = C(d, e);
                return g
            }
            for (var h in c.answers) {
                var i = c.answers[h];
                if (a.infoSearch[c.id] = {}, a.infoSearch[c.id].user = i.user, a.infoSearch[c.id].creationDate = i.creationDate, a.infoSearch[c.id].type = "answered by", a.infoSearch[c.id].idFound = i.id, e = f ? i.user.username : i.description.replace(/<(?:.|\n)*?>/gm, ""), B(d, e) > 0) {
                    a.typeTextFound[c.id] = "A:";
                    var g = "";
                    return f ? (e = i.description.replace(/<(?:.|\n)*?>/gm, ""), e = A(e, d), g = e) : (e = A(e, d), g = C(d, e)), g
                }
                for (var j in i.answers) {
                    var k = i.answers[j];
                    if (e = f ? k.user.username : k.description.replace(/<(?:.|\n)*?>/gm, ""), B(d, e) > 0) {
                        a.typeTextFound[c.id] = "R:", a.infoSearch[c.id] = {}, a.infoSearch[c.id].user = k.user, a.infoSearch[c.id].creationDate = k.creationDate, a.infoSearch[c.id].type = "answer replied by", a.infoSearch[c.id].idFound = k.id;
                        var g = "";
                        return f ? (e = k.description.replace(/<(?:.|\n)*?>/gm, ""), e = A(e, d), g = e) : (e = A(e, d), g = C(d, e)), g
                    }
                }
            }
            return a.infoSearch[c.id] = {}, a.infoSearch[c.id].user = c.user, a.infoSearch[c.id].creationDate = c.creationDate, a.infoSearch[c.id].type = "asked by", e = f ? "Posted By: " + i.user.username : c.description.replace(/<(?:.|\n)*?>/gm, ""), A(e, d)
        }
    }, b.findQuestionsByTag = function(a) {
        b.findQuestions(!1, a)
    }, b.getTimeQuestion = function(a) {
        var b = a.creationDate,
            c = {};
        c.name = a.user.usernamePublic;
        for (var d in a.answers) {
            var e = a.answers[d];
            e.creationDate > b && (b = e.creationDate, c.name = e.user.username, c.answer = !0)
        }
        var f = {};
        return f.time = b, f.user = c, f
    }
}]), angular.module("qubitsApp").controller("communityQuestionController", ["$rootScope", "$scope", "$q", "$anchorScroll", "$timeout", "User", "profileService", "userService", "$location", "playgroundFactory", "CommunityQuestion", "CommunityAnswer", "CommunityCategory", "CommunityReaction", "communityService", "loopbackClientCache", "$stateParams", "$window", "$sce", "LoopBackAuth", "$uibModal", "$state", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v) {
    function w(a) {
        return function(b) {
            b.attr("mentio", "mentio"), b.attr("spellcheck", "false"), b.attr("mentio-typed-term", "typedTerm"), b.attr("mentio-require-leading-space", "true"), b.attr("mentio-id", "'" + a + "'")
        }
    }

    function x(a, c, d) {
        var e = {};
        e.q || (e.q = {}), c ? e.q.tags = c : e.q.title = "/.*/", e.limit = 6, p.get(!1, k, "searchIndex", {
            query: e
        }, {}, function(c) {
            if (c && c.results && c.results.length > 0) {
                for (var e = [], f = 0; f < c.results.length && (c.results[f].id !== a && e.push(c.results[f]), !(e.length > 4)); f++);
                e.length > 0 ? b.questionsRelated = e : d || x(a, null, !0)
            } else d || x(a, null, !0)
        })
    }

    function y(a, b) {
        z(a).then(function(a) {
            a.oldReaction = angular.copy(a.reaction), a.reaction && a.reaction.id == b.id ? delete a.reaction : (a.reaction = angular.copy(b), a.reputation.total += b.weight)
        })
    }

    function z(a) {
        var b = c.defer();
        return a.reputation || (a.reputation = {}), a.reputation.total || (a.reputation.total = 0), a.reaction ? (a.reputation.oldTotal = a.reputation.total, o.reactions().then(function(c) {
            for (var d = 0; d < c.length; d++)
                if (c[d].id === a.reaction.id) return a.reputation.total -= c[d].weight, b.resolve(a);
            b.reject("Reaction not found")
        })) : b.resolve(a), b.promise
    }

    function A(a) {
        a.oldReaction && (a.reaction = angular.copy(a.oldReaction), delete a.oldReaction, a.reputation.total = a.reputation.oldTotal)
    }

    function B() {
        o.categoriesFiltered().then(function(c) {
            for (var d = {}, e = c, f = 0; f < e.length; ++f) {
                var g = e[f];
                d[g.id] = g
            }
            b.categoriesQuestion = e, b.categoriesMap = d;
            for (var f = 0; f < e.length; f++)
                for (var h in b.question.categories)
                    if (b.question.categories[h] && e[f].id == h) {
                        b.categoriesQuestion.selected = e[f];
                        break
                    }
            b.isNew = !1, a.loadingCommunity = !1, b.loadingBackgroundQuestion = !1, b.newAnswer = {}
        })
    }

    function C(a) {
        b.tags.selected = [];
        for (var c in a) b.tags.selected.push(b.addTag(c))
    }

    function D(a) {
        if (a.codeArr = [], a.code)
            for (var c in a.code) a.code[c] && a.codeArr.push(a.code[c]);
        if (a.answers)
            for (var d in a.answers) a.answers[d].code && (a.answers[d] = D(a.answers[d]), b.codesAnswers[d] = {}, b.codesAnswers[d].codeArr = a.answers[d].codeArr || {}, b.codesAnswers[d].code = a.answers[d].code || {});
        return a
    }

    function E() {
        b.setupAnswers || (b.setupAnswers = {}), b.setupAnswers.NEW = {}, b.setupAnswers.NEW.setup = function(a) {
            return w("mentionUserAnswer" + a)
        }("NEW")
    }

    function F(a) {
        if (b.setupAnswers || (b.setupAnswers = {}), a.answers)
            for (var c in a.answers) {
                b.setupAnswers[c] = {}, b.setupAnswers[c].setup = function(a) {
                    return w("mentionUserAnswer" + a)
                }(c);
                var d = a.answers[c];
                if (d.answers)
                    for (var e in d.answers) b.setupAnswers[e] = {}, b.setupAnswers[e].setup = function(a) {
                        return w("mentionUserAnswer" + a)
                    }(e)
            }
    }

    function G(c, d) {
        c ? (b.loadingBackgroundQuestion = !0, k.findById({
            id: c
        }, function(a) {
            b.question && b.question.lastModificationDate === a.lastModificationDate || (a = D(a), F(a), x(a.id, a.tags), b.question = a, "closed" === a.status && (b.isClosed = !0), e(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub])
            }), L(a), W(a), B(), C(a.tags), d(!1))
        }, function(a) {
            d(a)
        })) : (b.question = {
            title: "",
            description: ""
        }, o.categoriesFiltered().then(function(c) {
            var d = !1,
                e = c;
            if (b.categoriesQuestion = e, "forum" === b.channel && (d = !0), 1 === e.length) b.categoriesQuestion.selected = e[0];
            else
                for (var f = 0; f < e.length; f++) d ? "General" === e[f].name && (b.categoriesQuestion.selected = e[f]) : e[f].type === b.channel && (b.categoriesQuestion.selected = e[f]);
            b.isNew = !0, a.loadingCommunity = !1
        }))
    }

    function H(c, d) {
        a.loadingCommunity = !0;
        var f;
        if (c && a.questions)
            for (var g = 0; g < a.questions.length; g++) {
                var f = a.questions[g];
                if (f.id == c) {
                    f = D(f), F(f), x(f.id, f.tags), b.question = f, "closed" === f.status && (b.isClosed = !0), e(function() {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
                    }), W(f), B(), a.loadingCommunity = !1, C(f.tags);
                    break
                }
            }
        d(!b.question)
    }

    function I(c, d) {
        a.loadingCommunity = !0, c && c.id && (c = D(c), x(c.id, c.tags), b.question = c, "closed" === c.status && (b.isClosed = !0), e(function() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub])
        }), W(c), B(), a.loadingCommunity = !1, C(c.tags)), d(!b.question)
    }

    function J(a) {
        a || "events" !== b.channel || (b.question.data && b.question.data.eventDate && (b.question.data.eventDate = new Date(b.question.data.eventDate)), b.question.data && b.question.data.eventEndDate && (b.question.data.eventEndDate = new Date(b.question.data.eventEndDate))), !a && q.answerId && e(function() {
            d(q.answerId)
        }, 816)
    }

    function K(b) {
        if (b.pinned) return void a.questions.unshift(b);
        a.questions = a.questions || [];
        for (var c = 0; c < a.questions.length; c++)
            if (!a.questions[c].pinned) return void a.questions.splice(c, 0, b);
        a.questions.push(b)
    }

    function L(b, c) {
        if (a.questions)
            for (var d = 0; d < a.questions.length; d++) {
                var e = a.questions[d];
                if (e.id == b.id)
                    if (c) "pinned" === c ? (a.questions.splice(d, 1), a.questions.unshift(b)) : a.questions[d][c] = b[c];
                    else if (a.questions[d].pinned !== b.pinned) {
                    if (!a.questions[d].pinned) return a.questions.splice(d, 1), void a.questions.unshift(b);
                    a.questions.splice(d, 1);
                    for (var f = 0; f < a.questions.length; f++)
                        if (!a.questions[f].pinned) return void a.questions.splice(f, 0, b);
                    a.questions.push(b)
                } else a.questions[d] = b
            }
    }

    function M(b) {
        if (a.questions)
            for (var c = 0; c < a.questions.length; c++) {
                var d = a.questions[c];
                d.id == b && a.questions.splice(c, 1)
            }
    }

    function N() {
        var a = [];
        if (!b.categoriesQuestion.selected || void 0 == b.categoriesQuestion.selected.id) return void b.$emit("show-notification", "You  have to select a category.", "error");
        a.push(b.categoriesQuestion.selected.id);
        for (var c = [], d = 0; d < b.tags.selected.length; d++) c.push(b.tags.selected[d].key);
        if (c.length > 5) return void b.$emit("show-notification", "Only 5 tags by question is allowed. Please check it.", "error");
        b.question.code || (b.question.code = {});
        for (var e in b.question.code) b.question.code[e] = !1;
        if (b.question.codeArr)
            for (var d = 0; d < b.question.codeArr.length; d++) b.question.code[b.question.codeArr[d].id] = b.question.codeArr[d];
        return k.create({
            title: b.question.title,
            code: b.question.code,
            description: b.question.description,
            data: b.question.data,
            tagsArray: c,
            idsCategories: a,
            pinned: b.question.pinned
        }, function(a) {
            K(a), v.go("playground.section.community.question", {
                questionId: a.id
            }, {
                reload: !0
            })
        }, function(a) {
            console.log(a);
            var c = O(a);
            if (c && "TIME_ELAPSED_NOT_ENOUGH" === c.code) {
                var d = "You must to wait to create another question, Try again ";
                d += c.data ? "in " + c.data + " seconds." : "in a few moments", b.$emit("show-notification", d, "error", 1e4)
            } else b.$emit("show-notification", "Title must have minimum 5 and maximum 150 characters. Description must have minimum 10 and maximum 10k characters, Try again", "error", 1e4);
            r.scrollTo(0, 0)
        })
    }

    function O(a) {
        if (a && a.data && a.data.error) return a.data.error
    }

    function P() {
        var a = [];
        a.push(b.categoriesQuestion.selected.id);
        for (var c = [], d = 0; d < b.tags.selected.length; d++) c.push(b.tags.selected[d].key);
        if (c.length > 5) return void b.$emit("show-notification", "Only 5 tags by question is allowed. Please check it.", "error");
        b.question.code || (b.question.code = {});
        for (var e in b.question.code) b.question.code[e] = !1;
        for (var d = 0; d < b.question.codeArr.length; d++) b.question.code[b.question.codeArr[d].id] = b.question.codeArr[d];
        return k.prototype$updateAttributes({
            id: b.question.id
        }, {
            title: b.question.title,
            code: b.question.code,
            description: b.question.description,
            data: b.question.data,
            tagsArray: c,
            idsCategories: a,
            pinned: b.question.pinned
        }, function(a) {
            L(a), b.back()
        }, function(a) {
            b.$emit("show-notification", "Not Saved, Try again", "error"), r.scrollTo(0, 0)
        })
    }

    function Q(a) {
        b.user = angular.copy(a), b.user.usernamePublic = b.user.username.split("@")[0], b.modalInstanceUsername = u.open({
            animation: b.animationsEnabled,
            templateUrl: "templates/community/usernamePublicPopup.html",
            controller: "userNamePublicPopupController",
            scope: b
        })
    }

    function R(a, c, d, f) {
        var g = {};
        return g.description = d, g.questionId = q.questionId, c && (g.replyOtherAnswer = c), f && (g.code = f), l.create(g, function(d) {
            T(a, d, c), b.newAnswer[a] = "", b.setupAnswers[d.id] = {}, b.setupAnswers[d.id].setup = function(a) {
                return w("mentionUserAnswer" + a)
            }(d.id), e(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub])
            }), b.$emit("show-notification", "Answer Created", "success")
        }, function(a) {
            b.$emit("show-notification", "Not Saved, Try again", "error"), r.scrollTo(0, 0)
        })
    }

    function S(a, c, d, f) {
        var g = {};
        return g.description = d, f && (g.code = f), l.prototype$updateAttributes({
            id: a
        }, g, function(d) {
            T("@EDIT" + a, d, c), e(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub])
            }), b.$emit("show-notification", "Answer updated", "success")
        }, function(a) {
            b.$emit("show-notification", "Not Saved, Try again", "error"), r.scrollTo(0, 0)
        })
    }

    function T(a, c, d) {
        b.newAnswer[a] = "", b.showTextAngular[a] = !1, c.code && (c = D(c), b.codesAnswers[c.id] = {}, b.codesAnswers[c.id].codeArr = c.codeArr || {}, b.codesAnswers[c.id].code = c.code || {}), d ? b.question.answers[d].answers[c.id] = c : b.question.answers[c.id] = c, L(b.question), W(b.question)
    }

    function U(a, b) {
        if (b.answers)
            for (var c in b.answers) {
                if (b.answers[c].id === a) return delete b.answers[c], b;
                if (b.answers[c].answers)
                    for (var d in b.answers[c].answers)
                        if (b.answers[c].answers[d].id === a) return delete b.answers[c].answers[d], b
            }
        return b
    }

    function V(a, b) {
        for (var c = 0; c < a.length; c++)
            if (a[c].id == b) return a[c].name
    }

    function W(a) {
        o.reactions().then(function(c) {
            for (var d in c)
                if (c[d].name && (Y(a, c[d].name), a.answers)) {
                    b["reactionsAnswers" + c[d].name] || (b["reactionsAnswers" + c[d].name] = {});
                    for (var e in a.answers) {
                        var f = a.answers[e];
                        X(f, c[d].name)
                    }
                }
        })
    }

    function X(a, c) {
        if (!a) return void(b["reactionsAnswers" + c][a.id] = "reactions-icon");
        var d = f.getCurrentId();
        o.reactions().then(function(e) {
            for (var f in a.reactions)
                if (f === d) {
                    var g = V(e, a.reactions[f]);
                    return c === g ? void(b["reactionsAnswers" + c][a.id] = "reactions-icon-selected") : void(b["reactionsAnswers" + c][a.id] = "reactions-icon")
                }
            b["reactionsAnswers" + c][a.id] = "reactions-icon"
        })
    }

    function Y(a, c) {
        if (!a) return void(b["reactionsQuestion" + c] = "reactions-icon");
        var d = f.getCurrentId();
        o.reactions().then(function(e) {
            for (var f in a.reactions)
                if (f === d) return c === V(e, a.reactions[f]) ? void(b["reactionsQuestion" + c] = "reactions-icon-selected") : void(b["reactionsQuestion" + c] = "reactions-icon");
            b["reactionsQuestion" + c] = "reactions-icon"
        })
    }

    function Z() {
        q.questionId && k.addViewed({
            id: q.questionId
        }, {}, function(a) {
            b.question && (b.question.viewedCount += 1, L(b.question, "viewedCount"))
        }, function(a) {
            console.log(a)
        })
    }

    function $() {
        var a = [];
        a.push(["h3", "quote", "bold", "italics", "underline", "ul", "clear", "pre", "indent", "outdent"]), h.allowUploadFiles().then(function(c) {
            c && a.push(["insertImage", "insertLink2", "insertVideo", "uploadFile", "uploadImage"]), b.configToolbarTextEditor = a
        })
    }

    function _() {
        u.open({
            animation: b.animationsEnabled,
            templateUrl: "templates/community/questionLinkPopup.html",
            size: "large",
            scope: b
        })
    }
    b.showTextAngular = {}, b.isAdmin = !1, b.isAdminOrStaff = !1, b.codesAnswers = {}, b.codesAnswers["new"] = {}, b.isClosed = !1, b.channel = q.channel, b.questionFields = [{
        key: "title",
        type: "input",
        templateOptions: {
            label: "Title",
            required: !0,
            placeholder: "Enter a title for the Question"
        }
    }], "events" == b.channel ? (b.questionFields.push({
        key: "data.eventDate",
        type: "datepicker",
        templateOptions: {
            label: "Event Date",
            required: !0,
            type: "text",
            datepickerPopup: "dd-MMMM-yyyy"
        }
    }), b.questionFields.push({
        key: "data.eventEndDate",
        type: "datepicker",
        templateOptions: {
            label: "Event End Date",
            required: !1,
            type: "text",
            datepickerPopup: "dd-MMMM-yyyy"
        }
    }), b.questionFields.push({
        key: "data.eventLocation",
        type: "input",
        templateOptions: {
            label: "Location",
            required: !0,
            placeholder: "Enter the location of the event"
        }
    })) : "forum" != b.channel && b.questionFields.push({
        key: "data.thumbnail",
        type: "imageupload",
        templateOptions: {
            label: "Thumbnail url",
            required: !0,
            placeholder: "Enter the url of the thumbnail"
        }
    }), b.searchPeople = function(a) {
        for (var c = [], d = 0; d < b.peopleAll.length; d++) {
            var e = b.peopleAll[d];
            if (e.username.toUpperCase().indexOf(a.toUpperCase()) >= 0 && c.push(e), c.length > 4) break
        }
        return b.people = c, c
    }, b.setup = w("mentionUser"), b.getPeopleText = function(a) {
        return '<a class="mention-user" href="#/user/' + a.username + '" target="_blank"/>@' + a.username + "</a>"
    }, g.getPublicUsernames().then(function(a) {
        b.peopleAll = a
    }), b.tags = {
        selected: [],
        allTags: []
    }, k.getTags(function(a) {
        b.tags.allTags = a
    }), d("question-container"), b.addTag = function(a) {
        var b = {
            key: a,
            value: !0
        };
        return b
    }, b.categoriesMap = {}, E(), q.questionObject ? I(q.questionObject, J) : H(q.questionId, J), G(q.questionId, J), b.back = function() {
        window.history.go(-1)
    }, b.saveQuestion = function() {
        if (b.question.code && b.question.code instanceof Array)
            for (var a = 0; a < b.question.code.length; a++) {
                var c = b.question.code[a];
                delete c.executions
            }
        return b.isNew ? N() : P()
    }, b.markBestAnswer = function(a, c) {
        return k.setBestAnswer({
            id: b.question.id
        }, {
            idAnswer: c
        }, function(a) {
            b.question = a, e(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub])
            }), L(a), b.$emit("show-notification", "Marked as best answer!", "success")
        }, function(a) {
            b.$emit("show-notification", "Error trying to mark the answer. Please, try again", "error")
        })
    }, b.canMarkAnswer = function(a, c) {
        return b.checkOwner(a.user.id) && (!a.bestAnswer || !c || c.id != a.bestAnswer)
    }, b.checkOwner = function(a) {
        return f.getCurrentId() == a
    }, h.getCurrentWithRoles().then(function(a) {
        b.isAdmin = h.isAdmin, b.isAdminOrStaff = h.isAdminOrStaff
    }), b.enableTextAngular = function(c) {
        b.showTextAngular[c] || (b.showTextAngular[c] = !1), h.getCurrent().then(function(a) {
            a.usernamePublic || b.showTextAngular[c] ? b.showTextAngular[c] = !b.showTextAngular[c] : Q(a)
        }, function(c) {
            a.loggedin ? b.$emit("show-notification", "You need a username to interact in Community.", "error") : b.$emit("show-notification", "You need to be logged in.", "error")
        })
    }, b.saveAnswer = function(d, e, f, g) {
        var i = c.defer(),
            j = void 0;
        if (!f) {
            var k = d;
            if (g && (k = "new"), b.codesAnswers && b.codesAnswers[k]) {
                if (b.codesAnswers[k].code && b.codesAnswers[k].code instanceof Array)
                    for (var l = 0; l < b.codesAnswers[k].code.length; l++) {
                        var m = b.codesAnswers[k].code[l];
                        delete m.executions
                    }
                b.codesAnswers[k].code || (b.codesAnswers[k].code = {});
                for (var n in b.codesAnswers[k].code) b.codesAnswers[k].code[n] = !1;
                if (b.codesAnswers[k].codeArr)
                    for (var l = 0; l < b.codesAnswers[k].codeArr.length; l++) b.codesAnswers[k].code[b.codesAnswers[k].codeArr[l].id] = b.codesAnswers[k].codeArr[l];
                j = b.codesAnswers[k].code
            }
        }
        return h.getCurrent().then(function(a) {
            a.usernamePublic ? g ? R(d, f, e, j).$promise.then(function() {
                b.codesAnswers["new"].code = {}, b.codesAnswers["new"].codeArr = {}, i.resolve()
            }, function(a) {
                i.reject(a)
            }) : S(d, f, e, j).$promise.then(function() {
                b.codesAnswers["new"].code = {}, b.codesAnswers["new"].codeArr = {}, i.resolve()
            }, function(a) {
                i.reject(a)
            }) : (Q(a), i.reject())
        }, function(c) {
            i.reject(c), a.loggedin ? b.$emit("show-notification", "You need a username to interact in Community.", "error") : b.$emit("show-notification", "You need to be logged in.", "error")
        }), i.promise
    }, b.$on("changeUserNamePublic", function(c, d) {
        d.changed ? b.$emit("show-notification", "Username set!", "success") : a.loggedin ? b.$emit("show-notification", "You need a username to interact in Community.", "error") : b.$emit("show-notification", "You need to be logged in.", "error")
    }), b.addReactionQuestion = function(c, d) {
        h.getCurrent().then(function(a) {
            a.usernamePublic ? o.reactions().then(function(a) {
                for (var e = 0; e < a.length; e++)
                    if (a[e].name === d) return y(c, a[e]), void k.addReaction({
                        id: c.id
                    }, {
                        idReaction: a[e].id
                    }, function(a) {}, function(a) {
                        b.$emit("show-notification", "There was an error trying to save your reaction", "error"), A(c)
                    });
                b.$emit("show-notification", "Invalid Reaction", "error")
            }) : Q(a)
        }, function(c) {
            a.loggedin ? b.$emit("show-notification", "You need a username to interact in Community.", "error") : b.$emit("show-notification", "You need to be logged in.", "error")
        })
    }, b.addReactionAnswer = function(c, d) {
        h.getCurrent().then(function(a) {
            a.usernamePublic ? o.reactions().then(function(a) {
                for (var e = 0; e < a.length; e++)
                    if (a[e].name === d) {
                        var f = b.question.answers[c.id];
                        return c.replyOtherAnswer && (f = b.question.answers[c.replyOtherAnswer].answers[c.id]), y(f, a[e]), void l.addReaction({
                            id: c.id
                        }, {
                            idReaction: a[e].id
                        }, function(a) {}, function(a) {
                            b.$emit("show-notification", "There was an error trying to save your reaction", "error"), A(f)
                        })
                    }
                b.$emit("show-notification", "Invalid Reaction", "error")
            }) : Q(a)
        }, function(c) {
            a.loggedin ? b.$emit("show-notification", "You need a username to interact in Community.", "error") : b.$emit("show-notification", "You need to be logged in.", "error")
        })
    }, b.deleteQuestion = function(c) {
        a.loadingCommunity = !0, k["delete"]({
            id: c
        }, {}, function(b) {
            a.loadingCommunity = !1, M(c), v.go("playground.section.community", {
                redirect: !0
            })
        }, function(c) {
            a.loadingCommunity = !1, b.$emit("show-notification", "An error ocurred", "error")
        })
    }, b.showMathHelp = function() {
        u.open({
            animation: b.animationsEnabled,
            templateUrl: "templates/community/maths_help.html",
            controller: function() {
                e(function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "mathsHelp"])
                })
            }
        })
    }, b.deleteAnswer = function(a) {
        return l["delete"]({
            id: a
        }, {}, function(c) {
            b.question = U(a, b.question), L(b.question)
        }, function(a) {
            b.$emit("show-notification", "An error ocurred", "error")
        })
    }, b.reportQuestion = function(c) {
        return h.getCurrent().then(function(a) {
            a.usernamePublic ? k.report({
                id: c
            }, {}, function(a) {
                b.question = a, L(b.question), b.question.report ? b.$emit("show-notification", "The question has been reported.", "success") : b.$emit("show-notification", "The question has been unreported.", "success")
            }, function(a) {
                b.$emit("show-notification", "An error ocurred", "error")
            }) : Q(a)
        }, function(c) {
            a.loggedin ? b.$emit("show-notification", "You need a username to interact in Community.", "error") : b.$emit("show-notification", "You need to be logged in.", "error");
        })
    }, b.reportAnswer = function(c) {
        h.getCurrent().then(function(a) {
            a.usernamePublic ? l.report({
                id: c
            }, {}, function(a) {
                T(c, a, a.replyOtherAnswer), b.$emit("show-notification", "The answer has been reported.", "success")
            }, function(a) {
                b.$emit("show-notification", "An error ocurred", "error")
            }) : Q(a)
        }, function(c) {
            a.loggedin ? b.$emit("show-notification", "You need a username to interact in Community.", "error") : b.$emit("show-notification", "You need to be logged in.", "error")
        })
    }, Z(), $();
    var aa = f.getCurrentId();
    b.userCodes = [], a.loggedin && (b.userCodes = f.getLastCodes({
        id: aa,
        includeExecutions: !0
    })), b.closeQuest = function(a) {
        var c = b.question.status;
        "closed" === c ? newStatus = "open" : newStatus = "closed";
        var c = newStatus;
        return k.updateStatus({
            id: b.question.id,
            status: c
        }, {}, function(a) {
            b.question.status = c, "closed" === a.status ? (b.isClosed = !0, b.$emit("show-notification", "Question closed", "success")) : (b.isClosed = !1, b.$emit("show-notification", "Question open", "success"))
        }, function(a) {
            b.$emit("show-notification", "Error closing/opening question", "error")
        })
    }, b.questionLink = function() {
        b.communityElement = "Question", b.url = v.href("playground.section.community.question", {
            questionId: b.question.id
        }, {
            absolute: !0
        }), _()
    }, b.answerLink = function(a) {
        b.communityElement = "Answer", b.url = v.href("playground.section.community.question", {
            questionId: b.question.id,
            answerId: a
        }, {
            absolute: !0
        }), _()
    }
}]), angular.module("qubitsApp").controller("devicesListController", ["$scope", "Device", "$location", function(a, b, c) {
    a.chips = b.find({
        filter: {
            include: ["topology"]
        }
    })
}]), angular.module("qubitsApp").controller("displayCodeController", ["$rootScope", "$scope", "$timeout", "$location", "$state", "$stateParams", "$uibModal", "$q", "promptDialog", "Code", "Execution", function(a, b, c, d, e, f, g, h, i, j, k) {
    b.loadingImage = !0, b.code = void 0, b.idCode = f.id, b.stopLoading = function() {
        b.loadingImage = !1
    }, b.idCode && (j.findById({
        id: b.idCode
    }, function(a) {
        b.code = a, b.code.id = void 0
    }, function(a) {
        b.errorWithCode = !0
    }), b.codeUrl = j.getCodeImageUrl({
        id: b.idCode,
        format: "svg"
    })), b.execution = void 0, b.idExecution = f.idExecution, b.idExecution && k.findById({
        id: b.idExecution
    }, function(a) {
        b.execution = a
    }, function(a) {}), b.showResultsModal = function(c, d) {
        d.code = c, a.execution = d, b.showOnlyQasm = !0;
        g.open({
            animation: b.animationsEnabled,
            templateUrl: "templates/playground_results_modal.html",
            controller: "resultsController",
            size: "extralarge",
            scope: b
        })
    }
}]), angular.module("qubitsApp").controller("executionController", ["$rootScope", "$scope", "$state", "User", "Topology", "playgroundFactory", function(a, b, c, d, e, f) {
    f.getGatesMatrixFromJsonQasm(b.code.jsonQASM).then(function(a) {
        b.executionCode = a
    })
}]), angular.module("qubitsApp").controller("executionListController", ["$rootScope", "$scope", "$q", "$timeout", "$state", "$stateParams", "User", "Topology", "Execution", "Code", "playgroundFactory", "usercodesFactory", "$uibModal", "$sce", "$anchorScroll", "promptDialog", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    function q(a) {
        var c = a || !1;
        b.loadingBackgroundExecutions = !0, l.updateGlobalArray(0, c).then(function(a) {
            b.total = l.total(), t(), r(b.currentPage), b.loadingBackgroundExecutions = !1, b.loadingExecutions = !1, b.total !== l.total() && q(!0)
        }, function(a) {
            b.loadingBackgroundExecutions = !1, console.log("Error: ", a)
        })
    }

    function r(a) {
        var c = a * w;
        b.loadingExecutions = !0, l.getCodeFromGlobal(c).then(function(a) {
            l.getGlobalArray().then(function(a) {
                if (b.arrayCodes === [] || 0 === b.arrayCodes.length) {
                    b.arrayCodes = [];
                    for (var d = 0; d < w; d++) a[c + d] && (b.arrayCodes[d] = a[c + d])
                } else {
                    var e = b.arrayCodes[0],
                        f = a[c];
                    if (e.id !== f.id || e.orderDate !== f.orderDate || e.executions && f.executions && e.executions.length !== f.executions.length) {
                        b.arrayCodes = [];
                        for (var d = 0; d < w; d++) a[c + d] && (b.arrayCodes[d] = a[c + d])
                    }
                }
                b.loadingExecutions = !1
            }, function(a) {
                console.log("Error: ", a), b.loadingExecutions = !1
            })
        }, function(a) {
            console.log("Error: ", a), b.loadingExecutions = !1
        })
    }

    function s(a) {
        a < b.pages && r(a)
    }

    function t() {
        b.total > 0 ? b.pages = Math.ceil(b.total / w) : b.pages = 0
    }

    function u() {
        b.currentPage;
        s(b.currentPage), t()
    }

    function v() {
        l.getCodeFromGlobal((b.currentPage + 1) * w).then(function(a) {
            l.getGlobalArray().then(function(a) {
                for (var c = (b.currentPage + 1) * w, d = 0; d < w; d++) {
                    var e = a[c + d];
                    if (b.arrayCodes && e) {
                        var f = b.arrayCodes.filter(function(a) {
                            return a.id === e.id
                        });
                        if (e && !e.deleted && !f.length) {
                            b.arrayCodes.push(e);
                            break
                        }
                    }
                }
            }, function(a) {
                console.log("Error: ", a)
            })
        }, function(a) {
            console.log("Error: ", a), r(b.currentPage)
        })
    }
    var w = 10;
    b.currentPage = 0, b.loadingExecutions = !0, b.loadingBackgroundExecutions = !1, b.total = 0, b.arrayCodes = [], b.refresh = q, l.getGlobalArray().then(function(a) {
        b.total = l.total(), t(), r(b.currentPage), b.loadingExecutions = !1, q()
    }, function(a) {
        console.log("Error: ", a)
    }), b.renderHTML = function(a) {
        return n.trustAsHtml(a.replace(new RegExp("\\n", "g"), "<br>"))
    };
    var x = function(c) {
            a.execution = c;
            m.open({
                animation: b.animationsEnabled,
                templateUrl: "templates/playground_results_modal.html",
                controller: "resultsController",
                size: "extralarge"
            })
        },
        y = function(c, d, e) {
            d.code = c, a.execution = d;
            var f = m.open({
                animation: b.animationsEnabled,
                templateUrl: "templates/playground_results_modal.html",
                controller: "resultsController",
                size: "extralarge"
            });
            f.result.then(function() {
                e && e()
            })
        };
    b.showResultsModal = y, b.deleteCode = function(a) {
        return c(function(c, d) {
            g.deleteCode({
                id: g.getCurrentId(),
                idCode: a.idCode
            }, function(e) {
                l.resetGlobalArray();
                for (var f = 0; f < b.arrayCodes.length; f++)
                    if (b.arrayCodes[f].id === a.id) return b.arrayCodes[f].deleted = !0, b.total -= 1, t(), v(), c("");
                d("")
            }, function(a) {
                d(""), console.log(a)
            })
        })
    }, b.deleteExecutions = function() {
        g.deleteExecutions({
            id: g.getCurrentId()
        }, function(a) {
            u()
        }, function(a) {
            console.log(a)
        })
    }, b.deleteCodes = function() {
        return c(function(a, c) {
            g.deleteCodes({
                id: g.getCurrentId()
            }, function(c) {
                b.currentPage = 0, l.resetGlobalArray(), l.updateGlobalArray(b.currentPage), b.arrayCodes = [], b.total = 0, t(), u(), a("")
            }, function(a) {
                console.log(a), c(a)
            })
        })
    }, b.deleteExecutionFromCode = function(a, d) {
        return c(function(c, e) {
            i["delete"]({
                id: a.id
            }, function(f) {
                for (var g = 0; g < b.arrayCodes.length; g++)
                    if (d.id === b.arrayCodes[g].id)
                        for (var h = b.arrayCodes[g].executions, i = 0; i < h.length; i++)
                            if (h[i].id === a.id) return h[i].deleted = !0, c("");
                e("")
            }, function(a) {
                console.log(a), e(a)
            })
        })
    }, b.deleteExecutionsFromCode = function(a) {
        return c(function(c, d) {
            g.deleteExecutionsOfCode({
                id: g.getCurrentId(),
                idCode: a.idCode
            }, function(d) {
                for (var e = 0; e < b.arrayCodes.length; e++)
                    if (a.id === b.arrayCodes[e].id) {
                        b.arrayCodes[e].executions = [];
                        break
                    }
                c("")
            }, function(a) {
                console.log(a), d(a)
            })
        })
    }, b.nextPage = function() {
        b.currentPage * w + w < b.total && (b.currentPage += 1, o("executionsContainer"), u())
    }, b.previousPage = function() {
        b.currentPage > 0 && (b.currentPage -= 1, o("executionsContainer"), u())
    }, b.goPage = function(a) {
        a >= 0 && a * w <= b.total ? (b.currentPage = a, o("executionsContainer"), u()) : console.log("pageIndex out of range")
    }, b.getNumber = function(a) {
        return angular.isNumber(a) || (a = 1), new Array(a)
    }, b.testFunction = function() {
        return c(function(a, b) {
            d(function() {
                a("")
            }, 3e3)
        })
    }, b.getPreviousVersions = function(a) {
        return c(function(b, c) {
            g.getAllCodeVersions({
                idCode: a,
                id: g.getCurrentId(),
                includeExecutions: !0
            }, {
                includeExecutions: !0
            }, function(a) {
                b(a)
            }, function(a) {
                console.log(a), c("Error getting the versions")
            })
        })
    }, b.updateLocalDescription = function(a) {
        for (var c = 0; c < b.arrayCodes.length; c++)
            if (b.arrayCodes[c].id === a.id) return void(b.arrayCodes[c].description = a.description)
    }, b.showPopupPreviousVersions = function(a) {
        var c = a.codes;
        m.open({
            animation: b.animationsEnabled,
            templateUrl: "templates/playground_executions_modal.html",
            size: "extralarge",
            controller: ["$scope", "arrayCodes", "hideButtons", "showResultsModal", "$uibModalInstance", function(a, b, c, d, e) {
                a.arrayCodes = b, a.hideButtons = c, a.showResultsModal = function(a, b) {
                    d(a, b, e.close)
                }
            }],
            resolve: {
                showResultsModal: function() {
                    return b.showResultsModal
                },
                arrayCodes: function() {
                    return c
                },
                hideButtons: function() {
                    return !0
                }
            }
        })
    }, void 0 !== f.executionId && (b.loadingExecutions = !0, i.findById({
        id: f.executionId,
        filter: {
            include: ["code"]
        }
    }, function(a) {
        console.log("execution:", a), b.loadingExecutions = !1, x(a)
    }, function(a) {
        b.loadingExecutions = !1, f.executionId = void 0, e.go(".", f, {
            notify: !1,
            reload: !1
        })
    }))
}]), angular.module("qubitsApp").controller("executionQasmController", ["$rootScope", "$scope", "$q", "$timeout", "$state", "User", "Topology", "Execution", "playgroundFactory", "$uibModal", "$sce", "$anchorScroll", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    b.code && b.code.jsonQASM ? i.getGatesMatrixFromJsonQasm(b.code.jsonQASM).then(function(a) {
        b.gatesMatrix = a
    }) : b.execution && b.execution.code && i.getGatesMatrixFromJsonQasm(b.execution.code.jsonQASM).then(function(a) {
        b.gatesMatrix = a
    })
}]), angular.module("qubitsApp").controller("helpController", ["$rootScope", "$scope", "$location", "$timeout", "playgroundFactory", function(a, b, c, d, e) {
    e.getVisibleGates().then(function(a) {
        var c = [],
            e = [],
            f = 4,
            g = 0;
        for (var h in a)
            if (a.hasOwnProperty(h))
                for (var i = a[h], j = 0; j < i.length; j++) {
                    var k = i[j];
                    g++, e.push(k), g >= f && (c.push(e), g = 0, e = [])
                }
        c.push(e), b.gatesRows = c, d(function() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub])
        })
    }, function(a) {
        b.showError("Something went wrong trying to get the gates.")
    }), b.screens = [{
        order: 1,
        title: "Add a Gate",
        description: "You can add a new gate using drag and drop",
        gif: "/qstage/img/tutorial/drag-gate.gif"
    }, {
        order: 2,
        title: "Delete a Gate",
        description: "You can remove a gate from Quantum Phase using double click",
        gif: "/qstage/img/tutorial/delete-gate.gif"
    }, {
        order: 3,
        title: "Actions Not Allowed",
        description: "You can't add a new gate in a busy position",
        gif: "/qstage/img/tutorial/error-drop-gate.gif"
    }, {
        order: 4,
        title: "Actions Not Allowed",
        description: "You can't move a gate to a busy position",
        gif: "/qstage/img/tutorial/error-drop-gate2.gif"
    }, {
        order: 5,
        title: "Reallocate a Gate",
        description: "You can move a gate from a position to another position",
        gif: "/qstage/img/tutorial/moving-gates.gif"
    }, {
        order: 6,
        title: "Add a CNOT Gate",
        description: "You can add a CNOT Gate that indicates the source position and the target position",
        gif: "/qstage/img/tutorial/cnot-gate-drop.gif"
    }, {
        order: 7,
        title: "Actions Not Allowed",
        description: "You can't add a CNOT gate where the topology is not allowed",
        gif: "/qstage/img/tutorial/cnot-drop-error.gif"
    }, {
        order: 8,
        title: "Measure Gate",
        description: "You can't add more gates in a line, to the right of a measure gate",
        gif: "/qstage/img/tutorial/measure-drop-error.gif"
    }, {
        order: 9,
        title: "Execute a Code",
        description: "You can execute the created experiments in a real simulator",
        gif: "/qstage/img/tutorial/running-code.gif"
    }, {
        order: 10,
        title: "Showing the Result",
        description: "You can see the results of a execution.",
        gif: "/qstage/img/tutorial/results.gif"
    }, {
        order: 11,
        title: "Showing the Result again",
        description: "You can see the results of an execution anytime you want",
        gif: "/qstage/img/tutorial/show-results.gif"
    }, {
        order: 12,
        title: "Showing the Executions",
        description: "You can see all your executions, in one place",
        gif: "/qstage/img/tutorial/executions.gif"
    }, {
        order: 13,
        title: "Report an Issue",
        description: "You can report a bug to us at any time",
        gif: "/qstage/img/tutorial/report-issue.gif"
    }]
}]), angular.module("qubitsApp").controller("lastResultsController", ["$rootScope", "$scope", "$timeout", "$state", "$uibModal", "$stateParams", "$location", "$uibModalInstance", "$sce", "$http", "User", "Code", "LoopBackAuth", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if (b.ok = function() {
            h && h.dismiss()
        }, b.loading = !0, f.codeId) {
        var n = k.getCurrentId();
        k.lastCode({
            id: n,
            idCode: f.codeId,
            includeExecutions: !0
        }, function(a) {
            b.code = a, b.loading = !1
        }, function(a) {
            b.loading = !1
        })
    }
    b.showResultsModal = function(c, d) {
        d.code = c, a.execution = d;
        var f = e.open({
            animation: b.animationsEnabled,
            templateUrl: "templates/playground_results_modal.html",
            controller: "resultsController",
            size: "extralarge"
        });
        f.result.then(function() {
            h && h.close()
        })
    }
}]), angular.module("qubitsApp").controller("loginController", ["$rootScope", "$scope", "$state", "User", "$location", "$http", "userService", "statsService", function(a, b, c, d, e, f, g, h) {
    function i(a) {
        var b = /^[\w!@#%&\/(){}[\]=?+*^~\-.:,;]{8,16}$/;
        return null !== (m = b.exec(a))
    }

    function j(a) {
        for (var c = 0, d = 0; d < a.length; d++) c += a[d].value;
        b.executionsCount = c
    }

    function k(a) {
        for (var c = 0, d = 0; d < a.length; d++) c += a[d].value;
        b.codesCount = c
    }

    function l(a) {
        for (var c = 0, d = 0; d < a.length; d++) c += a[d].value;
        b.usersCount = c
    }
    var n = e.search();
    n.access_token && (b.access_token = n.access_token), n.email && (b.emailVerified = n.email), h.getAllStats().then(function(a) {
        for (var a = a.stats, b = 0; b < a.length; b++) "executions" === a[b].key ? j(a[b].values) : "codes" === a[b].key ? k(a[b].values) : "users_familiarity" === a[b].key && l(a[b].values)
    });
    var o = function() {
        b.errors = void 0, b.loginLoading = !0, g.login({
            email: b.username ? b.username.toLowerCase() : b.username,
            password: b.password
        }).then(function(d) {
            a.loggedInUser = d, b.loginLoading = !1;
            var f = "";
            e.nextAfterLogin && e.nextAfterLogin.url.indexOf("login") == -1 && (f = e.nextAfterLogin), e.nextAfterLogin = null, f ? c.go(f, f.params) : e.path("/"), a.loggedin = !0
        }, function(a) {
            console.log(a);
            var c = "";
            a && a.data && a.data.error && a.data.error.code && (c = a.data.error.code), "USER_BLOCKED" === c ? b.errors = "Sorry, You are Blocked in the system :(." : "USER_BLOCKED_LOGIN" === c ? b.errors = "Sorry, you have exceeded the maximum number of consecutive login attempts. Please try again in a few minutes." : "LOGIN_FAILED_EMAIL_NOT_VERIFIED" === c ? b.errors = "Your email has not been verified. Please check your inbox." : b.errors = "Please, check your credentials.", b.loginLoading = !1
        })
    };
    b.login = o;
    var p = function() {
        b.errors = void 0, b.loginLoading = !0, d.resetPassword({
            email: b.username ? b.username.toLowerCase() : b.username
        }, function() {
            b.loginLoading = !1;
            var a = "/login";
            e.path(a), b.$emit("show-notification", "An email has been sent to your account.", "info", 1e4)
        }, function(a) {
            b.$emit("show-notification", "Can't send email for reset your password", "error", 1e4), b.errors = "Please, check your credentials.", b.loginLoading = !1
        })
    };
    b.reset = p;
    var q = function() {
        return b.errors = void 0, b.loginLoading = !0, i(b.password) ? void f({
            method: "POST",
            url: "/reset-password",
            headers: {
                "X-Access-Token": b.access_token
            },
            data: {
                password: b.password,
                confirmation: b.passwordRepeat,
                emailVerified: b.emailVerified
            }
        }).then(function(a) {
            b.$emit("show-notification", "Your password has been changed.", "info", 1e4);
            var c = "/login";
            e.path(c), b.loginLoading = !1
        }, function(a) {
            b.$emit("show-notification", "Can't change your password.", "error", 1e4), b.loginLoading = !1
        }) : (b.errors = "Your password is not valid. It should have between 8 and 16 characters (Alphanumerics and !@#%&/(){}[]=?+*^~-.:,;_).", b.loginLoading = !1, void b.$emit("show-notification", "Your password is not valid. It should have between 8 and 16 characters (Alphanumerics and !@#%&/(){}[]=?+*^~-.:,;_).", "error", 1e4))
    };
    b.resetPassword = q, b.backSection = function() {
        window.history.go(-1)
    }
}]), angular.module("qubitsApp").controller("loginthirdController", ["$rootScope", "$scope", "$state", "User", "$location", "$http", "$stateParams", "LoopBackAuth", "userService", "$window", function(a, b, c, d, e, f, g, h, i, j) {
    var k = e.search();
    if (b.institution = k.institution, k.redirect) b.currentLoading = !0, d.current({
        accessToken: k.accessToken
    }, function(d) {
        b.currentLoading = !1, h.setUser(k.accessToken, d.id, d), h.rememberMe = !0, h.save(), a.loggedInUser = d;
        var f = "";
        e.nextAfterLogin && e.nextAfterLogin.url.indexOf("login") == -1 && (f = e.nextAfterLogin), e.nextAfterLogin = null, f ? c.go(f, f.params) : e.path("/"), a.loggedin = !0
    });
    else {
        var l = [{
            label: "Hmm what’s a qubit?",
            value: "a"
        }, {
            label: "Have read some articles about quantum",
            value: "b"
        }, {
            label: "Studied quantum mechanics in college",
            value: "c"
        }, {
            label: "PhD level quantum research and above",
            value: "d"
        }];
        b.familiarity = {
            answers: l,
            selected: l[0]
        };
        var m = !1
    }
    var n = function() {
        return b.loginLoading = !0, b.termsAndConditions ? !b.description || "" === b.description || b.description.length < 10 ? (b.errors = "Please, enter an answer with more than 10 characters on 'What would you like to use the IBM Quantum Experience for?'", b.loginLoading = !1, void j.scrollTo(0, 0)) : l.indexOf(b.familiarity.selected) == -1 ? (b.errors = "Please, enter a valid answer for 'What is your familiarity with quantum?'", b.loginLoading = !1, void j.scrollTo(0, 0)) : void d.current({
            accessToken: k.accessToken
        }, function(d) {
            h.currentUserId = d.id, h.accessTokenId = k.accessToken, h.save(), k.accessToken && (m = !0), b.errors = void 0, i.updateData({
                id: d.id,
                institution: b.institution,
                familiarity: b.familiarity.selected.value + ") " + b.familiarity.selected.label,
                description: b.description,
                termsAndConditions: b.termsAndConditions
            }).then(function(d) {
                a.loggedInUser = d, h.currentUserId = d.id, h.accessTokenId = k.accessToken, h.save();
                var f = "";
                e.nextAfterLogin && e.nextAfterLogin.url.indexOf("login") == -1 && (f = e.nextAfterLogin), e.nextAfterLogin = null, f ? c.go(f, f.params) : e.path("/"), a.loggedin = !0, b.loginLoading = !1
            }, function(a) {
                b.loginLoading = !1, console.log("Error: ", a), m && (h.currentUserId = void 0, h.accessTokenId = void 0, h.save())
            })
        }, function(a) {
            b.loginLoading = !1, console.log("error current: ", a)
        }) : (b.errors = "You have to accept the Legal Disclaimer to proceed.", b.loginLoading = !1, void j.scrollTo(0, 0))
    };
    b.updateDataLogin = n
}]), angular.module("qubitsApp").controller("playgroundController", ["$window", "$rootScope", "$scope", "$q", "$state", "$stateParams", "$uibModal", "$filter", "$timeout", "$interval", "User", "Code", "Topology", "Execution", "Status", "playgroundFactory", "jsonQasmParser", "promptDialog", "LoopBackAuth", "userService", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
    function u() {
        c.loadingcode = !0;
        var a = p.getTopologyUsed();
        return a.then(function(a) {
            c.loadingcode = !1, a && (b.topology = a)
        }, function(a) {
            c.loadingCode = !1
        }), a
    }

    function v() {
        t.getCurrentWithUserType().then(function(a) {
            a && a.userType && (b.myUser && b.myUser.userType.type === a.userType.type && b.myUser.credit.remaining === a.credit.remaining && b.myUser.credit.promotional === a.credit.promotional || (b.myUser = a))
        })
    }

    function w(a, d, e, f) {
        z(a, d, e, f).then(function(a) {
            c.executionPending = !1;
            var d = a.execution;
            d ? d && (!d.status || "TIMEOUT" !== d.status.id && "ERROR" !== d.status.id && "PENDING_APPROBATION" !== d.status.id && "WORKING_IN_PROGRESS" !== d.status.id) ? (b.execution = d, E()) : d && "WORKING_IN_PROGRESS" === d.status.id ? d.positionQueue > 0 ? c.$emit("show-notification", "The execution is planned. There are " + d.positionQueue + " executions before yours. Please enjoy the usage of the Simulate feature in the meantime!", "info", 1e4) : c.$emit("show-notification", "The execution is planned and it'll be the next one to be run! Please enjoy the usage of the Simulate feature in the meantime!", "info", 1e4) : d && "TIMEOUT" === d.status.id ? c.$emit("show-notification", 'The execution is planned, check "My quantum scores" tabs after some minutes.', "info", 1e4) : d && "PENDING_APPROBATION" === d.status.id ? c.$emit("show-notification", "The execution needs to be approved, we will notify you once it has been reviewed", "info", 1e4) : c.$emit("show-notification", "Error executing the code.", "danger") : (d = {
                result: a.data
            }, b.execution = d, E())
        }, function(a) {
            c.executionPending = !1, "NOT_CREDITS" === a ? c.$emit("show-notification", "You do not have enough Units to run an experiment.", "danger") : "NOT_ALLOWED" === a ? c.$emit("show-notification", "This action is not allowed.", "danger") : "QUEUE_DISABLED" === a ? c.$emit("show-notification", "The Device is in maintenance. Sorry for the inconvenience.", "danger") : c.$emit("show-notification", a, "danger")
        })
    }

    function x(a, b) {
        if (b && b.roles)
            for (var c = 0; c < b.roles.length; c++)
                if ("admin" === b.roles[c].name || "staff" === b.roles[c].name || "admin-lab" === b.roles[c].name) return !0;
        if (b && b.credit) {
            if (b.credit.remaining && b.credit.remaining >= a) return !0;
            if (b.credit.promotional && b.credit.promotional >= a) return !0;
            if (b.credit.remaining && b.credit.promotional && b.credit.remaining + b.credit.promotional >= a) return !0
        }
        return !1
    }

    function y(a, d, e, f, h, i) {
        c.paramsCustomize = {}, c.paramsCustomize.shots = 100;
        var j = "templates/modals/shotsExecutionSim.html";
        h && (j = "templates/modals/parametersExecution.html", c.paramsCustomize.Tupper1 = 50, c.paramsCustomize.Tupper2 = 50), g.open({
            templateUrl: j,
            scope: c,
            controller: ["$scope", "$uibModalInstance", function(a, b) {
                a.ok = function(b) {
                    return b.Tupper1 && (!b.Tupper1 || b.Tupper1 < 10 || b.Tupper1 > 1e3 || !b.Tupper2 || b.Tupper2 < 10 || b.Tupper2 > 1e3) ? void a.$emit("show-notification", "T1 or T2 values are wrong", "error") : void(b.shots && b.shots >= 1 && b.shots <= 8192 ? a.$close({
                        paramsCustomize: b
                    }) : a.$emit("show-notification", "Shots value are wrong", "error"))
                }
            }]
        }).result.then(function(g) {
            var h;
            p.getQasmEditorVisible() && (h = b.qasmCodeTextArea), k.doExecution({
                id: a,
                idCode: d,
                deviceRunType: e.value,
                shots: g.paramsCustomize.shots,
                T1value: g.paramsCustomize.Tupper1,
                T2value: g.paramsCustomize.Tupper2,
                fromCache: !1
            }, {
                jsonQasm: f,
                qasm: h
            }, function(a) {
                i(null, a)
            }, function(a) {
                i(a && a.data && a.data.error ? "NOT_ALLOWED" === a.data.error.code || "QUEUE_DISABLED" === a.data.error.code ? a.data.error.code : a.data.error.message : "Error executing the code."), c.executionPending = !1
            })
        }, function() {
            c.executionPending = !1
        })
    }

    function z(a, e, f, g) {
        return d(function(d, h) {
            var i, j = b.topology;
            p.getQasmEditorVisible() && (i = b.qasmCodeTextArea);
            var l = [];
            if (g && j && j.executionTypes && j.executionTypes.indexOf("real") != -1) {
                var m = c.numberOfShots.real;
                k.resultsFromCache({
                    id: a,
                    idCode: e,
                    deviceRunType: "real",
                    shots: m
                }, {
                    jsonQasm: f
                }, function(g) {
                    var j = {},
                        l = {},
                        n = 3,
                        o = [],
                        p = "";
                    m > 1024 && (n = 5);
                    var q = {
                        label: "New Execution",
                        description: "Run a New Execution (" + n + " Units)",
                        value: "new"
                    };
                    b.statusR === !1 && (q.label += " *", q.description = "[Maintenance]: The device is in maintenance, but we can put your execution in queue to run when the device is available. " + q.description), t.getCurrentWithRoles(!0).then(function(s) {
                        if (g && g.length > 0) j = {
                            label: "Result from Cache",
                            description: "Get Existing Result (Units Free)",
                            value: "cache"
                        }, p = "We found a result of the same code executed recently on the device. Would you like to get this result? Otherwise, a new execution will be planned.", l = q, o = [j, l];
                        else {
                            if (!x(n, s)) return h("NOT_CREDITS");
                            j = q, p = b.statusR === !1 ? "The device is in maintenance, but it will soon be available" : "Do you want to run the execution?", o = [j]
                        }
                        r({
                            title: "Confirm your execution (shots: " + m + ")",
                            message: p,
                            label: "Confirm your execution",
                            input: !0,
                            selected: j,
                            resolveIfOneOption: !0,
                            optionButtons: o
                        }).then(function(b) {
                            var j = "cache" === b.value;
                            if (j) {
                                for (var l = 0; l < g.length; l++) g[l].label = new Date(g[l].data.date).toISOString().slice(0, 19).replace("T", " ");
                                r({
                                    title: "Select the result from cache that you want to display.",
                                    label: "Cache Results Found",
                                    input: !0,
                                    listItems: g,
                                    selected: g[0]
                                }).then(function(b) {
                                    k.doExecution({
                                        id: a,
                                        idCode: e,
                                        deviceRunType: "real",
                                        shots: m,
                                        idResult: b.id,
                                        fromCache: j
                                    }, {
                                        jsonQasm: f,
                                        qasm: i
                                    }, function(a) {
                                        d(a)
                                    }, function(a) {
                                        h(a && a.data && a.data.error ? "NOT_CREDITS" === a.data.error.code || "NOT_ALLOWED" === a.data.error.code || "QUEUE_DISABLED" === a.data.error.code ? a.data.error.code : a.data.error.message : "Error executing the code.")
                                    })
                                }, function(a) {
                                    c.executionPending = !1
                                })
                            } else k.doExecution({
                                id: a,
                                idCode: e,
                                deviceRunType: "real",
                                shots: m,
                                fromCache: j
                            }, {
                                jsonQasm: f,
                                qasm: i
                            }, function(a) {
                                v(), d(a)
                            }, function(a) {
                                h(a && a.data && a.data.error ? "NOT_CREDITS" === a.data.error.code || "NOT_ALLOWED" === a.data.error.code || "QUEUE_DISABLED" === a.data.error.code ? a.data.error.code : a.data.error.message : "Error executing the code.")
                            })
                        }, function(a) {
                            c.executionPending = !1
                        })
                    })
                }, function(a) {
                    c.executionPending = !1
                })
            } else if (g) h("Error executing the code.");
            else {
                var l = [];
                l.push({
                    label: "Ideal quantum processor 2.0",
                    description: "Simulator with ideal conditions for OPENQASM 2.0",
                    value: "sim_trivial_2"
                }), j.executionTypes && j.executionTypes.indexOf("sim_realistic") != -1 && l.push({
                    label: "Realistic quantum processor",
                    description: "Simulator with realistic conditions",
                    value: "sim_realistic"
                }), 0 == l.length && h("Error executing the code."), 1 != l.length || "sim_trivial" != l[0].value && "sim_trivial_2" != l[0].value ? r({
                    title: "Select where your code will be simulated.",
                    message: "The time to get the results will vary according with the type selected.",
                    input: !0,
                    label: "Simulator target",
                    selected: l[0],
                    optionButtons: l
                }).then(function(b) {
                    "sim_realistic" === b.value ? t.getCurrentWithUserTypeAndRoles(!0).then(function(c) {
                        t.allowCustomizeParameters(c) ? y(a, e, b, f, !0, function(a, b) {
                            a ? h(a) : d(b)
                        }) : y(a, e, b, f, !1, function(a, b) {
                            a ? h(a) : d(b)
                        })
                    }) : y(a, e, b, f, !1, function(a, b) {
                        a ? h(a) : d(b)
                    })
                }, function(a) {
                    c.executionPending = !1
                }) : k.doExecution({
                    id: a,
                    idCode: e,
                    deviceRunType: l[0].value,
                    shots: c.numberOfShots.simulator,
                    fromCache: !1
                }, {
                    jsonQasm: f,
                    qasm: i
                }, function(a) {
                    d(a)
                }, function(a) {
                    h(a && a.data && a.data.error ? "NOT_ALLOWED" === a.data.error.code || "QUEUE_DISABLED" === a.data.error.code ? a.data.error.code : a.data.error.message : "Error executing the code."), c.executionPending = !1
                })
            }
        })
    }

    function A(a, e) {
        var f = k.getCurrentId();
        return d(function(d, g) {
            var h;
            c.currentCode && c.currentCode.description && (h = c.currentCode.description);
            var i;
            p.getQasmEditorVisible() && (i = b.qasmCodeTextArea), k.codes.create({
                id: f
            }, {
                name: e,
                description: h,
                jsonQASM: a,
                codeType: "QASM2",
                qasm: i
            }, function(a) {
                d(a)
            }, function(a) {
                g(a && a.data && a.data.error ? a.data.error.message : "Error creating the code.")
            })
        })
    }

    function B(a, e) {
        return d(function(d, f) {
            return e.numberGates ? void(a && void 0 !== a.id ? l.findById({
                id: a.id
            }, function(a) {
                var g = a.description;
                c.currentCode && c.currentCode.description && (g = c.currentCode.description), c.currentCode && c.currentCode.name !== a.name && (a.name = c.currentCode.name), a.jsonQASM = e, p.getQasmEditorVisible() ? a.qasm = b.qasmCodeTextArea : a.qasm = void 0, a.description = g, l.createOrUpdateCode(a, function(a) {
                    d(a)
                }, function(a) {
                    f(a.data.error.message)
                })
            }, function(a) {
                f(a.data.error.message)
            }) : f("The experiment is empty")) : void f("The experiment is empty!")
        })
    }

    function C(a, b) {
        return d(function(c, d) {
            if (!a.numberGates) return void d("The experiment is empty!");
            if (b && "" != b) A(a, b).then(function(a) {
                c(a)
            }, function(a) {
                d(a)
            });
            else {
                var e = h("date")(new Date, "yyyyMMddHHmmss");
                r({
                    title: "Name your experiment",
                    message: "Your experiment will be saved before executing it. Please, enter a name for your experiment: ",
                    input: !0,
                    label: "Experiment name",
                    value: "Experiment #" + e
                }).then(function(b) {
                    A(a, b).then(function(a) {
                        c(a)
                    }, function(a) {
                        d(a)
                    })
                }, function(a) {
                    d(a)
                })
            }
        })
    }
    c.numberOfShots = {
        real: 1024,
        simulator: 100
    }, c.advancedMode = !1;
    var D;
    a.scrollTo(0, 0), p.setQasmEditorVisible(!1), b.subroutines = p.getSubroutines(), b.predefinedSubroutines = [], p.getPredefinedSubroutines().then(function(a) {
        b.predefinedSubroutines = a
    }), c.showDots = !1, c.showLinkableLines = !1, c.collapseStats = !1, c.gateDescription = void 0, b.qasmCodeTextArea = void 0, b.errorMessage = void 0, b.topology && (c.commandsMatrix = p.getGatesMatrix()), i(function() {
        iosDragDrop("playground-canvas-wrapper"), iosDragDrop("playground-gates-menu")
    }), v(), p.getTopologies().then(function(a) {
        c.topologies = a
    }, function(a) {
        c.showError("Something went wrong trying to get the Topology. Executing experiments may not work.")
    }), p.getVisibleGates().then(function(a) {
        c.gatesByType = a
    }, function(a) {
        c.showError("Something went wrong trying to get the gates.")
    });
    var E = function() {
        g.open({
            animation: c.animationsEnabled,
            templateUrl: "templates/playground_results_modal.html",
            controller: "resultsController",
            size: "extralarge"
        })
    };
    c.showLastResultsModal = function() {
        if (!f.codeId) return void c.showError("There are no results for this code");
        g.open({
            animation: c.animationsEnabled,
            templateUrl: "templates/playground_last_results_modal.html",
            controller: "lastResultsController"
        })
    }, c.addQReg = function(a) {
        a.qregs || (a.qregs = []), a.qregs.push({
            name: "q",
            size: 1
        })
    }, c.addCReg = function(a) {
        a.cregs || (a.cregs = []), a.cregs.push({
            name: "c",
            size: 1
        })
    }, c.removeQReg = function(a, b) {
        b.qregs && b.qregs.length > 1 && b.qregs.splice(a, 1)
    }, c.removeCReg = function(a, b) {
        b.cregs && b.cregs.length > 1 && b.cregs.splice(a, 1)
    }, c.lookForTopologyErrors = function(a, b) {
        if (!(a.qregs && a.cregs && a.qregs.length && a.cregs.length)) return void c.$emit("show-notification", "There must be at least 1 creg and 1 qreg in the topology.", "danger");
        for (var d = [], e = 0, f = 0; f < a.qregs.length; f++) {
            if (!a.qregs[f].size || a.qregs[f].size <= 0 || d.indexOf(a.qregs[f].name) !== -1) return void c.$emit("show-notification", 'The qreg "' + a.qregs[f].name + '" has no qubits or another qreg has the same name.', "danger");
            if (a.qregs[f].size > p.getQubitsLimit()) return void c.$emit("show-notification", "You can't select more than " + p.getQubitsLimit() + " qubits.", "danger");
            e += a.qregs[f].size, d.push(a.qregs[f].name)
        }
        if (e > p.getQubitsLimit()) return void c.$emit("show-notification", "You can't select more than " + p.getQubitsLimit() + " qubits.", "danger");
        for (var g = 0, f = 0; f < a.cregs.length; f++) {
            if (!a.cregs[f].size || a.cregs[f].size <= 0 || d.indexOf(a.cregs[f].name) !== -1) return void c.$emit("show-notification", 'The creg "' + a.cregs[f].name + '" has no bits or another creg has the same name.', "danger");
            if (a.cregs[f].size > p.getBitsLimit()) return void c.$emit("show-notification", "You can't select more than " + p.getBitsLimit() + " bits.", "danger");
            g += a.cregs[f].size, d.push(a.cregs[f].name)
        }
        return g > p.getBitsLimit() ? void c.$emit("show-notification", "You can't select more than " + p.getBitsLimit() + " bits.", "danger") : void b(a)
    }, c.customTopology = function(a, d, e, f) {
        c.newTopology = f || {
            name: "Custom Topology",
            qregs: [{
                name: "q",
                size: 5
            }],
            cregs: [{
                name: "c",
                size: 5
            }]
        };
        var h = g.open({
            animation: c.animationsEnabled,
            templateUrl: "templates/playground_custom_topology_modal.html",
            size: "large",
            scope: c
        });
        h.result.then(function(c) {
            c.executionTypes = ["sim_trivial_2"], c.topology = {
                qasmHeader: "OPENQASM 2.0;\n"
            }, b.topology = c, d && d({
                name: a,
                topology: c
            })
        }, function(a) {
            e && e(a)
        })
    };
    var F = function() {
        var a = d.defer();
        return p.getTopologies().then(function(d) {
            for (var e = [], f = 0; f < d.length; f++) d[f].isHidden || e.push(d[f]);
            e.push({
                isCustom: !0,
                name: {
                    en: "Custom Topology"
                },
                description: {
                    en: "Build your own topology"
                },
                topology: {
                    qasmHeader: "OPENQASM 2.0;"
                }
            }), c.topologies = e;
            var h = g.open({
                animation: c.animationsEnabled,
                templateUrl: "templates/playground_topology_modal.html",
                size: "large",
                scope: c
            });
            h.result.then(function(d) {
                d.name && (c.currentCode = {
                    name: d.name
                }, p.setCode(c.currentCode)), d.topology.isCustom ? c.customTopology(d.name, a.resolve, a.reject) : (b.topology = d.topology, p.setTopologyUsed(d.topology), a.resolve(d))
            }, function() {
                a.reject("")
            })
        }), a.promise
    };
    c.showResultsModal = E;
    var G = function() {
        g.open({
            animation: c.animationsEnabled,
            templateUrl: "templates/playground_help_modal.html",
            controller: "helpController",
            size: "extralarge"
        })
    };
    c.showHelp = G, c.showError = function(a, b) {
        var d = b || "warning";
        c.$emit("show-notification", a, d)
    }, c.execute = function(a) {
        if (b.errorMessage) return void c.showError("Please, fix any error before running the score.");
        c.executionPending = !0;
        var d = p.getJsonQasm(b.topology);
        if (0 == d.numberGates && (c.executionPending = !1, c.showError("Oops, the playground is empty. I thought you wanted to execute something.")), d.hasMeasures) {
            var g = k.getCurrentId(),
                h = c.currentCode;
            if (!h || void 0 === h.id || h.fromTutorial || h.fromCommunity) {
                var i = void 0;
                h && h.name && (i = h.name), C(d, i).then(function(b) {
                    p.setCode(b), c.currentCode = b, c.$emit("show-notification", "Code created!", "success"), f.codeId = b.idCode, e.go(".", f, {
                        notify: !1,
                        reload: !1
                    }), w(g, b.idCode, d, a)
                }, function(a) {
                    c.executionPending = !1, c.$emit("show-notification", a, "danger")
                })
            } else w(g, h.idCode, d, a)
        } else c.executionPending = !1, d.hasBloch ? c.showError("Bloch measures are currently not available.") : c.showError("You need to add at least one measure gate to execute the score.")
    }, c.dragGateStart = function(a, b) {
        c.showDots = !0, b && b.subtype && "link" === b.subtype && (c.showLinkableLines = !0)
    }, c.dragGateEnd = function(a, b) {
        c.showDots = !1, c.showLinkableLines = !1
    }, c.setDescription = function(a) {
        c.gateDescription = a
    }, c.clearQasm = function() {
        b.qasmCodeTextArea = ""
    }, c.clearPlayground = function(a) {
        c.commandsMatrix = [], p.clearGatesMatrix(), p.clearSubroutines(), b.subroutines = p.getSubroutines(), p.setCode(void 0), p.setTutorialName(void 0), c.currentCode = void 0, b.qasmCodeTextArea = "", c.showLinkToTutorial = !1, c.showLinkToCommunity = void 0, c.isNewExecution = !0, f.codeId = void 0, f.fromTutorial = !1, f.fromCommunity = void 0, f.executionCode = !1, e.go(".", f, {
            notify: !1,
            reload: !1
        }), c.$broadcast("clear-playground"), a && a()
    }, c.newCodeDialog = function() {
        F().then(function(a) {
            c.clearPlayground(function() {
                a && a.name && c.updateLocalDescription(a)
            })
        }, function(a) {
            a && c.$emit("show-notification", a, "danger")
        })
    }, c.editRunParams = function(a, b) {
        var d = [{
                label: "1 Shot (3 Units)",
                value: 1
            }, {
                label: "1024 Shots (3 Units)",
                value: 1024
            }, {
                label: "4096 Shots (5 Units)",
                value: 4096
            }, {
                label: "8192 Shots (5 Units)",
                value: 8192
            }],
            e = {
                title: "Select the number of shots for your execution.",
                label: "Number of shots" + (a ? "" : "(between 1 and 8192)"),
                value: b,
                input: !0
            };
        if (a) {
            for (var f = 0; f < d.length; f++) d[f].value == b && (e.selected = d[f]);
            e.listItems = d
        }
        var g = r(e);
        return g.then(function(b) {
            a ? c.numberOfShots.real = b.value : c.numberOfShots.simulator = parseInt(b);
        }), g
    }, c.updateLocalDescription = function(a) {
        c.currentCode = a, p.setCode(c.currentCode)
    }, c.saveCodeAs = function() {
        var a = p.getJsonQasm(b.topology);
        C(a, void 0).then(function(a) {
            p.setCode(a), c.currentCode = a, f.codeId = a.idCode, e.go(".", f, {
                notify: !1,
                reload: !1
            }), c.$emit("show-notification", "Experiment created!", "success")
        }, function(a) {
            a && c.$emit("show-notification", a, "danger")
        })
    }, c.saveCode = function() {
        var a = p.getJsonQasm(b.topology),
            d = c.currentCode;
        if (!d || void 0 === d.id || d.fromTutorial || d.fromCommunity) {
            var g = void 0;
            d && d.name && (g = d.name), C(a, g).then(function(a) {
                p.setCode(a), c.currentCode = a, f.codeId = a.idCode, e.go(".", f, {
                    notify: !1,
                    reload: !1
                }), c.$emit("show-notification", "Experiment created!", "success")
            }, function(a) {
                a && c.$emit("show-notification", a, "danger")
            })
        } else B(d, a).then(function(a) {
            p.setCode(a), c.currentCode = a, c.$emit("show-notification", "Experiment saved!", "success")
        }, function(a) {
            c.$emit("show-notification", a, "danger")
        })
    }, c.stickyMenu = !1, c.$watch("topology", function(a) {
        c.isRealDevice = a && a.executionTypes && a.executionTypes.indexOf("real") !== -1
    }), c.makeSticky = function(a, b) {
        c.stickyMenu = !a;
        var d = document.getElementById("playground-right-tabs");
        d && (d.style.top = "", d.style.bottom = "", b.parts && !b.parts.top && (d.style.top = -1 * b.elementRect.top + 42 + "px"), b.parts && !b.parts.bottom)
    }, c.$on("gate-selected", function(a, b, d) {
        b ? (c.selectedGate = b, c.seletecGateUpdate = d) : (c.selectedGate = void 0, c.seletecGateUpdate = void 0)
    }), c.$on("gates-matrix-modified", function(a, c, d) {
        D && i.cancel(D), p.getQasmEditorVisible() || (D = i(function() {
            b.qasmCodeTextArea = q.parse(p.getJsonQasm(b.topology, !0), !0)
        }, 250))
    }), (f.fromTutorial || p.isFromTutorial() || f.fromCommunity) && (f.fromCommunity ? c.showLinkToCommunity = f.fromCommunity : (p.setTutorialName(f.codeName || p.getTutorialName()), c.showLinkToTutorial = !0));
    var H = f.sharedCode;
    if (f.sharedCode && (p.setCode(void 0), c.loadingCode = !0, l.getSharedCode({
            id: f.codeId
        }, function(a) {
            void 0 !== a && void 0 !== a.id ? (a.id = void 0, a.idCode = void 0, c.currentCode = a, p.setCode(a), b.subroutines = a.jsonQASM.gateDefinitions, u(), f.codeId = void 0, f.sharedCode = void 0, p.getGatesMatrixFromJsonQasm(a.jsonQASM).then(function(a) {
                c.loadingCode = !1, c.commandsMatrix = a || [], e.go(".", f, {
                    notify: !1,
                    reload: !1
                })
            })) : (c.loadingCode = !1, c.clearPlayground(), c.showError("The experiment doesn't exist."))
        }, function(a) {
            c.loadingCode = !1, c.clearPlayground(), c.showError("The experiment doesn't exist.")
        })), H || void 0 === f.codeId)
        if (f.executionCode) c.loadingCode = !0, f.executionCode.fromTutorial = c.showLinkToTutorial, f.executionCode.fromCommunity = c.showLinkToCommunity, c.currentCode = f.executionCode, p.setCode(f.executionCode), b.subroutines = f.executionCode.jsonQASM.gateDefinitions, u().then(function() {
            b.qasmCodeTextArea = f.executionCode.qasm
        }), p.getGatesMatrixFromJsonQasm(f.executionCode.jsonQASM).then(function(a) {
            c.loadingCode = !1, c.commandsMatrix = a || [], f.executionCode = void 0, e.go(".", f, {
                notify: !1,
                reload: !1
            })
        }, function(a) {
            c.loadingCode = !1
        });
        else {
            var I = p.getCode();
            c.currentCode = I, I && I.jsonQASM && (b.subroutines || (b.subroutines = I.jsonQASM.gateDefinitions), u()), !I || I.fromTutorial || I.fromCommunity ? I ? I.fromCommunity ? c.showLinkToCommunity = I.fromCommunity : c.showLinkToTutorial = !0 : H ? (f.codeId = void 0, e.go(".", f, {
                notify: !1,
                reload: !1
            })) : b.topology ? b.topology.autoSelected && F() : c.clearPlayground(F) : (f.codeId = I.idCode, e.go(".", f, {
                notify: !1,
                reload: !1
            }))
        }
    else {
        c.loadingCode = !0;
        var J = k.getCurrentId();
        k.lastCode({
            id: J,
            idCode: f.codeId
        }, function(a) {
            void 0 !== a && void 0 !== a.id ? (c.currentCode = a, p.setCode(a), b.subroutines = a.jsonQASM.gateDefinitions, u(), p.getGatesMatrixFromJsonQasm(a.jsonQASM).then(function(a) {
                c.loadingCode = !1, c.commandsMatrix = a || []
            })) : (c.loadingCode = !1, c.clearPlayground(), c.showError("The experiment doesn't exist."))
        }, function(a) {
            c.loadingCode = !1, c.clearPlayground(), c.showError("There was an error trying to load the experiment.")
        })
    }
    c.updateCommandsMatrix = function(a) {
        c.commandsMatrix = a || []
    }, c.$watch("subroutines", function(a, c) {
        var d = p.setSubroutines(a);
        angular.equals(a, c) && angular.equals(d, a) || (b.subroutines = d)
    }), c.addSubroutine = function(a) {
        var d = g.open({
            animation: c.animationsEnabled,
            backdrop: "static",
            templateUrl: "templates/playground_custom_subroutine_modal.html",
            size: "extralarge",
            controller: ["$scope", "$timeout", "playgroundFactory", function(a, b, c) {
                var d;
                a.gateQasm = "", a.gateCommandsMatrix = void 0, a.refreshCodeMirror = !1, a.codemirrorLoaded = function(c) {
                    b(function() {
                        a.refreshCodeMirror = !0
                    }, 100), a.codemirrorEditor = c;
                    c.getDoc();
                    c.focus()
                }, a.$watch("gateQasm", function(e) {
                    d && b.cancel(d), e && (d = b(function() {
                        a.gateErrorMessage = 0;
                        for (var b = a.codemirrorEditor, d = b.getDoc(), f = b.lineCount(), g = 0; g < f; g++) d.removeLineClass(parseInt(g), "gutter", "line-error");
                        try {
                            var h = c.getSubroutines(),
                                i = [];
                            if (h)
                                for (var g = 0; g < h.length; g++) {
                                    var j = h[g],
                                        k = {
                                            name: j.name,
                                            qasm: j.qasm
                                        };
                                    j.gateDefinition && (k.lines = j.gateDefinition.lines, j.gateDefinition.params && (k.params = j.gateDefinition.params)), i.push(k)
                                }
                            for (var l = c.getGates().$$state.value.gates, m = [], g = 0; g < l.length; g++) {
                                var k = l[g],
                                    n = {
                                        name: k.name,
                                        qasm: k.qasm
                                    };
                                k.gateDefinition && (n.definition = k.gateDefinition), k.params && (n.params = k.params), m.push(n)
                            }
                            for (var o = c.getPredefinedSubroutines().$$state.value, p = [], g = 0; g < o.length; g++) {
                                var j = o[g],
                                    n = {
                                        name: j.name,
                                        qasm: j.qasm
                                    };
                                j.gateDefinition && (n.definition = j.gateDefinition), j.params && (n.params = j.params), p.push(n)
                            }
                            var q = {
                                    gatesDefinition: m,
                                    predefinedSubroutines: p,
                                    subroutines: i
                                },
                                r = qasmGateAnalyzer.parse(e, q);
                            r && r.jsonQASM && (a.gateTopology = r.jsonQASM.topology, a.qasmSubroutines = r.gate, c.getGatesMatrixFromJsonQasm(r.jsonQASM).then(function(b) {
                                a.gateCommandsMatrix = b || []
                            }))
                        } catch (s) {
                            var t = 0;
                            s.hash && s.hash.loc && (t = s.hash.loc.first_line), qasmGateAnalyzer.parse("clean");
                            var u = s.message,
                                f = b.lineCount();
                            d.addLineClass(parseInt(t), "gutter", "line-error"), a.gateErrorMessage = "Error in line " + t + ": " + u
                        }
                    }, 600))
                })
            }],
            scope: c
        });
        d.result.then(function(a) {
            for (var c = 0; c < a.length; c++) {
                var d = a[c];
                p.addSubroutine(d)
            }
            b.subroutines = p.getSubroutines()
        })
    }, c.downloadQASM = function() {
        q.downloadQASMDirectly(c.currentCode ? c.currentCode.id : void 0, b.qasmCodeTextArea)
    }, c.codemirrorLoaded = function(a) {
        c.codemirrorEditor = a
    }, c.isGateVisible = function(a, b, c) {
        return !a.displayProperties || (!a.displayProperties.unavailableInDevice || !c || !c.executionTypes || c.executionTypes.indexOf("real") === -1) && (b || !a.displayProperties.isAdvanced)
    }, c.setAdvancedMode = function(a) {
        c.advancedMode = a
    }
}]), angular.module("qubitsApp").controller("playgroundTabsController", ["$window", "$rootScope", "$scope", "$q", "$state", "$stateParams", "$uibModal", "$timeout", function(a, b, c, d, e, f, g, h) {
    c.activeTab = 0, c.saveParameters = function() {
        c.seletecGateUpdate(c.selectedGate.params)
    }, c.$watch("activeTab", function(a) {}), c.$watch("selectedGate", function(a) {
        a && (a.description && a.description.en || a.params || a.qasmDefinition) ? c.activeTab = 1 : c.activeTab = 0
    })
}]), angular.module("qubitsApp").controller("qasmEditorController", ["$rootScope", "$scope", "$timeout", "$location", "$state", "$stateParams", "$uibModal", "$q", "promptDialog", "userService", "jsonQasmParser", "playgroundFactory", function(a, b, c, d, e, f, g, h, j, k, l, m) {
    function n() {
        var a = b.codemirrorEditor,
            c = a.getDoc(),
            d = a.lineCount();
        for (i = 0; i < d; i++) c.removeLineClass(i, "gutter", "line-error")
    }

    function o(c, d) {
        m.getJsonQasmFromQasm(c, a.topology).then(function(d) {
            var e = angular.copy(d);
            if (a.errorMessage = void 0, n(), e && !angular.equals(r, e)) {
                if (r = angular.copy(e), b.loadingCode = !0, !a.topology || void 0 === a.topology.id) {
                    var f = e.topology;
                    f.executionTypes = ["sim_trivial_2"], f.name = "Custom Topology", a.topology = f
                }
                m.getGatesMatrixFromJsonQasm(e).then(function(d) {
                    for (var f in e.gateDefinitions) e.gateDefinitions[f] = angular.extend(e.gateDefinitions[f], {
                        type: "subroutine",
                        subtype: "multiline"
                    });
                    a.subroutines = angular.copy(e.gateDefinitions), b.loadingCode = !1, b.commandsMatrixQasm = d, d && d.length || (b.commandsMatrixQasm = []), a.qasmCodeTextArea = c
                }, function() {
                    b.loadingCode = !1
                })
            } else c && "" != c || (b.commandsMatrixQasm = void 0, b.qasmCodeTextArea = "")
        }, function(c) {
            var d = b.codemirrorEditor,
                e = d.getDoc();
            Array.isArray(c) ? (n(), e.addLineClass(parseInt(c[0]) - 1, "gutter", "line-error"), a.errorMessage = "Error in line " + c[0] + ": " + c[1]) : (n(), e.addLineClass(0, "gutter", "line-error"), a.errorMessage = "Error: " + c[1])
        })
    }
    var p, q, r;
    a.errorMessage = void 0, m.setQasmEditorVisible(!0), b.$on("clear-playground", function() {
        f.fromTutorial = !1, f.executionCode = !1, f.codeId = void 0, e.go(".", f, {
            notify: !1,
            reload: !1
        })
    }), b.$on("new-code", function() {
        var a = m.getCode();
        if (a && a.qasm) b.qasmCodeTextArea = a.qasm;
        else if (a && a.jsonQasm) try {
            b.qasmCodeTextArea = l.parse(a.jsonQASM, !0)
        } catch (c) {
            console.log(c)
        } else b.commandsMatrixQasm = void 0, b.qasmCodeTextArea = l.parse(m.getJsonQasm(b.topology, !0, !0), !0)
    }), b.$watch("topology", function(a, c) {
        if (a && !angular.equals(a, c))
            if (b.qasmCodeTextArea && "" != b.qasmCodeTextArea) f.codeId || b.commandsMatrixQasm && 0 != b.commandsMatrixQasm.length || f.executionCode && f.executionCode.qasm || (b.qasmCodeTextArea = l.parse(m.getJsonQasm(a, !0), !0));
            else {
                var d = m.getCode();
                if (b.commandsMatrix && 0 != b.commandsMatrix.length || !d || !d.qasm)
                    if (b.commandsMatrix && 0 != b.commandsMatrix.length || !d || !d.jsonQASM) b.qasmCodeTextArea = l.parse(m.getJsonQasm(a, !0), !0);
                    else try {
                        b.qasmCodeTextArea = l.parse(d.jsonQASM, !0)
                    } catch (e) {
                        console.log(e)
                    } else b.qasmCodeTextArea = d.qasm
            }
    }), !a.topology || f.codeId || f.executionCode && f.executionCode.qasm || (b.qasmCodeTextArea = l.parse(m.getJsonQasm(a.topology, !0), !0)), b.$watch("commandsMatrixQasm", function(a) {
        a ? m.setGatesMatrix(a) : m.setGatesMatrix([])
    }), b.$watch("qasmCodeTextArea", function(a, b) {
        p && c.cancel(p), m.getQasmEditorVisible() && a && !/^\s*$/.test(a) && (a = a.replace("IBMQASM 2.0;\n", ""), a = a.replace("OPENQASM 2.0;\n", ""), q = a, p = c(function() {
            o(q, !0)
        }, 1e3))
    }), b.uploadQASM = function() {
        g.open({
            controller: "readFileModalInstanceController",
            scope: b,
            templateUrl: "templates/read_file.html"
        }).result.then(function(a) {
            a && "" !== a.trim() && (b.qasmCodeTextArea = a.trim())
        })
    }, b.downloadQASM = function() {
        var c = "myCode";
        b.currentCode && (c = b.currentCode.name || "myCode");
        var d = void 0;
        m.getCode() && m.getCode().id && (d = m.getCode().id), l.downloadQASMDirectly(d, a.qasmCodeTextArea, c)
    }, b.qasmCodeTextArea && o(b.qasmCodeTextArea, !0), b.$on("$destroy", function() {
        return m.setQasmEditorVisible(!1), a.errorMessage = void 0, b.commandsMatrixQasm ? (b.loadingCode = !1, void b.updateCommandsMatrix(b.commandsMatrixQasm)) : void(b.loadingCode = !1)
    })
}]), angular.module("qubitsApp").controller("resultsController", ["$rootScope", "$scope", "$timeout", "$state", "$location", "$uibModalInstance", "$sce", "$http", "Execution", "LoopBackAuth", function(a, b, c, d, e, f, g, h, i, j) {
    function k(a) {
        for (var b = 0, c = a.length; b < c;) a[b] = parseFloat(a[b]).toFixed(6), b++;
        return a
    }

    function l(a) {
        var b = a.p.labelsShrink || a.p.labels,
            c = (24 * b.length, b.length > 16 ? 60 * b.length + "px" : void 0),
            d = (angular.element(document.querySelector("#plotP")).parent().offsetHeight, a.p.valuesShrink || a.p.values),
            e = [k(d)],
            f = new Chartist.Bar("#plotP", {
                labels: b,
                series: e
            }, {
                width: c,
                distributeSeries: !1,
                high: 1,
                low: 0
            });
        f.on("draw", function(a) {
            var b, c, d, e;
            return "bar" === a.type && (b = a.x1 + .5 * a.element.width(), c = a.y1 + a.element.height() * -1 - 5, e = a.element.attr("ct:value"), "0" !== e) ? (d = new Chartist.Svg("text"), d.text(parseFloat(e).toFixed(3)), d.addClass("ct-barlabel"), d.attr({
                fill: "#777777",
                x: b,
                y: c,
                "text-anchor": "middle"
            }), a.group.append(d)) : void a.element.animate({
                opacity: {
                    dur: 1e3,
                    from: 0,
                    to: 1
                }
            })
        })
    }

    function m(a, b, c) {
        return c = c || "0", a += "", a.length >= b ? a : new Array(b - a.length + 1).join(c) + a
    }

    function n(a, b) {
        for (var c = Math.pow(2, a), d = b.labels, e = {}, f = {}, g = 0; g < d.length; g++) e[parseInt(d[g], 2)] = b.values[g];
        for (var g = 0; g < c; g++) f[g] = m(g.toString(2), a), e[g] || (e[g] = 0);
        return b.labels = Object.keys(f).map(function(a) {
            return f[a]
        }), b.values = Object.keys(e).map(function(a) {
            return e[a]
        }), b
    }

    function o(a) {
        if (a) {
            for (var c = [], d = 0; d < a.length; d++)
                if ("Q" === a[d].key.charAt(0)) {
                    var e = parseInt(a[d].key.substr(1)) - 1;
                    c[e] = {}, c[e].key = "$$Q_" + e + "$$", c[e].values = a[d].values
                }
            for (var d = 0; d < a.length; d++)
                if ("C" === a[d].key.charAt(0)) {
                    var f = a[d].key.substr(2).split("_"),
                        g = parseInt(f[0]) - 1;
                    parseInt(f[1]) - 1;
                    for (var h in a[d].values) c[g].values[h] = a[d].values[h]
                }
            for (var i = [], d = 0; d < c.length; d++) {
                i[d] = {}, i[d].key = c[d].key, i[d].values = {};
                var e = 5;
                for (h in c[d].values) {
                    var j = "$$" + h + "$$",
                        k = {};
                    if ("f" === h) k.label = j, k.value = "$$" + (parseFloat(c[d].values[h]) / 1e9).toFixed(2) + "\\ \\text{GHz}$$";
                    else if ("e" === h.charAt(0)) {
                        j = "$$\\epsilon " + h.substring(1) + "$$", k.label = j, k.value = parseFloat(c[d].values[h]).toExponential().toString();
                        var l = k.value.split("e");
                        k.value = "$$" + l[0] + "\\times 10^{" + l[1] + "}$$"
                    } else "t" === h.charAt(0) && (j = "$$" + h.toUpperCase() + "$$", k.label = j, k.value = "$$" + c[d].values[h] + "\\ \\mu \\text{s}$$");
                    "f" === h ? i[d].values[0] = k : "t_1" === h ? i[d].values[1] = k : "t_2" === h ? i[d].values[2] = k : "e_g" === h ? i[d].values[3] = k : "e_r" === h ? i[d].values[4] = k : i[d].values[e++] = k
                }
            }
            b.stats = i
        }
    }
    var p = a.execution;
    if (p) {
        if (p.result && p.result.data && p.result.data.p && "sim_trivial_2" != p.deviceRunType) {
            var q = p.result.data.p.labels[0].length;
            p.result.data.p = n(q, p.result.data.p)
        }
    } else b.$emit("show-notification", "There are no results to show.", "info");
    b.codemirrorLoaded = function(a) {
        c(function() {
            b.refreshCodeMirror = !0
        }, 200)
    }, b.execution = p, b.urlDownloadAll = "/api/Executions/" + p.id + "/data", b.execution.code ? b.qasmExecution = b.execution.code.qasm : b.qasmExecution = b.execution.result.data.qasm, "real" == p.deviceRunType && void 0 !== p.calibration && o(p.calibration.properties), c(function() {
        if (void 0 !== p) {
            var a = (p.result.data.valsxyz, 0),
                c = [];
            b.qsIn3D = !1;
            for (var d in p.result.data.valsxyz) {
                var e = p.result.data.valsxyz[d],
                    f = d;
                p.result.data.p && (f = p.result.data.p.qubits[a]), c.push({
                    x: e.x,
                    y: e.y,
                    z: e.z,
                    q: f
                }), plotXYZ("#plot3dqbit-" + a, "qubit " + f, e.x, e.y, e.z, f), p.result.data.valsxyz[d].q = f, plotXYZ3D("plot3dqbiti-" + a++, "qubit " + f, [{
                    x: e.x,
                    y: e.y,
                    z: e.z,
                    q: f
                }])
            }
            MathJax.Hub.Queue(["Typeset", MathJax.Hub])
        }
    }), c(function() {
        if (p.result.data.p) {
            l(p.result.data);
            var a = p.result.data.p.labels[0].length;
            a <= 5 && qsphere("qSphere", p.result.data.p)
        }
    }), b.downloadCSV = function() {
        var a = "/api",
            b = a + "/Executions/" + p.id + "/csvdistribution";
        b = b + "?access_token=" + j.accessTokenId, window.open(b, "_blank")
    }, b.downloadCSVBloch = function() {
        var a = "/api",
            b = a + "/Executions/" + p.id + "/csvbloch";
        b = b + "?access_token=" + j.accessTokenId, window.open(b, "_blank")
    }, b.downloadAllData = function() {
        if (p && p.result && p.result.data && p.result.data.valsxyz) {
            var a = {},
                b = 0;
            for (var c in p.result.data.valsxyz) {
                var d = angular.element(document.querySelector("#plot3dqbit-" + b++))[0].outerHTML,
                    e = document.createElement("canvas");
                canvg(e, d);
                var f = e.toDataURL("image/png");
                if (f) {
                    a || (a = {}), a.blochs || (a.blochs = {});
                    var g = c;
                    p.result.data.p && (g = p.result.data.p.qubits[c]), a.blochs[g] = f
                }
            }
            a && (angular.element(document.querySelector("#data"))[0].value = JSON.stringify(a))
        } else if (p && p.result && p.result.data && p.result.data.p) {
            var h = angular.element(document.querySelector("#qSphere")).children()[0];
            if (h) {
                var e = document.createElement("canvas"),
                    i = e.getContext("2d");
                e.width = 300, e.height = 300, i.drawImage(h, 0, 0, e.width, e.height);
                var j = e.toDataURL("img/png"),
                    a = {};
                a.qsphere = j, angular.element(document.querySelector("#data"))[0].value = JSON.stringify(a)
            }
        }
        var k = angular.element(document.querySelector("#downloadAllWorkaround"))[0];
        k.submit()
    }, b.goTo = function(a, b) {
        d.go(a, b), f && f.close()
    }, b.formatDate = function(a) {
        if (a) return a.slice(0, 16).replace(/T/g, " ")
    }, b.formatFridge = function(a) {
        if (a) return a + " Kelvin"
    }, b.ok = function() {
        f && f.dismiss()
    }
}]), angular.module("qubitsApp").controller("signupController", ["$rootScope", "$scope", "User", "$location", "$state", "vcRecaptchaService", "$window", function(a, b, c, d, e, f, g) {
    function h(a) {
        var b = /^[\w!@#%&\/(){}[\]=?+*^~\-.:,;]{8,16}$/;
        return null !== (m = b.exec(a))
    }
    var i = d.search();
    i.hash && (b.hash = i.hash);
    var j = [{
        label: "Hmm what’s a qubit?",
        value: "a"
    }, {
        label: "Have read some articles about quantum",
        value: "b"
    }, {
        label: "Studied quantum mechanics in college",
        value: "c"
    }, {
        label: "PhD level quantum research and above",
        value: "d"
    }];
    b.familiarity = {
        answers: j,
        selected: j[0]
    }, b.publicKey = "6LeYsB4TAAAAAO3Hfq_Nfbp1n1CJowX5ieg7oryE", b.errors = void 0, b.infoMessage = void 0;
    var k = function() {
        if (b.errors = void 0, b.infoMessage = void 0, "" === f.getResponse()) b.errors = "Resolve the captcha";
        else {
            if (b.signupLoading = !0, b.password !== b.passwordRepeat) return b.errors = "Passwords are not equal.", b.signupLoading = !1, void g.scrollTo(0, 0);
            if (!h(b.password)) return b.errors = "Your password is not valid. It should have between 8 and 16 characters (Alphanumerics and !@#%&/(){}[]=?+*^~-.:,;_).", b.signupLoading = !1, void g.scrollTo(0, 0);
            if (!b.termsAndConditions) return b.errors = "You have to accept the Legal Disclaimer to proceed.", b.signupLoading = !1, void g.scrollTo(0, 0);
            if (!b.description || "" === b.description || b.description.length < 10) return b.errors = "Please, enter an answer with more than 10 characters on 'What would you like to use the IBM Quantum Experience for?'", b.signupLoading = !1, void g.scrollTo(0, 0);
            c.create({
                email: b.email,
                institution: b.institution,
                password: b.password,
                firstName: b.firstname,
                lastName: b.lastName,
                description: b.description,
                familiarity: b.familiarity.selected.value + ") " + b.familiarity.selected.label,
                additionalData: {
                    termsAndConditions: b.termsAndConditions
                },
                "g-recaptcha-response": f.getResponse()
            }, function(a) {
                b.signupLoading = !1, b.infoMessage = "Verify your email Address. We now need to verify your email address. ", b.infoMessage += "We've sent an email to verify your address. Please click the link in that email to continue", b.hideFields = !0
            }, function(a) {
                a.data.error && "MAIL_HAS_NOT_INVITED" === a.data.error.error ? b.errors = "The email has not been invited." : b.errors = "Please, check the fields.", b.signupLoading = !1, g.scrollTo(0, 0)
            })
        }
    };
    b.signup = k
}]), angular.module("qubitsApp").controller("signupinvitationController", ["$rootScope", "$scope", "User", "$location", "$state", function(a, b, c, d, e) {
    function f(a) {
        var b = /^[\w!@#%&\/(){}[\]=?+*^~\-.:,;]{8,16}$/;
        return null !== (m = b.exec(a))
    }
    var g = d.search();
    g.hash && (b.hash = g.hash), b.errors = void 0;
    var h = function() {
        return b.signupLoading = !0, b.password !== b.passwordRepeat ? (b.errors = "Passwords are not equal.", void(b.signupLoading = !1)) : f(b.password) ? b.termsAndConditions ? void c.createFromInvitation({
            hash: b.hash,
            password: b.password,
            termsAndConditions: b.termsAndConditions
        }, function() {
            b.signupLoading = !1, e.go("login")
        }, function(a) {
            a.data.error && "MAIL_HAS_NOT_INVITED" === a.data.error.error ? b.errors = "The email has not been invited." : b.errors = "Please, check the fields.", b.signupLoading = !1
        }) : (b.errors = "You have to accept the Legal Disclaimer to proceed.", void(b.signupLoading = !1)) : (b.errors = "Your password is not valid. It should have between 8 and 16 characters (Alphanumerics and !@#%&/(){}[]=?+*^~-.:,;_).", void(b.signupLoading = !1))
    };
    b.signup = h
}]), angular.module("qubitsApp").controller("statsController", ["$rootScope", "$scope", "Device", "Topology", "DeviceStats", "Status", "$location", "$timeout", "$interval", "playgroundFactory", function(a, b, c, d, e, f, g, h, i, j) {
    function k() {
        f.getQueueStatus({
            device: "chip_real"
        }, {}, function(b) {
            b ? a.statusR = b.state : a.statusR = void 0
        })
    }

    function l() {
        c.findOne({
            filter: {
                where: {
                    serialNumber: "Real5Qv2",
                    type: "Real",
                    status: "on"
                }
            }
        }, function(a) {
            a ? e.lastStats({
                uuidDevice: a.serialNumber.toString()
            }, {}, function(a) {
                if (a) {
                    if (b.statsDevice = a, b.statTitle = "Qubit 0 properties", a.fridge_temperature && (b.fridgeTemperatureStats = a.fridge_temperature[0].value), a.Q1 && a.Q1[0]) {
                        b.statsQubit = a.Q1;
                        for (var c = 0; c < a.Q1.length; c++) a.Q1[c].date && (b.dateStats = a.Q1[c].date.slice(0, 16).replace(/T/g, " "))
                    }
                    var d = {},
                        e = {};
                    for (var f in a)
                        if (a.hasOwnProperty(f))
                            if (f.indexOf("Q") != -1 && 0 == f.indexOf("Q")) {
                                var g = f.charAt(0) + (parseInt(f.charAt(1)) - 1);
                                d[g] = a[f]
                            } else if (f.indexOf("CR") != -1 && 0 == f.indexOf("CR")) {
                        var i = f.charAt(0) + f.charAt(1) + (parseInt(f.charAt(2)) - 1) + f.charAt(3) + (parseInt(f.charAt(4)) - 1);
                        e[i] = a[f]
                    }
                    var j = {};
                    Object.keys(d).sort().forEach(function(a) {
                        j[a] = d[a]
                    }), b.qubitStats = j;
                    var k = {};
                    Object.keys(e).sort().forEach(function(a) {
                        k[a] = e[a]
                    }), b.crStats = k, h(function() {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
                    })
                } else b.statsDevice = [], b.statsQubit = {}
            }, function(a) {
                b.statsDevice = []
            }) : b.statsDevice || (b.statsDevice = [])
        })
    }
    a.topology || j.getTopology().then(function(b) {
        if (!a.topology) {
            var c = angular.copy(b);
            c.autoSelected = !0, a.topology = c
        }
    }), a.statusR = !0, k();
    var m = i(function() {
        a.realDevice && k()
    }, 5e3);
    b.$on("$destroy", function() {
        m && i.cancel(m)
    }), b.qubitClicked = function(a) {
        b.$apply(function() {
            var c;
            if ("q" === a.charAt(0)) b.statTitle = "Qubit " + a.charAt(1) + " properties", c = a.charAt(0).toUpperCase() + (parseInt(a.charAt(1)) + 1);
            else {
                c = a;
                var d = a.substr(2).split("_"),
                    e = parseInt(d[0]) - 1,
                    f = parseInt(d[1]) - 1;
                b.statTitle = "CR " + e + "-" + f
            }
            b.statsDevice && b.statsDevice[c] ? b.statsQubit = b.statsDevice[c] : b.statsQubit = {}, h(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub])
            })
        })
    }, l(), a.$watch("topology", function(c, d) {
        b.statsTopology = c, c && c.diagram ? (b.collapseStats = !1, a.realDevice = !0) : (b.collapseStats = !0, a.realDevice = !1)
    })
}]), angular.module("qubitsApp").controller("subscriptionsCommunityPopUpController", ["$rootScope", "$scope", "User", "userService", "CommunityQuestion", "CommunityCategory", "$stateParams", "$location", "$state", "$sce", "$uibModal", "$uibModalInstance", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    b.tags = {}, b.categories = {}, b.isUserWithPrivilegesToCommunitySubscriptions = !1, d.isUserWithPrivilegesToCommunitySubscriptions().then(function(a) {
        a ? b.isUserWithPrivilegesToCommunitySubscriptions = !0 : b.isUserWithPrivilegesToCommunitySubscriptions = !1
    }), e.getTags(function(a) {
        b.tags.allTags = a
    }), f.find({}, function(a) {
        b.categories.allCategories = a
    }), d.getCurrent().then(function(a) {
        b.userLogged = a;
        var c = a.subscriptions;
        if (c || (c = b.subscriptions), c && c.community) {
            if (b.selectionMention = c.community.mentions || 1, b.selectionUpdates = String(c.updates) || 1, 2 == c.community.type) {
                var d = c.community.items;
                b.categories.selected = d
            } else if (3 == c.community.type) {
                var e = c.community.items;
                b.tags.selected = e
            }
            b.selectionSubs = c.community.type || 0
        } else b.selectionSubs = 0, b.selectionMention = 1, b.selectionUpdates = 1
    }), b.save = function() {
        if (b.userLogged) {
            var d = b.userLogged.subscriptions;
            if (d || (d = {}), d.community || (d.community = {}), b.isUserWithPrivilegesToCommunitySubscriptions) {
                var e = b.selectionSubs,
                    f = [];
                if (2 == e) {
                    if (f = b.categories.selected, !f || 0 === f.length) return void b.$emit("show-notification", "You must select any CATEGORY", "error")
                } else if (3 == e && (f = b.tags.selected, !f || 0 === f.length)) return void b.$emit("show-notification", "You must select any TAG", "error");
                if (d.community.type = e, f && f.length > 0) {
                    for (var g in f) delete f[g]._uiSelectChoiceDisabled;
                    d.community.items = f
                }
            }
            var h = b.selectionMention,
                i = b.selectionUpdates;
            return d.community.mentions = h, d.updates = parseInt(i), c.updateSubscriptions({
                id: b.userLogged.id
            }, {
                subscriptions: d
            }, function(c) {
                b.$emit("show-notification", "Subscriptions Updated", "success"), a.subscriptions = c.subscriptions, l && l.close()
            }, function(a) {
                b.$emit("show-notification", "Subscription Error Update", "error")
            })
        }
        return !1
    }
}]), angular.module("qubitsApp").controller("topologiesListController", ["$scope", "Topology", "$location", function(a, b, c) {
    a.topologies = b.find()
}]), angular.module("qubitsApp").controller("tutorialController", ["$rootScope", "$scope", "$location", "$timeout", "$anchorScroll", "$q", "User", "TutorialPage", "playgroundFactory", "$state", "$stateParams", function(a, b, c, d, e, f, g, h, i, j, k) {
    function l(c) {
        !b.tutorialCompleted && g.isAuthenticated() && g.setTutorialPageCompleted({
            id: g.getCurrentId(),
            idTutorialPage: c
        }, {}, function(c) {
            c.hasBeenCompletedNow && (b.$emit("show-notification", "Congratulations, you have completed the tutorial!", "info"), b.tutorialCompleted = !0, a.loggedInUser && (a.loggedInUser.additionalData ? a.loggedInUser.additionalData.tutorialCompleted = !0 : a.loggedInUser.additionalData = {
                tutorialCompleted: !0
            }))
        })
    }
    e.yOffset = 60, b.isSearch = k.lastItemId, b.tutorialCompleted = !1, b.loadingTutorial = !0;
    var m = k.sectionId || i.getLastTutorialSectionId();
    k.sectionId && (k.pageIndex ? i.setLastTutorialPage(k.pageIndex) : i.setLastTutorialPage(0)), k.goMain && (m = void 0), i.getTutorialSection(m).then(function(a) {
        b.loadingTutorial = !1, b.section = a, d(function() {
            b.goPage(i.getLastTutorialPage(), a.main)
        }), b.pages = a.pages, k.goMain = !1, k.sectionId = a.id, a.main ? a.nextSectionId = void 0 : a.subsections && a.subsections.length > 0 ? b.section.nextSectionId = a.subsections[0].id : i.getTutorialSection(a.tutorialPageSectionId).then(function(a) {
            if (a) {
                for (var c = !1, d = a.id, e = void 0, f = 0; f < a.subsections.length; f++) {
                    var g = a.subsections[f];
                    c && (b.section.nextSectionId = g.id), c = g.id == b.section.id, c && e && (d = e.id), e = g
                }
                b.section.previousSectionId = d
            }
        }), i.setLastTutorialSectionId(a.id), g.isAuthenticated() && g.getTutorialPagesCompleted({
            id: g.getCurrentId()
        }, function(a) {
            var c = {};
            for (a && (c = a.tutorialPagesCompleted || c), index = 0; index < b.pages.length; ++index) c[b.pages[index].id.toString()] && (b.pages[index].viewed = !0);
            b.tutorialCompleted = a.tutorialCompleted
        }, function(a) {})
    }, function(a) {}), b.redirectSearch = function(a) {
        j.go("playground.section.tutorial.search", {
            searchQ: a
        })
    }, b.nextPage = function() {
        b.currentPage < b.pages.length - 1 && (b.pages[b.currentPage].viewed = !0, b.currentPage += 1, l(b.pages[b.currentPage].id), i.setLastTutorialPage(b.currentPage), e("tutorialPageContainer"))
    }, b.previousPage = function() {
        b.currentPage > 0 && (b.pages[b.currentPage].viewed = !0, b.currentPage -= 1, l(b.pages[b.currentPage].id), i.setLastTutorialPage(b.currentPage), e("tutorialPageContainer"))
    }, b.goPage = function(a, c) {
        (a < 0 || !b.pages || a > b.pages.length - 1) && (a = 0), b.pages && b.pages[a] && (l(b.pages[a].id), b.pages[a].viewed = !0), b.currentPage = a, k.pageIndex = a, j.go(".", k, {
            location: "replace",
            notify: !1,
            reload: !1
        }), i.setLastTutorialPage(b.currentPage), c || e("tutorialPageContainer")
    }, b.goBack = function() {
        window.history.back()
    }
}]), angular.module("qubitsApp").controller("tutorialLanding", ["$rootScope", "$scope", "$location", "$timeout", "$anchorScroll", "$q", "User", "TutorialPage", "playgroundFactory", "$state", "$stateParams", function(a, b, c, d, e, f, g, h, i, j, k) {
    b.landingSections = void 0, i.getLandingSections().then(function(a) {
        b.landingSections = a
    }, function(a) {
        b.landingSections = void 0
    }), b.redirectSearch = function(a) {
        j.go("playground.section.tutorial.search", {
            searchQ: a
        })
    }, b.goBack = function() {
        window.history.back()
    }
}]), angular.module("qubitsApp").controller("tutorialQasmController", ["$rootScope", "$scope", "$uibModal", "playgroundFactory", function(a, b, c, d) {
    d.getGatesMatrixFromJsonQasm(b.code.jsonQASM).then(function(a) {
        b.executionCode = a
    }), b.showResultsModal = function() {
        a.execution = b.code.execution, a.execution.code = {
            codeId: b.code.id,
            idCode: b.code.idCode,
            name: b.code.name,
            qasm: b.code.qasm,
            jsonQASM: b.code.jsonQASM,
            isSharedCode: !0
        };
        c.open({
            animation: b.animationsEnabled,
            templateUrl: "templates/playground_results_modal.html",
            controller: "resultsController",
            size: "extralarge"
        })
    }
}]), angular.module("qubitsApp").controller("tutorialSearchController", ["$rootScope", "$scope", "$location", "$timeout", "$anchorScroll", "$q", "User", "TutorialPage", "playgroundFactory", "loopbackClientCache", "$state", "$stateParams", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    function m(a, b) {
        for (var c = a.split(" "), d = 0; d < c.length; d++) {
            var e = new RegExp(c[d], "ig"),
                f = "<b>" + c[d] + "</b>";
            b = b.replace(e, f)
        }
        return b
    }

    function n(a, b) {
        var c = 300;
        if (a.length > c) {
            for (var d = b.length, e = b.split(" "), f = 0, g = 0; g < e.length; g++)
                if (a.toLowerCase().indexOf(e[g].toLowerCase()) >= 0) {
                    f = a.toLowerCase().indexOf(e[g].toLowerCase()), d = e[g].length;
                    break
                }
            return f >= 0 ? f < c / 2 ? a.length > c ? a.substring(0, c) + "..." : a.substring(0, c) : f + c > a.length ? "..." + a.substring(f - c / 2 - (c / 2 - (a.length - f)), a.length) : "..." + a.substring(f - c / 2, f + c / 2 + d) + "..." : a.length > c ? a.substring(0, c) + "..." : a.substring(0, c)
        }
        return a
    }

    function o(b, c) {
        i.getTutorialSection(b).then(function(d) {
            if (d.pages && c) {
                for (var e = 0; e < d.pages.length; e++)
                    if (d.pages[e].id === c) {
                        a.urlPages[c] = {}, a.urlPages[c].section = b, a.urlPages[c].page = e;
                        break
                    }
            } else a.urlPages[b] = {}, a.urlPages[b].section = b, a.urlPages[b].page = 0
        })
    }
    d(function() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    }), b.searchingPagesTutorial = !1, a.searchTutorial && (b.searchTutorial = a.searchTutorial), b.clearSearch = function() {
        b.searchTutorial = "", a.urlPages = {}, a.pagesFound = []
    }, b.findInTutorial = function() {
        var c = b.searchTutorial;
        a.searchTutorial = c, b.searchingPagesTutorial = !0, a.pagesFound = [], j.get(h, "search", {
            text: c
        }, {}, function(c) {
            a.urlPages = {};
            for (var e = 0; e < c.results.length; e++) {
                var f = c.results[e],
                    g = void 0,
                    h = void 0;
                "page" === f.type ? (g = f.id, h = f.tutorialPageSectionId) : h = f.id, o(h, g)
            }
            a.pagesFound = c.results, d(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub])
            }), b.searchingPagesTutorial = !1
        }, function(c) {
            b.searchingPagesTutorial = !1, a.pagesFound = [], a.urlPages = {}
        })
    }, b.getTextFromPage = function(b) {
        var c = "";
        if (b) {
            var d = b.replace(/<(?:.|\n)*?>/gm, "");
            description = n(d, a.searchTutorial), c = m(a.searchTutorial, description)
        }
        return c
    }, l && l.searchQ && (b.searchTutorial = l.searchQ, b.findInTutorial())
}]), angular.module("qubitsApp").controller("userController", ["$rootScope", "$scope", "$state", "$stateParams", "User", "communityService", "profileService", function(a, b, c, d, e, f, g) {
    var h = d.name;
    b.showLimit = 10, b.showLimitAnswers = b.showLimit, b.showLimitQuestions = b.showLimit, b.loadingUser = !0, b.order = "-creationDate", b.questionsCount = 0, b.answersCount = 0, g.getUserProfile(h).then(function(a) {
        b.user = a, b.loadingUser = !1
    }, function(a) {
        b.loadingUser = !1, window.location.href = "/errors/404"
    }), b.orderFunction = function(a) {
        return a.reputation ? -a.reputation.total : 0
    }, b.hasQuestion = function(a) {
        return a.hasOwnProperty("question") && !angular.equals({}, a.question)
    }, b.doTheBack = function() {
        window.history.back()
    }, b.showAllAnswers = function() {
        b.showLimitAnswers = 1e3
    }, b.showAllQuestions = function() {
        b.showLimitQuestions = 1e3
    }, f.categories().then(function(a) {
        for (var c = {}, d = 0; d < a.length; ++d) {
            var e = a[d];
            c[e.id] = e
        }
        b.categoriesMap = c
    })
}]), angular.module("qubitsApp").controller("userNamePublicPopupController", ["$rootScope", "$scope", "User", "userService", "$uibModal", function(a, b, c, d, e) {
    b.closeModal = function(a) {
        b.modalInstanceUsername && b.modalInstanceUsername.close();
        var c = {};
        c.changed = a, b.$emit("changeUserNamePublic", c)
    }, b.updateUsernamePublic = function(a) {
        return /^\w+$/.test(a.usernamePublic) ? a.usernamePublic.length < 5 ? void b.$emit("show-notification", "Username is too short", "error") : a.usernamePublic.length > 21 ? void b.$emit("show-notification", "Username is too long", "error") : void c.updateUsernamePublic({
            id: a.id,
            usernamePublic: a.usernamePublic
        }, function(a) {
            d.getCurrent(!0).then(function(a) {
                b.closeModal(!0), b.$emit("show-notification", "The username has been set.", "success")
            }, function(a) {
                b.closeModal(!0)
            })
        }, function(a) {
            console.log(a), 422 === a.status ? b.$emit("show-notification", "This username already exists. Set a different one.", "error") : "PUBLIC_USERNAME_SHORT_LENGHT" === a.data.error.code || "PUBLIC_USERNAME_NOT_VALID" === a.data.error.code ? b.$emit("show-notification", "Username is too short", "error") : b.$emit("show-notification", "An error ocurred.", "error")
        }) : void b.$emit("show-notification", "Invalid username. Only allow [a-zA-Z0-9_] characters", "error")
    }
}]), angular.module("qubitsApp").factory("communityService", ["$rootScope", "CommunityCategory", "CommunityReaction", "$q", function(a, b, c, d) {
    function e() {
        var a = d.defer();
        return h ? a.resolve(angular.copy(h)) : (j || (j = b.getAll({}, {}).$promise), j.then(function(b) {
            h = b, j = void 0, a.resolve(angular.copy(h))
        }, function(b) {
            h = void 0, j = void 0, a.reject(b)
        })), a.promise
    }

    function f() {
        var a = d.defer();
        return i ? a.resolve(angular.copy(i)) : (k || (k = b.getFiltered({}, {}).$promise), k.then(function(b) {
            i = b, k = void 0, a.resolve(angular.copy(i))
        }, function(b) {
            i = void 0, k = void 0, a.reject(b)
        })), a.promise
    }

    function g() {
        if (!l) {
            var a = d.defer();
            c.all({}, {}, function(b) {
                a.resolve(b)
            }, function(b) {
                a.reject(b), l = void 0
            }), l = a.promise
        }
        return l
    }
    var h, i, j, k, l;
    return {
        categories: e,
        reactions: g,
        categoriesFiltered: f
    }
}]), angular.module("qubitsApp").factory("gatesSVGFactory", ["$q", function(a) {
    function b(e) {
        return void 0 === d[e] && (d[e] = a(function(a, d) {
            if (c[e]) a(c[e]);
            else try {
                Snap.ajax("/img/gates/" + e + ".svg", function(f) {
                    if (f.responseURL && f.responseURL.indexOf("error") !== -1) b("gates").then(function(b) {
                        c[e] = b, a(b)
                    }, function(a) {
                        d("error")
                    });
                    else {
                        var g = Snap.parse(f.responseText);
                        c[e] = g, a(g)
                    }
                })
            } catch (f) {
                d("error")
            }
        })), d[e]
    }
    var c = {},
        d = {};
    return {
        getGateSVG: function(c) {
            return a(function(a, d) {
                b(c.type).then(function(b) {
                    var d = b.select("#" + c.qasm.toLowerCase()),
                        e = void 0;
                    d && (e = d.clone());
                    var f;
                    if (c.displayProperties && c.displayProperties.shape) {
                        var g = b.select("#" + c.displayProperties.shape);
                        if (g) {
                            var h = "#" + c.displayProperties.shape + "Colored";
                            c.displayProperties.color && g.select(h) && g.select(h).attr({
                                fill: c.displayProperties.color
                            }), f = g.clone()
                        }
                    } else {
                        var i = "#box",
                            j = b.select(i);
                        if (j) {
                            var h = i + "Colored";
                            j.select(h) && j.select(h).attr({
                                fill: "#d28f0d"
                            }), f = j.clone()
                        }
                    }
                    a({
                        gateLabel: e,
                        background: f
                    })
                }, function(a) {
                    d(a)
                })
            })
        },
        getDefaultGateLabel: function(a, b, c, d) {
            var e = d && d.labelPosition ? d.labelPosition : "center",
                f = d && d.fontSize ? d.fontSize : 20.5,
                g = "#",
                h = d && d.position && d.position.left ? d.position.left : 19,
                i = d && d.position && d.position.top ? d.position.top : 27;
            c && ("center" == e ? (h = Math.round(c.getSize().w / 2 * 1e3) / 1e3, i = Math.round(c.getSize().h / 2 * 1e3) / 1e3) : "left" == e ? (h = 5, i = Math.round(c.getSize().h / 2 * 1e3) / 1e3) : "middle" == e && (h = Math.round(c.getSize().w / 2 * 1e3) / 1e3)), b.name && b.name.length > 0 && (g = b.name);
            var j = a.text(0, 0, g).attr({
                    fill: "#fff",
                    "font-size": f + "px",
                    "font-family": "'Helvetica Neue','HelveticaNeue','Helvetica',Arial,sans-serif"
                }),
                k = j.getSize().w,
                l = new Snap.Matrix,
                m = 1;
            return k / 2 > h && (m = 2 * h / (k + 10)), h -= j.getSize().w * m / 2, h = Math.round(1e3 * h) / 1e3, i = i + j.getSize().h * m / 2 - 5.5, i = Math.round(1e3 * i) / 1e3, l.translate(h, i), l.scale(m.toFixed(3)), j.transform(l), j
        }
    }
}]), angular.module("qubitsApp").factory("jsonQasmParser", ["$rootScope", "$q", "Topology", "Gate", "User", "playgroundFactory", "LoopBackAuth", function(a, b, c, d, e, f, g) {
    function h(a, b) {
        return void 0 !== i(a, b)
    }

    function i(a, b) {
        return f.getGateByQASM(a, b)
    }

    function j(a, b, c, d) {
        return b = parseInt(b), c = parseInt(c), f.canLinkLines(a, b, c) && b >= 0 && b < d && c >= 0 && c < d
    }

    function k(a, b) {
        return parseInt(a) >= 0 && parseInt(a) < b
    }

    function l(a, b) {
        function c(a, b, f, g) {
            if ("cx" === g) {
                if (!j(d, f.to, a, e)) throw "CNOT not allowed";
                return g + " " + s[f.to] + "," + s[a] + ";"
            }
            if ("if" !== g) {
                if ("measure" === g) {
                    if (n && n.length > 0) throw "Measure not allowed";
                    return m.push(parseInt(a)), f.measureCreg || (f.measureCreg = {
                        line: e,
                        bit: a
                    }), g + " " + s[a] + " -> " + s[f.measureCreg.line] + "[" + f.measureCreg.bit + "];"
                }
                if (!k(a, e)) throw "The qubit is not in the topology";
                if ("bloch" === g) {
                    if (m && m.length > 0) throw "Bloch not allowed";
                    n.push(parseInt(a))
                }
                var h = "";
                if (f.params) {
                    var i = f.params.map(function(a, b) {
                        return a.value
                    });
                    h = "(" + i.join(",") + ")"
                }
                var l = s[a];
                if (f.affectedLines) {
                    l = "";
                    var o = f.affectedLines.map(function(a, b) {
                        if (a) return s[b]
                    });
                    o = o.filter(function(a) {
                        return void 0 != a && "" != a
                    }), l = o.join(",")
                }
                if (f.lineParams) {
                    var p = f.lineParams.map(function(a, b) {
                        return s[a.value]
                    });
                    l = p.join(",")
                }
                return g + h + " " + l + ";"
            }
            if (f["if"].gate) {
                var q = c(a, b, f["if"].gate, f["if"].gate.qasm);
                return g + "(" + s[f["if"].line] + "==" + f["if"].value + ") " + q
            }
        }
        try {
            var d = a.topology,
                e = f.getNumOfQubits(d),
                g = a.numberColumns,
                i = f.getNumOfLines(d);
            if (!i) return "";
            for (var l = a.playground, m = [], n = [], o = [], p = 'include "qelib1.inc";\n', q = [], r = 0; r < i; r++) q[r] = [];
            var s = [];
            for (var t in l) s[t] = l[t].name + "[" + l[t].line + "]";
            if (d.qregs) {
                for (var u = "", r = 0; r < d.qregs.length; r++) {
                    var v = d.qregs[r];
                    u += "qreg " + v.name + "[" + v.size + "];\n"
                }
                p += u
            }
            if (d.cregs) {
                for (var w = "", r = 0; r < d.cregs.length; r++) {
                    var x = d.cregs[r];
                    w += "creg " + x.name + "[" + x.size + "];\n", s[e + r] = x.name
                }
                p += w
            }
            for (var t in l)
                for (var y in l[t].gates)
                    if (l[t].gates[y].name) {
                        var z = l[t].gates[y],
                            A = z.qasm || z.name;
                        if (!h(A)) throw 'Unknown Gate found "' + A + '"';
                        var B = c(t, y, z, A);
                        q[t][z.position] = B, o.indexOf(A) !== -1 || z.isOperation || o.push(A)
                    }
            if (a.gateDefinitions)
                for (var y in a.gateDefinitions) {
                    var C = a.gateDefinitions[y];
                    C.qasmDefinition && !C.predefined && (p += C.qasmDefinition + "\n")
                }
            for (var D = "", E = 0; E < g; E++)
                for (var r = 0; r < i; r++) void 0 !== q[r][E] && (D += q[r][E] + "\n");
            return b && (D = p + "\n" + D), D
        } catch (F) {
            return void console.error("Error parsing QASM: ", F)
        }
    }

    function m(a, b, c, d) {
        var e, h = "myCode";
        d ? (h = d.replace(/[^-A-Za-z0-9.]+/g, "_"), e = c) : (e = l(f.getJsonQasm(b, !0), !0), c && c.name && (h = c.name.replace(/[^-A-Za-z0-9.]+/g, "_")));
        var i = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function(a) {
                var b, c, d, e, f, g, h, j = "",
                    k = 0;
                for (a = i._utf8_encode(a); k < a.length;) b = a.charCodeAt(k++), c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = b >> 2, f = (3 & b) << 4 | c >> 4, g = (15 & c) << 2 | d >> 6, h = 63 & d, isNaN(c) ? g = h = 64 : isNaN(d) && (h = 64), j = j + this._keyStr.charAt(e) + this._keyStr.charAt(f) + this._keyStr.charAt(g) + this._keyStr.charAt(h);
                return j
            },
            decode: function(a) {
                var b, c, d, e, f, g, h, j = "",
                    k = 0;
                for (a = a.replace(/[^A-Za-z0-9+\/=]/g, ""); k < a.length;) e = this._keyStr.indexOf(a.charAt(k++)), f = this._keyStr.indexOf(a.charAt(k++)), g = this._keyStr.indexOf(a.charAt(k++)), h = this._keyStr.indexOf(a.charAt(k++)), b = e << 2 | f >> 4, c = (15 & f) << 4 | g >> 2, d = (3 & g) << 6 | h, j += String.fromCharCode(b), 64 != g && (j += String.fromCharCode(c)), 64 != h && (j += String.fromCharCode(d));
                return j = i._utf8_decode(j)
            },
            _utf8_encode: function(a) {
                a = a.replace(/rn/g, "n");
                for (var b = "", c = 0; c < a.length; c++) {
                    var d = a.charCodeAt(c);
                    d < 128 ? b += String.fromCharCode(d) : d > 127 && d < 2048 ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128))
                }
                return b
            },
            _utf8_decode: function(a) {
                for (var b = "", c = 0, d = c1 = c2 = 0; c < a.length;) d = a.charCodeAt(c), d < 128 ? (b += String.fromCharCode(d), c++) : d > 191 && d < 224 ? (c2 = a.charCodeAt(c + 1), b += String.fromCharCode((31 & d) << 6 | 63 & c2), c += 2) : (c2 = a.charCodeAt(c + 1), c3 = a.charCodeAt(c + 2), b += String.fromCharCode((15 & d) << 12 | (63 & c2) << 6 | 63 & c3), c += 3);
                return b
            }
        };
        e = e.replace(/\->/gi, "--");
        var j = i.encode(e),
            k = "/api",
            m = k + "/Codes/qasm/";
        m = m + "?name=" + h, a && (m = m + "&codeId=" + a), m = m + "&qasmBase64=" + j, m = m + "&access_token=" + g.accessTokenId, window.open(m, "_blank")
    }

    function n(a, b, c) {
        var d = "myCode",
            e = b;
        c && (d = c.replace(/[^-A-Za-z0-9.]+/g, "_"));
        var f = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function(a) {
                var b, c, d, e, g, h, i, j = "",
                    k = 0;
                for (a = f._utf8_encode(a); k < a.length;) b = a.charCodeAt(k++), c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = b >> 2, g = (3 & b) << 4 | c >> 4, h = (15 & c) << 2 | d >> 6, i = 63 & d, isNaN(c) ? h = i = 64 : isNaN(d) && (i = 64), j = j + this._keyStr.charAt(e) + this._keyStr.charAt(g) + this._keyStr.charAt(h) + this._keyStr.charAt(i);
                return j
            },
            decode: function(a) {
                var b, c, d, e, g, h, i, j = "",
                    k = 0;
                for (a = a.replace(/[^A-Za-z0-9+\/=]/g, ""); k < a.length;) e = this._keyStr.indexOf(a.charAt(k++)), g = this._keyStr.indexOf(a.charAt(k++)), h = this._keyStr.indexOf(a.charAt(k++)), i = this._keyStr.indexOf(a.charAt(k++)), b = e << 2 | g >> 4, c = (15 & g) << 4 | h >> 2, d = (3 & h) << 6 | i, j += String.fromCharCode(b), 64 != h && (j += String.fromCharCode(c)), 64 != i && (j += String.fromCharCode(d));
                return j = f._utf8_decode(j)
            },
            _utf8_encode: function(a) {
                a = a.replace(/rn/g, "n");
                for (var b = "", c = 0; c < a.length; c++) {
                    var d = a.charCodeAt(c);
                    d < 128 ? b += String.fromCharCode(d) : d > 127 && d < 2048 ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128))
                }
                return b
            },
            _utf8_decode: function(a) {
                for (var b = "", c = 0, d = c1 = c2 = 0; c < a.length;) d = a.charCodeAt(c), d < 128 ? (b += String.fromCharCode(d), c++) : d > 191 && d < 224 ? (c2 = a.charCodeAt(c + 1), b += String.fromCharCode((31 & d) << 6 | 63 & c2), c += 2) : (c2 = a.charCodeAt(c + 1), c3 = a.charCodeAt(c + 2), b += String.fromCharCode((15 & d) << 12 | (63 & c2) << 6 | 63 & c3), c += 3);
                return b
            }
        };
        e = e.replace(/\->/gi, "--");
        var h = f.encode(e),
            i = "/api",
            j = i + "/Codes/qasm/";
        j = j + "?name=" + d, a && (j = j + "&codeId=" + a), j = j + "&qasmBase64=" + h, j = j + "&access_token=" + g.accessTokenId, window.open(j, "_blank")
    }
    return {
        parse: function(a, b) {
            return l(a, b)
        },
        downloadQASM: function(a, b, c, d) {
            return m(a, b, c, d)
        },
        downloadQASMDirectly: function(a, b, c) {
            return n(a, b, c)
        }
    }
}]), angular.module("qubitsApp").provider("loginModal", function() {
    var a = {
        options: {
            closable: !0,
            animation: !0,
            backdrop: !0
        },
        $get: ["$rootScope", "$q", "$uibModal", function(b, c, d) {
            var e, f = {};
            return f.show = function(b) {
                var f = c.defer();
                return b = angular.extend({}, a.options, b), e && e.dismiss(), e = d.open({
                    animation: b.animation,
                    templateUrl: "templates/loginPopup.html",
                    controller: "loginModalController",
                    backdrop: b.backdrop
                }), e.result.then(function(a) {
                    f.resolve(a)
                }, function() {
                    f.reject()
                }), f.promise
            }, f
        }]
    };
    return a
}).controller("loginModalController", ["$rootScope", "$scope", "User", "userService", "$uibModalInstance", function(a, b, c, d, e) {
    var f = function() {
        b.errors = void 0, b.loginLoading = !0, d.login({
            email: b.username ? b.username.toLowerCase() : b.username,
            password: b.password
        }).then(function(c) {
            a.loggedInUser = c, b.loginLoading = !1, a.loggedin = !0, e.close(c)
        }, function(a) {
            console.log(a);
            var c = "";
            a && a.data && a.data.error && a.data.error.code && (c = a.data.error.code), "USER_BLOCKED" === c ? b.errors = "Sorry, You are Blocked in the system :(." : "USER_BLOCKED_LOGIN" === c ? b.errors = "Sorry, you have exceeded the maximum number of consecutive login attempts. Please try again in a few minutes." : "LOGIN_FAILED_EMAIL_NOT_VERIFIED" === c ? b.errors = "Your email has not been verified. Please check your inbox." : b.errors = "Please, check your credentials.", b.loginLoading = !1
        })
    };
    b.login = f
}]), angular.module("qubitsApp").factory("playgroundFactory", ["$q", "$rootScope", "Topology", "Gate", "User", "TutorialPage", "TutorialPageSection", "visualQasmSettings", function(a, b, c, d, e, f, g, h) {
    function j(a, b) {
        d.find(a, function(a) {
            L = {}, a.forEach(function(a) {
                var b = L[a.type] || [];
                b.push(a), L[a.type] = b
            }), b(null, L)
        }, function(a) {
            K = void 0, L = void 0, b("No Gates available.")
        })
    }

    function k() {
        return K || (K = a(function(a, b) {
            if (L) a(L);
            else {
                var c = {
                    filter: {
                        order: "order ASC",
                        where: {
                            type: {
                                nin: ["subroutine"]
                            }
                        }
                    }
                };
                j(c, function(d, e) {
                    d ? b(d) : e && 0 !== Object.keys(e).length ? a(e) : (c = {
                        filter: {
                            order: "order ASC",
                            where: {
                                type: {
                                    neq: "subroutine"
                                }
                            }
                        }
                    }, j(c, function(c, d) {
                        c ? b(c) : a(d)
                    }))
                })
            }
        })), K
    }

    function l() {
        return M || (M = a(function(a, b) {
            aa && aa.length ? a(aa) : d.find({
                filter: {
                    order: "order ASC",
                    where: {
                        type: "subroutine"
                    }
                }
            }, function(b) {
                aa = b, a(aa)
            }, function(a) {
                subroutinePromise = void 0, aa = void 0, b("No Subroutines available.")
            })
        })), M
    }

    function m() {
        return J || (J = a(function(a, b) {
            I ? a(I) : c.find({}, function(b) {
                I = b, a(b)
            }, function(a) {
                J = void 0, I = void 0, b("No topologies available")
            })
        })), J
    }

    function n() {
        return W || (W = a(function(a, b) {
            V ? a(V) : d.find({
                filter: {
                    order: "order ASC"
                }
            }, function(b) {
                V = b, a(V)
            }, function(a) {
                W = void 0, V = void 0, b("No Gates available.")
            })
        })), W
    }

    function o() {
        return a(function(a, b) {
            k().then(function(b) {
                var c = {};
                for (var d in b)
                    if (b.hasOwnProperty(d)) {
                        var e = b[d];
                        c[d] = [];
                        for (var f = 0; f < e.length; f++) {
                            var g = e[f];
                            g && (!g.displayProperties || g.displayProperties && !g.displayProperties.isHidden) && c[d].push(g)
                        }
                    }
                a(c)
            }, function(a) {
                b(a)
            })
        })
    }

    function p(a, b) {
        if (b)
            for (var c = 0; c < a.length; c++)
                if (a[c].qasm == b) return a[c]
    }

    function q(a, b) {
        if (!b) return a;
        for (var c = angular.copy(a), d = 0; d < b.length; d++) p(c, b[d].qasm) || c.push(angular.extend({
            type: "subroutine",
            subtype: "multiline"
        }, b[d]));
        return c
    }

    function r(b) {
        var c = a.defer();
        return b && "string" == typeof b ? t(b).then(function(a) {
            c.resolve(a)
        }, c.reject) : c.resolve(b), c.promise
    }

    function s(b) {
        var c = a.defer();
        return r(b).then(function(a) {
            a ? (H = a, c.resolve(H)) : H ? c.resolve(H) : N && N.jsonQASM && N.jsonQASM.topology ? "string" == typeof N.jsonQASM.topology ? t(N.jsonQASM.topology).then(function(a) {
                H = a, c.resolve(a)
            }, c.reject) : c.resolve(N.jsonQASM.topology) : m().then(function(a) {
                var b = 0;
                if (a && a.length > 0) {
                    for (; b < a.length && a[b].isHidden;) b++;
                    b < a.length ? c.resolve(a[b]) : c.resolve(a[0])
                }
            }, c.reject)
        }, c.reject), c.promise
    }

    function t(b) {
        var d = a.defer();
        if (I) {
            for (var e = void 0, f = 0; f < I.length; f++)
                if (I[f].id == b) {
                    e = I[f];
                    break
                }
            e ? d.resolve(e) : c.findById({
                id: b
            }, function(a) {
                d.resolve(a)
            })
        } else c.findById({
            id: b
        }, function(a) {
            d.resolve(a)
        });
        return d.promise
    }

    function u() {
        return P || (P = a(function(a, b) {
            O ? a(O) : f.find({
                filter: {
                    order: "order ASC",
                    include: ["code"],
                    where: {
                        deleted: !1,
                        isVisible: !0
                    }
                }
            }, function(b) {
                O = b, a(b)
            }, function(a) {
                P = !1, b(a)
            })
        })), P
    }

    function v() {
        return R || (R = a(function(a, b) {
            Q ? a(Q) : g.find({
                filter: {
                    order: "order ASC",
                    where: {
                        deleted: !1,
                        principal: !0
                    }
                }
            }, function(b) {
                Q = b, a(b)
            }, function(a) {
                R = !1, b(a)
            })
        })), R
    }

    function w() {
        return T || (T = a(function(a, b) {
            S ? a(S) : g.findMainFromCache(function(b) {
                S = b, Z[b.id] = b, a(b)
            }, function(a) {
                T = !1, b(a)
            })
        })), T
    }

    function x(b) {
        if (b) {
            var c = a(function(a, c) {
                Z[b] ? a(Z[b]) : g.findFromCache({
                    id: b
                }, function(c) {
                    Z[b] = c, a(c)
                }, function(a) {
                    c(a)
                })
            });
            return c
        }
        return w()
    }

    function y(a) {
        if (a && a.qregs) {
            for (var b = 0, c = 0; c < a.qregs.length; c++) {
                var d = a.qregs[c];
                b += d.size
            }
            return b
        }
        return a ? a.qubits : 0
    }

    function z(a) {
        return a && a.cregs ? a.cregs.length : 1
    }

    function A(a) {
        if (a && a.cregs) {
            for (var b = 0, c = 0; c < a.cregs.length; c++) {
                var d = a.cregs[c];
                b += d.size
            }
            return b
        }
        return a ? a.qubits : 0
    }

    function B(a) {
        return y(a) + z(a)
    }

    function C(a) {
        var b;
        if (a.cr) b = a.cr;
        else if (a.topology && a.topology.adjacencyMatrix) {
            var c = y(a),
                d = a.topology.adjacencyMatrix;
            b = [];
            for (var e = 0; e < c; e++)
                for (var f = 0; f < c; f++) {
                    var g = f * c + e;
                    b[f] || (b[f] = []), b[f][e] = d[g]
                }
        }
        return b
    }

    function D(a, b) {
        var c = [],
            d = y(a);
        if (a.cr)
            for (var e = a.cr, f = 0; f < d; f++) e[i][b] && c.push(f);
        else if (a.topology && a.topology.adjacencyMatrix)
            for (var e = a.topology.adjacencyMatrix, f = 0; f < d; f++) {
                var g = f * a.qubits + b;
                e[g] && c.push(f)
            } else c = Array.apply(null, {
                length: d
            }).map(Number.call, Number);
        return c
    }

    function E(a, b, c) {
        if (a.cr) {
            var d = a.cr;
            return b < d.length && c < d.length && d[b][c]
        }
        if (a.topology && a.topology.adjacencyMatrix) {
            var d = a.topology.adjacencyMatrix,
                e = b * a.qubits + c;
            return d[e]
        }
        return c < y(a) && b < y(a)
    }

    function F(a) {
        var b = [],
            c = y(a);
        if (a.cr)
            for (var d = a.cr, e = 0; e < c; e++) {
                for (var f = !1, g = 0; g < c; g++)
                    if (d[g][e]) {
                        f = !0;
                        break
                    }
                f && b.push(e)
            } else if (a.topology && a.topology.adjacencyMatrix)
                for (var d = a.topology.adjacencyMatrix, e = 0; e < a.qubits; e++) {
                    for (var f = !1, g = 0; g < a.qubits; g++) {
                        var h = g * a.qubits + e;
                        if (d[h]) {
                            f = !0;
                            break
                        }
                    }
                    f && b.push(e)
                } else b = Array.apply(null, {
                    length: c
                }).map(Number.call, Number);
        return b
    }

    function G(a, b) {
        var c = {
            position: b,
            name: a.name,
            qasm: a.qasm
        };
        return a.subtype && "link" == a.subtype && a.linkedGates && a.linkedGates.length > 0 && (c.to = a.linkedGates[0].i), a.affectedLines && (c.affectedLines = a.affectedLines), a.measureCreg && (c.measureCreg = a.measureCreg), a["if"] && (c["if"] = a["if"]), a.params && (c.params = a.params), a.lineParams && (c.lineParams = a.lineParams), "operations" !== a.type && "barrier" !== a.type || (c.isOperation = !0), c
    }
    var H, I, J, K, L, M, N, O, P, Q, R, S, T, U = [],
        V = void 0,
        W = void 0,
        X = 0,
        Y = void 0,
        Z = {},
        $ = void 0,
        _ = [],
        aa = [],
        ba = !1,
        ca = 20,
        da = 1024;
    return l(), k(), m(), n(), w(), {
        existsGate: function(a) {
            return void 0 != U[a]
        },
        getGateFromMatrix: function(a) {
            return U[a]
        },
        getGateInColumnFromMatrix: function(a) {
            var b = U[a];
            if (b.isBusy) {
                var c = a % h.pointsPerLine;
                b = U[c]
            }
            return b
        },
        getFirstLineArrayPosition: function(a) {
            return a % h.pointsPerLine
        },
        addGateToMatrix: function(a, b) {
            void 0 === b ? delete U[a] : U[a] = b
        },
        clearGatesMatrix: function() {
            U = []
        },
        getGatesMatrix: function() {
            return U
        },
        setGatesMatrix: function(a) {
            U = a
        },
        getLinesLinkables: F,
        getLinesCanLink: D,
        canLinkLines: E,
        getNumOfLines: B,
        getNumOfQubits: y,
        getNumOfCRegs: z,
        getJsonQasmFromQasm: function(b, c) {
            var d, e, f = a.defer(),
                g = 0;
            return n().then(function(a) {
                for (var h = [], i = [], j = 0; j < a.length; j++)
                    if (c && !c.executionTypes || c && c.executionTypes && c.executionTypes.indexOf("real") === -1 || a[j].displayProperties && !a[j].displayProperties.unavailableInDevice) {
                        h.push(a[j].qasm);
                        var k = {
                            name: a[j].name,
                            qasm: a[j].qasm
                        };
                        a[j].gateDefinition && (k.definition = a[j].gateDefinition), a[j].params && (k.params = a[j].params), a[j].type && (k.type = a[j].type), i.push(k)
                    }
                var l = C(c),
                    m = {
                        gatesName: h,
                        gates: i
                    };
                l && (m.matrix = l), c && c.executionTypes && c.executionTypes.indexOf("real") !== -1 && (m.disableOperations = !0, m.disableSubroutine = !0, m.measureBlock = !0);
                try {
                    d = angular.copy(qasmAnalyzer.parse(b, m));
                    var n = y(d.topology),
                        o = A(d.topology);
                    if (n > ca) return void f.reject([0, "Number of qubits can't be greater than " + ca]);
                    if (o > da) return void f.reject([0, "Number of bits can't be greater than " + da]);
                    if (c && c.executionTypes && c.executionTypes.indexOf("real") !== -1) {
                        var p = y(c);
                        if (n > p) return void f.reject([0, "The quantum processor doesn't support the number of qubits."])
                    }
                    f.resolve(d)
                } catch (q) {
                    q.hash && q.hash.loc && (g = q.hash.loc.first_line), qasmAnalyzer.parse("clean", m), e = q.message, f.reject([g, e])
                }
            }, f.reject), f.promise
        },
        getGatesMatrixFromJsonQasm: function(b) {
            var c = angular.copy(b),
                d = [],
                e = a.defer();
            return c ? n().then(function(a) {
                r(c.topology).then(function(b) {
                    var f = y(b);
                    if (!f) return void e.reject();
                    if (c.gateDefinitions && (a = q(a, c.gateDefinitions)), c.playground) {
                        for (var g = h.pointsPerLine, i = 0; i < c.playground.length; i++)
                            if (i < f) {
                                var j = c.playground[i];
                                if (j.gates)
                                    for (var k in j.gates) {
                                        var l = angular.copy(j.gates[k]),
                                            m = l.position;
                                        if (m < g) {
                                            var n = l.qasm || l.name,
                                                o = p(a, n);
                                            void 0 !== l.to && (l.linkedGates = [{
                                                i: l.to,
                                                j: m
                                            }]), d[i * g + m] = angular.extend({}, o, l)
                                        }
                                    }
                            }
                        e.resolve(d)
                    }
                })
            }) : e.reject(), e.promise
        },
        getGateByQASM: function(a, b) {
            var c = b || _,
                d = [];
            aa && (d = d.concat(aa)), c && (d = d.concat(c));
            var e;
            if (V) {
                var f = q(V, d);
                e = p(f, a)
            }
            return e
        },
        getGateJsonQasm: G,
        getJsonQasm: function(a, b, c) {
            var d = 0,
                e = a;
            b || "string" == typeof e || (e = a.id ? "" + a.id : a);
            var f = {
                    playground: [],
                    numberColumns: h.pointsPerLine,
                    numberLines: y(a),
                    numberGates: 0,
                    hasMeasures: !1,
                    topology: e
                },
                g = 0;
            if (a.qregs || (a.qregs = [{
                    name: "q",
                    size: a.qubits
                }]), a.cregs || (a.cregs = [{
                    name: "c",
                    size: a.qregs[0].size
                }]), !c)
                for (var i = 0; i < a.qregs.length; i++)
                    for (var j = a.qregs[i], k = 0; k < j.size; k++) {
                        for (var l = {
                                line: k,
                                name: j.name,
                                gates: []
                            }, m = 0; m < f.numberColumns; m++) {
                            var n, o = g * f.numberColumns + m;
                            if (U && (n = U[o]), n && !n.endline) {
                                d++, f.hasMeasures = f.hasMeasures || "measure" == n.qasm || "measure" == n.name, f.hasBloch = f.hasBloch || "bloch" == n.qasm || "bloch" == n.name;
                                var p = G(n, m);
                                l.gates.push(p)
                            }
                        }
                        g++, f.playground.push(l)
                    }
            return _ && (f.gateDefinitions = angular.copy(_)), f.numberGates = d, f
        },
        getGates: function() {
            return k()
        },
        getVisibleGates: function() {
            return o()
        },
        getTopology: function() {
            return a(function(a, b) {
                if (H) a(H);
                else if (I) {
                    for (var d = 0; d < I.length && I[d].isHidden;) d++;
                    a(d < I.length ? I[d] : I[0])
                } else c.find({}, function(b) {
                    for (var c = 0; c < b.length && b[c].isHidden;) c++;
                    a(c < b.length ? b[c] : b[0])
                }, function(a) {
                    b(a)
                })
            })
        },
        getTopologyFromCode: function(a) {
            return r(a.jsonQASM.topology)
        },
        getTopologyUsed: s,
        setTopologyUsed: function(a) {
            H = a
        },
        getTopologies: m,
        getTutorialPages: u,
        getTutorialSection: x,
        getLastTutorialSectionId: function() {
            return Y
        },
        getLastTutorialPage: function() {
            return X
        },
        setLastTutorialPage: function(a) {
            X = a
        },
        setLastTutorialSectionId: function(a) {
            Y = a
        },
        getMouseEventPos: function(a, b) {
            var c = document.getElementById(b) || a.target || a.srcElement,
                d = c.currentStyle || window.getComputedStyle(c, null),
                e = parseInt(d.borderLeftWidth, 10),
                f = parseInt(d.borderTopWidth, 10),
                g = c.getBoundingClientRect(),
                h = a.clientX - e - g.left,
                i = a.clientY - f - g.top;
            if (void 0 === a.clientX) {
                var j = void 0 == a.layerX ? a.offsetX : a.layerX,
                    k = void 0 == a.layerY ? a.offsetY : a.layerY;
                h = a.originalEvent && a.originalEvent.layerX ? a.originalEvent.layerX : j, i = a.originalEvent && a.originalEvent.layerY ? a.originalEvent.layerY : k
            }
            return {
                x: h,
                y: i,
                scale: function(a) {
                    this.x = h * a, this.y = i * a
                }
            }
        },
        findTopologyById: t,
        setCode: function(a) {
            N = a, H = void 0, b.$broadcast("new-code")
        },
        getCode: function() {
            return N
        },
        getTutorialName: function() {
            return $
        },
        isFromTutorial: function() {
            return void 0 !== $
        },
        setTutorialName: function(a) {
            $ = a
        },
        setSubroutines: function(a) {
            if (_ = [], a)
                for (var b = 0; b < a.length; b++) _.push(angular.extend({
                    type: "subroutine",
                    subtype: "multiline"
                }, a[b]));
            return _
        },
        addSubroutine: function(a) {
            a.type = "subroutine", a.subtype = "multiline", _ || (_ = []), _.push(a)
        },
        getSubroutines: function() {
            return _
        },
        clearSubroutines: function() {
            _ = []
        },
        getPredefinedSubroutines: function() {
            return l()
        },
        getQubitsLimit: function() {
            return ca
        },
        getBitsLimit: function() {
            return da
        },
        setQasmEditorVisible: function(a) {
            ba = a
        },
        getQasmEditorVisible: function() {
            return ba
        },
        copyArrayGatesDistinct: function(a, b) {
            for (var c = 0; c < a.length; c++) {
                for (var d = a[c], e = 0; e < b.length; e++)
                    if (b[e].name === a[c].name) {
                        d = void 0;
                        break
                    }
                d && b.push(d)
            }
            return b
        },
        getLandingSections: v
    }
}]), angular.module("qubitsApp").factory("svgSymbols", ["$q", function(a) {
    function b() {
        return void 0 === d && (d = a(function(a, b) {
            if (c) a(c);
            else try {
                Snap.load(e, function(b) {
                    c = b, a(b)
                })
            } catch (d) {
                b("The symbols file didn't exist.")
            }
        })), d
    }
    var c, d, e = "/img/symbols.svg";
    return {
        getTextLabel: function(a, b, c, d) {
            return a.text(b, c, d.toLowerCase()).attr({
                fill: "#000",
                "font-size": "10px",
                "alignment-baseline": "middle",
                "font-family": "'Helvetica Neue','HelveticaNeue','Helvetica',Arial,sans-serif"
            })
        },
        getSymbol: function(c) {
            return a(function(a, d) {
                b().then(function(b) {
                    var d = b.select("#" + c),
                        e = d.clone(),
                        f = d.getSize();
                    e.size = {
                        h: f.h,
                        w: f.w + 10
                    }, a(e)
                }, function(a) {
                    d(a)
                })
            })
        },
        getDashedLine: function(a, b, c, d, e, f, g) {
            var h = Line(b, c, d, e, a);
            return h.attr({
                fill: "none",
                stroke: f || "#6e6d6d",
                strokeWidth: g || 4,
                strokeDasharray: "15,5"
            }), h
        },
        getColumnRectangle: function(a, b, c, d, e, f) {
            var g = a.rect(b, c, d, e);
            return f ? g.attr({
                fillOpacity: 0
            }) : g.attr({
                fill: "#c2c2c2",
                fillOpacity: .5
            }), g
        },
        addColumnRectangle: function(a, b, c, d, e) {
            if (b) {
                c = void 0 != c ? c : 5, d = void 0 != d ? d : 0;
                var f = b.getPos(),
                    g = b.getSize();
                if (b.asPX("strokeWidth")) {
                    var h = b.asPX("strokeWidth");
                    g.w += h, f.x -= h / 2
                }
                g.w += c, g.h += d, f.x -= c / 2, f.y -= d / 2;
                var i = getColumnRectangle(a, f.x, f.y, g.w, g.h, e);
                return a.group(i, b)
            }
        }
    }
}]), angular.module("qubitsApp").factory("usercodesFactory", ["$q", "User", "Topology", "Gate", "TutorialPage", function(a, b, c, d, e) {
    function f(c, d) {
        return m ? j : d && 0 === c ? (j = void 0, i()) : (l || (l = a(function(a, e) {
            b.getLastCodes({
                id: b.getCurrentId(),
                filter: {
                    skip: c * o,
                    limit: o
                },
                includeExecutions: !0
            }, function(b) {
                d && (h(), n = []), k = b.total;
                for (var e = c * o, f = 0; f < b.codes.length; f++) n[e + f] = b.codes[f];
                a(n)
            }, function(a) {
                e(a), l = void 0
            })
        })), l)
    }

    function g(c, d, e) {
        return a(function(a, f) {
            var g = e || o;
            n[c] && !d ? a(n[c]) : b.getLastCodes({
                id: b.getCurrentId(),
                filter: {
                    skip: c,
                    limit: g
                },
                includeExecutions: !0
            }, function(b) {
                d && (h(), n = []);
                for (var e = 0; e < b.codes.length; e++) n[c + e] = b.codes[e];
                return a(n[c])
            })
        })
    }

    function h() {
        j = void 0
    }

    function i() {
        return j || (j = a(function(a, c) {
            b.getLastCodes({
                id: b.getCurrentId(),
                filter: {
                    skip: 0,
                    limit: 10 * o
                },
                includeExecutions: !0
            }, function(b) {
                n = [];
                for (var c = 0; c < b.codes.length; c++) c < o && (b.codes[c].viewVisible = !0), n[c] = b.codes[c];
                k = b.total, a(n), m = !0, setTimeout(function() {
                    m = void 0
                }, 5e3)
            }, function(a) {
                c(a)
            })
        })), j
    }
    var j, k, l, m, n = [],
        o = 10;
    return i(), {
        total: function() {
            return k
        },
        getGlobalArray: function() {
            return a(function(a, b) {
                i().then(function(b) {
                    a(b)
                }, function(a) {
                    console.log("Reject"), b(a), j = void 0
                })
            })
        },
        updateGlobalArray: function(b, c) {
            return a(function(a, d) {
                var e = b || 0;
                f(e, c).then(function(b) {
                    a(b), l = void 0
                }, function(a) {
                    d(a), l = void 0
                })
            })
        },
        getCodeFromGlobal: function(b, c, d) {
            return a(function(a, e) {
                g(b, c, d).then(function(b) {
                    a(b)
                }, function(a) {
                    e(a)
                })
            })
        },
        resetGlobalArray: function() {
            h()
        }
    }
}]);
