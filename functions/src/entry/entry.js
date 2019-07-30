const admin = require('firebase-admin');
const { parseStringLocation } = require('../../lib/locationUtils');

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

  return db.collection("entries").where("ssid", "==", ssid)
    .get()
    .then(querySnapshot => {

      if (querySnapshot.empty) {
        return db.collection('entries')
          .add({
            ssid
          })
          .then(result => {

            const { lat, lng } = parseStringLocation(location);
            const firestoreLocation = new admin.firestore.GeoPoint(Number(lat), Number(lng));

            return Promise.all([db.collection('entries').doc(result.id).collection('locations')
              .add({
                location: firestoreLocation
              }), result.id]);

          })
          .then(result => {

            const newEntryId = result[1];
            const jsDate = new Date();
            const firestoreTimestamp = admin.firestore.Timestamp.fromDate(jsDate);

            return db.collection('entries').doc(newEntryId).collection('devices')
              .add({
                deviceId,
                timestamp: firestoreTimestamp
              })
          })
          .then(result => res.send({ success: `SUCCESS adding NEW device: ${deviceId} to ssid: ${ssid}` }))
          .catch(err => res.send({ err }));
      } else {
        return querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          db.collection('entries').doc(doc.id).collection('devices')
            .add({
              deviceId,
              timestamp: admin.firestore.Timestamp.fromDate(new Date())
            })
            .then(result => {

              const { lat, lng } = parseStringLocation(location);
              const firestoreLocation = new admin.firestore.GeoPoint(Number(lat), Number(lng));

              return db.collection('entries').doc(doc.id).collection('locations')
                .add({
                  location: firestoreLocation
                })
            })
            .then(result => res.send({ success: `SUCCESS adding EXISTING device: ${deviceId} to ssid: ${ssid}` }))
            .catch(err => console.error('ERR', err));
        });
      }

    })
    .catch(err => res.send(err));

};

module.exports = { createNewEntry };