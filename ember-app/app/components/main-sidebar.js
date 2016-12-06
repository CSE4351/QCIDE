import Ember from 'ember';
import NavigationMixin from '../mixins/navigation';
/*global $ */

export default Ember.Component.extend(NavigationMixin,{
    didInsertElement: function(){
        //Set content height
        $('.right_col').css('min-height', $(window).height() - $('footer').outerHeight() - 2);

        //Checkboxes
        $('input.flat:not(.icheck-bound)').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        }).addClass('icheck-bound');
    },
    formatted_username: Ember.computed('currentUser.username',function(){
        var username = this.get('currentUser.username');
        return username || ''.split('@')[0];
    })
});
