import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
  sendMessage,
  getMarkerList,
} from '../services/Message';

const INITIAL_STATE = {
  messageText: '',
  error: '',
  loading: false,
  markerData: {},
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
      const markerData = state.markerData;
      return { ...state, ...INITIAL_STATE, markerData };
    },
    sendFail(state) {
      return { ...state, error: 'Send Failed.', loading: false };
    },
    markerFetchSuccess(state, action) {
      return { ...state, markerData: action.payload };
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
