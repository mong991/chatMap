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

 console.log('checkChatMember');
  return new Promise((resolve, reject) => {
   ref.once('value', snapshot => {
      const isfriend = snapshot.val();
      if (isfriend) {
        const chatRoomKey = isfriend.chatRoomKey;
        resolve({ chatRoomKey, chatUser });
      } else {
        ref.set(true);
        resolve({ chatUser });
      }
    });
  });
}

export function creatChatRoom(user) {
  const { currentUser } = firebase.auth();
  const userId = currentUser.uid;
  const name = _.split(currentUser.email, '@', 2);
  const { chatUserId, chatUserName } = user;

  const member = {};
  member[userId] = { userId, userName: name[0] };
  member[chatUserId] = { userId: chatUserId, userName: chatUserName };

  const chatRoomId = firebase.database().ref().child('chatRoom').push({ member }).key;

  const updates = {};
  updates[`/${userId}/${chatUserId}`] = {
    chatRoomKey: chatRoomId,
    chatUserId
  };
  updates[`/${chatUserId}/${userId}`] = {
    chatRoomKey: chatRoomId,
    chatUserId: userId
  };

  return firebase.database().ref().child('chatMemberList').update(updates)
          .then(() => ({ chatRoomId }))
          .catch((err) => ({ err }));
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

// export function doWatchChatMemberList(callback) {
//   const { currentUser } = firebase.auth();
//   //const { chatRoomId } = chatData;
//   const ref = firebase.database().ref(`/chatMemberList/${currentUser.uid}`);

//   const handler = (snapshot) => {
//     callback(snapshot.val());
//   };

//   ref.on('value', handler);

//   return () => {
//     ref.off('value', handler);
//   };
// }
