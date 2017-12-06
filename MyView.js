import PropTypes from 'prop-types';
import { requireNativeComponent, View } from 'react-native';

var iface = {
  name: 'myImageView',
  propTypes: {
    src: PropTypes.string,
    borderRadius: PropTypes.number,
    ...View.propTypes // 包含默认的View的属性
  },
};

module.exports = requireNativeComponent('myImageView', iface);