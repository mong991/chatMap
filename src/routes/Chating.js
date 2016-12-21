import React, { Component } from 'react';
import { connect } from 'dva/mobile';
import { Text, View, TextInput } from 'react-native';
import { Button, Flex, List } from 'antd-mobile';

class Chating extends Component {

  componentDidMount() {
    //this.listenForItems(this.itemsRef);
  }

  onTextareaChange(text) {
    this.props.dispatch({
      type: 'Chat/privateMsgChanged',
      payload: text
    });
  }

  onButtonPress() {
    const { chatRoomKey, chatUser } = this.props.Chat.chatRoomInfo;
    const { privateMsgText } = this.props.Chat;
    this.props.dispatch({
      type: 'Chat/sendPrivateMsg',
      payload: { msg: privateMsgText, chatRoomKey, chatUser }
    });
  }

  render() {
    const { chatRoomKey } = this.props.Chat.chatRoomInfo;
    const { privateMsgText } = this.props.Chat;
    console.log(this.props.Chat);
    return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 9 }}>
            <Text >
              chatRoomKey=>{ chatRoomKey }
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <List>
              <Flex>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={styles.sendTextStyle}
                    onChangeText={this.onTextareaChange.bind(this)}
                    placeholder='說點甚麼吧~'
                    value={privateMsgText}
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

const mapStateToProps = ({ Chat }) => {
    return { Chat };
};

export default connect(mapStateToProps)(Chating);

