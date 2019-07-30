const functions = require('firebase-functions');

// // The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// exports.entriesTitan = functions.firestore
//   .document('entries/{entrieId}')
//   .onWrite((change, context) => {

//     console.log('CAMBIAAaaa', change);
//     console.log('CONTEXTaaaa', context);
//     db.collection('failures')
//       .add({
//         deviceId: 'abcd1234',
//         isConfirmed: false,
//         location: new admin.firestore.GeoPoint(-34, 89)
//       })
//       .then(res => console.log('RES', res))
//       .catch(err => console.error('ERR', err));

//   });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.get('/entry', (req, res) => res.send('All working here 🤙'));

app.delete('/entry', (req, res) => {
  const { ssid, deviceId } = req.query;
  res.send({ success: `Success => ssid: ${ssid}, deviceId: ${deviceId}` });
})

app.post('/entry', (req, res) => {
  // TODO: add validation for request body
  const { ssid, deviceId, timestamp, location } = req.body;

  db.collection('entries')
    .add({
      deviceId: 'abcd1234',
      isConfirmed: false,
      location: new admin.firestore.GeoPoint(-34, 89)
    })
    .then(res => console.log('RES', res))
    .catch(err => console.error('ERR', err));

  res.send({ success: `SUCCESS adding device: ${deviceId} to ssid: ${ssid}` });
});

app.listen(5000, () => console.log('server iniciado '))

// Expose Express API as a single Cloud Function:
exports.devices = functions.https.onRequest(app);