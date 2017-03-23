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

import NodeProperties from './node-properties';
import SiteProperties from './site-properties';

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
    if (this.props.mapSet.hasAtLeastNNodes(2)) {
      return [
        <IconButton key="link-by-line-icon" iconClassName="link-by-line-icon" style={{width: 56, height: 56}} onTouchTap={this.handleLinkTap("point-to-point")}/>,
        <IconButton key="link-by-tree-icon" iconClassName="link-by-tree-icon" style={{width: 56, height: 56}} onTouchTap={this.handleLinkTap("point-to-multipoint")}/>,
        <IconButton key="link-by-triangle-icon" iconClassName="link-by-triangle-icon" style={{width: 56, height: 56}} onTouchTap={this.handleLinkTap("ring")}/>
      ];
    } else {
      return [];
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
        this.props.mapSet.sites().map(site => <SiteProperties key={site.id} mapSet={this.props.mapSet} site={site} updateMap={this.props.updateMap} onDeselect={this.props.onDeselect} onDelete={this.props.onDelete}/>)
      }
      <ReactCSSTransitionGroup transitionName="fadein" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
      {
        this.props.mapSet.nodes().map(node => <NodeProperties key={node.id} mapSet={this.props.mapSet} node={node} updateMap={this.props.updateMap} onDeselect={this.props.onDeselect} onDelete={this.props.onDelete}/>)
      }
      </ReactCSSTransitionGroup>
			</div>
		);
	}
}
