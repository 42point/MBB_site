;(function() {
    var renderTmpl = function(tmpl, ctx) {
        for (var x in ctx) {
            tmpl = tmpl.replace('{' + x + '}', ctx[x]);
        }
        return tmpl;
    },
    $b = $('body'),
    $w = $(window);

    $.fn.customSelect = function(options) {
        var options = $.extend({
            tmpl: [
                '<a href="#" class="custom-select__title js-title">{text}</a>',
                '<div class="custom-select__dropdown js-dropdown"></div>'
            ].join('\n'),
            optionsTmpl: '<li><a href="#" class="c" data-value="{value}" data-content="{content}">{text}</a></li>',
            animSpeed: 50,
            className: '',
            action: 'click'
        }, options || {});

        this.each(function() {
            var dataClassName = $(this).data('classname');
            if (dataClassName) {
                options.className = dataClassName;
            }
            var dataAction = $(this).data('action');
            if (dataAction) {
                options.action = dataAction;
            }
            new CustomSelect(this, options);
        });
    };

    var CustomSelect = function(oldSelect, options) {

        var $oldSelect = $(oldSelect),
            isDisabled = oldSelect.disabled,
            oldSelectWidth = $oldSelect.outerWidth(),
            $_;

        var $selectedOption = $oldSelect.children().eq($oldSelect[0].selectedIndex);
        var wrapHtml = renderTmpl(options.tmpl, {
                text: $selectedOption.data('content') || $selectedOption.html()
            });
        var $wrap;
        var $title;
        var $options;
        var $dropdown;
        var $optionsHolder;
        var $optionsElements;
        var maxHeight;
        var realHeight;
        var $valueField = $('[name="' + $oldSelect.attr('name') + '_value"]', $oldSelect.parent());

        $oldSelect.hide();
        $oldSelect.wrap('<div class="custom-select">');
        $wrap = $oldSelect.parent();
        $wrap
            .css('width', oldSelectWidth)
            .addClass(options.className)
            .append($(wrapHtml));

        $valueField.val( $selectedOption.text() );

        if (isDisabled) {
            $wrap.addClass('custom-select_disabled');
        }

        $title = $wrap.find('.js-title');
        $dropdown = $wrap.find('.js-dropdown');

        initOptions();
        initTitle();
        setDropdownPosition();

        if ($().mousewheel) {
            $dropdown.mousewheel(function() {
                return false;
            });
        }

        if (! isDisabled) {
            if (options.action === 'hover') {
                $wrap.on('mouseenter', function() {
                    $dropdown.show();
                });
                $wrap.on('mouseleave', function() {
                    $dropdown.hide();
                });
            }
        }

        function getOptionsHtml() {
            var _ = [];
            $oldSelect.children().each(function(i, o) {
                var $o = $(o)
                _.push(renderTmpl(options.optionsTmpl, {
                    value: o.value,
                    text: $o.data('title') || $(o).attr('data-title')  || o.innerHTML,
                    content: $o.data('content') || o.innerHTML
                }));
            });
            return _.join('\n');
        };

        function initOptions() {
            $optionsHolder = $wrap.find('.js-dropdown');
            $optionsHolder.html(getOptionsHtml());

            $options = $optionsHolder.find('a');
            $options.eq(oldSelect.selectedIndex).addClass('selected');

            $options.each(function(i, el) {
                var $el = $(el),
                    title = $el.html(),
                    value = $el.data('value') || $el.attr('data-value') || $el.val() || $el.text(),
                    content = $el.data('content') || $el.attr('data-content') || value;

                if (! isDisabled) {
                    $el.click(function(e) {
                        e.preventDefault();

                        //var $el = $(this);
                        $dropdown.hide();
                        $title.html(content);
                        $oldSelect[0].selectedIndex = i;
                        $oldSelect.change();
                        // $oldSelect.val(value);
                        // $valueField.val(content);
                        $options.removeClass('selected');
                        $el.addClass('selected');
                    });
                }
            });
        };

        function initTitle() {
            if (options.action === 'click') {
                $title.click(function(e) {
                    if (isDisabled) {
                        return;
                    }
                    e.preventDefault();

                    setTimeout(function() {
                        $('.custom-select .js-dropdown').hide();
                        $wrap.toggleClass('opened');
                        $dropdown.toggle();
                        e.preventDefault();
                    });
                });
            }
        };

        function setDropdownPosition() {
            // var height = $dropdown.outerHeight(),
            //  titleHeight = $title.outerHeight(),
            //  offset = $dropdown.offset(),
            //  top = - (height - titleHeight) / 2;
            // top = top < - offset.top ? - offset.top : top;
            // $dropdown.css('top', top);
        };
    };

    $b.click(function() {
        $('.custom-select__dropdown').hide(50);
    });

    $('.js-customselect').customSelect();

})();