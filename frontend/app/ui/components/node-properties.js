import React from 'react';
import { connect } from 'react-redux'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { purple500 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';

import { NODE_REMOVED } from '../../map/map-set'

export class NodeProperties extends React.Component {

  constructor(props) {
    super(props);
    props.mapSet.subscribe(this);
    this.state = {
      originName: props.node.name,
      name: props.node.name,
      originType: props.node.type,
      type: props.node.type,
    }
  }

  componentWillUnmount() {
    this.props.mapSet.unsubscribe(this);
  }

  onEvent(set, eType, target) {
    if (eType === NODE_REMOVED && target.id === this.props.node.id) {
      if (this.state.name !== this.state.originName) {
        this.props.node.changed('name', this.state.originName);
      }
      if (this.state.type !== this.state.originType) {
        this.props.node.changed('type', this.state.originType);
      }
    }
  }

  onNameChanged = (e) => {
    this.setState({name: e.target.value});
    this.props.node.name = e.target.value;
    this.props.updateMap && this.props.updateMap();
  }

  handleTypeChange = (event, index, value) => {
    this.setState({type: value});
    this.props.node.type = value;
    this.props.updateMap && this.props.updateMap();
  }

  handleDeselect = (e) => {
    this.props.onDeselect && this.props.onDeselect(this.props.node)
  }

  handleDelete = (e) => {
    this.props.onDelete && this.props.onDelete(this.props.node)
  }

  handleCancel = (e) => {
    this.props.node.name = this.state.originName;
    this.props.node.type = this.state.originType;
    this.setState({ name: this.state.originName, type: this.state.originType });
    this.props.updateMap && this.props.updateMap();
  }

  actions() {
    if (this.state.name !== this.state.originName || this.state.type !== this.state.originType) {
      return (
        <CardActions>
          <FlatButton label="Deselect" onTouchTap={this.handleDeselect}/>
          <FlatButton label="Delete" secondary={true} onTouchTap={this.handleDelete}/>
          <FlatButton label="Cancel" onTouchTap={this.handleCancel}/>
        </CardActions>
      );
    } else {
      return (
        <CardActions>
          <FlatButton label="Deselect" onTouchTap={this.handleDeselect}/>
          <FlatButton label="Delete" secondary={true} onTouchTap={this.handleDelete}/>
        </CardActions>
      );
    }
  }

  render() {
    return (
        <Card key={this.props.node.id} style={{marginBottom: '5px'}}>
          <CardHeader
            title={this.state.name}
            subtitle={'Description'}
            avatar={ <Avatar size={50} backgroundColor={purple500}>R</Avatar> }
            actAsExpander={true}
            showExpandableButton={true}
          />
          {
            this.actions()
          }
          <CardText expandable={true}>
            <TextField hintText="Name" floatingLabelText="Name" value={this.state.name} onChange={this.onNameChanged}/>
            {
              this.properties(this.props.node)
            }
            <SelectField floatingLabelText="Type" value={this.state.type} fullWidth={true} onChange={this.handleTypeChange}>
              {
                this.props.nodeTypes.all().map(nt => <MenuItem key={nt} value={nt} primaryText={this.props.nodeTypes.lookup(nt).name}/>)
              }
            </SelectField>
          </CardText>
        </Card>
    );
  }

  properties = (node) => {
    return (
      <List>
      {
        node.ports.map(port => <ListItem key={port.id} primaryText={port.name}/>)
      }
      </List>
    )
  }
}

const mapStateToProps = (state) => {
	return {
		nodeTypes: state.icons.icons
	}
}

const mapDispatchToProps = (dispatch) => {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps, null)(NodeProperties);
