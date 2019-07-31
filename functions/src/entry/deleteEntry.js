const { sendSuccess, sendError } = require('../../lib/response');

const foundSSIDKey = ({ db, ssid }) => {
  return db.collection("entries")
    .where("ssid", "==", ssid)
    .get()
};

const foundDeviceIdKey = ({ db, ssidKey, deviceId }) => {
  return db.collection("entries")
    .doc(ssidKey)
    .collection('devices')
    .where('deviceId', "==", deviceId)
    .get()
};

const deleteDeviceFromSSIDList = ({ db, ssidKey, deviceKey }) => {
  return db.collection("entries")
    .doc(ssidKey)
    .collection('devices')
    .doc(deviceKey)
    .delete();
};

const deleteDeviceFromSSID = (req, res, db) => {
  const { ssid, deviceId } = req.query;

  return foundSSIDKey({ db, ssid })
    .then(querySnapshot => querySnapshot.empty
      ? Promise.reject(new Error('NO SSID Found'))
      : Promise.all([
        foundDeviceIdKey({ db, ssidKey: querySnapshot.docs[0].id, deviceId }),
        querySnapshot.docs[0].id
      ]))
    .then(results => {
      const querySnapshot = results[0];
      const ssidKey = results[1];

      return querySnapshot.empty
        ? Promise.reject(new Error('NO DEVICE Found'))
        : deleteDeviceFromSSIDList({ db, ssidKey, deviceKey: querySnapshot.docs[0].id });

    })
    .then(() => sendSuccess(res, 'Deleted succesfully'))
    .catch(err => sendError(res, err));

};

module.exports = { deleteDeviceFromSSID };