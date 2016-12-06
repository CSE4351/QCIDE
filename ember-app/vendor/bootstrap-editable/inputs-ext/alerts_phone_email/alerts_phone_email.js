(function ($) {
    "use strict";

    var Alerts_phone_email = function (options) {
        this.init('alerts_phone_email', options, Alerts_phone_email.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Alerts_phone_email, $.fn.editabletypes.abstractinput);

    $.extend(Alerts_phone_email.prototype, {

        /**
         Returns value of input.

         @method input2value()
         **/
        input2value: function() {
            var ids = App.Utils.parse_ids(this.$input.select2('data'));
            var val = {
                phone_alerts: 0,
                email_alerts: 0
            };
            $.each(ids,function(){
                val[this] = 1;
            });
            return val;
        },

        /**
         Activates input: sets focus on the first field.

         @method activate()
         **/
        activate: function() {
            var $scope = $(this.options.scope);
            var select2_hash = $scope.closest('table').data('data_table').api().row($scope.closest('tr').get(0)).data()['select2_hash_' + $scope.attr('data-select-2-id')];
            this.$input.select2(
                $.extend(
                    {},
                    select2_hash,
                    {
                        createSearchChoice: function(){
                            return null;
                        }
                    }
                )
            );
            if(select2_hash.events){
                this.$input.on(select2_hash.events);
            }
            Ember.run.scheduleOnce('afterRender',this,function(){
                this.$input.select2('open');
            });
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

    Alerts_phone_email.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<input type="hidden" class="form-control" style="margin-right: 7px;width: 300px" value="dummy">'
    });

    $.fn.editabletypes.alerts_phone_email = Alerts_phone_email;

}(window.jQuery));