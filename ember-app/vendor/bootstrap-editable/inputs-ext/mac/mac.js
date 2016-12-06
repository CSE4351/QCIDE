(function ($) {
    "use strict";

    var Mac = function (options) {
        this.init('mac', options, Mac.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Mac, $.fn.editabletypes.abstractinput);

    $.extend(Mac.prototype, {
        value2html: function(value, element) {
            return App.Utils.format_mac(value);
        }
    });

    Mac.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<input type="text" placeholder="MAC" class="form-control" style="margin-right: 7px">'
    });

    $.fn.editabletypes.mac = Mac;

}(window.jQuery));