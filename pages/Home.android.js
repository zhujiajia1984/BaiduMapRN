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
  BackHandler
} from 'react-native';


// global
var count = 0;
var data = [];
const mainColor = "#108ee9";
const backTime = 2000;
var lastBackBtnTime = "";

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
    };
  }

  //
  static navigationOptions = ({ navigation }) => ({
    headerTitleStyle: { color: 'white', alignSelf: 'center', paddingLeft: 40 },
    headerRight: <TouchableOpacity style={styles.headerRightBtn} onPress={()=> navigation.navigate('MapPage')}>
                  <Text style={{color: 'white',fontSize: 14}}>地图</Text>
                </TouchableOpacity>
  });

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
            if (resJson.code == 1) {
              data = []; //数据清空
              ToastAndroid.showWithGravity('数据上报成功', ToastAndroid.LONG, ToastAndroid.CENTER);
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

    // 安卓返回键
    BackHandler.addEventListener('hardwareBackPress', function() {
      // N秒内再次点击后退出
      if(lastBackBtnTime && ((lastBackBtnTime + backTime) > Date.now())){
        // 退出APP
        MapLocationComponent.stopLocation();
        return false;
      }
      lastBackBtnTime = Date.now();
      ToastAndroid.showWithGravityAndOffset('再按一次退出', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 200);
      return true;
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

  // 退出时
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {});
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
      <StatusBar
          animated={true}
          backgroundColor={mainColor}
        ></StatusBar>
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