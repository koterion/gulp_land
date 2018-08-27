$(() => {
  $('.select').cntr({select: true})

  $('.select + .cntr-ls li').on('click', () => {
    $('input[name=phone]').addClass('valid')
  })

  const form = $('.form')
  const inputForCheck = $('.input')
  const check = {
    'phone': /[0-9]{6,15}$/,
    'email': /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
    'name': /^[^\d+=()[\]{}\\/^$|?*!@#%:;&,_.]{3,30}$/,
    'last_name': /^[^\d+=()[\]{}\\/^$|?*!@#%:;&,_.]{3,30}$/,
    'promo': /[0-9]{3,3}$/
  }

  inputForCheck.on('change', () => {
    validate(check[$(this).attr('name')], $(this))
  })

  form.on('submit', event => {
    event.preventDefault()

    let that = $(this)
    let data = that.serialize()
    let url = that.attr('action')
    let btn = that.find('button')
    let curTextBtn = btn.text()
    let errorMessage = that.find('p.error')
    let input = that.find('.input')
    let promoInput = that.find('input[name=promo]')
    let country = that.find('input[name=country]')
    let checkInp = that.find('input[name="check"]')
    let valid = true

    if (!checkInp.prop('checked')) {
      checkInp.addClass('error')
      valid = false
    } else {
      checkInp.removeClass('error')
    }

    input.map(() => {
      let prop = validate(check[$(this).attr('name')], $(this))
      if (!prop) {
        valid = false
      }
    })

    if (promoInput.val() !== undefined && promoInput.val().length > 0) {
      let prop = validate(check[promoInput.attr('name')], promoInput)
      if (!prop) {
        valid = false
      }
    } else {
      data = data.replace('&promo=', '')
    }

    if (country.val() !== undefined && country.val().length > 0) {
      country.prevAll('.select').closest('.indent').addClass('tooltip')
    } else {
      country.prevAll('.select').closest('.indent').removeClass('tooltip')
      valid = false
    }

    if (valid) {
      btn.text('Wait').attr('disabled', 'disabled')
      errorMessage.text('')

      $.ajax({
        method: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        success: request => {
          let r = request['exist']
          let u = request['url']
          if (!r) {
            btn.removeAttr('disabled', 'disabled').text(curTextBtn)
            setTimeout(() => {
              location.replace(u)
            }, 5000)
          } else {
            errorMessage.text(request['errorMessage'])
            btn.removeAttr('disabled', 'disabled').text(curTextBtn)
          }
        },
        error: () => {
          errorMessage.text('Something went wrong! Please try again later.')
          btn.removeAttr('disabled').text(curTextBtn)
        }
      })
    }
  })

  function validate (pattern, selector) {
    let c = selector.val()
    if (!(c.search(pattern) === 0) && c.length > 0 || c.replace(/\s/g, '') === '') {
      selector.addClass('error').removeClass('valid')
      return false
    }
    selector.removeClass('error').addClass('valid')
    return true
  }
})
