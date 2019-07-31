const admin = require('firebase-admin');
const { parseStringLocation } = require('../../lib/locationUtils');
const { sendSuccess, sendError } = require('../../lib/response');

const addLocationToSSIDDevice = ({ ssidEntryId, db, locationString }) => {

  const { lat, lng } = parseStringLocation(locationString);
  const firestoreLocation = new admin.firestore.GeoPoint(Number(lat), Number(lng));

  return db.collection('entries')
    .doc(ssidEntryId)
    .collection('locations')
    .add({ location: firestoreLocation });

};

const addTimeStampToSSIDDevice = ({ ssidEntryId, deviceId, db }) => {
  return db
    .collection('entries')
    .doc(ssidEntryId)
    .collection('devices')
    .add({
      deviceId,
      timestamp: admin.firestore.Timestamp.fromDate(new Date())
    });
};

const addEntryToNewSSID = ({ db, deviceId, location: locationString, ssid }) => {
  return db.collection('entries')
    .add({ ssid })
    .then(newEntry => Promise.all([
      addLocationToSSIDDevice({ ssidEntryId: newEntry.id, db, locationString }),
      newEntry.id
    ]))
    .then(result => addTimeStampToSSIDDevice({ ssidEntryId: result[1], deviceId, db }))
    .then(() => Promise.resolve(`SUCCESS adding NEW device: ${deviceId} to ssid: ${ssid}`));
};

const addEntryToExistingSSID = ({ existingSSIDId: ssidEntryId, db, deviceId, location: locationString }) => {
  return addTimeStampToSSIDDevice({ ssidEntryId, deviceId, db })
    .then(() => addLocationToSSIDDevice({ ssidEntryId, db, locationString }))
    .then(() => Promise.resolve(`SUCCESS adding EXISTING device: ${deviceId} to ssid: ${ssidEntryId}`))
};

const createNewEntry = (req, res, db) => {

  /*
  DEMO BODY
  {
    "deviceId": "ae61b51574e74288",
    "location": "lat: 37.4219983, lng: -122.084",
    "ssid": "AndroidWifi",
    "timestamp": "2019-07-30T18:19Z"
  }
  */

  const { ssid, deviceId, timestamp, location } = req.body;

  return db
    .collection("entries")
    .where("ssid", "==", ssid)
    .get()
    .then(querySnapshot =>
      querySnapshot.empty
        ? addEntryToNewSSID({ db, deviceId, location, ssid })
        : addEntryToExistingSSID({ existingSSIDId: querySnapshot.docs[0].id, db, deviceId, location }))
    .then(resultString => sendSuccess(res, resultString))
    .catch(err => sendError(res, err));

};

module.exports = { createNewEntry };