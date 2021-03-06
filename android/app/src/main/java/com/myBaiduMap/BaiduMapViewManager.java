package com.myBaiduMap;


import android.content.Context;
import android.graphics.Point;
import android.view.View;


import com.baidu.mapapi.SDKInitializer;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdate;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.MapViewLayoutParams;
import com.baidu.mapapi.model.LatLng;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by zjj on 2017/12/6.
 */

public class BaiduMapViewManager extends ViewGroupManager<MapView> {
    public static final String REACT_CLASS = "myMapView";
    public static boolean misLocation = false;
    private ReadableArray childrenPoints;
    MapView mMapView = null;

    public void initSDK(Context context) {
        SDKInitializer.initialize(context);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public MapView createViewInstance(ThemedReactContext context) {
        this.mMapView = new MapView(context);
        return this.mMapView;
    }

    @Override
    public void addView(MapView parent, View child, int index) {
        if(childrenPoints != null) {
            Point point = new Point();
            ReadableArray item = childrenPoints.getArray(index);
            if(item != null) {
                point.set(item.getInt(0), item.getInt(1));
                MapViewLayoutParams mapViewLayoutParams = new MapViewLayoutParams
                        .Builder()
                        .layoutMode(MapViewLayoutParams.ELayoutMode.absoluteMode)
                        .point(point)
                        .build();
                parent.addView(child, mapViewLayoutParams);
            }
        }
    }

    // 定位


    @ReactProp(name="center")
    public void setCenter(MapView mapView, ReadableMap position) {
        if(position != null) {
            double latitude = position.getDouble("latitude");
            double longitude = position.getDouble("longitude");
            LatLng point = new LatLng(latitude, longitude);
            MapStatus mapStatus = new MapStatus.Builder()
                    .target(point)
                    .build();
            MapStatusUpdate mapStatusUpdate = MapStatusUpdateFactory.newMapStatus(mapStatus);
            mapView.getMap().setMapStatus(mapStatusUpdate);
        }
    }

    @ReactProp(name="zoom")
    public void setZoom(MapView mapView, float zoom) {
        if(zoom >= 0) {
            MapStatus mapStatus = new MapStatus.Builder()
                    .zoom(zoom)
                    .build();
            MapStatusUpdate mapStatusUpdate = MapStatusUpdateFactory.newMapStatus(mapStatus);
            mapView.getMap().setMapStatus(mapStatusUpdate);
        }
    }

    @ReactProp(name="location")
    public void setLocation(MapView mapView, Boolean isLocation) {
        this.misLocation = isLocation;
        if(isLocation) {
            mapView.getMap().setMyLocationEnabled(true);
        }else{
            mapView.getMap().setMyLocationEnabled(false);
        }
    }
}
