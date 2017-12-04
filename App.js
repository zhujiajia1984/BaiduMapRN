import React, { Component } from 'react';
// import ToastExample from './ToastExample';
import MapLocationComponent from './BaiduLocation';
// import { PropTypes } from 'react';
import { DeviceEventEmitter } from 'react-native';
// import myImageView from './MyView'

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';

// 
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
      isOnLocation: false,
    }
  }

  //
  componentDidMount() {
    // 初始化定位并监听
    MapLocationComponent.initLocation(1000);
    var that = this;
    DeviceEventEmitter.addListener('myEvent', function(e: Event) {
      // console.log(e);
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

    // 从服务器获取数据
    // var url = "https://weiquaninfo.cn/login/getTableData";
    // fetch(url, {
    //     method: "GET",
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   })
    //   .then(res => {
    //     let contentType = res.headers.get("Content-Type");
    //     if (res.status == 200 && contentType && contentType.includes("application/json")) {
    //       return res.json();
    //     } else {
    //       throw new Error(`status:${res.status} contentType:${contentType}`);
    //     }
    //   })
    //   .then(resJson => {
    //     return resJson;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     Alert.alert(`获取服务器数据失败：${error.message}`);
    //   })
  }

  //
  startLocation() {
    if (!this.state.isOnLocation) {
      MapLocationComponent.startLocation();
      this.setState({ isOnLocation: true });
    }
  }

  //
  endLocation() {
    if (this.state.isOnLocation) {
      MapLocationComponent.stopLocation();
      this.setState({
        longitude: "",
        latitude: "",
        errorDetail: "",
        radius: "",
        locationDescribe: "",
        addr: "",
        errorCode: "",
        isOnLocation: false
      })
    }
  }

  //
  render() {
    // const myViewTest = <myImageView ppp={"https://weiquaninfo.cn/images/123.jpg"}></myImageView>;
    return (
      <View style={styles.container}>
        <Text style={styles.itemText}>{`定位结果：${this.state.errorDetail}`}</Text>
        <Text style={styles.itemText}>{`错误码：${this.state.errorCode}`}</Text>
        <Text style={styles.itemText}>{`经度：${this.state.longitude}`}</Text>
        <Text style={styles.itemText}>{`纬度：${this.state.latitude}`}</Text>
        <Text style={styles.itemText}>{`准度：${this.state.radius}`}</Text>
        <Text style={styles.itemText}>{`描述：${this.state.locationDescribe}`}</Text>
        <Text style={styles.itemText}>{`位置：${this.state.addr}`}</Text>
        <View style={styles.btnWrapper}>
          <TouchableOpacity style={styles.primaryBtn} onPress={this.startLocation.bind(this)}>
            <Text style={styles.btnTextBegin}>开     始     定     位</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnWrapper}>
          <TouchableOpacity style={styles.defaultBtn} onPress={this.endLocation.bind(this)}>
            <Text style={styles.btnTextEnd}>结     束     定     位</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  itemText: {
    marginBottom: 10,
  },
  primaryBtn: {
    padding: 10,
    backgroundColor: "#108ee9",
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    borderRadius: 5,
  },
  defaultBtn: {
    padding: 10,
    backgroundColor: "white",
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
  },
  btnTextBegin: {
    color: "white",
    fontWeight: '500',
    fontSize: 16,
  },
  btnTextEnd: {
    color: "black",
    fontSize: 16,
  },
  btnWrapper: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
  }
});