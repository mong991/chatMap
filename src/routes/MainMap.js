import _ from 'lodash';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'dva/mobile';
import { Button, TextareaItem, Flex, List } from 'antd-mobile';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 24.795258;
const LONGITUDE = 120.996351;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class MainMap extends Component {
  state={
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      const newRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

      //this.onRegionChange(newRegion);
    });
  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView 
          style={{ flex: 9 }}
          initialRegion={{
            latitude: 24.795258,
            longitude: 120.996351,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          <MapView.Marker
              key='geolocation'
              coordinate={{ 
                latitude: this.state.region.latitude, 
                longitude: this.state.region.longitude 
              }}
          />
        </MapView>
        <View style={{ flex: 1 }}>
          <List>
            <Flex>
              <View style={{ flex: 3 }}>
                <TextareaItem 
                  style={styles.sendTextStyle}
                  autoHeight
                  placeholder='說點甚麼吧~'

                />
              </View>
              <View style={{ flex: 1 }}>
                <Button type="primary" style={{ margin: 5 }}>Send</Button>
              </View>  
            </Flex>
          </List>
        </View>
      </View>
    );
  }
  
}

  const styles = {
    sendTextStyle: {
      fontSize: 18,
      paddingLeft: 5,
      paddingTop: 10
    }
  };

export default connect(null)(MainMap);
