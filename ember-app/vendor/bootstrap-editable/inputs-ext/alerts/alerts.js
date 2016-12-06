(function ($) {
    "use strict";

    var Alerts = function (options) {
        this.init('alerts', options, Alerts.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Alerts, $.fn.editabletypes.abstractinput);

    $.extend(Alerts.prototype, {

        /**
         Returns value of input.

         @method input2value()
         **/
        input2value: function() {
            var ids = App.Utils.parse_ids(this.$input.select2('data'));
            var val;
            if(ids.indexOf('can_alert') !== -1){
                val = {
                    can_alert_green: 1,
                    can_alert_yellow: 1,
                    can_alert_red: 1
                };
            }else{
                val = {
                    can_alert_green: 0,
                    can_alert_yellow: 0,
                    can_alert_red: 0
                };
                $.each(ids,function(){
                    val[this] = 1;
                });
            }
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

    Alerts.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<input type="hidden" class="form-control" style="margin-right: 7px;width: 300px" value="dummy">'
    });

    $.fn.editabletypes.alerts = Alerts;

}(window.jQuery));