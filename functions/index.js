const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const entry = require('./src/entry/entry');
const { deleteDeviceFromSSID } = require('./src/entry/deleteEntry');
// const { cleanDbFails } = require('./src/cleaning/clean-fails-db');
const { detectingFails } = require('./src/detecting/detecting-fails');

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

app.delete('/entry', (req, res) => deleteDeviceFromSSID(req, res, db));

app.post('/entry', (req, res) => entry.createNewEntry(req, res, db));

// app.listen(5000, () => console.log('server iniciado '))

// Expose Express API as a single Cloud Function:
exports.devices = functions.https.onRequest(app);

////////////////////////////////////////////////////////////////////////////////////////////
// LEO /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// Function to detect a fail when a network has no more devices
exports.detectFails = functions.firestore.document('entries/{entryId}/devices/{deviceId}')
    .onWrite((change, context) => detectingFails(change, db, admin.firestore.GeoPoint));

 // Function to clean from Failed DB a network that is active with devices connected
/* xports.cleanDbFails = functions.firestore.document('entries/{entryId}/devices/{deviceId}').onWrite((change, context) => {

    var rootId = change.before.ref.path.split("/").slice(1, 2);

    db.collection('entries/' + rootId[0] + '/devices').get().then((subCollectionSnapshot) => {

        var exist_devices = false;

        subCollectionSnapshot.forEach((subDoc) => {
            exist_devices = true;
        });

        if(exist_devices){

            var fail_kill_query = db.collection('fails').where('wiFiAutoId','==', rootId[0]);

            fail_kill_query.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.delete();
                    console.log('Successs deleting documents');
                });
            }).catch(err => {
                console.log('Error deleting documents', err);
            });
        }
    });
    return true;
});

// Function to clean devices that are more than 3 minutes without communication
function cleanDevices() {

    var entries = db.collection('entries');

    entries.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(docEntries) {

            db.collection('entries/' + docEntries.id + '/devices').get().then((subCollectionSnapshot) => {

                subCollectionSnapshot.forEach((subDoc) => {

                    const today = new Date();
                    const endDate = subDoc.data().timestamp.toDate();
                    const minutes = parseInt(Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60) % 60);

                    if(minutes > 1){
                        subDoc.ref.delete();
                    }

                });
            });
        });
    }).catch(err => {
        console.log('Error deleting documents', err);
    });
}

// Function perform the function that clears devices that are more than 3 minutes without communication
exports.scheduledcleanDevices = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    cleanDevices();
}); */