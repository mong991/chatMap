import { Actions } from 'react-native-router-flux';
import { sendMessage } from '../services/Message';

const INITIAL_STATE = {
    messageText: '',
    error: '',
    loading: false
};

export default {

  namespace: 'message',

  state: { ...INITIAL_STATE },

  reducers: {
    messageChanged(state, action) {
      return { ...state, messageText: action.payload };
    },
    showLoading(state) {
      return { ...state, loading: true, error: '' };
    },
    sendSuccess(state) {
      return { ...state, ...INITIAL_STATE };
    },
    sendFail(state) {
      console.log('sendFail');
      return { ...state, error: 'Send Failed.', loading: false };
    }
  },
  effects: {
    * sendMessage({ payload }, { call, put }) {
        //yield put({ type: 'showLoading' });

        const { user, err } = yield call(sendMessage, { message: payload });

        if (user) {
          yield put({ type: 'sendSuccess', payload: user });
        } else if (err) {
          yield put({ type: 'sendFail' });
        }
    }

  },
  subscriptions: {

  },
};
