import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Home from './pages/Home';
import MapMode from './pages/MapMode';

// global
const mainColor = "#108ee9";


// StackNavigator
const RootNavigator = StackNavigator({
  HomePage: {
    screen: Home,
  },
  MapPage: {
    screen: MapMode,
  }
}, {
  // 全局配置
  navigationOptions: ({ navigation }) => ({
    headerStyle: { backgroundColor: mainColor },
    headerTitle: "定位采集",
    headerTitleStyle: {color: 'white', alignSelf: 'center'},
    headerTintColor: "white",
  }),
});

// 
export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <RootNavigator></RootNavigator>
    );
  }
}