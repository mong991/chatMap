import _ from 'lodash';
import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
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

  onPressCallout(userId, userName) {
    console.log('onPressCallout');
    this.props.dispatch({
        type: 'Chat/privateChat',
        payload: { userId, userName }
    });
  }

  renderMarker() {
    const markerList = this.props.userMarker.map((marker, index) => {
       if (marker.latlon) {
          return (
            <MapView.Marker
              key={index}
              coordinate={marker.latlon}
              title={`userId: ${marker.username}`}
              description={`message: ${marker.lastMessage}`}
            >
            <MapView.Callout
              style={{ width: 160 }}
              onPress={() => this.onPressCallout(marker.userId, marker.username)}
            >

              <View>
                <Text>{`userId: ${marker.username}`}</Text>
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
        <MapView
          style={{ flex: 9 }}
          initialRegion={this.props.region}
          showsUserLocation
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
    }
  };

  const mapStateToProps = ({ Message, Initial }) => {
    const userMarker = _.map(Message.markerData, (data, key) => {

      return { ...data, userId: key };
    });

    const { region } = Initial;
    const message = Message;
    return { message, region, userMarker };
  };

export default connect(mapStateToProps)(MainMap);
