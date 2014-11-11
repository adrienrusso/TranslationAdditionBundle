var Leyer = {
    Translator: function(element, options) {
        this.opts = $.extend({}, this.defaults, options);
        this.$element = $(element);
        this.init();
    }
};

Leyer.Translator.prototype = {
    constructor: Leyer.Translator,

    defaults: {},

    timer: null,

    init: function () {
        this.build();
        this.listen();
    },

    build: function () {
        if (this.$element.prop('tagName') === 'TRANS') {
            this.$trans = this.$element.parent();
            this.$trans.data('trans', $.parseJSON(window.atob(this.$element.data('trans'))));
            this.$trans.data('translator', this);
        } else {
            this.$trans = this.$element;
            if (typeof this.$element.attr('title') !== typeof undefined) {
                this.attribute = 'title';
                this.$trans.data('trans',
                    $.parseJSON(window.atob($('<div/>', {
                        'html' : this.$element.attr('title')
                    }).find('trans').data('trans'))));
            } else if (typeof this.$element.attr('placeholder') !== typeof undefined) {
                this.attribute = 'placeholder';
                this.$trans.data('trans',
                    $.parseJSON(window.atob($('<div/>', {
                        'html' : this.$element.attr('placeholder')
                    }).find('trans').data('trans'))));
            }
        }
        this.data = this.$trans.data('trans');
        this.$trans.addClass('trans')
    },

    listen: function () {
        this.hover(this);
        this.click(this);
        this.resizeWindow(this);
    },

    hover: function (obj) {
        this.$trans
            .on('mouseover', function () {
                if (obj.$trans.find('.trans-btn').length === 0) {
                    obj.addEditButton();
                }
            });
    },

    click: function (obj) {
        this.$trans
            .on('click', '.trans-btn', function(e) {
                e.preventDefault();
                e.stopPropagation();
                obj[$(this).data('action')](obj);
            });
    },

    resizeWindow: function(obj) {
        $(window).on('resize', function(){
            if (obj.$modal) {
                clearTimeout(obj.timer);
                obj.timer = setTimeout(obj.move(obj.$modal), 100);
            }
            if (obj.$edit) {
                clearTimeout(obj.timer);
                obj.timer = setTimeout(obj.move(obj.$edit), 100);
            }
        });
    },

    resizeModal: function(obj) {
        if (this.$trans.outerWidth() > obj.find('textarea').width()) {
            obj.find('textarea').css('width', this.$trans.outerWidth());
        }

        if (this.$trans.outerHeight() > obj.find('textarea').height()) {
            obj.find('textarea').css('height', this.$trans.outerHeight());
        }

    },

    addEditButton: function() {
        this.$trans.append(
            this.$edit = $('<a/>', {
                'class': 'trans-btn edit',
                'html': 'Edit'
            }).data('action', 'edit')
        );
        this.move(this.$edit);
        this.$edit.fadeIn();
    },

    edit: function (obj) {
        this.$edit.remove();
        $('.trans').lTranslator('externalClose');

        this.$trans.addClass('trans-hover');

        this.$trans.append(
            this.$modal = $('<div/>', {
                'class': 'trans-modal'
            }).append(
                $('<label/>', {
                    'class': 'trans-lbl',
                    'html': 'Translate'
                }),
                this.attribute ? $('<div/>', {
                    'class': 'trans-lgd',
                    'html': 'Attribute: ' + this.attribute
                }) :'',
                $('<div/>', {
                    'class': 'trans-lgd',
                    'html': 'Key: ' + this.data.key
                }),
                $('<div/>', {
                    'class': 'trans-lgd',
                    'html': 'Origin: ' + this.data.transValue
                }),
                $('<textarea/>', {
                    'class': 'trans-texterea'
                }).val(this.data.trans),
                $('<a/>', {
                    'class': 'trans-btn cancel',
                    'html': 'Cancel'
                }).data('action', 'hide'),
                $('<a/>', {
                    'class': 'trans-btn save',
                    'html': 'Save'
                }).data('action', 'save')
            )
        );
        this.move(this.$modal);
        this.resizeModal(this.$modal);
        this.$modal.fadeIn();
    },

    hide: function (obj) {
        obj.$modal.fadeOut('fast', function() {
            obj.$modal.remove();
            obj.$trans.removeClass('trans-hover');
        });
    },

    move: function (obj) {
        if (obj === this.$edit) {
            this.$edit.css({
                'top': this.$trans.position().top + this.$trans.outerHeight() + parseInt(this.$trans.css('marginTop')) - 1,
                'left': this.$trans.position().left + parseInt(this.$trans.css('marginLeft'))
            });
        } else if (obj === this.$modal) {
            this.$modal.css({
                'top':  this.$trans.position().top + this.$trans.outerHeight() + parseInt(this.$trans.css('marginTop')) + 4 ,
                'left': this.$trans.position().left + parseInt(this.$trans.css('marginLeft'))
            });
        }
    },

    save: function (obj) {
        this.$trans.addClass('flash');
        obj.hide(obj);
        $.ajax({
            type: "PUT",
            url: obj.data.url,
            data: {
                id: obj.data.key,
                message: obj.$modal.find('textarea').val(),
                parameters: obj.data.parameters
            },
            success: function(data) {
                obj.data.transValue = obj.$modal.find('textarea').val();
                obj.$trans.find('>trans').html(data.message);
                obj.$trans.removeClass(
                    'untranslated flash'
                );
                obj.data.trans = data.message;
                obj.$trans.attr('title', '');
            },
            error: function(response) {
                var responseText = $.parseJSON(response.responseText);
                obj.$trans.removeClass('flash');
                obj.$trans.addClass('error');
                obj.$trans.attr('title', responseText.message);
            }
        });
    },

    externalClose: function () {
        if (this.$modal) {
            this.hide(this);
        }
    }

};


/**
 * new Widget Declaration
 */
$.fn.lTranslator = function(options) {
    return this.each(function(){
        var data = $(this).data('translator');
        if (!data || (typeof options !== 'string' && $(this).prop('tagName') === 'TRANS')) {
            $(this).data('translator', (data = new Leyer.Translator(this, $.extend(true, {}, options))));
        }
        if (typeof options === 'string') {
            data[options]();
        }
    });
};

jQuery(document).ready(function($) {
    $('trans, [title^="<trans"], [placeholder^="<trans"]').lTranslator();
});