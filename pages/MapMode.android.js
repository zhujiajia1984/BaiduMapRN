import React, { Component } from 'react';
import { Text, View } from 'react-native';
import myImageView from '../MyView'

// 
export default class MapMode extends Component {
	//
	constructor(props) {
		super(props);
	}

	//
	static navigationOptions = ({ navigation }) => ({
		headerTitleStyle: { color: 'white', alignSelf: 'center', paddingRight: 70 },
		headerTitle: "地图定位",
	});

	//
	render() {
		return (
			<View>
		<myImageView borderRadius={0.5}></myImageView>
      </View>
		);
	}
}