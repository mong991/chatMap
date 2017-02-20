import React, { Component } from 'react';
import { Text, View, ListView, Image } from 'react-native';
import { connect } from 'dva/mobile';
import { Flex, List } from 'antd-mobile';
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
  //   const { chatMemberList } = this.props;
  //   const nextChatMemberList = nextProps.chatMemberList;
  //   if ((chatMemberList !== nextChatMemberList) && nextChatMemberList) {
  //      this.undoWatchList = doWatchChatMemberList(this.onChatList.bind(this), nextChatMemberList);
  //   }
  //  // const { chatMemberList } = nextProps.Chat;
  console.log('next');
   console.log(nextProps);
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

  renderMessageList(chatList) {
    if (chatList.chatUserName) {
      console.log(chatList.chatUserName);
      const userImg = chatList.chatUserImg ? { uri: chatList.chatUserImg } : require('../img/default-profile.png');
      return (
        <Flex style={styles.chatListItem}>
           <Image
            style={{ height: 35, width: 35, borderRadius: 15 }}
            source={userImg}
          />
          <View style={{ marginLeft: 5 }}>
            <Text style={{ fontSize: 24 }}>{chatList.chatUserName}</Text>
          </View>
        </Flex>
      );
    }
    return (<View />);
  }

  render() {
    return (
      <View style={styles.splashView}>
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
  splashView: {
    flex: 1,
    justifyContent: 'center'
  },
  chatListItem: {
    marginLeft: 5,
    marginRight: 5,
    padding: 10
  },
};

const mapStateToProps = ({ Chat }) => {
  const { chatMemberList } = Chat;
    return { chatMemberList };
};

export default connect(mapStateToProps)(ChatList);
