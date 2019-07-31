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

const deleteDeviceFromSSID = (req, res, db) => {
  const { ssid, deviceId } = req.query;

  return foundSSIDKey({ db, ssid })
    .then(querySnapshot => {
      if(querySnapshot.empty){
        sendSuccess(res, 'NO SSID Found')
      } else {

        foundDeviceIdKey({ db, ssidKey: querySnapshot.docs[0].id, deviceId })
          .then(qSnapshot => {
          if(qSnapshot.empty){
            sendSuccess(res, 'NO DEvice Found')
          } else {
            console.log(qSnapshot.docs[0].id)
            sendSuccess(res, 'Should delelete device')
          }
        })
      }
    })

/*   db.collection("entries").doc("DC").delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  }); */

};

module.exports = { deleteDeviceFromSSID };