$(function() {
    $('.select').cntr({select:true});

    $('.select + .cntr-ls li').on('click',function(){
        $('input[name=phone]').addClass('valid');
    });

    var form     = $('.form'),
        input    = $('.input'),
        check    = {
            'phone'     : /[0-9]{6,15}$/,
            'email'     : /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
            'name'      : /^[^\d+=()\[\]{}\\/^$|?*!@#%:;&,_.]{3,30}$/,
            'last_name' : /^[^\d+=()\[\]{}\\/^$|?*!@#%:;&,_.]{3,30}$/,
            'promo'     : /[0-9]{3,4}$/
        };

    function validate(a, b) {
        var c = b.val();
        if (!c.search(a) == 0 && c.length > 0 || c.replace(/\s/g,'') == '') {
            b.addClass('error').removeClass('valid');
            return false;
        } else {
            b.removeClass('error').addClass('valid');
            return true;
        }
    }

    input.on('change',function(){
        validate(check[$(this).attr('name')], $(this));
    });
});