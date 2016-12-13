import _ from 'lodash';
import React, { Component } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'dva/mobile';
import { Button } from 'antd-mobile';

class MainMap extends Component {


  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView 
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 24.795258,
            longitude: 120.996351,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <Button type="primary" style={{ margin: 10 }}>
          Send
        </Button>
      </View>
    );
  }
}
export default connect(null)(MainMap);
