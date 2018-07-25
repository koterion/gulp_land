var burger_id = '.js-burger',
    nav_id    = '.js-nav',
    elements  = burger_id + ', ' + nav_id;

$(burger_id).on('click', function(e){
    e.preventDefault(e);
    $(burger_id).hasClass('js-active') ? $(elements).removeClass('js-active') : $(elements).addClass('js-active');
});

$(document).mouseup(function (e){ // событие клика по веб-документу
    var div = $(".js-nav"); // тут указываем ID элемента
    if (!div.is(e.target) // если клик был не по нашему блоку
        && div.has(e.target).length === 0 && !$(burger_id).is(e.target)) { // и не по его дочерним элементам
        $(elements).removeClass("js-active"); // скрываем его
    }
});