import React from 'react';

import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

export default class Navigator extends React.Component {
	constructor() {
    	super();
  	}

  	onMove(direction){ 
  		return function(event) {
  			this.props.onMove && this.props.onMove(direction);
  		}
  	}
	render() {
		return (
			<div id='map-navigator' style={{height: 150, width: 120}}>
				<div className="top-row">
					<FloatingActionButton mini={true} className="arrow-up" onTouchTap={this.onMove("up").bind(this)}>
	      				<ArrowUp  />
	    			</FloatingActionButton>
    			</div>
    			<div className="middle-row">
					<FloatingActionButton mini={true} className="arrow-left" onTouchTap={this.onMove("lt").bind(this)}>
	      				<ArrowLeft  />
	    			</FloatingActionButton>
	    			<FloatingActionButton mini={true} className="arrow-right" onTouchTap={this.onMove("rt").bind(this)}>
	      				<ArrowRight  />
	    			</FloatingActionButton>
    			</div>
    			<div className="bottom-row">
	    			<FloatingActionButton mini={true} className="arrow-down" onTouchTap={this.onMove("dw").bind(this)}>
	      				<ArrowDown />
	    			</FloatingActionButton>
	    		</div>
			</div>
		);
	}
}