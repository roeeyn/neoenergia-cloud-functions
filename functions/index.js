const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const entry = require('./src/entry/entry');
const { deleteDeviceFromSSID } = require('./src/entry/deleteEntry');

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

app.listen(5000, () => console.log('server iniciado '))

// Expose Express API as a single Cloud Function:
exports.devices = functions.https.onRequest(app);