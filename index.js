import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	InteractionManager,
	Platform,
	StatusBar,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View
} from 'react-native';

class StatusBarAlert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: new Animated.Value(this.getHeight(props)),
			opacity: new Animated.Value(this.getOpacity(props)),
			visible: props.hiddenHeight ? true : props.visible,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible && !this.props.visible) {
			this.setState({ visible: true }, () => {
				this.performAnimation(nextProps);
			});
		} else if (!nextProps.visible && this.props.visible) {
			this.performAnimation(nextProps, () => {
				if (!nextProps.hiddenHeight) this.setState({ visible: false });
			});
		} else if (nextProps.statusBarHeight !== this.props.statusbarHeight) {
			this.performAnimation(nextProps);
		}
	}

	performAnimation(props, cb = () => {}) {
		requestAnimationFrame(() => {
			Animated.parallel([
				Animated.timing(this.state.height, {
					toValue: this.getHeight(props),
					duration: SLIDE_DURATION
				}),
				Animated.timing(this.state.opacity, {
					toValue: this.getOpacity(props),
					duration: SLIDE_DURATION
				})
			]).start(cb);
		});
	}

	getOpacity(props) {
		return props.visible ? 1 : 0;
	}

	getHeight(props) {
		if (!props.visible) {
			return props.hiddenHeight;
		}
		return Platform.OS === 'ios'
			? props.height + (props.statusbarHeight || STATUS_BAR_HEIGHT)
			: props.height;
	}

	render() {
		if (!this.state.visible) return null;
		const content = this.props.children || (
			<Text
				style={[styles.text, { color: this.props.color || styles.text.color }]}
				allowFontScaling={false}
			>
				{this.props.message}
			</Text>
		);
		return (
			<Animated.View
				style={[
					styles.view,
					this.props.style,
					{
						height: this.state.height,
						opacity: this.state.opacity,
						backgroundColor: this.props.backgroundColor
					}
				]}
			>
				<TouchableOpacity
					style={[styles.touchableOpacity, this.props.style]}
					onPress={this.props.onPress || null}
					activeOpacity={0.7}
				>
					{content}
				</TouchableOpacity>
			</Animated.View>
		);
	}
}

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const SLIDE_DURATION = 300;
const DEFAULT_BACKGROUND_COLOR = '#3DD84C';

const styles = {
	view: {
		height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT * 2 : STATUS_BAR_HEIGHT,
	},
	touchableOpacity: {
		flex: 1,
		display: 'flex',
		height: STATUS_BAR_HEIGHT,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	text: {
		height: STATUS_BAR_HEIGHT,
		fontSize: 14,
		fontWeight: '400',
		lineHeight: 20,
		marginBottom: Platform.OS === 'ios' ? 4 : 0,
		color: 'white'
	}
};

StatusBarAlert.propTypes = {
	visible: PropTypes.bool.isRequired,
	message: PropTypes.string,
	backgroundColor: PropTypes.string,
	highlightColor: PropTypes.string,
	color: PropTypes.string,
	height: PropTypes.number,
	statusbarHeight: PropTypes.number,
	hiddenHeight: PropTypes.number,
	onPress: PropTypes.func,
	style: PropTypes.any
};

StatusBarAlert.defaultProps = {
	visible: false,
	message: '',
	backgroundColor: DEFAULT_BACKGROUND_COLOR,
	highlightColor: null,
	color: styles.text.color,
	height: STATUS_BAR_HEIGHT,
	hiddenHeight: 0,
	statusbarHeight: STATUS_BAR_HEIGHT,
	onPress: null
};

export default StatusBarAlert;
