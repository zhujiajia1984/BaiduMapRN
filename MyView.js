import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var iface = {
	name: 'myImageView',
};

module.exports = requireNativeComponent('myImageView', iface);