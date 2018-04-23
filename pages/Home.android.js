import React, { Component } from 'react';
import MapLocationComponent from '../BaiduLocation';
import PropTypes from 'prop-types';
// import { PropTypes } from 'react';
// import myImageView from './MyView'
// import ToastExample from './ToastExample';

import {
  DeviceEventEmitter,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ToastAndroid,
  StatusBar,
  BackHandler,
  AppState
} from 'react-native';


// global
const mainColor = "#108ee9";
const backTime = 2000;
var lastBackBtnTime = "";
var that = null;

// 
export default class Home extends Component < {} > {
  //
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
      height: "",
      direction: "",
      sn: "",
      speed: "",
      time: "",
      type: "",
    };
    that = this;
  }

  //
  static navigationOptions = ({ navigation }) => ({
    headerTitleStyle: { color: 'white', alignSelf: 'center', paddingLeft: 40 },
    headerRight: <TouchableOpacity style={styles.headerRightBtn} onPress={()=> {
                    if (that.state.isOnLocation){
                      MapLocationComponent.stopLocation();
                      that.setState({
                        longitude: "",
                        latitude: "",
                        errorDetail: "",
                        radius: "",
                        locationDescribe: "",
                        addr: "",
                        errorCode: "",
                        isOnLocation: false,
                        height: "",
                        direction: "",
                        sn: "",
                        speed: "",
                        time: "",
                        type: "",
                      })
                    }
                    navigation.navigate('MapPage');
                  }}>
                  <Text style={{color: 'white',fontSize: 14}}>地图</Text>
                </TouchableOpacity>
  });

  //
  componentDidMount() {
    // 初始化定位并监听
    MapLocationComponent.initLocation(1000);
    DeviceEventEmitter.addListener('myEvent', function(e: Event) {
      // console.log(e.type);
      that.setState({
        longitude: e.longitude,
        latitude: e.latitude,
        errorDetail: e.errorDetail,
        radius: e.radius,
        locationDescribe: e.locationDescribe,
        addr: e.addr,
        errorCode: e.errorCode,
        height: e.height,
        direction: e.direction,
        sn: e.sn,
        speed: e.speed,
        time: e.time,
        type: (e.type == null) ? 'gps' : 'network',
      })

    });

    // 安卓返回键
    BackHandler.addEventListener('hardwareBackPress', function() {
      // N秒内再次点击后退出
      if (lastBackBtnTime && ((lastBackBtnTime + backTime) > Date.now())) {
        // 退出APP
        MapLocationComponent.stopLocation();
        return false;
      }
      lastBackBtnTime = Date.now();
      ToastAndroid.showWithGravityAndOffset('再按一次退出', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 200);
      return true;
    });

    // APP状态（前台后台）
    AppState.addEventListener("change", this.onAppStateChange);
  }

  //
  onAppStateChange(nextAppState) {
    // console.log(nextAppState);
    if (nextAppState == "background") {
      // if (that.state.isOnLocation) {
      //   MapLocationComponent.stopLocation();
      // }
    }
  }

  // 上传数据
  sendServerData(sendData) {
    // 上传数据
    let url = "http://dingwei.doublecom.net/api/dingwei/baidu/add/";
    fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: sendData
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
        if (resJson.stat == "success") {
          ToastAndroid.showWithGravity('数据上报成功', ToastAndroid.LONG, ToastAndroid.CENTER);
        }
        return resJson;
      })
      .catch(error => {
        console.log(error);
        Alert.alert(`上传服务器数据失败：${error.message}`);
      })
  }

  // 退出时
  componentWillUnmount() {
    if (that.state.isOnLocation) {
      MapLocationComponent.stopLocation();
    }
    BackHandler.removeEventListener('hardwareBackPress', () => {});
    AppState.removeEventListener('change', this.onAppStateChange);
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
      this.setState({ isOnLocation: false });
    }
  }

  // 
  sendLocation() {
    if (!this.state.name) {
      Alert.alert("请先输入景点名称");
      return;
    }
    if (this.state.time == "") {
      Alert.alert("请先定位");
      return;
    }
    this.sendServerData([{
      name: this.state.name,
      time: this.state.time,
      type: this.state.type,
      longitude: parseFloat(this.state.longitude),
      latitude: parseFloat(this.state.latitude),
      radius: parseFloat(this.state.radius),
      height: (this.state.type == "gps") ? parseFloat(this.state.height) : 0,
      speed: (this.state.type == "gps") ? parseFloat(this.state.speed) : 0,
      direction: (this.state.type == "gps") ? parseFloat(this.state.direction) : 0,
      sn: (this.state.type == "gps") ? parseInt(this.state.sn) : 0,
      desc: this.state.locationDescribe,
      address: this.state.addr,
    }])
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
      <StatusBar
          animated={true}
          backgroundColor={mainColor}
        ></StatusBar>
      <Text style={styles.itemText}>{`景点名称：${this.state.name}`}</Text>
        <Text style={styles.itemText}>{`定位结果：${this.state.errorDetail}`}</Text>
        <Text style={styles.itemText}>{`定位时间：${this.state.time}`}</Text>
        <Text style={styles.itemText}>{`经度：${this.state.longitude}`}</Text>
        <Text style={styles.itemText}>{`纬度：${this.state.latitude}`}</Text>
        <Text style={styles.itemText}>{`准度：${this.state.radius}`}</Text>
        <Text style={styles.itemText}>{`高度(GPS)：${this.state.height}米`}</Text>
        <Text style={styles.itemText}>{`速度(GPS)：${this.state.speed}公里/小时`}</Text>
        <Text style={styles.itemText}>{`方向(GPS)：${this.state.direction}度`}</Text>
        <Text style={styles.itemText}>{`卫星数(GPS)：${this.state.sn}个`}</Text>
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
        <View style={{display:'flex', flexDirection:'row'}}>
            <TouchableOpacity style={styles.defaultBtn} onPress={this.startLocation.bind(this)}>
              <Text style={styles.btnTextEnd}>开     始     定     位</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.defaultBtn} onPress={this.endLocation.bind(this)}>
              <Text style={styles.btnTextEnd}>停     止     定     位</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.btnWrapper}>
          <TouchableOpacity style={styles.primaryBtn} onPress={this.sendLocation.bind(this)}>
            <Text style={styles.btnTextBegin}>上     传</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// 验证输入
Home.propTypes = {
  navigation: PropTypes.object,
};

// css
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
    marginTop: 10,
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
    marginLeft: 10,
    marginRight: 10,
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
  },
  headerRightBtn: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    // backgroundColor: 'red'
  }
});