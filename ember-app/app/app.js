import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

if(config.environment === 'development'){
  Ember.run.backburner.DEBUG = true;
  Ember.onerror = function(error) {
    Ember.Logger.error('Error happened');
    Ember.Logger.error(error.stack);
  };
}

export default App;
