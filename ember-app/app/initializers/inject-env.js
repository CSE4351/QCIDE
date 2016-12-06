import env from '../config/environment';
import NotificationMixin from '../mixins/notification';
import Ember from 'ember';
import '../lib/vals';
import '../lib/datatable';
import '../lib/editable';
import '../lib/loader';

export function initialize(application) {
  application.register('env:main', env, { singleton: true, instantiate: false });
  application.inject('component', 'env', 'env:main');

  //Current user service (currentUser.user.username)
  application.inject('component', 'currentUser', 'service:current-user');
  application.inject('route', 'currentUser', 'service:current-user');

  //Current session service (session.isAuthenticated)
  application.inject('component', 'session', 'service:session');
  application.inject('route', 'session', 'service:session');

  //Ajax service
  application.inject('component', 'ajax', 'service:ajax');
  application.inject('route', 'ajax', 'service:ajax');

  //Utils service
  application.inject('component', 'utils', 'service:utils');
  application.inject('route', 'utils', 'service:utils');

  //Store service
  application.inject('component', 'store', 'service:store');
  application.inject('route', 'store', 'service:store');

  //Router in navigation components (might not be the right way)
  application.inject('component', 'router', 'router:main');
  application.inject('route:application', 'router', 'router:main');
  application.inject('controller:application', 'router', 'router:main');

  //Notification mixin on every route
  Ember.Route.reopen(NotificationMixin);
}

export default {
  name: 'inject-env',
  initialize: initialize
};