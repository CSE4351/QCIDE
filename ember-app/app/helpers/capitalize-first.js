import Ember from 'ember';

export function capitalizeFirst([str]) {
    if(str == null){
        return null;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Ember.Helper.helper(capitalizeFirst);
