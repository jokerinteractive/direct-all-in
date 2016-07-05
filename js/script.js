/*
particlesJS.load('particles-js', 'js/particles.json', function() {
  console.log('callback - particles.js config loaded');
});
*/

var sliderModule = (function () {

  var init = function () {
    _setUpListeners();
  };

  var _setUpListeners = function () {
    $('.slider-nav').on('click', _moveSlides);
  };

  var _moveSlides = function (e) {
    e.preventDefault();

    var slider      = $('.slider'),
        slides      = $(slider.children('.slide')),
        slideWidth  = parseInt($(slides[0]).css('width')),
        slideMargin = 60,
        moveSide    = e.currentTarget.innerText;

    if (moveSide === 'next') {

      //проверка, а не с краю ли мы
      if (slides.last().hasClass('active')) {
        console.log('Крайний справа');
        return false;
      }

      $.each(slides, function(index, slide) {
        var margin = parseInt($(slide).css('margin-left')),
            newMargin = margin - slideWidth - slideMargin;

        $(slide).removeClass('active');
        $(slide).animate({
          'margin-left': margin + 'px',
          'margin-left': newMargin + 'px'},
          500, function () {
            if (newMargin === -330 || newMargin === 30) {
              $(slide).addClass('active');
            }
          });
      });

    }

    if (moveSide === 'prev') {

      //проверка, а не с краю ли мы
      if (slides.first().hasClass('active')) {
        console.log('Крайний слева');
        return false;
      }

      $.each(slides, function(index, slide) {
        var margin = parseInt($(slide).css('margin-left')),
            newMargin = margin + slideWidth + slideMargin;

        $(slide).removeClass('active');
        $(slide).animate({
          'margin-left': margin + 'px',
          'margin-left': newMargin + 'px'},
          500, function () {
            if (newMargin === -330 || newMargin === 30) {
              $(slide).addClass('active');
            }
          });
      });

    }
  };

  return {
    init: init
  };

})();

if ($('.slider-nav')) {
  sliderModule.init();
}

console.log("script works");
$("a").mPageScroll2id();
