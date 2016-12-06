import DS from 'ember-data';

export default DS.Model.extend({
    date_start: DS.attr('number'),
    date_banned_till: DS.attr('number'),
    active: DS.attr('number'),
    type: DS.attr('number'),
    username: DS.attr('string'),
    password: DS.attr('string'),
    username2: DS.attr('string'),
    password2: DS.attr('string'),
    profile_picture_url: DS.attr('string'),
    subscription_type: DS.attr('string'),
    subscription_token: DS.attr(),
    subscription_source: DS.attr()
});
