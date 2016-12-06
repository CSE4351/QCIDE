import Ember from 'ember';

export function toLowerCase([str]) {
    return str.toLowerCase();
}

export default Ember.Helper.helper(toLowerCase);
