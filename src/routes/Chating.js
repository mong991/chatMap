import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'dva/mobile';
import { Text, View, TextInput } from 'react-native';
import { Button, Flex, List } from 'antd-mobile';
import { doWatchChatList } from '../services/Message';

class Chating extends Component {

  componentWillMount() {
    const { chatRoomKey } = this.props.Chat.chatRoomInfo;
    if (chatRoomKey) {
      doWatchChatList(this.onChatMessage.bind(this), chatRoomKey);
    }
  }

  componentWillReceiveProps(nextProps) {
    const chatRoomKey = this.props.Chat.chatRoomInfo.chatRoomKey;
    const nextChatRoomKey = nextProps.Chat.chatRoomInfo.chatRoomKey;

    if (chatRoomKey !== nextChatRoomKey && !chatRoomKey) {
       doWatchChatList(this.onChatMessage.bind(this), chatRoomKey);
    }
  }

  onChatMessage(val) {
    const messages = val;
    this.props.dispatch({
      type: 'Chat/updateChatMessage',
      payload: { ...messages }
    });
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

    if (privateMsgText) {
      this.props.dispatch({
        type: 'Chat/sendPrivateMsg',
        payload: { msg: privateMsgText, chatRoomKey, chatUser }
      });
    }
  }

  renderMessageList() {
    console.log(this.props);
    const { chatMessage } = this.props.Chat;
    const { userName } = this.props.CurrentUser;
    let justify = '';
    const messageItem = _.map(chatMessage, (data, key) => {
      if (userName === data.userName) {
        justify = 'end';
      } else {
        justify = 'start';
      }

      return (
        <Flex key={key} style={styles.chatMessageItem} justify={justify}>
          <Text key='{key}+name'>{data.userName}:</Text>
          <Text key='{key}+msg' style={styles.msgText} >{data.msg}</Text>
        </Flex>
      );
    });
    return messageItem;
  }

  render() {
    const { privateMsgText } = this.props.Chat;
    return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 9 }}>
            <List>
              {this.renderMessageList()}
            </List>
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
  },
  chatMessageItem: {
    marginTop: 5,
    padding: 2
  },
  msgText: {
    padding: 5
  }
};

const mapStateToProps = ({ Chat, auth }) => {
    const CurrentUser = auth.user;
    return { Chat, CurrentUser };
};

export default connect(mapStateToProps)(Chating);

