/*jshint node:true*/
/* global require, module, process */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        // Add options here
        fingerprint: {
            prepend: process.env.STATIC_URL
        }
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    //Vendor CSS
    app.import('vendor/css/toastr.css');
    app.import('vendor/css/bootstrap.css');
    app.import('vendor/css/font-awesome.css');
    app.import('vendor/css/components.css');
    app.import('vendor/css/iCheck.css');
    app.import('vendor/css/select2.css');
    app.import('vendor/css/plugins.css');
    app.import('vendor/css/datatables.css');
    app.import('vendor/css/style.css');
    app.import('vendor/css/style-responsive.css');
    app.import('vendor/css/layout.css');
    app.import('vendor/css/error.css');
    app.import('vendor/css/blue-steel.css');
    app.import('vendor/css/blue.css');
    app.import('vendor/css/nprogress.css');
    app.import('vendor/css/dropzone.css');
    app.import('vendor/css/custom.css');
    app.import('vendor/css/common.css');
    app.import('vendor/css/bootstrap-editable.css');

    //JS
    app.import('vendor/js/delay.js');
    app.import('vendor/bootstrap/dist/js/bootstrap.js');
    app.import('vendor/js/icheck.js');
    app.import('vendor/jquery-validation/js/jquery.validate.js');
    app.import('vendor/block-ui/jquery.blockui.min.js');
    app.import('vendor/spin/spin.js');
    app.import('vendor/spin/jquery.spin.js');
    app.import('vendor/select2/select2.js');
    app.import('vendor/js/nprogress.js');
    app.import('vendor/js/dropzone.js');
    app.import('vendor/js/createAlert.js');
    app.import('vendor/moment/moment.js');
    app.import('bower_components/jquery-knob/js/jquery.knob.js');
    app.import('vendor/js/twemoji.js');
    app.import('vendor/underscore.js');
    app.import('vendor/ace/ace.js');

    app.import('vendor/elevatezoom/jquery.elevatezoom.js');
    app.import('vendor/codemirror/lib/codemirror.js');
    app.import('vendor/codemirror/lib/codemirror.css');
    app.import('vendor/codemirror/mode/qasm/qasm.js');

    //Datatables
    app.import('vendor/datatables/media/js/jquery.dataTables.js');
    app.import('vendor/datatables/extensions/TableTools/js/dataTables.tableTools.min.js');
    app.import('vendor/datatables/extensions/ColReorder/js/dataTables.colReorder.min.js');
    app.import('vendor/datatables/extensions/Scroller/js/dataTables.scroller.min.js');
    app.import('vendor/datatables/plugins/bootstrap/dataTables.bootstrap.js');

    //Photoswipe
    app.import('vendor/photoswipe/dist/photoswipe.css');
    app.import('vendor/photoswipe/dist/default-skin/default-skin.css');
    app.import('vendor/photoswipe/dist/photoswipe.js');
    app.import('vendor/photoswipe/dist/photoswipe-ui-default.js');

    //Editable
    app.import('vendor/bootstrap-editable/bootstrap-editable/js/bootstrap-editable.js');


    return app.toTree();
};
