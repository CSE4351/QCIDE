$.fn.editable.defaults.inputclass = 'form-control';
$.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
$.fn.editableform.loading = '<div class="loader-wrapper"><div class="loader"></div></div>';
$.fn.editableform.Constructor.prototype.showLoading = function(){
    var w, h;
    if(this.$form) {
        //set loading size equal to form
        w = this.$form.outerWidth();
        h = this.$form.outerHeight();
        if(w) {
            this.$loading.width(w);
        }
        if(h) {
            this.$loading.height(h);
        }
        this.$form.hide();
    } else {
        //stretch loading to fill container width
        w = this.$loading.parent().width();
        if(w) {
            this.$loading.width(w);
        }
    }
    this.$loading.show();
    window.init_loader($('.loader'),1.2);
};
$.fn.editableform.Constructor.prototype.submit = function(e){
    e.stopPropagation();
    e.preventDefault();

    var error,
        newValue = this.input.input2value(); //get new value from input

    //validation
    if (error = this.validate(newValue)) {
        this.error(error);
        this.showForm();
        return;
    }

    //if value not changed --> trigger 'nochange' event and return
    /*jslint eqeq: true*/
    if (!this.options.savenochange && this.input.value2str(newValue) == this.input.value2str(this.value)) {
        /*jslint eqeq: false*/
        /**
         Fired when value not changed but form is submitted. Requires savenochange = false.
         @event nochange
         @param {Object} event event object
         **/
        this.$div.triggerHandler('nochange');
        return;
    }

    //convert value for submitting to server
    var submitValue = this.input.value2submit(newValue);

    this.isSaving = true;

    //sending data to server
    this.save(submitValue)
        .then($.proxy(function(response) {
            this.isSaving = false;

            //run success callback
            var res = typeof this.options.success === 'function' ? this.options.success.call(this.options.scope, response, newValue) : null;

            //if success callback returns false --> keep form open and do not activate input
            if(res === false) {
                this.error(false);
                this.showForm(false);
                return;
            }

            //if success callback returns string -->  keep form open, show error and activate input
            if(typeof res === 'string') {
                this.error(res);
                this.showForm();
                return;
            }

            //if success callback returns object like {newValue: <something>} --> use that value instead of submitted
            //it is usefull if you want to chnage value in url-function
            if(res && typeof res === 'object' && res.hasOwnProperty('newValue')) {
                newValue = res.newValue;
            }

            //clear error message
            this.error(false);

            this.value = newValue;
            this.$div.triggerHandler('save', {newValue: newValue, submitValue: submitValue, response: response});
        }, this))
        .catch($.proxy(function(return_data) {
            this.isSaving = false;
            createError('Error saving',return_data);

            this.showForm();
        }, this));
};