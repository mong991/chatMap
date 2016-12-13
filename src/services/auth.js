import firebase from 'firebase';

export function signInWithEmailAndPassword(email, password) {
  console.log(email, password);
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => ({ user }))
    .catch(() => {
     return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => ({ user }))
        .catch((err) => ({ err }));
    });
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
