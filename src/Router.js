import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import Auth from './routes/Auth';
import MainMap from './routes/MainMap';
import Chating from './routes/Chating';
import Splash from './components/Splash';

const RouterComponent = ({ dispatch }) => {
    function onLogout() {
        dispatch({ type: 'auth/logoutUser' });
    }

    return (
        <Router sceneStyle={{ paddingTop: 55 }}>

            <Scene
                key="splash"
                component={Splash}
                hideNavBar
                passProps
                splashText="Chat Map"
                initial
            />

            <Scene key="auth">
                <Scene key="login" component={Auth} title="Please Login" />
            </Scene>
            <Scene key="main">
                <Scene
                    key="map"
                    onRight={onLogout}
                    rightTitle="Logout"
                    component={MainMap}
                    title="Chat Map"
                />
                <Scene
                    key="chating"
                    component={Chating}
                    title=''
                />

            </Scene>

        </Router>
    );
};

export default connect()(RouterComponent);
