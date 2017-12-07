import PropTypes from 'prop-types';
import { requireNativeComponent, View } from 'react-native';

var iface = {
  name: 'myMapView',
  propTypes: {
    center: PropTypes.object,
    zoom: PropTypes.number,
    location: PropTypes.bool,
    ...View.propTypes // 包含默认的View的属性
  },
};

module.exports = requireNativeComponent('myMapView', iface);