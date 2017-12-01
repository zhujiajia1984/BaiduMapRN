/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import ToastExample from './ToastExample';
import MapLocationComponent from './BaiduLocation';
import { PropTypes } from 'react';
import { DeviceEventEmitter } from 'react-native';
// import myImageView from './MyView'

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component < {} > {
  constructor(props) {
    super(props);
    this.state = {
      longitude: "",
      latitude: "",
      radius: "",
      locationDescribe: "",
      addr: "",
      errorDetail: "",
      errorCode: "",
    }
  }

  //
  componentDidMount() {
    // 定位开始
    MapLocationComponent.startLocation(1000);
    var that = this;
    DeviceEventEmitter.addListener('myEvent', function(e: Event) {
      console.log(e);
      that.setState({
        longitude: e.longitude,
        latitude: e.latitude,
        errorDetail: e.errorDetail,
        radius: e.radius,
        locationDescribe: e.locationDescribe,
        addr: e.addr,
        errorCode: e.errorCode,
      })
    });
  }
  //
  beginLocation() {
    MapLocationComponent.stopLocation();
    this.setState({
      longitude: "",
      latitude: "",
      errorDetail: "",
      radius: "",
      locationDescribe: "",
      addr: "",
      errorCode: "",
    })
  }

  //
  render() {
    // const myViewTest = <myImageView ppp={"https://weiquaninfo.cn/images/123.jpg"}></myImageView>;
    return (
      <View style={styles.container}>
        <Button type="primary" title="结束定位" onPress={this.beginLocation.bind(this)}></Button>
        <Text>{`定位结果：${this.state.errorDetail}`}</Text>
        <Text>{`错误码：${this.state.errorCode}`}</Text>
        <Text>{`经度：${this.state.longitude}`}</Text>
        <Text>{`纬度：${this.state.latitude}`}</Text>
        <Text>{`准度：${this.state.radius}`}</Text>
        <Text>{`描述：${this.state.locationDescribe}`}</Text>
        <Text>{`位置：${this.state.addr}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});