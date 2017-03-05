export default class IconLoader {
	static load(icon) {
		return new Promise(function(resolve, reject) {
			var image = new Image();
	        image.onload = function(){
	            resolve({ ... icon, iconImg: image });
	        }.bind(this);
					image.onerror = function(){
	            reject({message: "Can't load image with src " + icon.iconSrc});
	        }.bind(this)
	        image.src = icon.iconSrc;
		});
	}
}
