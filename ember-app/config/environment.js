/* jshint node: true */
/*global $ */
module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'ember-app',
        environment: environment,
        rootURL: '/',
        locationType: 'auto',
        notification_params: {
            header: {
                refreshModel: false,
                replace: false,
            },
            message: {
                refreshModel: false,
                replace: false,
            },
            success: {
                refreshModel: false,
                replace: false,
            },
            sticky: {
                refreshModel: false,
                replace: false,
            }
        },
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },
        emblemOptions: {
            blueprints: false
        }
    };

    ENV.validate_default = {
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        highlight: function(element) { // hightlight error inputs
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group
        },
        success: function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        }
    };

    if (environment === 'development') {
        ENV.apiURL = 'http://localhost:8080';
        ENV['algolia'] = {
        };
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
        ENV.stripe = {
            key: "change_this"
        };
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        // ENV.APP.LOG_ACTIVE_GENERATION = false;
        // ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {
        ENV.apiURL = 'http://api.qcide.com';
        ENV['algolia'] = {
        };
        ENV.stripe = {
            key: "change_this"
        };
    }

    ENV['ember-simple-auth'] = {
        serverTokenEndpoint: ENV.apiURL + '/login'
    };


    return ENV;
};