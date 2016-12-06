import Ember from 'ember';

export default Ember.Mixin.create({
    beforeModel: function(transition) {
        if(transition && transition.queryParams && transition.queryParams.header){
            createAlert(transition.queryParams.header, transition.queryParams.message, transition.queryParams.status || 'success',transition.queryParams.sticky || false);
        }
    }
});
