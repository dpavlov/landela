import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { purple500 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';

export default class SiteProperties extends React.Component {

  constructor(props) {
    super(props);
  }

  title = (site) => {
    return site.name;
  }

  description = (site) => {
    return "Properties for " + site.name;
  }

  icon = (site) => {
    return <Avatar size={50} backgroundColor={purple500}>R</Avatar>;
  }

  onNameChanged = (e) => {
    this.props.site.name = e.target.value;
    this.props.onNameChanged && this.props.onNameChanged(this.props.site);
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
            title={this.title(this.props.site)}
            subtitle={this.description(this.props.site)}
            avatar={this.icon(this.props.site)}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardActions>
            <FlatButton label="Deselect" onTouchTap={this.handleDeselect}/>
            <FlatButton label="Delete" secondary={true} onTouchTap={this.handleDelete}/>
          </CardActions>
          <CardText expandable={true}>
            <TextField hintText="Name" floatingLabelText="Name" defaultValue={this.props.site.name} onChange={this.onNameChanged}/>
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
