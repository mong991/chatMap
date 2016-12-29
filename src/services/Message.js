import firebase from 'firebase';
import _ from 'lodash';

export function sendMessage(data) {
  const { currentUser } = firebase.auth();
  const message = data.messageText;
  const latlon = data.latlon;
  const userId = currentUser.uid;


  return (
    firebase.database().ref(`/userInfo/${currentUser.uid}/lastMessage`).set(message)
      .then(() => {
        return (firebase.database().ref('/publish_chat')
          .push({ userId, message, latlon })
          .then((success) => ({ success }))
          .catch((err) => ({ err }))
        );
      })
      .catch((err) => ({ err }))
  );
}

export function getMarkerList(callback) {
  const ref = firebase.database().ref('/userInfo');

  const handler = (snapshot) => {
    callback(snapshot.val());
  };

  ref.on('value', handler);

  return () => {
    ref.off('value', handler);
  };
}

export function checkChatMember(chatUser) {
  const { currentUser } = firebase.auth();
  const { chatUserId } = chatUser;
  const ref = firebase.database().ref(`/chatMemberList/${currentUser.uid}/${chatUserId}`);

  return new Promise((resolve, reject) => {
   ref.once('value', snapshot => {
      const chatRoomKey = snapshot.val();
      if (chatRoomKey) {
        resolve({ chatRoomKey, chatUser });
      } else {
        resolve({ chatUser });
        // const chatRoomKey = ref.push(false).key;
        // const { success, err } = creatChatRoom(chatRoomKey, chatuserId);

        // if (success) {
        //   resolve({ chatRoomKey, usedChatRoom: false, chatuserId });
        // } else if (err) {
        //   reject({ err });
        // }
      }
    });
  });
}

export function creatChatRoom(user) {
  const { currentUser } = firebase.auth();
  const userId = currentUser.uid;
  const name = _.split(currentUser.email, '@', 2);
  const { chatUserId, chatUserName } = user;

  const ref = firebase.database().ref('/chatRoom');
  const chatList = firebase.database().ref('/chatMemberList/');

  const member = {};
  member[userId] = { userId, userName: name[0] };
  member[chatUserId] = { userId: chatUserId, userName: chatUserName };

  const chatRoomId = ref.push({ member }).key;

  if (chatRoomId) {
    return (
      chatList.child(userId).child(chatUserId).set(chatRoomId: chatRoomId)
        .then(() => {
          return (
            chatList.child(chatUserId).child(userId).set(chatRoomId: chatRoomId)
              .then(() => ({ chatRoomId }))
              .catch((err) => ({ err }))
          );
        })
        .catch((err) => ({ err }))
    );
  }

  return { err: 'error' };
}

export function savePrivateMsg(data) {
  const { currentUser } = firebase.auth();
  const { msg, chatRoomKey } = data;
  const userId = currentUser.uid;
  const userName = _.split(currentUser.email, '@', 2);
  const time = new Date().getTime();

  const ref = firebase.database().ref(`/chatRoom/${chatRoomKey}/message`);
  const success = ref.push({
    userId,
    userName: userName[0],
    msg,
    time
  }).key;
   return { success };
}

export function doWatchChatList(callback, chatRoomId) {
  //const { currentUser } = firebase.auth();
  //const { chatRoomId } = chatData;
  const ref = firebase.database().ref(`/chatRoom/${chatRoomId}`);

  const handler = (snapshot) => {
    callback(snapshot.val());
  };

  ref.on('value', handler);

  return () => {
    ref.off('value', handler);
  };
}

// export function doWatchChatMemberList(callback, chatRoomId) {
//   const { currentUser } = firebase.auth();
//   //const { chatRoomId } = chatData;
//   const ref = firebase.database().ref(`/chatMemberList/${currentUser}`);

//   const handler = (snapshot) => {
//     callback(snapshot.val());
//   };

//   ref.on('value', handler);

//   return () => {
//     ref.off('value', handler);
//   };
// }
