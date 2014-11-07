var Leyer = {
    Translator: function(element, options) {
        this.opts = $.extend({}, this.defaults, options);
        this.$element = $(element);
        this.data = $(element).data('translation');
        this.init();
    }
};

Leyer.Translator.prototype = {
    constructor: Leyer.Translator,

    defaults: {
        ins:          '.leyer-translator',
        input:        '.leyer-textarea',
        tooltip:      '.leyer-tooltip',
        btn:          '.leyer-button',
        flash:        '.leyer-flash',
        untranslated: '.untranslated',
        error:        '.leyer-error'
    },

    timer: null,

    init: function () {
        this.templating();
        this.listen();
    },

    templating: function() {
        this.tpls = {
            btn:     $('<a/>').addClass(this.opts.btn.replace('.', '')),
            tooltip: $('<div/>').addClass(this.opts.tooltip.replace('.', '')).html('Translate'),
            input:   $('<textarea/>').addClass(this.opts.input.replace('.', ''))
        };
    },

    listen: function () {
        var self = this;
        this.$element.on('mouseenter', function (e) {
            if ($(this).find(self.opts.btn).length === 0) {
                $(this).append(
                    self.tpls.btn.clone().addClass('edit')
                );
            }
        });

        this.$element.parent().on('click', function(e) {
           if ($(this).find(self.opts.tooltip).length > 0) {
               e.preventDefault();
           }
        });

        this.$element.on('click', self.opts.btn, function (e) {
            e.stopPropagation();
            e.preventDefault();

            if ($(this).hasClass('edit'))
                self.show();

            if ($(this).hasClass('close'))
                self.close();

            if ($(this).hasClass('save'))
                self.save();
        });

        $(window).on('resize', function(){
            if (self.$element.find(self.opts.tooltip).length > 0) {
                clearTimeout(self.timer);
                self.timer = setTimeout(self.move(), 100);
            }
        });
    },
    move: function() {
         this.$element.find(this.opts.tooltip).css({
            'left': this.$element.position().left
         });
    },
    show: function(){
        console.log('show')
        this.close();
        $(this.$element).append(
            this.tpls.tooltip.clone()
                .val(this.data.transValue)
                .css({
                    'left': this.$element.position().left,
                    'width': this.$element.width() < 225 ? 225 : this.$element.width()
                }).append(
                this.tpls.input.clone()
                    .val(this.data.transValue)
                    .css({
                        'width': this.$element.width() < 225 ? 200 : this.$element.width() - 25,
                        'height': this.$element.height() < 155 ? 100 : this.$element.height()
                    }),
                this.tpls.btn.clone().addClass('save'),
                this.tpls.btn.clone().addClass('close')
            )
        );
        this.$element.find('.edit').remove();
    },
    close: function()
    {
        this.$element.html(this.data.trans);
        $(this.opts.tooltip).remove();
    },
    save: function()
    {
        var self = this;
        this.$element.addClass(this.opts.flash.replace('.', ''));
        $.ajax({
            type: "PUT",
            url: this.data.url,
            data: {
                id: this.data.key,
                message: this.$element.find(this.opts.input).val(),
                parameters: this.data.parameters
            },
            success: function(data) {
                self.data.transValue = self.$element.find(self.opts.input).val();
                self.$element.removeClass(
                    self.opts.untranslated.replace('.', '') + self.opts.flash.replace('.', ' ')
                );
                self.data.trans = data.message;
                self.$element.attr('title', '');
                self.close();
            },
            error: function(response) {
                var responseText = $.parseJSON(response.responseText);
                self.$element.removeClass(self.opts.flash.replace('.', ''));
                self.$element.addClass(self.opts.error.replace('.', ''));
                self.$element.attr('title', responseText.message);
                self.close();
            }
        });
    }
};


/**
 * new Widget Declaration
 */
$.fn.LeyerTranslator = function(options) {
    return this.each(function(){
        var data = $(this).data('translator');
        if (!data) {
            $(this).data('translator', (data = new Leyer.Translator(this, $.extend(true, {}, options))));
        }
        if (typeof option === 'string') {
            data[option]();
        }
    });
};

jQuery(document).ready(function($) {
    $('ins.leyer-translator').LeyerTranslator();
});