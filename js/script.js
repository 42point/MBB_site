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
            $('#send-present').prop('disabled', totalPrice <= 49);
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
        var button = form.find('.tire-request-form__add-button');
        var positionButton = form.find('.tire-request-form__add-position-button');
        var inputs = form.find('select');

        var submitRow = form.find('.form-row_submit');
        var template = form.find('script[type="text/template"]');

        form.on('change', ':input', function () {
            validate();
        });

        inputs.on('change', function () {
            validate();
        });

        positionButton.on('click', function (evt) {
            evt.preventDefault();
            addRow();
        });

        addRow();

        function validate() {
            var rows = form.find('.form-row:not(.form-row_submit)');
            var count = 0;

            rows.each(function (i, row) {
                var model = $('.tire-request-form__model', row).val();
                var quantity = Number($('.tire-request-form__quantity', row).val());
                if (model) {
                    count += quantity;
                }
            });

            var valid = count >= 5;
            button.attr('disabled', !valid);
        };

        function addRow() {
            var row = $(template.html());
            row.insertBefore(submitRow);
            row.find('.js-customselect').customSelect();
        }

    });

    $('.disable-on-submit').on('submit', function (evt) {
        if (!evt.defaultPrevented) {
            var button = $(evt.target).find(':input[type="submit"]');
            button.attr('disabled', true);
        }
    });

    if ($('#map').length) {
        var wrap = $('#map-wrap');
        var outlets = wrap.data('outlets');

        ymaps.ready(function () {
            var DEFAULT_MAP_ZOOM = 4;
            var center = [59.18579387, 58.37602542];

            var map = window.map = new ymaps.Map('map', {
                center: center,
                zoom: DEFAULT_MAP_ZOOM
            });
            var input = $('#map-input');

            input.on('input', function () {
                var val = input.val().trim();
                if (!val) {
                    showAll();
                } else {
                    filter(val);
                }
            });

            showAll();

            function filter(val) {
                val = val.toLowerCase();
                map.geoObjects.removeAll();
                outlets.forEach(function (outlet) {
                    var city = outlet.city.toLowerCase();
                    addPlacemark(outlet, city.indexOf(val) !== -1);
                });
            }

            function showAll() {
                map.geoObjects.removeAll();
                outlets.forEach(function (outlet) {
                    addPlacemark(outlet, true)
                });
            }

            function addPlacemark(outlet, isActive) {
                var iconColor = isActive ? '#0095b6' : '#ccc';

                var pm = new ymaps.Placemark(outlet.coords, {
                    balloonContentHeader: outlet.city,
                    balloonContent: outlet.description
                }, {
                    preset: 'islands#dotIcon',
                    iconColor: iconColor
                });
                map.geoObjects.add(pm);
            }
        })
    }

        // this.initMap = function () {
        //     var center = this.data.flatCoords || rostovCoords;
        //     window.map = this.map = new ymaps.Map('map', {
        //         center: center,
        //         zoom: DEFAULT_MAP_ZOOM
        //     });

        //     if (this.data.flatCoords) {
        //         this.addPlacemark(this.data.flatCoords);
        //     }
        // }

        // this.after('initialize', function () {
        //     this.address = this.select('addressSel');
        //     this.coords = this.select('coordsSel');
        //     this.on(this.address, 'change', this.onAddressChange);
        //     this.data = this.$node.data();

        //     var that = this;

        //     window.onload = function () {
        //         setTimeout(function () {
        //             that.initMap();
        //         }, 1000);
        //     }
        // });









})();