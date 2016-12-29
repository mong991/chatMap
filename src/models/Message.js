import firebase from 'firebase';
import {
  sendMessage,
  getMarkerList,
} from '../services/Message';

const INITIAL_STATE = {
  messageText: '',
  error: '',
  loading: false,
  markerData: {},
  region: {
    latitude: 24.795258,
    longitude: 120.996351,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  }
};

export default {

  namespace: 'Message',

  state: { ...INITIAL_STATE },

  reducers: {
    messageChanged(state, action) {
      return { ...state, messageText: action.payload };
    },
    showLoading(state) {
      return { ...state, loading: true, error: '' };
    },
    sendSuccess(state) {
      const initialData = { messageText: '', error: '', loading: false };
      return { ...state, ...initialData };
    },
    sendFail(state) {
      return { ...state, error: 'Send Failed.', loading: false };
    },
    markerFetchSuccess(state, action) {
      return { ...state, markerData: action.payload };
    },
    regionChanged(state, action) {
      return { ...state, region: action.payload };
    },
    cleanMap(state) {
      return { ...state, ...INITIAL_STATE };
    }
  },
  effects: {
    * sendMessage({ payload }, { call, put }) {
      //yield put({ type: 'showLoading' });

      const { success, err } = yield call(sendMessage, { ...payload });
      if (success) {
        yield put({ type: 'sendSuccess', payload: success });
      } else if (err) {
        yield put({ type: 'sendFail' });
      }
    },
    * backUserLocation({ payload }, { select, put }) {
      const region = yield select(state => state.Initial.geoRegion);
      yield put({ type: 'regionChanged', payload: region });
    }
  },
  subscriptions: {
    ferchMarker({ dispatch }) {
      firebase.auth().onAuthStateChanged((isLogin) => {
        if (isLogin) {
          getMarkerList((val) => {
            dispatch({ type: 'markerFetchSuccess', payload: val });
          });
        }
      });
    }
  }
};
