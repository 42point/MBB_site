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

/* **********************************************
     Begin jquery.tooltip.js
********************************************** */

/*
 * jQuery Tooltip plugin 1.3
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * http://docs.jquery.com/Plugins/Tooltip
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.tooltip.js 5741 2008-06-21 15:22:16Z joern.zaefferer $
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 
;(function($) {
    
        // the tooltip element
    var helper = {},
        // the current tooltipped element
        current,
        // the title of the current element, used for restoring
        title,
        // timeout id for delayed tooltips
        tID,
        // IE 5.5 or 6
        IE = /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
        // flag for mouse tracking
        track = false;
    
    $.tooltip = {
        blocked: false,
        defaults: {
            delay: 200,
            fade: false,
            showURL: true,
            extraClass: "",
            top: 15,
            left: 15,
            id: "tooltip"
        },
        block: function() {
            $.tooltip.blocked = !$.tooltip.blocked;
        }
    };
    
    $.fn.extend({
        tooltip: function(settings) {
            settings = $.extend({}, $.tooltip.defaults, settings);
            createHelper(settings);
            return this.each(function() {
                    $.data(this, "tooltip", settings);
                    this.tOpacity = helper.parent.css("opacity");
                    // copy tooltip into its own expando and remove the title
                    this.tooltipText = this.title;
                    $(this).removeAttr("title");
                    // also remove alt attribute to prevent default tooltip in IE
                    this.alt = "";
                })
                .mouseover(save)
                .mouseout(hide)
                .click(hide);
        },
        fixPNG: IE ? function() {
            return this.each(function () {
                var image = $(this).css('backgroundImage');
                if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
                    image = RegExp.$1;
                    $(this).css({
                        'backgroundImage': 'none',
                        'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
                    }).each(function () {
                        var position = $(this).css('position');
                        if (position != 'absolute' && position != 'relative')
                            $(this).css('position', 'relative');
                    });
                }
            });
        } : function() { return this; },
        unfixPNG: IE ? function() {
            return this.each(function () {
                $(this).css({'filter': '', backgroundImage: ''});
            });
        } : function() { return this; },
        hideWhenEmpty: function() {
            return this.each(function() {
                $(this)[ $(this).html() ? "show" : "hide" ]();
            });
        },
        url: function() {
            return this.attr('href') || this.attr('src');
        }
    });
    
    function createHelper(settings) {
        // there can be only one tooltip helper
        if( helper.parent )
            return;
        // create the helper, h3 for title, div for url
        helper.parent = $('<div id="' + settings.id + '"><h3></h3><div class="body"></div><div class="url"></div></div>')
            // add to document
            .appendTo(document.body)
            // hide it at first
            .hide();
            
        // apply bgiframe if available
        if ( $.fn.bgiframe )
            helper.parent.bgiframe();
        
        // save references to title and url elements
        helper.title = $('h3', helper.parent);
        helper.body = $('div.body', helper.parent);
        helper.url = $('div.url', helper.parent);
    }
    
    function settings(element) {
        return $.data(element, "tooltip");
    }
    
    // main event handler to start showing tooltips
    function handle(event) {
        // show helper, either with timeout or on instant
        if( settings(this).delay )
            tID = setTimeout(show, settings(this).delay);
        else
            show();
        
        // if selected, update the helper position when the mouse moves
        track = !!settings(this).track;
        $(document.body).bind('mousemove', update);
            
        // update at least once
        update(event);
    }
    
    // save elements title before the tooltip is displayed
    function save() {
        // if this is the current source, or it has no title (occurs with click event), stop
        if ( $.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler) )
            return;

        // save current
        current = this;
        title = this.tooltipText;
        
        if ( settings(this).bodyHandler ) {
            helper.title.hide();
            var bodyContent = settings(this).bodyHandler.call(this);
            if (bodyContent.nodeType || bodyContent.jquery) {
                helper.body.empty().append(bodyContent)
            } else {
                helper.body.html( bodyContent );
            }
            helper.body.show();
        } else if ( settings(this).showBody ) {
            var parts = title.split(settings(this).showBody);
            helper.title.html(parts.shift()).show();
            helper.body.empty();
            for(var i = 0, part; (part = parts[i]); i++) {
                if(i > 0)
                    helper.body.append("<br/>");
                helper.body.append(part);
            }
            helper.body.hideWhenEmpty();
        } else {
            helper.title.html(title).show();
            helper.body.hide();
        }
        
        // if element has href or src, add and show it, otherwise hide it
        if( settings(this).showURL && $(this).url() )
            helper.url.html( $(this).url().replace('http://', '') ).show();
        else 
            helper.url.hide();
        
        // add an optional class for this tip
        helper.parent.addClass(settings(this).extraClass);

        // fix PNG background for IE
        if (settings(this).fixPNG )
            helper.parent.fixPNG();
            
        handle.apply(this, arguments);
    }
    
    // delete timeout and show helper
    function show() {
        tID = null;
        if ((!IE || !$.fn.bgiframe) && settings(current).fade) {
            if (helper.parent.is(":animated"))
                helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
            else
                helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade);
        } else {
            helper.parent.show();
        }
        update();
    }
    
    /**
     * callback for mousemove
     * updates the helper position
     * removes itself when no current element
     */
    function update(event)  {
        if($.tooltip.blocked)
            return;
        
        if (event && event.target.tagName == "OPTION") {
            return;
        }
        
        // stop updating when tracking is disabled and the tooltip is visible
        if ( !track && helper.parent.is(":visible")) {
            $(document.body).unbind('mousemove', update)
        }
        
        // if no current element is available, remove this listener
        if( current == null ) {
            $(document.body).unbind('mousemove', update);
            return; 
        }
        
        // remove position helper classes
        helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
        
        var left = helper.parent[0].offsetLeft;
        var top = helper.parent[0].offsetTop;
        if (event) {
            // position the helper 15 pixel to bottom right, starting from mouse position
            left = event.pageX + settings(current).left;
            top = event.pageY + settings(current).top;
            var right='auto';
            if (settings(current).positionLeft) {
                right = $(window).width() - left;
                left = 'auto';
            }
            helper.parent.css({
                left: left,
                right: right,
                top: top
            });
        }
        
        var v = viewport(),
            h = helper.parent[0];
        // check horizontal position
        if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
            left -= h.offsetWidth + 20 + settings(current).left;
            helper.parent.css({left: left + 'px'}).addClass("viewport-right");
        }
        // check vertical position
        if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
            top -= h.offsetHeight + 20 + settings(current).top;
            helper.parent.css({top: top + 'px'}).addClass("viewport-bottom");
        }
    }
    
    function viewport() {
        return {
            x: $(window).scrollLeft(),
            y: $(window).scrollTop(),
            cx: $(window).width(),
            cy: $(window).height()
        };
    }
    
    // hide helper and restore added classes and the title
    function hide(event) {
        if($.tooltip.blocked)
            return;
        // clear timeout if possible
        if(tID)
            clearTimeout(tID);
        // no more current element
        current = null;
        
        var tsettings = settings(this);
        function complete() {
            helper.parent.removeClass( tsettings.extraClass ).hide().css("opacity", "");
        }
        if ((!IE || !$.fn.bgiframe) && tsettings.fade) {
            if (helper.parent.is(':animated'))
                helper.parent.stop().fadeTo(tsettings.fade, 0, complete);
            else
                helper.parent.stop().fadeOut(tsettings.fade, complete);
        } else
            complete();
        
        if( settings(this).fixPNG )
            helper.parent.unfixPNG();
    }
    
})(jQuery);


