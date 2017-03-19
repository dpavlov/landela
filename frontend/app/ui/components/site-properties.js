import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { purple500 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';

import { SITE_REMOVED } from '../../map/map-set'

export default class SiteProperties extends React.Component {

  constructor(props) {
    super(props);
    props.mapSet.subscribe(this);
    this.state = {
      originName: props.site.name,
      originAddress: props.site.address,
      name: props.site.name,
      address: props.site.address,
    }
  }

  componentWillUnmount() {
    this.props.mapSet.unsubscribe(this);
  }

  onEvent(set, eType, target) {
    if (eType === SITE_REMOVED && target.id === this.props.site.id) {
      if (this.state.name !== this.state.originName) {
        this.props.site.changed('name', this.state.originName)
      }
      if (this.state.address !== this.state.originAddress) {
        this.props.site.changed('address', this.state.originAddress)
      }
    }
  }

  onNameChanged = (e) => {
    this.setState({name: e.target.value});
    this.props.site.name = e.target.value;
    this.props.updateMap && this.props.updateMap();
  }

  onAddressChanged = (e) => {
    this.setState({address: e.target.value});
    this.props.site.address = e.target.value;
    this.props.updateMap && this.props.updateMap();
  }

  handleDeselect = (e) => {
    this.props.onDeselect && this.props.onDeselect(this.props.site);
  }

  handleDelete = (e) => {
    this.props.onDelete && this.props.onDelete(this.props.site);
  }

  render() {
    return (
        <Card key={this.props.site.id} style={{marginBottom: '5px'}}>
          <CardHeader
            title={this.state.name}
            subtitle={this.state.address}
            avatar={<Avatar size={50} backgroundColor={purple500} style={{fontSize: '0.9em'}}>SITE</Avatar>}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardActions>
            <FlatButton label="Deselect" onTouchTap={this.handleDeselect}/>
            <FlatButton label="Delete" secondary={true} onTouchTap={this.handleDelete}/>
          </CardActions>
          <CardText expandable={true}>
            <TextField hintText="Name" floatingLabelText="Name" defaultValue={this.props.site.name} onChange={this.onNameChanged}/>
            <TextField hintText="Address" floatingLabelText="Address" defaultValue={this.props.site.address} onChange={this.onAddressChanged}/>
            {
              this.properties(this.props.site)
            }
          </CardText>
        </Card>
    );
  }

  properties = (site) => {
    return (
      <List>
      {
        site.nodes.map(node => <ListItem key={node.id} primaryText={node.name}/>)
      }
      </List>
    )
  }
}
