const burgerId = '.js-burger'
const navId = '.js-nav'
const elements = burgerId + ', ' + navId

$(burgerId).on('click', e => {
  e.preventDefault(e)
  $(burgerId).hasClass('js-active') ? $(elements).removeClass('js-active') : $(elements).addClass('js-active')
})

$(document).mouseup(e => { // событие клика по веб-документу
  let div = $(navId) // тут указываем ID элемента
  if (!div.is(e.target) && // если клик был не по нашему блоку
     div.has(e.target).length === 0 && !$(burgerId).is(e.target)) { // и не по его дочерним элементам
    $(elements).removeClass('js-active') // скрываем его
  }
})
