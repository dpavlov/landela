import React from 'react';
import AppBar from 'material-ui/AppBar';

export default class Toolbar extends React.Component {
	render() {
		return (
			<div className='toolbar'>
		 		<AppBar title={"Network"} />
			</div>
		);
	}
}
