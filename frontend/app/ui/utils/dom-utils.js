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
}