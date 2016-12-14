import _ from 'lodash';

import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

const INITIAL_STATE = {
  region: {
    latitude: 24.795258,
    longitude: 120.996351,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  }
};

export default {
  namespace: 'Initial',
  state: { ...INITIAL_STATE },
  reducers: {
    regionChanged(state, action) {
      return { ...state, region: action.payload };
    },
    newRegion(state, action) {
      return { ...state, newRegion: action.payload };
    },
  },
  effects: {},
  subscriptions: {
    setup({ dispatch }) {
      const config = {
            apiKey: 'AIzaSyAdZaDJ6oivgSPiPyrwZeCtRGtE1Olg2k4',
            authDomain: 'chatmap-5780f.firebaseapp.com',
            databaseURL: 'https://chatmap-5780f.firebaseio.com',
            storageBucket: 'chatmap-5780f.appspot.com',
            messagingSenderId: '150134550030'
      };
      firebase.initializeApp(config);

      navigator.geolocation.getCurrentPosition(
          (position) => {
            const region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            };

            dispatch({
                type: 'regionChanged',
                payload: region
            });
          },
          (error) => alert(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      firebase.auth().onAuthStateChanged((isLogin) => {
        if (isLogin) {
          Actions.main();
        } else {
          Actions.auth();
        }
      });
    },
     geolocation({ dispatch }) {
        this.watchID = navigator.geolocation.watchPosition((position) => {
          const newRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          };

          dispatch({
                type: 'regionChanged',
                payload: newRegion
          });
        });
    }
  }
};

