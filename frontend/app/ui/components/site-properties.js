import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
      city: 'city'
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

  handleCancel = (e) => {
    this.props.site.name = this.state.originName;
    this.props.site.address = this.state.originAddress;
    this.setState({name: this.state.originName, address: this.state.originAddress});
    this.props.updateMap && this.props.updateMap();
  }
  actions() {
    if (this.state.name !== this.state.originName || this.state.address !== this.state.originAddress) {
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
        <Card key={this.props.site.id} style={{marginBottom: '5px'}}>
          <CardHeader
            title={this.state.name}
            subtitle={this.state.address}
            avatar={<Avatar size={50} backgroundColor={purple500} style={{fontSize: '0.9em'}}>SITE</Avatar>}
            actAsExpander={true}
            showExpandableButton={true}
          />
          {
            this.actions()
          }
          <CardText expandable={true}>
            <TextField hintText="Name" floatingLabelText="Name" value={this.state.name} onChange={this.onNameChanged} fullWidth={true}/>
            <TextField hintText="Address" floatingLabelText="Address" value={this.state.address} onChange={this.onAddressChanged} fullWidth={true}/>
            <SelectField floatingLabelText="City" value={this.state.city} fullWidth={true} onChange={this.handleCiteChanged}>
              {
                <MenuItem key={'city'} value={'city'} primaryText={'City'}/>
              }
            </SelectField>
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
