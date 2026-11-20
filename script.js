$(function () {
  $('#y').text(new Date().getFullYear());

  /* ---------- Countdown ---------- */
  var $cd = $('#countdown');
  var launch = new Date($cd.data('launch')).getTime();
  var $u = {
    d: $cd.find('[data-u="d"]'),
    h: $cd.find('[data-u="h"]'),
    m: $cd.find('[data-u="m"]'),
    s: $cd.find('[data-u="s"]')
  };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var timer;

  function setNum($el, val) {
    if ($el.text() === val) return;
    $el.text(val).stop(true, true).css({ opacity: 0.35 }).animate({ opacity: 1 }, 300);
  }

  function tick() {
    var diff = Math.max(0, launch - Date.now());
    var s = Math.floor(diff / 1000);
    setNum($u.d, pad(Math.floor(s / 86400)));
    setNum($u.h, pad(Math.floor(s % 86400 / 3600)));
    setNum($u.m, pad(Math.floor(s % 3600 / 60)));
    setNum($u.s, pad(s % 60));
    if (diff === 0) {
      clearInterval(timer);
      $('#live').prop('hidden', false).hide().fadeIn(600);
    }
  }
  tick();
  timer = setInterval(tick, 1000);

  /* ---------- Drifting clouds ---------- */
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function drift($c) {
    var w = $(window).width(), h = $(window).height();
    var cw = $c.outerWidth(), ch = $c.outerHeight();
    $c.animate({
      left: rand(-cw * 0.5, w - cw * 0.5),
      top: rand(-ch * 0.5, h - ch * 0.5),
      opacity: rand(0.45, 0.9)
    }, {
      duration: rand(14000, 24000),
      easing: 'swing',
      complete: function () { drift($c); }
    });
  }

  $('.cloud').each(function () {
    var $c = $(this);
    var w = $(window).width(), h = $(window).height();
    $c.css({
      left: rand(-$c.outerWidth() * 0.3, w - $c.outerWidth() * 0.7),
      top: rand(-$c.outerHeight() * 0.3, h - $c.outerHeight() * 0.7)
    }).hide().fadeIn(1500);
    if (!reduceMotion) drift($c);
  });
});
