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

export default class SlotsAllocator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      busySlots: this.props.busySlots
    }
  }
  handleFreeSlotAssigned = (nodeType) => {
    return (event, index, value) => {
      let newSlots = {... this.state.busySlots};
      newSlots[nodeType] = value;
      this.setState({busySlots: newSlots})
      this.props.onBusySlotsChanged && this.props.onBusySlotsChanged(newSlots);
    }
  }
  checkSlotFree(slotNr) {
    for (var key in this.state.busySlots) {
      let busySlot = this.state.busySlots[key];
      if (busySlot === slotNr) {
        return false;
      }
    }
    return true;
  }
  findBusySlotNrForType(nodeType) {
    return this.state.busySlots[nodeType] ? this.state.busySlots[nodeType] : 0;
  }
  renderFreeSlots = (nt) => {
    let freeSlots = [];
    let selectedSlot = this.findBusySlotNrForType(nt);
    for (var i = 1; i < 11; i++) {
      if (this.checkSlotFree(i) || selectedSlot === i) {
        freeSlots.push({nr: i, label: "Slot " + i});
      }
    }
    return (
      <SelectField floatingLabelText="Free Slots" style={{position: 'relative', top: '-10px'}} value={selectedSlot} onChange={this.handleFreeSlotAssigned(nt)}>
        <MenuItem value={0} primaryText="Unassigned" />
        {
          freeSlots.map(s => <MenuItem key={s.nr} value={s.nr} primaryText={s.label} />)
        }
      </SelectField>
    );
  }
	render() {
		return (
          <Table selectable={false} height={"300"}>
            <TableBody displayRowCheckbox={false}>
            {
              this.props.nodeTypes.all().map(nt => {
                 let props = this.props.nodeTypes.lookup(nt);
                  return (
                    <TableRow key={props.code}>
                      <TableRowColumn>{props.name}</TableRowColumn>
                      <TableRowColumn>{this.renderFreeSlots(nt)}</TableRowColumn>
                    </TableRow>
                  );
              })
            }
            </TableBody>
          </Table>
		);
	}
}
