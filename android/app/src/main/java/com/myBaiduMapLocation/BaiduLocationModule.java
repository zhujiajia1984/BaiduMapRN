package com.myBaiduMapLocation;

//
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.location.BDLocationListener;
import com.baidu.location.BDLocation;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.myBaiduMap.BaiduMapViewManager;

import android.support.annotation.Nullable;
import android.util.Log;

/**
 * Created by zjj on 2017/11/22.
 */

public class BaiduLocationModule extends ReactContextBaseJavaModule {
    public LocationClient mLocationClient = null;
    private boolean misMapMode = false;
    public  ReactContext  mContext;

    //
    public BaiduLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
    }

    @Override
    public String getName() {
        return "MapLocationComponent";
    }

    public BDLocationListener myListener = new BDLocationListener(){
        @Override
        public void onReceiveLocation(BDLocation location) {
            int errorCode = location.getLocType();
            if(errorCode == 161 || errorCode== 61){
                double latitude = location.getLatitude();    //获取纬度信息
                double longitude = location.getLongitude();    //获取经度信息
                float radius = location.getRadius();    //获取定位精度，默认值为0.0f
                double height = location.getAltitude();    //获取定位高度，单位米，GPS有效
                float direction = location.getDirection(); //获取定位方向，单位度，GPS有效
                int sn = location.getSatelliteNumber();     //获取卫星数量，GPS有效
                float speed = location.getSpeed();          //获取速度，GPS有效
                String time = location.getTime();           //定位时间
                String locationDescribe = location.getLocationDescribe();
                String addr = location.getAddrStr();    //获取详细地址信息
                String desp = location.getLocTypeDescription();
                String type = location.getNetworkLocationType();
//                Log.d("经度：", Double.toString(longitude));
//                Log.d("纬度：", Double.toString(latitude));
//                Log.d("定位精度：", Float.toString(radius));
//                Log.d("错误码：", Integer.toString(errorCode));
//                Log.d("错误描述：", desp);
//                Log.d("位置描述：", locationDescribe);
//                Log.d("详细位置", addr);
                if(!BaiduLocationModule.this.misMapMode) {
                    // 文字模式
                    WritableMap params = Arguments.createMap();
                    params.putString("longitude", Double.toString(longitude));
                    params.putString("latitude", Double.toString(latitude));
                    params.putString("radius", Float.toString(radius));
                    params.putString("errorCode", Integer.toString(errorCode));
                    params.putString("errorDetail", desp);
                    params.putString("locationDescribe", locationDescribe);
                    params.putString("addr", addr);
                    params.putString("height", Double.toString(height));
                    params.putString("direction", Float.toString(direction));
                    params.putString("sn", Integer.toString(sn));
                    params.putString("speed", Float.toString(speed));
                    params.putString("time", time);
                    params.putString("type", type);
                    sendEvent(BaiduLocationModule.this.mContext, "myEvent", params);
                }else{
                    // 地图模式
                    Log.d("mapIsLocation", "true");
                }
            }else{
                String desp = location.getLocTypeDescription();
//                Log.d("错误码：", Integer.toString(errorCode));
//                Log.d("错误描述：", desp);
                if(!BaiduLocationModule.this.misMapMode){
                    // 文字模式
                    WritableMap params = Arguments.createMap();
                    params.putString("longitude","0");
                    params.putString("latitude","0");
                    params.putString("errorDetail",desp);
                    params.putString("errorCode",Integer.toString(errorCode));
                    sendEvent(BaiduLocationModule.this.mContext, "myEvent",params);
                }else{
                    // 地图模式
                    Log.d("mapIsLocation", "true");
                }
            }
        }
    };

    @ReactMethod
    public void initLocation(int time){
        // init
        this.mLocationClient = new LocationClient(getReactApplicationContext());
        this.mLocationClient.registerLocationListener(myListener);

        // option
        LocationClientOption option = new LocationClientOption();
        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
        option.setCoorType("bd09ll");
        option.setScanSpan(time);
        option.setOpenGps(true);
        option.setIsNeedLocationDescribe(true);
        option.setIsNeedAddress(true);
        this.mLocationClient.setLocOption(option);
        this.misMapMode = false;
    }

    @ReactMethod
    public void startLocation() {
        // run
        this.mLocationClient.start();
        this.misMapMode = false;
    }

    @ReactMethod
    public void stopLocation(){
        // start
        this.mLocationClient.stop();
        this.misMapMode = false;
    }

    @ReactMethod
    public void startMapLocation(){
        // start
        this.mLocationClient.start();
        this.misMapMode = true;
    }

    @ReactMethod
    public void stopMapLocation(){
        // start
        this.mLocationClient.stop();
        this.misMapMode = true;
    }

//    事件
    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
