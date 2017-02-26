import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import configureStore from './store';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { purple500 } from 'material-ui/styles/colors';

import Bootstrap from './ui/components/bootstrap'

import injectTapEventPlugin from 'react-tap-event-plugin';

window.addEventListener('DOMContentLoaded', function() {

	injectTapEventPlugin();

	const muiTheme = getMuiTheme(lightBaseTheme, {
	  	palette: {
	    	primary1Color: purple500
	  	}
	});

	ReactDOM.render(
		<Provider store={configureStore()}>
			<MuiThemeProvider muiTheme={muiTheme}>
				<Bootstrap/>
			</MuiThemeProvider>
		</Provider>, 
	  	document.getElementById('app')
	);
}, false);