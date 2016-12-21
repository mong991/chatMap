import React from 'react';
import { connect } from 'dva/mobile';
import { Text, View, TextInput } from 'react-native';
import { Button, Flex, List } from 'antd-mobile';

function Chating({ dispatch, Chat }) {
  const { chatRoomKey, chatUser } = Chat.chatRoomInfo;
  const { privateMsgText } = Chat;

  function onTextareaChange(text) {
    dispatch({
      type: 'Chat/privateMsgChanged',
      payload: text
    });
  }

  function onButtonPress() {
    dispatch({
      type: 'Chat/sendPrivateMsg',
      payload: { msg: privateMsgText, chatRoomKey, chatUser }
    });
  }

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
                  onChangeText={onTextareaChange}
                  placeholder='說點甚麼吧~'
                  value={privateMsgText}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  type="primary"
                  style={{ margin: 5 }}
                  onClick={onButtonPress}
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

