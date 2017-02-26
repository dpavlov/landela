export default class DomUtils {
	static height(el) {
		try {
 			return parseInt(window.getComputedStyle(el, null).getPropertyValue('height').replace("px", ""));
		} catch(e) {
 			return parseInt(el.currentStyle.height.replace("px", ""));
		}
	}
	static width(el) {
		try {
 			return parseInt(window.getComputedStyle(el, null).getPropertyValue('width').replace("px", ""));
		} catch(e) {
 			return parseInt(el.currentStyle.width.replace("px", ""));
		}
	}

	static offsetLeft( elem ) {
    var offsetLeft = 0;
    do {
      if ( !isNaN( elem.offsetLeft ) )
      {
          offsetLeft += elem.offsetLeft;
      }
    } while( elem = elem.offsetParent );
    return offsetLeft;
	}

	static offsetTop( elem ) {
    var offsetTop = 0;
    do {
      if ( !isNaN( elem.offsetTop ) )
      {
          offsetTop += elem.offsetTop;
      }
    } while( elem = elem.offsetParent );
    return offsetTop;
	}
}
