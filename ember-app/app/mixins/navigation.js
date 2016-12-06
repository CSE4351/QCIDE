import Ember from 'ember';

export default Ember.Mixin.create({
    is_full_page: Ember.computed('router.currentPath',function() {
        var full_page_routes = ['login','register','forgot.password','forgot.password.reset'];
        return full_page_routes.indexOf(this.get('router.currentPath')) !== -1;
    }),
    route_title: Ember.computed('router.currentPath',function() {
        var route_name_hash = {
            dashboard: 'Dashboard'
        };
        return route_name_hash[this.get('router.currentPath')];
    })
});
