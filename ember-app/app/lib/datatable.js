import Ember from 'ember';
import config from '../config/environment';
/*global $, createAlert, createError, createConfirm, showLoader, hideLoader */

$.fn.init_datatable = function(hash) {

    //Extend datatables
    $.extend(true, $.fn.DataTable.TableTools.classes, {
        "container": "btn-group tabletools-btn-group pull-right",
        "buttons": {
            "normal": "btn btn-sm default",
            "disabled": "btn btn-sm default disabled"
        }
    });

    //Extend hash
    hash.table.group_update = function(){
        var count = $('.dataTables_wrapper tbody input[type="checkbox"]:checked').length;
        if(count > 0){
            $('.table-add-button').hide();
            $('div.table-group-actions-select').show();
            $('.table-group-actions-select button span').html(count + ' selected');
        }else{
            $('.table-add-button').show();
            $('div.table-group-actions-select').hide();
        }
    };

    hash.table.delete = function(){
        createConfirm({
            title: 'Delete',
            message: 'Are you sure you want to delete these ' + hash.type.pluralize() + '?',
            success: function(){
                if (!hash.can_run()) {
                    return;
                }

                var datas = data_table.api().rows($('table.dataTable tr td:first-of-type input:checked').closest('tr').get()).data();
                var items = [];
                if (hash.table.delete_data) {
                    items = hash.table.delete_data(datas);
                } else {
                    $.each(datas, function () {
                        items.push({
                            id: this.id,
                            active: 0
                        });
                    });
                }
                var data = {};
                data[hash.type.pluralize()] = items;
                hash.component.get('ajax').put('/' + hash.type.pluralize(), {
                    data: data
                }).then(
                    function () {
                        createAlert('Items deleted', '', 'success');
                        data_table.api().ajax.reload(hash.table.group_update, false);

                        $('table tr:first-of-type input[type="checkbox"]').iCheck('uncheck');
                    },
                    function (error) {
                        createError('Save error', error);
                    }
                ).finally(hash.done_loading);
            }
        });
    };

    hash = $.extend({},{
        is_loading: false,
        can_run: function(){
            if(hash.is_loading){
                return false;
            }
            hash.is_loading = true;
            showLoader();
            return true;
        },
        done_loading: function(){
            hash.is_loading = false;
            hideLoader();
        },
        edit: {},
        destroy: function(){
            $('.ui-dialog').remove();
        }
    },hash);

    //Setup datatable
    var blocked = false;
    var data_table = $(this)
        .on({
            'draw.dt': function(){
                //Editable
                $('.editable:not(.has-editable)')
                    .addClass('has-editable')
                    .editable({
                        url: hash.edit.url || function(params){
                            var item = {
                                id: params.pk
                            };
                            if($(this).attr('data-editable-multiple')){
                                $.extend(item,params.value);
                            }else{
                                item[params.name] = params.value;
                            }
                            var data = {};
                            data[hash.type.pluralize()] = [item];

                            return hash.component.get('ajax').put('/' + hash.type.pluralize(),{
                                data: data,
                            });
                        },
                        display: hash.edit.display,
                        success: function(response,value){
                            var $el = $(this);
                            if($el.editable('getValue')){
                                $el.editable('setValue',value);
                            }
                        }
                    });
                $('.dataTables_wrapper table input[type="checkbox"]:not(.changed-bind)').addClass('changed-bind').on({
                    ifChanged: hash.table.group_update
                });
            },
            'processing.dt': function( e, settings, processing ){
                if(processing){
                    if(!blocked){
                        blocked = true;
                        hash.component.get('utils').blockUI({
                            target: '.x_panel',
                            boxed: true
                        });
                    }
                }else{
                    if(blocked){
                        blocked = false;
                        hash.component.get('utils').unblockUI('.x_panel');
                    }
                }
            }
        })
        .dataTable({
            ordering: false,
            serverSide: true,
            pageLength: 10,
            dom: "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12 table-toolbar'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'il><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            columns: hash.table.columns,
            tableTools: {
                sSwfPath: "/swf/copy_csv_xls_pdf.swf",
                aButtons: [{
                    sExtends:    "collection",
                    sButtonText: "Export",
                    aButtons:    [{
                        sExtends: 'csv',
                        mColumns: [1, 2, 3, 4]
                    }]
                }]
            },
            language: {
                lengthMenu: " _MENU_ <span style='display: inline-block; margin-left: 10px;'>per page</span>",
                search: "<span style='display: inline-block; margin-right: 10px;'>Search:</span>_INPUT_",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                infoFiltered: "",
                zeroRecords: 'No ' + hash.type.pluralize() + ' found'
            },
            ajax: function(data, callback){
                var index = hash.table.index;
                hash.component.get('ajax').request('/search',{
                    data: {
                        args: [{
                            index: index,
                            q: $('.dataTables_filter input').val().trim() || '',
                            page: data_table ? data_table.api().page() : 0,
                            count: data_table ? data_table.api().page.len() : 10
                        }]
                    }
                }).then(
                    function(return_data) {
                        callback({
                            aaData: return_data[index]['data'],
                            recordsFiltered: return_data[index]['meta']['total']
                        });
                    },
                    function(error){
                        createError('Error fetching data', error);
                        hash.component.get('router').transitionTo('error');
                    }
                );
            },
            fnRowCallback: hash.table.row_callback || function(row){
                return row;
            },
            fnDrawCallback : hash.table.drawn || function(){
                $('input.flat:not(.icheck-bound)').iCheck({
                    checkboxClass: 'icheckbox_flat-green',
                    radioClass: 'iradio_flat-green'
                }).addClass('icheck-bound');
            }
        });

    //Get table toolbar
    var $table_toolbar = $('.table-toolbar');

    //Add toolbar template
    $table_toolbar
        .prepend('' + ( typeof hash.table.add_template !== 'undefined' ?
            '<button class="btn pull-left table-add-button btn-default">' +
                'Add ' +
                '<i class="fa fa-plus"></i> ' +
                '</button>' : '') +
            '<div class="dropdown table-group-actions-select dropdown-button-wrapper" style="display: none">' +
            '<button class="btn btn-default" data-toggle="dropdown" data-close-others="true"><span></span><i class="fa fa-sort-down"></i></button> ' +
            '<ul class="dropdown-menu dropdown-menu-default">' +
            '<li><a class="pointer">Delete</a></li>' +
            '</ul>' +
            '</div>');

    //Toolbar events
    $table_toolbar
        .on({
            click: function(){
                switch($(this).html()){
                    case 'Delete':
                        Ember.Logger.debug('Delete group action');
                        hash.table.delete();
                        break;
                    default:
                        break;
                }
            }
        },'div.table-group-actions-select li a');


    //Toolbar add clicked
    $table_toolbar
        .find('.table-add-button')
        .on({
            click: function(){
                if(hash.table.add_check && !hash.table.add_check()){
                    return;
                }

                var $form;
                var done_adding = function() {
                    data_table.api().ajax.reload();
                    $dialog.modal('hide');
                    if(hash.table.add_done){
                        hash.table.add_done();
                    }
                    createAlert(hash.type.capitalize() + ' created','','success');
                };
                var $dialog = createConfirm({
                    title: 'Add ' + hash.type.capitalize(),
                    message: hash.table.add_template,
                    buttons: {
                        danger: {
                            label: 'Cancel',
                            className: 'default'
                        },
                        success: {
                            label: 'Save',
                            className: "blue",
                            callback: function(){
                                if(hash.table.add_submit){
                                    hash.table.add_submit(done_adding);
                                }else{
                                    $form.submit();
                                }
                                return false;
                            }
                        }
                    }
                });
                $form = $dialog.find('form');
                $form.validate($.extend({},config.validate_default,{
                    rules: hash.table.add_rules,
                    submitHandler: function(form){
                        if(!hash.can_run()){
                            return;
                        }

                        var item = $(form).serializeObject();
                        if(hash.table.add_before){
                            item = hash.table.add_before();
                        }

                        var data = {};
                        data[hash.type] = item;
                        hash.component.get('ajax').post('/' + hash.type.pluralize(),{
                            data: data,
                        }).then(
                            done_adding,
                            function(error){
                                createError('Error creating ' +  hash.type + '.',error);
                            }

                        ).finally(hash.done_loading);
                    }
                }));
                if(hash.table.add_init){
                    hash.table.add_init();
                }
            }
        });

    //Datatables length
    $('.dataTables_length select').select2();

    // handle group checkboxes check/uncheck
    $('.group-checkable').on({
        ifChanged(){
            var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]');
            var checked = $(this).is(":checked");
            $(set).each(function() {
                $(this).iCheck(checked ? 'check' : 'uncheck');
            });
        }
    });

    $(this).data('data_table',data_table);

    return data_table;
};