/* **********************************************
     Begin script.js
********************************************** */

(function() {

    var $b = $('body');
    var $w = $(window);

    var $presents = $('#presents');

    if ($().datepicker) {
        $('.js-datepicker').datepicker({
            format: 'dd.mm.yyyy'
        });
    }

    $('.js-custom-select').customSelect();

    $b.on('click', '.input-wrap_date', function(e) {
        var $input = $(e.currentTarget).find('input');
        if ($input[0] !== e.target) {
            try {
                $input[0].focus();
            } catch(err) {};
        }
    });

    if ($presents.length) {
        var $presentsInfo = $('#presents-info');
        var $presentItems = $('.js-present-item');
        var $presentItemsCount = $('.js-present-item-count');

        $presentItemsCount.on('input change', function() {
            recount();
        });

        function recount() {
            var totalPrice = 0;
            var totalCount = 0;
            var info;

            $presentItems.each(function(i, item) {
                var $item = $(item);
                var $count = $item.find('.js-present-item-count');
                var price = parseInt($item.data('price')) || 0;
                var count = parseInt($count.val()) || 0;
                totalCount += count;
                totalPrice += price * count;
            });

            info = 'Выбрано ' + totalCount + ' призов на ' + totalPrice + ' баллов';
            $presentsInfo.html(info);
        }

        recount();

    }

    var $popups = $('.js-popup');
    var $popupOverlay  = $('#popup-overlay');

    $b.on('click', '#popup-overlay, .js-popup-close', function(e) {
        e.preventDefault();

        $popups.fadeOut(100);
        $popupOverlay.fadeOut(100);

        var href = document.location.href.replace('join', '').replace('complete', '');
        if ('history' in window && 'pushState' in window.history) {
            window.history.pushState({}, document.title, href);
        } else {
            document.location.href = href;
        }

    });

    if ($().tooltip) {
        $('.js-tooltip').tooltip({
            delay: 0
        });
    }

    var $addressFieldset = $('#address-fieldset');

    if ($addressFieldset.length) {
        var $addressFieldsetInputs = $addressFieldset.find(':input');
        var $addressType = $('.js-address-type-radio');
        $addressFieldsetInputs.each(function(i, input) {
            $(input).data('default', $(input).val());
        });

        $addressType.on('change', checkAddressType);
        checkAddressType();

        function checkAddressType() {
            var $radio = $addressType.filter(':checked');
            var type = $radio.data('type');

            if ($radio[0].value === 'old') {
                $addressFieldset.attr('disabled', true);
                $addressFieldsetInputs.each(function(i, input) {
                    $(input).val($(input).data('default'));
                });
            } else {
                $addressFieldset.attr('disabled', false);
            }
        }
        
    }

    var $agree = $('#agree');

    if ($agree.length) {
        var $button = $('#' + $agree.data('button'));

        $button.attr('disabled', !$agree.is(':checked'));

        $agree.on('change', function () {
            $button.attr('disabled', !$agree.is(':checked'));
        });
    }

})();