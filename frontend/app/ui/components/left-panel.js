import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { purple500 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Node from '../../map/node';
import Site from '../../map/site';

export default class LeftPanel extends React.Component {

  static defaultProps = {
    open: false,
    targets: null
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

  handleLinkTap = (linkType) => {
    return (e) => {
      this.props.onMakeLink && this.props.onMakeLink(linkType);
    }
  }

  toolbar = () => {
    return (
      <Toolbar style={{marginBottom: '5px'}}>
        {
          this.toolbarIcons()
        }
      </Toolbar>
    );
  }

  toolbarIcons() {
    if (this.props.targets.hasAtLeastNNodes(2)) {
      return [
        <IconButton key="link-by-line-icon" iconClassName="link-by-line-icon" style={{width: 56, height: 56}} onTouchTap={this.handleLinkTap("point-to-point")}/>,
        <IconButton key="link-by-tree-icon" iconClassName="link-by-tree-icon" style={{width: 56, height: 56}} onTouchTap={this.handleLinkTap("point-to-multipoint")}/>,
        <IconButton key="link-by-triangle-icon" iconClassName="link-by-triangle-icon" style={{width: 56, height: 56}} onTouchTap={this.handleLinkTap("ring")}/>
      ];
    } else {
      return [];
    }
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
        <Card key={t.id} style={{marginBottom: '5px'}}>
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
    } else if (t instanceof Site) {
      return (
        <List>
        {
          t.nodes.map(node => <ListItem key={node.id} primaryText={node.name}/>)
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
      <ReactCSSTransitionGroup transitionName="fadein" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
      {
        this.toolbar()
      }
      </ReactCSSTransitionGroup>
      {
        this.props.targets.sites().map(function(t){ return this.renderTarget(t); }.bind(this))
      }
      <ReactCSSTransitionGroup transitionName="fadein" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
      {
        this.props.targets.nodes().map(function(t){ return this.renderTarget(t); }.bind(this))
      }
      </ReactCSSTransitionGroup>
			</div>
		);
	}
}
