import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { purple500 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';

export default class NodeProperties extends React.Component {

  constructor(props) {
    super(props);
  }

  title = (node) => {
    return node.name;
  }

  description = (node) => {
    return "Properties for " + node.name;
  }

  icon = (node) => {
    return <Avatar size={50} backgroundColor={purple500}>R</Avatar>;
  }

  onNameChanged = (e) => {
    this.props.node.name = e.target.value;
    this.props.onNameChanged && this.props.onNameChanged(this.props.node);
  }

  handleDeselect = (e) => {
    this.props.onDeselect && this.props.onDeselect(this.props.node)
  }

  handleDelete = (e) => {
    this.props.onDelete && this.props.onDelete(this.props.node)
  }

  render() {
    return (
        <Card key={this.props.node.id} style={{marginBottom: '5px'}}>
          <CardHeader
            title={this.title(this.props.node)}
            subtitle={this.description(this.props.node)}
            avatar={this.icon(this.props.node)}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardActions>
            <FlatButton label="Deselect" onTouchTap={this.handleDeselect}/>
            <FlatButton label="Delete" secondary={true} onTouchTap={this.handleDelete}/>
          </CardActions>
          <CardText expandable={true}>
            <TextField hintText="Name" floatingLabelText="Name" defaultValue={this.props.node.name} onChange={this.onNameChanged}/>
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
