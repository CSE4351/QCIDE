import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        change_password(){
            var user = this.get('currentUser.content');
            var new_password = this.get('new_password');
            if(new_password === ''){
                return;
            }

            user.set('password', new_password);
            showLoader();
            user.save()
                .then(() => {
                    createAlert('Password Updated','Your password has been updated.','success');
                }).catch((error) => {
                    createError('Error updating password', error);
                    user.rollbackAttributes();
                }).finally(() => {
                    hideLoader();
                });
        }
    }
});
