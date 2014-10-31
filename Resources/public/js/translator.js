var Leyer = {
    Translator: function(options) {
        this.options = jQuery.extend({}, this.defaults, options);
        this.init();
    }
};

Leyer.Translator.prototype = {
    constructor: Leyer.Translator,

    defaults: {
        select: {
            container:    '.leyer-translator-container',
            ins:          'ins.leyer-translator',
            input:        'textarea.leyer-textarea',
            tooltip:      '.leyer-tooltip',
            button:       '.leyer-button',
            flash:        'leyer-flash',
            untranslated: 'untranslated',
            error:        'leyer-error'
        },
        tpl: {
            button:  jQuery('<a/>', {'class': 'leyer-button'}),
            wrapper: jQuery('<span/>', {'class': 'leyer-translator-container'}),
            tooltip: jQuery('<div/>', {'class': 'leyer-tooltip'}),
            input:   jQuery('<textarea/>', {'class': 'leyer-textarea'})
        }
    },

    init: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        var self = this;
        jQuery('body').on('mouseover', self.options.select.ins, function (e) {
            if (jQuery(this).closest(self.options.select.container).length === 0) {
                jQuery(this).wrap(
                    self.options.tpl.wrapper
                );
                self.options.tpl.button.clone().addClass('edit').insertAfter(jQuery(this));
            }
        });

        jQuery('body').on('click', self.options.select.button, function (e) {
            var $container = jQuery(this).closest(self.options.select.container);

            e.stopPropagation();
            e.preventDefault();

            if (jQuery(this).hasClass('edit'))
                self.createToolTip($container.find(self.options.select.ins));

            if (jQuery(this).hasClass('close'))
                self.removeContainer($container);

            if (jQuery(this).hasClass('save'))
                self.save(
                    $container.find(self.options.select.ins),
                    $container.find(self.options.select.input).val()
                );
        });

    },
    createToolTip: function(trans){
        jQuery(this.options.select.tooltip).remove();
        this.options.tpl.tooltip.clone()
            .val(trans.data('transValue'))
            .css({
                'left': trans.position().left,
                'width': trans.width()
            }).append(
                this.options.tpl.input.clone()
                    .val(trans.data('transValue'))
                    .css({
                        'width': trans.width() < 200 ? 200 : trans.width(),
                        'height': trans.height() < 100 ? 100 : trans.height()
                    }),
                this.options.tpl.button.clone().addClass('save'),
                this.options.tpl.button.clone().addClass('close')
        ).insertAfter(trans);
    },
    removeContainer: function(container)
    {
        var trans = container.find(this.options.select.ins);
        trans.html(trans.data('value'));
        container.replaceWith(trans);
    },
    save: function(trans, value)
    {
        var self = this;
        trans.addClass(this.options.select.flash);
        this.removeContainer(trans.closest(this.options.select.container));
        jQuery.ajax({
            type: "PUT",
            url: trans.data('url'),
            data: {
                message: value,
                parameters: trans.data('parameters')
            },
            success: function(data) {
                trans.data('transValue', value);
                trans.removeClass(self.options.select.untranslated);
                trans.removeClass(self.options.select.flash);
                trans.html(data.message);
                trans.attr('title', '');
            },
            error: function(response) {
                var responseText = jQuery.parseJSON(response.responseText);
                trans.removeClass(self.options.select.flash);
                trans.addClass(self.options.select.error);
                trans.attr('title', responseText.message);
            }
        });
    }
};

jQuery(document).ready(function($) {
    LeyerTranslator = new Leyer.Translator();
});