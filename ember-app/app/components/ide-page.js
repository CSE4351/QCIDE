import Ember from 'ember';
/* global ace, CodeMirror, _ */

export default Ember.Component.extend({
    didInsertElement() {
        let editor = CodeMirror.fromTextArea($('#editor')[0], {
            lineNumbers: true,
            mode: "qasm"
        });
        editor.on('change', _.debounce(() => {
            Ember.debug('done typing');
            let qasm = editor.getValue();

            if (qasm !== '') {
                this.get('ajax').post('/convert', {
                    data: {
                        file_name: 'temp',
                        qasm: qasm
                    }
                }).then((response_data) => {
                    $('.simulation-image').attr('src', response_data['converted']).data('zoom-image', response_data['converted']).elevateZoom({
                        zoomWindowPosition: 11
                    });
                }, (error) => {
                    $('.simulation-image').attr('src', '');
                    createError('QASM simulation creation error', error);
                }).finally(() => {
                    this.get('utils').unblockUI('.simulation');
                });
                this.get('utils').blockUI({
                    target: '.simulation',
                    boxed: true
                });
            }
        }, 3000));
    }
});