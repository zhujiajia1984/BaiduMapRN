import React, { Component } from 'react';
// import ToastExample from './ToastExample';
import MapLocationComponent from './BaiduLocation';
// import { PropTypes } from 'react';
// import myImageView from './MyView'

import {
  DeviceEventEmitter,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

var count = 0;
var data = [];

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
      name: "",
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

      // 30秒上传一次
      count++;
      if (count % 30 == 0) {
        count = 0;

        // 上传数据
        let url = "https://weiquaninfo.cn/location/positions";
        fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: that.state.name,
              data: data
            }),
          })
          .then(res => {
            let contentType = res.headers.get("Content-Type");
            if (res.status == 200 && contentType && contentType.includes("application/json")) {
              return res.json();
            } else {
              throw new Error(`status:${res.status} contentType:${contentType}`);
            }
          })
          .then(resJson => {
            // 成功
            if(resJson.code == 1){
              data = []; //数据清空
              Alert.alert("数据上报成功");
            }
            return resJson;
          })
          .catch(error => {
            console.log(error);
            Alert.alert(`获取服务器数据失败：${error.message}`);
          })
      } else {
        // 数据组装
        data.push({
          long: e.longitude,
          lat: e.latitude,
          radius: e.radius,
          detail: e.errorDetail,
          desp: e.locationDescribe,
          addr: e.addr,
          errCode: e.errorCode,
        })
      }
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
    if (!this.state.name) {
      Alert.alert("请先输入景点名称");
      return;
    }
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
  onChangeName(text) {
    this.setState({ name: text });
  }

  //
  render() {
    // const myViewTest = <myImageView ppp={"https://weiquaninfo.cn/images/123.jpg"}></myImageView>;
    return (
      <View style={styles.container}>
      <Text style={styles.itemText}>{`景点名称：${this.state.name}`}</Text>
        <Text style={styles.itemText}>{`定位结果：${this.state.errorDetail}`}</Text>
        <Text style={styles.itemText}>{`错误码：${this.state.errorCode}`}</Text>
        <Text style={styles.itemText}>{`经度：${this.state.longitude}`}</Text>
        <Text style={styles.itemText}>{`纬度：${this.state.latitude}`}</Text>
        <Text style={styles.itemText}>{`准度：${this.state.radius}`}</Text>
        <Text style={styles.itemText}>{`描述：${this.state.locationDescribe}`}</Text>
        <Text style={styles.itemText}>{`位置：${this.state.addr}`}</Text>
        <View style={styles.inputWrapper}>
          <View style={styles.inputView}>
            <TextInput style={styles.inputContent}
              placeholder = {"请输入景点名称，不超过50个汉字"}
              placeholderTextColor = {"rgba(0, 0, 0, 0.25)"}
              autoCorrect = {false}
              autoFocus = {false}
              keyboardType = {"default"}
              maxLength = {100}
              onChangeText = {this.onChangeName.bind(this)}
              value = {this.state.name}
              returnKeyType = {"done"}
              // secureTextEntry = {true}
              underlineColorAndroid = {"#108ee9"}
            ></TextInput>
          </View>
        </View>
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
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
  },
  inputView: {
    // backgroundColor: "white",
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
  },
  inputContent: {
    flex: 1,
  }
});