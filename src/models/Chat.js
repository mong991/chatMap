import { Actions } from 'react-native-router-flux';
import {
  checkChatMember,
  savePrivateMsg,
  creatChatRoom
} from '../services/Message';
import { getCurrentUser } from '../services/Auth';

const INITIAL_STATE = {
  chatError: '',
  chatLoading: false,
  chatRoomInfo: {},
  privateMsgText: ''
};

export default {

  namespace: 'Chat',

  state: { ...INITIAL_STATE },

  reducers: {
    showLoading(state) {
      return { ...state, loading: true, error: '' };
    },
    sendFail(state) {
      return { ...state, error: 'Send Failed.', loading: false };
    },
    getChatRoomSuccess(state, action) {
      return { ...state, chatRoomInfo: action.payload };
    },
    getChatRoomFail(state) {
      return { ...state, error: 'Chating Failed.' };
    },
    privateMsgChanged(state, action) {
      return { ...state, privateMsgText: action.payload };
    },
    privateSendSuccess(state, action) {
      return { ...state, privateMsgText: '', loading: false, chatRoomInfo: action.payload };
    }
  },
  effects: {
    * privateChat({ payload }, { call, put }) {
      const { chatUserName, chatUserId } = payload;
      const { currentUser } = yield call(getCurrentUser);

      if (currentUser.uid === chatUserId) {
        alert('不要跟自己聊天!!!!');
      } else {
        const chatRoomInfo = yield call(checkChatMember, { chatUserId, chatUserName });

        if (chatRoomInfo) {
          yield put({ type: 'getChatRoomSuccess', payload: chatRoomInfo });
        } else {
          yield put({ type: 'getChatRoomFail' });
        }

        Actions.chating({ title: chatUserName });
      }
    },
    * sendPrivateMsg({ payload }, { call, put }) {
      //yield put({ type: 'showLoading' });
      let { chatRoomKey, chatUser, msg } = payload;

      if (!chatRoomKey) {
        const { chatRoomId, createdErr } = yield call(creatChatRoom, { ...chatUser });

        if (chatRoomId) {
          chatRoomKey = chatRoomId;
        } else if (createdErr) {
          yield put({ type: 'sendFail' });
          return;
        }
      }
      console.log(chatRoomKey);
      const success = yield call(savePrivateMsg, { chatRoomKey, msg });
      console.log(success);
      if (success) {
        yield put({ type: 'privateSendSuccess', payload: { chatUser, chatRoomKey } });
      }
    }
  },
  subscriptions: {}
};
