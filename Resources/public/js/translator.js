var Leyer = {
    Translator: function(options) {
        this.options = jQuery.extend({}, this.defaults, options);
        this.init();
    }
};

Leyer.Translator.prototype = {
    constructor: Leyer.Translator,

    defaults: {
        config: {}
    },
    options: {},

    /**
     * Initialization
     */
    init: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        var self = this;
        jQuery('ins.leyer-translator').on('mouseover', function(e){
            console.log(jQuery(e.currentTarget).find('a').length == 0);
            if (jQuery(e.currentTarget).find('a').length == 0) {
                jQuery(e.currentTarget).append(
                    jQuery('<a/>', {
                        'href': '#',
                        'text': ' Edit'
                    })
                );
            }
        });

        $('body').on('click', 'ins.leyer-translator a' ,function(e) {
            e.preventDefault();
            var parent = jQuery(e.currentTarget).closest('ins.leyer-translator');
            parent.attr('contenteditable', true);
            parent.focus();
        });

        $('ins.leyer-translator').on('focus' ,function(e) {
            e.preventDefault();
        });

        this.form.find('form').submit(function(e){
            e.preventDefault();
            var form = jQuery(this);
            jQuery.ajax({
                type: "PUT",
                url: jQuery(form.find('.form-input-container')).data('url'),
                data: {
                    message: ''
                },
                success: function(data) {
                    var trans = jQuery('.leyer-translator[data-id="'+
                        jQuery(form.find('.form-input-container')).data('id')+'"]');

                    trans.data('value', data.trans);
                    trans.text(data.trans);
                },
                error:function (xhr){
                    var response = jQuery.parseJSON(xhr.responseText);
                    var error = self.form.find('.error');
                    error.text(response.error)
                    error.show();
                }
            });
        });
    }
}