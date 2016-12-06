(function ($) {
    "use strict";

    var PhoneNumber = function (options) {
        this.init('address', options, PhoneNumber.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(PhoneNumber, $.fn.editabletypes.abstractinput);

    $.extend(PhoneNumber.prototype, {
        /**
         Renders input from tpl

         @method render()
         **/
        render: function() {
            this.$select = this.$tpl.filter('select');
            this.$input = this.$tpl.filter('input');
        },

        /**
         Default method to show value in element. Can be overwritten by display option.

         @method value2html(value, element)
         **/
        value2html: function(value, element) {
            return null;
        },

        /**
         Gets value from element's html

         @method html2value(html)
         **/
        html2value: function(html) {
            return null;
        },

        /**
         Converts value to string.
         It is used in internal comparing (not for sending to server).

         @method value2str(value)
         **/
        value2str: function(value) {
            var str = '';
            if(value) {
                for(var k in value) {
                    str = str + k + ':' + value[k] + ';';
                }
            }
            return str;
        },

        /*
         Converts string to value. Used for reading value from 'data-value' attribute.

         @method str2value(str)
         */
        str2value: function(str) {
            /*
             this is mainly for parsing value defined in data-value attribute.
             If you will always set value by javascript, no need to overwrite it
             */
            return str;
        },

        /**
         Sets value of input.

         @method value2input(value)
         @param {mixed} value
         **/
        value2input: function(value) {
            if(!value) {
                return;
            }
            this.$select.val(value.phone_number_cc);
            this.$input.val(value.phone_number);
        },

        /**
         Returns value of input.

         @method input2value()
         **/
        input2value: function() {
            return {
                phone_number_cc: this.$select.val(),
                phone_number: this.$input.val()
            };
        },

        /**
         Activates input: sets focus on the first field.

         @method activate()
         **/
        activate: function() {
            this.$select.css({
                width: '200px',
                'margin-right': '7px'
            });
            window.phone_number_cc_init(this.$select);
            this.$input.focus();
        },

        /**
         Attaches handler to submit form in case of 'showbuttons=false' mode

         @method autosubmit()
         **/
        autosubmit: function() {
            this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
            });
        }
    });

    PhoneNumber.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: window.phone_number_cc_tpl + '<input type="text" placeholder="Phone Number" class="form-control" style="margin-right: 7px">'
    });

    $.fn.editabletypes.phonenumber = PhoneNumber;

}(window.jQuery));