import React from 'react';
import { Modal, Text, View } from 'react-native';
import {
   Flex,
   Button,
   List,
   WhiteSpace,
   WingBlank,
   Card
} from 'antd-mobile';

const Confirm = ({ children, visible, onAccept, onDecline }) => {
  const { containerStyle, textStyle, cardSectionStyle, buttonStyle } = styles;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
   
      <View style={containerStyle}>
        <WingBlank>
          <List style={cardSectionStyle}>
            <Flex>
              <Text style={textStyle}>
                {children}
              </Text>
            </Flex>
            <Flex>
              <Flex.Item>
                <Button type="primary" onClick={onAccept} style={buttonStyle} >Yes</Button>
              </Flex.Item>
              <Flex.Item>
                <Button type="primary" onClick={onDecline} style={buttonStyle}>No</Button>
              </Flex.Item>
            </Flex>
            <WhiteSpace size="lg"/>
          </List>
        </WingBlank>
      </View>
   
    </Modal>
  );
};

const styles = {
  cardSectionStyle: {
    justifyContent: 'center'
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center'
  },
  buttonStyle: {
      alignSelf: 'stretch',
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10
  }
};

export { Confirm };
