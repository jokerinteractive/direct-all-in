(function () {
  var
    i,
    titlePopup,
    popup = document.querySelector('.popup'),
    form = popup.querySelector('.form'),
    close = popup.querySelector('.popup__close'),
    btn = popup.querySelector('.btn'),
    callback = document.querySelector('.header__phone'),
    orderBtn = document.querySelectorAll('.price-list__list--btn');

  function closePopup() {
    popup.classList.remove('popup--isopen');
    document.body.classList.remove('overlay');
    form.title.value = '';
  }

  function openPopup(e) {
    e.preventDefault();
    popup.classList.add('popup--isopen');
    document.body.classList.add('overlay');
    if (this.dataset.title) {
      titlePopup = this.dataset.title;
      form.title.value = titlePopup;
    }

  }

  close.addEventListener('click', closePopup);
  callback.addEventListener('click', openPopup);

  for (i=0; i<orderBtn.length; i++) {
    orderBtn[i].addEventListener('click', openPopup);
  }

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 27 && popup.classList.contains('popup--isopen')) {
      closePopup();
    }
  }, false);
})();
