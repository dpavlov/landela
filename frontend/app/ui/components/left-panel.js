import React from 'react';
import Drawer from 'material-ui/Drawer';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { purple500 } from 'material-ui/styles/colors';

export default class LeftPanel extends React.Component {

  static defaultProps = {
    targets: []
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
        <Card key={t.id}>
          <CardHeader
            title={this.title(t)}
            subtitle={this.description(t)}
            avatar={this.icon(t)}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardActions>
            <FlatButton label="Action1" />
            <FlatButton label="Action2" />
          </CardActions>
          <CardText expandable={true}>
            <TextField hintText="Name" defaultValue={t.name} onChange={this.onTargetNameChanged(t)}/>
          </CardText>
        </Card>
    );
  }

	render() {
		return (
			<div id='left-panel'>
					<Drawer width={400} openSecondary={true} open={this.props.open} >
          {
            this.props.targets.map(function(t){ return this.renderTarget(t); }.bind(this))
          }
        	</Drawer>
			</div>
		);
	}
}
