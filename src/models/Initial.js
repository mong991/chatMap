import _ from 'lodash';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { updateLocation } from '../services/Auth';

const INITIAL_STATE = {
  geoRegion: {
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
    geoRegionChanged(state, action) {
      return { ...state, geoRegion: action.payload };
    }
  },
  effects: {
    * setLocation({ payload }, { select, call, put }) {
        const user = yield select(state => state.Initial.user);
        if (user) {
          yield call(updateLocation, { ...payload });
        }

        yield put({
          type: 'geoRegionChanged',
          payload
        });
    },
  },
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
            const newRegion = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            };
            dispatch({
                type: 'Message/regionChanged',
                payload: newRegion
            });
          },
          (error) => alert(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 10 }
      );

      firebase.auth().onAuthStateChanged((isLogin) => {
        if (isLogin) {
          dispatch({
              type: 'auth/getUserInfo'
          });
          Actions.drawer({ type: 'reset' });
        } else {
          Actions.auth({ type: 'reset' });
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
                type: 'setLocation',
                payload: newRegion
          });
        });
    }
  }
};

