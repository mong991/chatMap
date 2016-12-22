import _ from 'lodash';
import React, { Component } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'dva/mobile';
import { Button, Flex, List } from 'antd-mobile';

class MainMap extends Component {

  onTextareaChange(text) {
    this.props.dispatch({
        type: 'Message/messageChanged',
        payload: text
    });
  }

  onButtonPress() {
    const { messageText } = this.props.message;
    const { latitude, longitude } = this.props.region;
    const latlon = { latitude, longitude };

    this.props.dispatch({
        type: 'Message/sendMessage',
        payload: { messageText, latlon }
    });
  }

  onPressCallout(chatUserId, chatUserName) {
    this.props.dispatch({
        type: 'Chat/privateChat',
        payload: { chatUserId, chatUserName }
    });
  }

  onRegionChange(region) {
    this.props.dispatch({
        type: 'Message/regionChanged',
        payload: region
    });
  }

  onPressLocation() {
    this.props.dispatch({
        type: 'Message/backUserLocation'
    });
  }

  renderMarker() {
    const markerList = this.props.userMarker.map((marker, index) => {

      if (marker.latlon) {
        const profileImg = marker.img ? { uri: marker.img } : require('../img/default-profile.png');

        return (
          <MapView.Marker
            key={index}
            coordinate={marker.latlon}
            title={`userId: ${marker.userName}`}
            anchor={{ x: 0.5, y: 1.2 }}
            centerOffset={{ x: 0.5, y: 1.2 }}
          >
            <Image
              source={profileImg}
              style={{ width: 35, height: 35 }}
            />
            <MapView.Callout
              style={{ width: 160 }}
              onPress={() => this.onPressCallout(marker.userId, marker.userName)}
            >
              <View>
                <Text>{`userId: ${marker.userName}`}</Text>
                <Text>message:{ marker.lastMessage ? marker.lastMessage : '' }</Text>
              </View>
            </MapView.Callout>
          </MapView.Marker>
        );
       }
    });
    return markerList;
  }

  // renderButton() {
  //   if (loading) {
  //     return <ActivityIndicator size="large" color="#0080FF" />;
  //   }

  //   return (
  //     <Button type="primary" onClick={onButtonPress} style={{ margin: 10 }}>
  //       Login
  //     </Button>
  //   );
  // }

  render() {
    const { messageText } = this.props.message;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.iconBorder} onPress={this.onPressLocation.bind(this)}>
          <Image
            style={styles.icon}
            source={require('../img/location.png')}
          />
        </TouchableOpacity>
        <MapView
          style={{ flex: 9 }}
          initialRegion={this.props.region}
          showsUserLocation
          onRegionChange={this.onRegionChange.bind(this)}
          region={this.props.region}
        >
          {this.renderMarker()}
        </MapView>

        <View style={{ flex: 1 }}>
          <List>
            <Flex>
              <View style={{ flex: 3 }}>
                <TextInput
                  style={styles.sendTextStyle}
                  value={messageText}
                  placeholder='說點甚麼吧~'
                  onChangeText={this.onTextareaChange.bind(this)}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  type="primary"
                  style={{ margin: 5 }}
                  onClick={this.onButtonPress.bind(this)}
                >
                  Send
                </Button>
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
      paddingLeft: 10,
      paddingTop: 10
    },
    icon: {
      width: 30,
      height: 30
    },
    iconBorder: {
      position: 'absolute',
      width: 30,
      height: 30,
      top: 10,
      left: 10,
      zIndex: 10
    }
  };

  const mapStateToProps = ({ Message }) => {
    const userMarker = _.map(Message.markerData, (data, key) => {

      return { ...data, userId: key };
    });

    const { region } = Message;
    const message = Message;
    return { message, region, userMarker };
  };

export default connect(mapStateToProps)(MainMap);
