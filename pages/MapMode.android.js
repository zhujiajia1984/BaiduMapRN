import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
// import myImageView from '../MyView';
import myMapView from '../native/MyMapView'

// 
export default class MapMode extends Component {
	//
	constructor(props) {
		super(props);
		this.state = {
			center: {
				longitude: 121.367848,
				latitude: 31.113367
			},
			zoom: 17,			// 3-21
			isLocation: true,
		}
	}

	//
	static navigationOptions = ({ navigation }) => ({
		headerTitleStyle: { color: 'white', alignSelf: 'center', paddingRight: 70 },
		headerTitle: "地图定位",
	});

	// <myImageView borderRadius={0.5}></myImageView>
	//
	render() {
		return (
			<View style={styles.container}>
				<myMapView 
					style={styles.map}
					center={this.state.center}
					zoom={this.state.zoom}
					location={this.state.isLocation}
				>
				</myMapView>
			</View>
		);
	}
}

// css
const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#f7f7f7',
	},
	map:{
		width: '100%',
		height: '100%',
	}
});