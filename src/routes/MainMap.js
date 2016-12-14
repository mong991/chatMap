import _ from 'lodash';
import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'dva/mobile';
import { Button, Flex, List } from 'antd-mobile';

class MainMap extends Component {

  onTextareaChange(text) {
    this.props.dispatch({
        type: 'message/messageChanged',
        payload: text
    });
  }

  onButtonPress() {
    const { messageText } = this.props.message;
    const { latitude, longitude } = this.props.region;
    const latlon = { latitude, longitude };

    this.props.dispatch({
        type: 'message/sendMessage',
        payload: { messageText, latlon }
    });
  }

  onPressCallout(userId) {
    this.props.dispatch({
        type: 'message/privateChat',
        payload: userId
    });
  }

  renderMarker() {
    const markerList = this.props.publish_chat.map((marker, index) => {
       if (marker.latlon) {
          return (
            <MapView.Marker
              key={index}
              coordinate={marker.latlon}
              title={`userId: ${marker.userId}`}
              description={`message: ${marker.message}`}
            >
            <MapView.Callout
              style={{ width: 160 }}
              onPress={() => this.onPressCallout(marker.userId)}
            >

              <View>
                <Text>{`userId: ${marker.userId}`}</Text>
                <Text>{`message: ${marker.message}`}</Text>
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

  const mapStateToProps = ({ message, Initial }) => {
    const publish_chat = _.map(message.markerData, (data) => {
      return { ...data };
    });

    const { region } = Initial;
    return { message, region, publish_chat };
  };

export default connect(mapStateToProps)(MainMap);
