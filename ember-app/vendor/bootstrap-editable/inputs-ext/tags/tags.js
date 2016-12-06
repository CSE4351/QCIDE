(function ($) {
    "use strict";

    var Tags = function (options) {
        this.init('tags', options, Tags.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Tags, $.fn.editabletypes.abstractinput);

    $.extend(Tags.prototype, {

        input2value: function() {
            return this.$input.select2('data');
        },
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

    Tags.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<input type="hidden" class="form-control" style="margin-right: 7px;width: 300px" value="dummy">'
    });

    $.fn.editabletypes.tags = Tags;

}(window.jQuery));