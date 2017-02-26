import React from 'react';
import { connect } from 'react-redux'
import Layout from './layout';

import { loadConfig } from '../redux/config'
import { loadIcons } from '../redux/icons'

export class Bootstrap extends React.Component {
	componentDidMount() {
		this.props.loadConfig();
	}
	componentDidUpdate(nextProps) {
		if (this.props.isConfigLoaded && !this.props.isIconsLoaded) {
			this.props.loadIcons(this.props.settings.map.icons);
		} 
	}
	render() {
		if (this.props.icons.state !== 'Done') {
			return <div>Loading Icons. Please Wait</div>
		} else {
			return <Layout/>
		}
	}
}

const mapStateToProps = (state) => {
  return {
		isConfigLoaded: state.config.state === 'Done',
		isIconsLoaded: state.icons.state === 'Done',
    settings: state.config.state === 'Done' ? state.config.config.settings : {},
		icons: state.icons
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
		loadConfig: () => {
      dispatch(loadConfig())
    },
    loadIcons: (iconTypes) => {
      dispatch(loadIcons(iconTypes))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bootstrap);
