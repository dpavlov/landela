import 'whatwg-fetch'

export default class ConfigLoader {
	static load() {
		return fetch('/config.yaml')
      .then(function(response) {
        return response.text()
      });
	}
}
