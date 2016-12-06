import Ember from 'ember';
import config from '../config/environment';
/*global $, Dropzone */

export default Ember.Service.extend({
    blockUI: function(options) {
        options = $.extend(true, {}, options);
        var html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><div class="loading-wrapper"><div class="loader"></div></div></div>';

        if (options.target) { // element blocking
            var el = options.target instanceof $ ? options.target : $(options.target);
            if (el.height() <= ($(window).height())) {
                options.cenrerY = true;
            }
            el.block({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 1000,
                centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                css: {
                    top: '10%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        } else { // page blocking
            $.blockUI({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 1000,
                css: {
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#000',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        }
        if(!options.textOnly){
            this.init_loader($('.loading-message .loader'),1);
        }
    },
    unblockUI: function(target) {
        if (target) {
            var el = target instanceof $ ? target : $(target);
            el.unblock({
                onUnblock: function() {
                    el.css('position', '');
                    el.css('zoom', '');
                }
            });
        } else {
            $.unblockUI();
        }
    },
    init_loader: function(loader,size,color){
        loader.spin({
            lines: 10, // The number of lines to draw

            length: size * 4, // The length of each line
            width: size * 2, // The line thickness
            radius: size * 6, // The radius of the inner circle

            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: color || '#00b9f2', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '0px', // Top position relative to parent in px
            left: '0px' // Left position relative to parent in px
        });
    },
    dropzone(hash){
        var dropzone = null;
        hash.max_files = typeof hash.max_files !== 'undefined' ? hash.max_files : 1;
        hash.preview_template = typeof hash.preview_template !== 'undefined' ? hash.preview_template : '';
        hash.autoProcessQueue = typeof hash.autoProcessQueue !== 'undefined' ? hash.autoProcessQueue : false;
        hash.dropzone.dropzone({
            url: config.apiURL + hash.url ,
            autoProcessQueue: hash.autoProcessQueue,
            addRemoveLinks: false,
            uploadMultiple: true,
            paramName: 'files',
            maxFilesize: 5000,
            maxFiles: hash.max_files,
            headers: {
                Authorization: 'Bearer ' + this.get('session.data.authenticated.access_token')
            },
            previewTemplate: hash.preview_template || ('' +
            '<div class="dz-preview dz-file-preview">' +
            '<div class="dz-image">' +
            '<img data-dz-thumbnail />' +
            '</div>' +
            '<div class="dz-details">' +
            '<div class="dz-size" data-dz-size></div>' +
            '<div class="dz-filename"><span data-dz-name></span></div>' +
            '</div>' +
            '<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>' +
            '<div class="dz-success-mark"><span>✔</span></div>' +
            '<div class="dz-error-mark"><span>✘</span></div>' +
            '<div class="fa fa-remove dz-remove" data-dz-remove></div>' +
            '</div>'),
            init(){
                dropzone = this;
                dropzone.on(hash.uploadMultiple ? 'sendingmultiple' : 'sending',function(){
                    Ember.Logger.debug('sending');
                    dropzone.showed_error = false;
                    dropzone.last_error = null;
                    if(hash.sending){
                        hash.sending.apply(this,arguments);
                    }
                }).on('error', function(file, error){
                    Ember.Logger.debug('error');
                    dropzone.last_error = error;
                    if(!file.accepted){
                        dropzone.removeFile(file);
                    }
                }).on('maxfilesreach maxfilesexceeded', function(){
                    createAlert('Max Files', 'The maximum amount of files is ' + hash.max_files + '.','error');
                }).on('processingmultiple', function(){
                    showLoader();
                }).on('completemultiple', function(files){
                    Ember.Logger.debug('completemultiple');
                    hideLoader();
                    if(dropzone.last_error && !dropzone.showed_error){
                        createError(hash.error_text, dropzone.last_error);
                        dropzone.showed_error = true;
                    }

                    //Requeue errored files
                    for(var file of files){
                        if(file['status'] === 'error'){
                            file.status = Dropzone.QUEUED;
                            $(file.previewElement).removeClass('dz-error dz-processing dz-complete').find('.dz-upload').css('width','');
                        }
                    }
                }).on(hash.uploadMultiple ? 'successmultiple' : 'success', function(files){
                    Ember.Logger.debug('success');
                    if(files[0]){
                        for(var file of files){
                            dropzone.removeFile(file);
                        }
                    }else{
                        dropzone.removeFile(files);
                    }
                    if(this.files.length > 0){
                        dropzone.processQueue();
                    }else if(hash.done){
                        Ember.Logger.debug('done');
                        dropzone.removeAllFiles(true);
                        hash.done.apply(this,arguments);
                    }
                    if(hash.success){
                        hash.success.apply(this,arguments);
                    }
                });
            }
        });
        return dropzone;
    },
    linkify: function(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" onClick="if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" onClick="if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" onClick="if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;">$1</a>');

        return replacedText;
    }
});