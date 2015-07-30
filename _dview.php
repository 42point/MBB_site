<table class="print-coupon">
    <tr>
        <td class="print-coupon__header">
            Купон для участия в программе<br>
            Мишлен Бонус*
        </td>
    </tr>
    <tr>
        <td class="print-coupon__hr"></td>
    </tr>
    <tr>
        <td>
            <table cellpadding=0 cellspacing=0>
                <tr>
                    <td class="print-coupon__text l">
                        <p style="margin-top: 0;">
                            Мишлен Бонус -<br>
                    
                            еще один способ повысить <br>
                            эффективность грузоперевозок <br>
                        </p>
                        <p>
                            <strong>Срок действия купона</strong>
                            Настоящий купон необходимо активировать<br>
                            до 16 марта 2013
                        </p>
                        <p>
                            <strong>Информация об участии</strong>
                            Для участия в программе зарегистрируйте свой<br>
                            личный кабинет на сайте <a href="http://www.michelin-bonus.ru">www.michelin-bonus.ru</a>
                        </p>
                    </td>

                    <td class="print-coupon__form l">
                        <div class="print-coupon__form__label">Название шины</div>
                        <div class="print-coupon__form__value"><?php echo CHtml::encode($this->goodName ); ?></div>
                        <div class="print-coupon__form__hr"></div>

                        <div class="print-coupon__form__label">Дилер Мишлен</div>
                        <div class="print-coupon__form__value"><?php echo CHtml::encode($this->dealerName ); ?></div>
                        <div class="print-coupon__form__hr"></div>

                        <div class="print-coupon__form__code">
                            <?php echo CHtml::encode($data->code_code); ?>
                        </div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td class="print-coupon__hint">*Для активации купона необходимо внести данные с настоящего купона</td>
    </tr>
</table>
<?php
if ($this->coupon%3 === 0)
{
    echo "<pagebreak  />";
}
$this->coupon++;
?>
