import Ember from 'ember';
import NavigationMixin from '../mixins/navigation';
/*global $ */

export default Ember.Component.extend(NavigationMixin,{
    didInsertElement(){
        var $BODY = $('body'),
            $SIDEBAR_MENU = $('#sidebar-menu');
        this.$('#menu_toggle').on('click', function() {
            if ($BODY.hasClass('nav-md')) {
                $SIDEBAR_MENU.find('li.active ul').hide();
                $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
            } else {
                $SIDEBAR_MENU.find('li.active-sm ul').show();
                $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
            }

            $BODY.toggleClass('nav-md nav-sm');
        });
    },
    actions: {
        logout() {
            this.get('session').invalidate();
        }
    }
});
