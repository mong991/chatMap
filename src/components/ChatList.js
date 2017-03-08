import React, { Component } from 'react';
import { Text, View, ListView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'dva/mobile';
import { Flex, List } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import { doWatchChatMemberList } from '../services/Message';

class ChatList extends Component {

  componentWillMount() {
    const { chatMemberList } = this.props;
    console.log(chatMemberList);
    if (chatMemberList) {
      this.undoWatchMarkerList = doWatchChatMemberList(this.onChatList.bind(this));
    }

    this.createDataSource({ chatMemberList });
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps.chatMemberList);
  }

  componentWillUnmount() {
    if (typeof (this.undoWatchList) === 'function') {
      this.undoWatchList();
    }

    this.props.dispatch({
      type: 'Chat/cleanChat'
    });
  }

  onChatList(val) {
    const chatList = val;
    this.props.dispatch({
      type: 'Chat/listFetchSuccess',
      payload: { ...chatList }
    });
  }

  createDataSource(chatList) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.dataSource = ds.cloneWithRows(chatList);
  }

  onPressChatMember(chatUserId, chatUserName, chatUserImg) {
    this.props.dispatch({
      type: 'Chat/privateChat',
        payload: { chatUserId, chatUserName, chatUserImg }
    });
  }

  renderMessageList(chatList) {
    if (chatList.chatUserName) {
      const userImg = chatList.chatUserImg ? { uri: chatList.chatUserImg } : require('../img/default-profile.png');
      return (
        <TouchableOpacity onPress={() => { this.onPressChatMember(chatList.chatUserId, chatList.chatUserName, userImg) }}>
          <View style={styles.chatListItem}>
            <Image
              style={{ height: 35, width: 35, borderRadius: 15 }}
              source={userImg}
            />
            <Text style={{ marginLeft: 5, fontSize: 24 }}>{chatList.chatUserName}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (<View />);
  }

  render() {
    return (
      <View style={styles.view}>
        <ListView
              enableEmptySections
              dataSource={this.dataSource}
              renderRow={this.renderMessageList.bind(this)}
        />
      </View>
    );
  }

}

const styles = {
  view: {
    flex: 1
  },
  chatListItem: {
    marginLeft: 5,
    marginRight: 5,
    padding: 10,
    flexDirection: 'row'
  },

};

const mapStateToProps = ({ Chat }) => {
  const { chatMemberList } = Chat;
    return { chatMemberList };
};

export default connect(mapStateToProps)(ChatList);
