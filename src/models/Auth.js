import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import { signInWithEmailAndPassword, signOut, getUser } from '../services/Auth';

const INITIAL_STATE = {
    user: null,
    email: '',
    password: '',
    error: '',
    loading: false
};

export default {

  namespace: 'auth',

  state: { ...INITIAL_STATE },

  reducers: {
    emailChanged(state, action) {
      return { ...state, email: action.payload };
    },
    passwordChanged(state, action) {
      return { ...state, password: action.payload };
    },
    showLoading(state) {
      return { ...state, loading: true, error: '' };
    },
    loginSuccess(state, action) {
      return { ...state, ...INITIAL_STATE, user: action.payload };
    },
    loginFail(state) {
      return { ...state, error: 'Authentication Failed.', password: '', loading: false };
    },
    updateCurrentUser(state, action) {
      return { ...state, user: action.payload };
    }
  },
  effects: {
    * loginUser({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { email, password } = payload;
      const { user, err } = yield call(signInWithEmailAndPassword, email, password);

      if (user) {
        yield put({ type: 'loginSuccess', payload: user });
      } else if (err) {
        yield put({ type: 'loginFail' });
      }
    },
    * logoutUser({ payload }, { call }) {
      yield call(signOut);
    },
    * getUserInfo({ payload }, { call, put }) {
      const user = yield call(getUser);
      if (user) {
        yield put({ type: 'updateCurrentUser', payload: user });
      }
    }

  },
  subscriptions: {},
};
