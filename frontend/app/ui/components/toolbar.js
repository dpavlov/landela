import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';

export default class Toolbar extends React.Component {
	handleDrawMarkerButton = (newState) => {
    return (e) => {
      this.props.onDrawMarkerStateChanged && this.props.onDrawMarkerStateChanged(newState);
    }
  }
	tabs() {
		return (
			<Tabs style={{width: '400px', marginTop: '15px', marginRight: '150px'}} initialSelectedIndex={2}>
    		<Tab label="Cities" ></Tab>
    		<Tab label="Sites" ></Tab>
				<Tab label="Equipments" ></Tab>
			</Tabs>
		);
	}
	iconElementRight() {
		let rightButtons = this.props.isDrawMarkerDisplayed ? (
			 <RaisedButton label="Hide draw marker" secondary={true} onTouchTap={this.handleDrawMarkerButton(false).bind(this)}/>
		) : (
			 <RaisedButton label="Show draw marker" secondary={true} onTouchTap={this.handleDrawMarkerButton(true).bind(this)}/>
		);
		return <div style={{marginRight: '50px', marginTop: '10px'}}> {rightButtons} </div> ;
	}
	render() {
		return (
			<div className='toolbar'>
		 		<AppBar title={"Landela"} iconElementRight={this.iconElementRight()} style={{flexWrap: 'wrap'}}>
					{this.tabs()}
				</AppBar>
			</div>
		);
	}
}
