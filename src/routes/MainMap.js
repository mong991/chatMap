import _ from 'lodash';
import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
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
    this.props.dispatch({
        type: 'message/sendMessage',
        payload: this.props.message.messageText
    });
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
        <MapView.Marker
          coordinate={this.props.region}
          title='{marker.title}'
          description='{marker.description}'
        />
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
    const { region } = Initial;
    console.log(Initial);
    return { message, region };
  };

export default connect(mapStateToProps)(MainMap);
