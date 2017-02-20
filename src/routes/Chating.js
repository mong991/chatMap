import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'dva/mobile';
import { Text, View, TextInput, Image, Dimensions, ListView } from 'react-native';
import { Button, Flex, List } from 'antd-mobile';
import { doWatchChatList } from '../services/Message';

const { height, width } = Dimensions.get('window');
class Chating extends Component {

  componentWillMount() {
    const { chatRoomKey } = this.props.Chat.chatRoomInfo;
    if (chatRoomKey) {
      this.undoWatchList = doWatchChatList(this.onChatMessage.bind(this), chatRoomKey);
    }
    const { message } = this.props.Chat.chatMessage;
    this.createDataSource({ chatMessage: message });
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps.Chat.chatRoomInfo.chatRoomKey);
    const { chatRoomKey } = this.props.Chat.chatRoomInfo;
    const nextChatRoomKey = nextProps.Chat.chatRoomInfo.chatRoomKey;
    if ((chatRoomKey !== nextChatRoomKey) && nextChatRoomKey) {
       this.undoWatchList = doWatchChatList(this.onChatMessage.bind(this), nextChatRoomKey);
    }
    const { message } = nextProps.Chat.chatMessage;
    this.createDataSource(message);
  }

  componentWillUnmount() {
    if (typeof (this.undoWatchList) === 'function') {
      this.undoWatchList();
    }

    this.props.dispatch({
      type: 'Chat/cleanChat'
    });
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

  createDataSource(chatMessage) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.dataSource = ds.cloneWithRows(chatMessage);
  }

  renderMessageList(chatMessage) {
    if (chatMessage.userId) {
      const { member } = this.props.Chat.chatMessage;
      const { userName } = this.props.CurrentUser;
      let justify = '';

      if (userName === chatMessage.userName) {
        justify = 'end';
      } else {
        justify = 'start';
      }

      const userImg = member[chatMessage.userId].userImg ? { uri: member[chatMessage.userId].userImg } : require('../img/default-profile.png');

      const key = new Date().getTime();
      return (
        <Flex key={key} style={styles.chatMessageItem} justify={justify} align="start">
          <Image
            style={{ height: 35, width: 35, borderRadius: 15 }}
            source={userImg}
          />
          <View style={{ marginLeft: 5, maxWidth: width * 0.6 }}>
            <Text key='{key}+name' style={{ fontSize: 12 }}>{chatMessage.userName}</Text>
            <View style={{ backgroundColor: '#ffe4b5', borderRadius: 10, marginTop: 5 }}>
              <Text key='{key}+msg' style={styles.msgText} >{chatMessage.msg}</Text>
            </View>
          </View>
        </Flex>
      );
    }
    return (<Flex />);
  }

  render() {
    const { privateMsgText } = this.props.Chat;
    return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 9 }}>
            <ListView
              enableEmptySections
              dataSource={this.dataSource}
              renderRow={this.renderMessageList.bind(this)}
            />
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
    marginLeft: 5,
    marginRight: 5,
    padding: 2
  },
  msgText: {
    padding: 10
  }
};

const mapStateToProps = ({ Chat, auth }) => {
    const CurrentUser = auth.user;
    return { Chat, CurrentUser };
};

export default connect(mapStateToProps)(Chating);

