import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { purple500 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';

import { NODE_REMOVED } from '../../map/map-set'

export default class NodeProperties extends React.Component {

  constructor(props) {
    super(props);
    props.mapSet.subscribe(this);
    this.state = {
      originName: props.node.name,
      name: props.node.name
    }
  }

  componentWillUnmount() {
    this.props.mapSet.unsubscribe(this);
  }

  onEvent(set, eType, target) {
    if (eType === NODE_REMOVED && target.id === this.props.node.id) {
      if (this.state.name !== this.state.originName) {
        this.props.node.changed('name', this.state.originName)
      }
    }
  }

  onNameChanged = (e) => {
    this.setState({name: e.target.value});
    this.props.node.name = e.target.value;
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
    this.setState({ name: this.state.originName });
    this.props.updateMap && this.props.updateMap();
  }

  actions() {
    if (this.state.name !== this.state.originName) {
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
            <TextField hintText="Name" floatingLabelText="Name" value={this.props.node.name} onChange={this.onNameChanged}/>
            {
              this.properties(this.props.node)
            }
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
