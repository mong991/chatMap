import firebase from 'firebase';

export function sendMessage(data) {
  const { currentUser } = firebase.auth();
  const message = data.message;
  const userId = currentUser.uid;

  return (
    firebase.database().ref('/publish_chat')
      .push({ userId, message })
      .then((user) => ({ user }))
      .catch((err) => ({ err }))
  );
}

export function signOut() {
  return firebase.auth().signOut();
}

export function doWatchList(callback) {
  const { currentUser } = firebase.auth();
  const ref = firebase.database().ref(`/users/${currentUser.uid}/employees`);

  const handler = (snapshot) => {
    callback(snapshot.val());
  };

  ref.on('value', handler);

  return () => {
    ref.off('value', handler);
  };
}
