import firebase from 'firebase';

export function sendMessage(data) {
  const { currentUser } = firebase.auth();
  const message = data.messageText;
  const latlon = data.latlon;
  const userId = currentUser.uid;

  return (
    firebase.database().ref('/publish_chat')
      .push({ userId, message, latlon })
      .then((user) => ({ user }))
      .catch((err) => ({ err }))
  );
}

export function getMarkerList(callback) {
  const ref = firebase.database().ref('/publish_chat');

  const handler = (snapshot) => {
    callback(snapshot.val());
  };

  ref.on('value', handler);

  return () => {
    ref.off('value', handler);
  };
}

// export function doWatchList(callback) {
//   const { currentUser } = firebase.auth();
//   const ref = firebase.database().ref(`/users/${currentUser.uid}/employees`);

//   const handler = (snapshot) => {
//     callback(snapshot.val());
//   };

//   ref.on('value', handler);

//   return () => {
//     ref.off('value', handler);
//   };
// }
