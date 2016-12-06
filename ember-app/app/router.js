import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('dashboard');
  this.route('login');
  this.route('register');
  this.route('password');

  this.route('forgot', { path: '/forgot' });
  this.route('forgot.password', { path: '/forgot/password' });
  this.route('forgot.password.reset', { path: '/forgot/password/reset' });
  this.route('logout');

  this.route('error');
  this.route('index.html');
});

export default Router;
