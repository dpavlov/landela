var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
          return setTimeout(callback, 1);
        };
let easeInOutCubic = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
export default class Animation {
  static animate(_update, duration, _done) {
    var start = new Date().getTime();
    var end = start + duration;
    var step = function() {
      var timestamp = new Date().getTime();
      var progress = Math.min((duration - (end - timestamp)) / duration, 1);
      _update(easeInOutCubic(Math.min((duration - (end - timestamp)) / duration, 1)));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        _done && _done();
      }
    };
    return step();
  };
}
