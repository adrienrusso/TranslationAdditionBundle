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
                    jQuery('<span/>', {'class': 'leyer-translator-container'})
                );
                jQuery('<a/>', {'href': '#', 'class': 'leyer-button edit','text': 'Edit'}).insertAfter(e.currentTarget);
            }
        });
        jQuery('body').on('click', '.leyer-button.edit' ,function(e) {
            var trans = jQuery(e.currentTarget).closest('.leyer-translator-container').find('ins.leyer-translator');
            jQuery('<div/>', {
                'value': trans.data('transValue'),
                'class': 'leyer-tooltip',
                'css': {
                    'left': trans.position().left,
                    'top': trans.position().bottom,
                    'width': trans.width()
                }
            }).append(
                jQuery('<textarea/>', {
                    'value': trans.data('transValue'),
                    'class': 'leyer-textarea',
                    'css': {
                        'width': trans.width() < 100 ? 100 : trans.width(),
                        'height': trans.height() < 50 ? 50 : trans.height()
                    }
                }),
                jQuery('<a/>', {'href': '#', 'class': 'leyer-button save', 'text': 'Save'}),
                jQuery('<a/>', {'href': '#', 'class': 'leyer-button close', 'text': 'Close'})
            ).insertAfter(trans);

            e.stopPropagation();
            e.preventDefault();
        });
        jQuery('body').on('click', '.leyer-button.close' ,function(e) {
            self.removeContainer(jQuery(e.currentTarget).closest('.leyer-translator-container'));
            e.stopPropagation();
            e.preventDefault();
        });
        jQuery('body').on('click', '.leyer-button.save' ,function(e) {
            var container = jQuery(e.currentTarget).closest('.leyer-translator-container');
            self.save(
                container.find('ins.leyer-translator'),
                container.find('textarea.leyer-textarea').val()
            );

            e.stopPropagation();
            e.preventDefault();
        });
    },
    removeContainer: function(container)
    {
        var trans = container.find('ins.leyer-translator');
        trans.html(trans.data('value'));
        container.replaceWith(trans);
    },
    save: function(trans, value)
    {
        trans.addClass('leyer-flash');
        this.removeContainer(trans.closest('.leyer-translator-container'));
        jQuery.ajax({
            type: "PUT",
            url: trans.data('url'),
            data: {
                message: value
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

jQuery(document).ready(function($) {
    LeyerTranslator = new Leyer.Translator();
});