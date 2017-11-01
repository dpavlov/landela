import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { purple500 } from 'material-ui/styles/colors';
import { LineType } from '../../map/link'
import { LINK_REMOVED } from '../../map/map-set'

export default class LinkProperties extends React.Component {

  constructor(props) {
    super(props);
    props.mapSet.subscribe(this);
    this.state = {
      originLineType: props.link.lineType,
      lineType: props.link.lineType
    }
  }

  componentWillUnmount() {
    this.props.mapSet.unsubscribe(this);
  }

  onEvent(set, eType, target) {
    if (eType === LINK_REMOVED && target.id === this.props.link.id) {
      if (this.state.lineType !== this.state.originLineType) {
        this.props.link.changed('lineType', this.state.originLineType);
      }
    }
  }

  handleDeselect = (e) => {
    this.props.onDeselect && this.props.onDeselect(this.props.link)
  }

  handleDelete = (e) => {
    this.props.onDelete && this.props.onDelete(this.props.link)
  }

  handleCancel = (e) => {
    this.props.updateMap && this.props.updateMap();
  }

  handleLineTypeChange = (event, index, value) => {
    this.setState({lineType: value});
    this.props.link.lineType = value;
    this.props.updateMap && this.props.updateMap();
  }

  actions() {
    if (false) {
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

  properties = (link) => {
    return (
      <div></div>
    );
  }

  render() {
    return (
        <Card key={this.props.link.id} style={{marginBottom: '5px'}}>
          <CardHeader
            title={'Link'}
            subtitle={'Description'}
            avatar={ <Avatar size={50} backgroundColor={purple500}>L</Avatar> }
            actAsExpander={true}
            showExpandableButton={true}
          />
          {
            this.actions()
          }
          <CardText expandable={true}>
          <SelectField floatingLabelText="Line Type" value={this.state.lineType} fullWidth={true} onChange={this.handleLineTypeChange}>
          {
            LineType.all().map(lt => <MenuItem key={lt.value} value={lt.value} primaryText={lt.name}/>)
          }
          </SelectField>
          {
            this.properties(this.props.link)
          }
          </CardText>
        </Card>
    );
  }
}
