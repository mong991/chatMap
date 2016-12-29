import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'dva/mobile';
//import { getChatList } from '../services/Message';

class ChatList extends Component {

  // componentWillMount() {
  //   //this.undoWatchMarkerList = getChatList(this.onChatList.bind(this));
  // }

  // onChatList(val) {
  //   const chatList = val;
  //   this.props.dispatch({
  //     type: 'Chat/listFetchSuccess',
  //     payload: { ...chatList }
  //   });
  // }

  render() {
    return (
      <View style={styles.splashView}>
        <Text style={styles.splashText}>
          sdfghjkl;''
        </Text>
      </View>
    );
  }

}

const styles = {
  splashView: {
    flex: 1,
    justifyContent: 'center'
  },
  splashText: {
    fontSize: 50,
    textAlign: 'center'
  }
};

 const mapStateToProps = ({ Chat }) => {
   console.log(Chat);
    return { Chat };
};

export default connect(mapStateToProps)(ChatList);
