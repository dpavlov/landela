import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';

export default class Toolbar extends React.Component {
	state = {
		activeMapLayer: 'equipments'
	}
	handleDrawMarkerButton = (newState) => {
    return (e) => {
      this.props.onDrawMarkerStateChanged && this.props.onDrawMarkerStateChanged(newState);
    }
  }
	handleTabSelected = (value) => {
		this.setState({activeMapLayer: value});
		this.props.onMapLayerChanged && this.props.onMapLayerChanged(value);
	}
	tabs() {
		return (
			<Tabs style={{width: '400px', marginTop: '15px', marginRight: '150px'}} initialSelectedIndex={2} onChange={this.handleTabSelected}>
    		<Tab label="Cities" value={'cities'}></Tab>
    		<Tab label="Sites"  value={'sites'}></Tab>
				<Tab label="Equipments" value={'equipments'}></Tab>
			</Tabs>
		);
	}
	iconElementRight() {
		let rightButtons = this.props.isDrawMarkerDisplayed ? (
			 <RaisedButton label="Hide draw marker" secondary={true} onTouchTap={this.handleDrawMarkerButton(false).bind(this)}/>
		) : (
			 <RaisedButton label="Show draw marker" secondary={true} onTouchTap={this.handleDrawMarkerButton(true).bind(this)}/>
		);
		return this.state.activeMapLayer === 'equipments' ? (
			<div style={{marginRight: '50px', marginTop: '10px'}}> {rightButtons} </div>
		) : null;
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
