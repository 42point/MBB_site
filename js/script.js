(function() {

    var $b = $('body');
    var $w = $(window);

    var $presents = $('#presents');

    if ($().datepicker) {
        $('.js-datepicker').datepicker({
            format: 'dd.mm.yyyy'
        });
    }

    if ($().customSelect) {
        $('.js-custom-select').customSelect();
    }

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

    $('.tire-request-form').each(function (i, form) {
        form = $(form);
        var hiddenInputTpl = '<input type="hidden" name="number[]">';
        var submit = form.find('.tire-request-form__submit');
        var button = form.find('.tire-request-form__add-button');

        form.on('click', '.tire-request-form__reset', function (evt) {
            evt.preventDefault();

            form.find('.tire-request-form__input').val('').focus();
            form.find('input[type="hidden"]').remove();
            button.attr('disabled', true);
            countTotal();
        });

        form.on('click', '.tire-request-form__add-button', function (evt) {
            evt.preventDefault();
            var button = $(evt.currentTarget);
            var row = button.closest('.form-row');
            var input = row.find('.tire-request-form__input');
            if (button.attr('disabled')) {
                return;
            }

            var hiddenInput = $(hiddenInputTpl);
            hiddenInput.val(input.val());
            hiddenInput.appendTo(form);

            input.val('').focus();
            button.attr('disabled', true);
            countTotal();
            validate();
        });

        form.on('input', '.tire-request-form__input', function (evt) {
            var input = $(evt.currentTarget);
            var row = input.closest('.form-row');
            var error = row.find('.form-row__message_error');
            var button = row.find('.btn');

            error.remove();
            button.attr('disabled', !input.val().trim());
            validate();
        });

        function getHiddenInputs() {
            return form.find('input[type="hidden"]');
        };

        function countTotal() {
            var inputs = getHiddenInputs();
            form.find('.tire-request-form__total-value').html(inputs.length);
        };

        function validate() {
            var inputs = getHiddenInputs();
            var valid = true;
            if (inputs.length < 5) {
                valid = false;
            }
            if (valid) {
                inputs.each(function (i, input) {
                    if (input.value.trim() === 0) {
                        valid = false;
                    }
                });
            }

            submit.attr('disabled', !valid);
        };

    });

})();