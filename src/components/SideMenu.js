import React from 'react';
import { Text, View, Image, Navigator, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { List } from 'antd-mobile';

function onPressItem() {
  alert('onPressItem');
}

function SideMenu({ close }) {
  return (
    <View style={{ flex: 1 }}>
      <List
        renderHeader={() => {
          return (
            <View>
              <Image
                style={styles.icon}
                source={require('../img/sideMeun.jpg')}
              />
              <Text style={styles.meunTitleStyle} >Menu</Text>
            </View>
          );
        }}
      >
        <TouchableOpacity style={styles.iconBorder} onPress={onPressItem}>
          <Text style={styles.textStyle}>
            Publish Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBorder} onPress={() => { close(); Actions.chatList(); }}>
          <Text style={styles.textStyle}>
            Chat List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBorder} onPress={onPressItem}>
          <Text style={styles.textStyle}>
            Logout
          </Text>
        </TouchableOpacity>

      </List>
    </View>
  );
}

const styles = {
  textStyle: {
    fontSize: 18,
    alignSelf: 'flex-start',
    padding: 10,
    margin: 5
  },
  icon: {
    height: Navigator.NavigationBar.Styles.General.NavBarHeight + 30
  },
  meunTitleStyle: {
    position: 'absolute',
    fontSize: 16,
    zIndex: 10,
    bottom: 10,
    left: 10,
    color: 'ivory',
    fontWeight: 'bold',
  }
};

export default SideMenu;

