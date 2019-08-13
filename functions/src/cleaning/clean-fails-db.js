const cleanFailsDb = (change, db) => {
  const rootId = change.before.ref.path.split("/").slice(1, 2)[0];

  return db.collection(`entries/${rootId}/devices`)
    .get()
    .then(devicesCollection => {

      const isThereDevices = devicesCollection.docs.length > 0;

      return isThereDevices
        ? db.collection('fails')
          .where('wiFiAutoId','==', rootId)
          .get()
          : Promise.reject(new Error('No deleted anything, as there is no devices.'));

    })
    .then(failsSnapshot => Promise.all(failsSnapshot.docs.map(fail => fail.ref.delete())))
    .then(results => console.log('Deleted all fails'))
    .catch(err => console.log('ERROR', err));
};

module.exports = { cleanFailsDb };