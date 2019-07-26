const admin = require('firebase-admin');
let serviceAccount = require('./secret.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


let db = admin.firestore();

db.collection('entries').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      return db.collection('entries').add(doc.data()).then(ref => {
        console.log('Added document with ID: ', ref.id);
      });
    });
  })
  .then(() => console.log('ajiaaa'))
  .catch((err) => {
    console.log('Error getting documents', err);
  });