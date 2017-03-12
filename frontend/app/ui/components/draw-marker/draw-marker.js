import React from 'react';
import DomUtils from '../../utils/dom-utils';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import Menu from 'material-ui/svg-icons/navigation/menu';
import Add from 'material-ui/svg-icons/content/add';
import Grid from 'material-ui/svg-icons/image/grid-on';
import Avatar from 'material-ui/Avatar';
import { purple500, purple900 } from 'material-ui/styles/colors';

import SlotsAllocator from './slots-allocator';

export default class DrawMarker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: { type: 'router', name: 'new' },
      slots: {
        '1': [
          {nr: 1, style: { top: 0, left: 0 }},
          {nr: 2, style: { top: 0, left: 0 }},
          {nr: 3, style: { top: 0, left: 0 }},
          {nr: 4, style: { top: 0, left: 0 }},
          {nr: 5, style: { top: 0, left: 0 }}
        ],
        '2': [
          {nr: 6, style: { top: 0, left: 0 }},
          {nr: 7, style: { top: 0, left: 0 }},
          {nr: 8, style: { top: 0, left: 0 }},
          {nr: 9, style: { top: 0, left: 0 }}
        ]
      },
      drawMarkerStyle: { top: 0, left: 0 },
      hLineStyle: { top: 0, left: 0 },
      vLineStyle: { top: 0, left: 0 },
      drawMarkerDlgOpen: false,
      busySlots: this.props.settings['slots-allocation'],
      nodeTypes: this.props.settings['node-types'],
      buttons: [
        {code: 'menu', left: 0, top: 0, icon: <Menu/>},
        {code: 'align', left: 0, top: 0, icon: <Grid/>},
        {code: 'add', left: 0, top: 0, icon: <Add/>}
      ]
    };
  }
  componentWillReceiveProps(nextProps) {
    this.handleResize();
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this), false);
    this.handleResize();
    this.recalculateButtonPositions(80, -1.5 * Math.PI);
    let l1Slots = this.recalculateSlotPositions('1', - Math.PI / 4 - Math.PI / 18, 110, 0.75);
    let l2Slots = this.recalculateSlotPositions('2', - Math.PI / 4 + Math.PI / 36 - Math.PI / 144, 150, 0.6);
    this.setState({ slots: { '1': l1Slots, '2': l2Slots } });
  }
  recalculateButtonPositions(radius, initAngle) {
    let buttons = [];
    let steps = this.state.buttons.length;
    let xCenter = 0;
    let yCenter = 0;
    for (var i = 0; i < steps; i++) {
      let x = (xCenter + radius * Math.cos(initAngle + Math.PI * i / (steps - 1))) - 20;
      let y = (yCenter + radius * Math.sin(initAngle + Math.PI * i / (steps - 1))) - 20 ;
      buttons.push({...this.state.buttons[i], left: x, top: y});
    }
    this.setState({buttons: buttons});
  }
  recalculateSlotPositions(line, initAngle, radius, stepMul) {
    let slots = [];
    let steps = this.state.slots[line].length;
    let xCenter = 0;
    let yCenter = 0;
    for (var i = 0; i < steps; i++) {
      let x = (xCenter + radius * Math.cos(initAngle + stepMul * Math.PI * i / steps)) - 22;
      let y = (yCenter + radius * Math.sin(initAngle + stepMul * Math.PI * i / steps)) - 22;
      let slot = this.state.slots[line][i];
      slots.push({ ...slot, style: {left: x, top: y} });
    }
    return slots;
  }
  handleResize() {
    if (this.props.container && this.refs.vline && this.refs.hline) {
      let width = DomUtils.width(this.props.container);
      let height = DomUtils.height(this.props.container);
      let vLineWidth = DomUtils.width(this.refs.vline);
      let vLineHeight = DomUtils.height(this.refs.vline);
      let hLineWidth = DomUtils.width(this.refs.hline);
      let hLineHeight = DomUtils.height(this.refs.hline);
      this.setState({
        drawMarkerStyle: {top: height / 2, left: width / 2},
        hLineStyle: { top: - vLineWidth / 2, left: - hLineWidth / 2 },
        vLineStyle: { top: - vLineHeight / 2, left: - hLineHeight/ 2 }
      });
    }
  }
  handleActionButton = (button) => {
    return (e) => {
      if (button.code === 'add') {
        this.props.onAdd && this.props.onAdd(this.state.config.type, this.state.config.name);
      } else if (button.code === 'menu') {
        this.setState({drawMarkerDlgOpen: true});
      } else if (button.code === 'align') {
        this.props.onGridAlign && this.props.onGridAlign();
      }
    }
  }
  handleClose = () => {
    this.setState({drawMarkerDlgOpen: false});
  };
  handleNameChange = (event) => this.setState({config: {...this.state.config, name: event.target.value}});
  handleTypeChange = (event, index, value) => this.setState({config: {...this.state.config, type: value}});
  handleSlotActivated = (slot, aType) => {
    return (e) => {
      this.setState({config: {...this.state.config, type: aType}});
    };
  }
  handleBusySlotsChanged = (slots) => {
    this.setState({busySlots: slots});
  }
  renderButton(button) {
    return (
      <FloatingActionButton
        key={button.code}
        mini={true}
        secondary={true}
        className='draw-marker-button'
        style={{left: button.left, top: button.top}}
        onTouchTap={this.handleActionButton(button)}>
        {button.icon}
      </FloatingActionButton>
    );
  }
  findNodeTypeForSlotNr(slotNr){
    for (var key in this.state.busySlots) {
      let busySlot = this.state.busySlots[key];
      if (busySlot === slotNr) {
        return key;
      }
    }
    return null;
  }
  findTypeCode(aType) {
    for (var nt in this.state.nodeTypes) {
      if (nt === aType) {
        return this.state.nodeTypes[nt].code;
      }
    }
    return aType.substring(0, 2);
  }
  renderSlot(line, index, slot) {
    let aType = this.findNodeTypeForSlotNr(slot.nr);
    if (!aType) {
      return (<div key={index} className='slot empty-slot' style={slot.style}></div>);
    } else {
      let isActiveType = this.state.config.type === aType;
      let classes = isActiveType
        ? 'slot allocated-slot active-slot'
        : 'slot allocated-slot'
      return (
        <div key={line + '-' + index} className={classes} style={slot.style} onClick={this.handleSlotActivated(slot, aType)}>
          <Avatar backgroundColor={isActiveType ? purple900 : purple500} style={{fontSize: '10px'}}>
            { this.findTypeCode(aType) }
          </Avatar>
        </div>
      );
    }
  }
  renderSlots(line, slots) {
    return slots.map((slot, index) => this.renderSlot(line, index, slot))
  }
	render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={this.handleClose}/>,
      <FlatButton label="Save" primary={true} keyboardFocused={true} onTouchTap={this.handleClose}/>
    ];
		return (
			<div id='draw-marker' ref='drawMarker' style={this.state.drawMarkerStyle}>
        {
          this.state.buttons.map(b => this.renderButton(b))
        }
        {
          this.renderSlots('1', this.state.slots['1'])
        }
        {
          this.renderSlots('2', this.state.slots['2'])
        }
        <div className="vline" ref='vline' style={this.state.vLineStyle}></div>
        <div className="hline" ref='hline' style={this.state.hLineStyle}></div>
        <div className="circle"></div>
        <Dialog
          title="Draw marker"
          actions={actions}
          modal={false}
          open={this.state.drawMarkerDlgOpen}
          onRequestClose={this.handleClose}
        >
          <SelectField floatingLabelText="Active Type" value={this.state.config.type} fullWidth={true} onChange={this.handleTypeChange}>
            {
              Object.keys(this.state.nodeTypes).map(nt => <MenuItem key={nt} value={nt} primaryText={this.state.nodeTypes[nt].name}/>)
            }
          </SelectField>
          <TextField hintText="Name" floatingLabelText="Name" floatingLabelFixed={true} fullWidth={true} defaultValue={this.state.config.name} onChange={this.handleNameChange}/>
          <SlotsAllocator busySlots={this.state.busySlots} nodeTypes={this.state.nodeTypes} onBusySlotsChanged={this.handleBusySlotsChanged}/>
        </Dialog>
			</div>
		);
	}
}
