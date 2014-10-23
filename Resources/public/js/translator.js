var Leyer = {
    Translator: function(options) {
        this.options = jQuery.extend({}, this.defaults, options);
        this.init();
    }
};

Leyer.Translator.prototype = {
    constructor: Leyer.Translator,

    init: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        var self = this;
        jQuery('body').on('mouseover', 'ins.leyer-translator' ,function(e) {
            if (jQuery(e.currentTarget).closest('.leyer-translator-container').length == 0) {
                jQuery(e.currentTarget).wrap(
                    jQuery('<span/>', {
                        'class': 'leyer-translator-container'
                    })
                );
                jQuery('<a/>', {
                    'href': '#',
                    'data-parent': jQuery(e.currentTarget).data('id'),
                    'class': 'leyer-button edit',
                    'text': 'Edit'
                }).insertAfter(e.currentTarget);
            }
        });

        jQuery('body').on('mouseleave', '.leyer-translator-container' ,function(e) {
            var trans = jQuery(e.currentTarget).find('ins.leyer-translator');
            if( jQuery(e.currentTarget).find('.leyer-button.save').length == 0 || trans.data('value') == trans.text()) {
                self.removeContainer(
                    jQuery(e.currentTarget)
                );
            }
        });

        jQuery('body').on('click', '.leyer-button.edit' ,function(e) {
            jQuery(e.currentTarget).text('Save')
                .removeClass('edit')
                .addClass('save')
                .closest('.leyer-translator-container')
                    .find('ins.leyer-translator')
                    .attr('contenteditable', true)
                    .focus();
            e.stopPropagation();
        });

        jQuery('body').on('click', '.leyer-button.save' ,function(e) {
            var trans = jQuery(e.currentTarget)
                .closest('.leyer-translator-container')
                .find('ins.leyer-translator');

            self.save(trans);
            self.removeContainer(
                jQuery(e.currentTarget).closest('.leyer-translator-container')
            );
            e.stopPropagation();
        });
    },
    removeContainer: function(container)
    {
        var trans = container.find('ins.leyer-translator');
        trans.text(trans.data('value'));
        container.replaceWith(trans);
    },
    save: function(trans)
    {
        trans.attr('contenteditable', false);
        trans.data('value', trans.text());
        trans.addClass('leyer-flash');

        jQuery.ajax({
            type: "PUT",
            url: trans.data('url'),
            data: {
                message: trans.text()
            },
            success: function() {
                trans.removeClass('untranslated');
                trans.removeClass('leyer-flash');
                trans.attr('title', '');
            },
            error: function(response) {
                var responseText = jQuery.parseJSON(response.responseText);
                trans.removeClass('leyer-flash');
                trans.addClass('leyer-error');
                trans.attr('title', responseText.message);
            }
        });
    }
}