import React from 'react';
import { Navigator } from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import { connect } from 'dva/mobile';

import Auth from './routes/Auth';
import MainMap from './routes/MainMap';
import Chating from './routes/Chating';
import Splash from './components/Splash';
import sideNav from './components/Navigator';

const RouterComponent = ({ dispatch }) => {
  function onLogout() {
    dispatch({ type: 'auth/logoutUser' });
  }

  return (
    <Router
      titleStyle={styles.titleStyle}
      leftButtonIconStyle={{ tintColor: 'white' }}
      rightButtonTextStyle={{ color: 'white' }}
      passProps
    >
      <Scene
      key="splash"
      component={Splash}
      hideNavBar
      passProps
      splashText="Chat Map"
      initial
      />

      <Scene key="auth" >
        <Scene
          key="login"
          component={Auth} title="Please Login"
          style={styles.navBarHeight}
          navigationBarStyle={styles.navBar}
        />
      </Scene>

      <Scene
        key="drawer"
        component={sideNav}
        open={false}
      >
        <Router
          key="main"
          sceneStyle={styles.navBarHeight}
          navigationBarStyle={styles.navBar}
          passProps
        >
          <Scene
            key="map"
            onRight={onLogout}
            rightTitle="Logout"
            component={MainMap}
            title="Chat Map"
            type="replace"
          />
          <Scene
            key="chating"
            component={Chating}
            title=''
          />
        </Router>
      </Scene>
    </Router>
  );
};

const styles = {
  navBarHeight: {
    paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight
  },
  navBar: {
    backgroundColor: 'peru'
  },
  titleStyle: {
    color: 'white',
    fontWeight: 'bold'
  }
};

export default connect()(RouterComponent);
