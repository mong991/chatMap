import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
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
  privateMsgText: '',
  chatMessage: {
    message: {}
  },
  chatMemberList: {},

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
    },
    updateChatMessage(state, action) {
      return { ...state, chatMessage: action.payload };
    },
    cleanChat(state) {
      return { ...state, ...INITIAL_STATE, chatMemberList: state.chatMemberList };
    },
    listFetchSuccess(state, action) {
      return { ...state, chatMemberList: action.payload };
    }
  },
  effects: {
    * privateChat({ payload }, { call, put }) {
      //payload = { chatUserId, chatUserName, chatUserimg}
      const { chatUserName, chatUserId } = payload;
      const { currentUser } = yield call(getCurrentUser);

      if (currentUser.uid === chatUserId) {
        alert('不要跟自己聊天!!!!');
      } else {
        const chatRoomInfo = yield call(checkChatMember, { ...payload });

        if (chatRoomInfo) {
          yield put({ type: 'getChatRoomSuccess', payload: chatRoomInfo });
        } else {
          yield put({ type: 'getChatRoomFail' });
        }

        Actions.chating({ title: chatUserName });
      }
    },
    * sendPrivateMsg({ payload }, { call, put }) {
      //payload={ chatRoomKey, chatUser, msg }
      let { chatRoomKey } = payload;
      const { chatUser, msg } = payload;

      if (!chatRoomKey) {
        const { chatRoomId, err } = yield call(creatChatRoom, { ...chatUser });
        console.log(chatRoomId, err);
        if (chatRoomId) {
          chatRoomKey = chatRoomId;
        } else if (err) {
          yield put({ type: 'sendFail' });
          return;
        }
      }

      const success = yield call(savePrivateMsg, { chatRoomKey, msg });

      if (success) {
        yield put({ type: 'privateSendSuccess', payload: { chatUser, chatRoomKey } });
      }
    }
  },
  subscriptions: {}
};
