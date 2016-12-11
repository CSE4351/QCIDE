import Ember from 'ember';
/* global ace */

export default Ember.Component.extend({
    didInsertElement(){
        var editor = ace.edit("editor");
        editor.getSession().on('change', _.debounce(() => {
            Ember.debug('done typing');

            var qasm = editor.getValue();

            if(qasm !== ''){
                this.get('ajax').post('/convert',{
                    data: {
                        file_name: 'temp',
                        qasm: qasm
                    }
                }).then((response_data) => {
                    $('.simulation-image').attr('src', response_data['converted']);
                },(error) => {
                    $('.simulation-image').attr('src', '');
                    createError('QASM simulation creation error',error);
                }).finally(() => {
                    this.get('utils').unblockUI('.simulation');
                });
                this.get('utils').blockUI({
                    target: '.simulation',
                    boxed: true
                });
            }
        } , 1000));
    }
});
