import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { purple500 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';

import Node from '../../map/node';

export default class LeftPanel extends React.Component {

  static defaultProps = {
    open: false,
    targets: []
  }
  constructor(props) {
    super(props);
    this.state = {
      style: { display: props.open ? 'block' : 'none' }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({style : { ...this.state.style, display: nextProps.open ? 'block' : 'none' }});
  }

  title = (target) => {
    return target.name;
  }

  description = (target) => {
    return "Properties for " + target.name;
  }

  icon = (target) => {
    return <Avatar size={50} backgroundColor={purple500}>R</Avatar>;
  }

  onTargetNameChanged = (target) => {
    return (e) => {
      target.name = e.target.value;
    }
  }

  renderTarget = (t) => {
    return (
        <Card key={t.id} style={{marginBottom: '10px'}}>
          <CardHeader
            title={this.title(t)}
            subtitle={this.description(t)}
            avatar={this.icon(t)}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardActions>
            <FlatButton label="Deselect" />
            <FlatButton label="Delete" secondary={true} />
          </CardActions>
          <CardText expandable={true}>
            <TextField hintText="Name" floatingLabelText="Name" defaultValue={t.name} onChange={this.onTargetNameChanged(t)}/>
            {
              this.renderTargetProperties(t)
            }
          </CardText>
        </Card>
    );
  }

  renderTargetProperties = (t) => {
    if (t instanceof Node) {
      return (
        <List>
        {
          t.ports.map(port => <ListItem key={port.id} primaryText={port.name}/>)
        }
        </List>
      )
    } else {
      return null;
    }
  }

	render() {
		return (
			<div id='left-panel' style={this.state.style}>
      {
        this.props.targets.map(function(t){ return this.renderTarget(t); }.bind(this))
      }
			</div>
		);
	}
}
