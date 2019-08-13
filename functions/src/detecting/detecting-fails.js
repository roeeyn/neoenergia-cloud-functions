const detectingFails = (change, db, GeoPoint) => {

  const document = change.after.exists ? change.after.data() : null;
  const rootId = change.before.ref.path.split('/').slice(1, 2)[0];
  const docRef = db.collection('entries').doc(rootId);

  return db.collection(`entries/${rootId}/locations`)
    .get()
    .then(locationsCollection => {

      const locations = locationsCollection.docs.map(collectionDoc => collectionDoc.data().location);
      const lastLocation = locations[locations.length - 1];

      return Promise.all([
        docRef.get(),
        lastLocation
      ]);
    })
    .then(results => {

      const lastLocation = results[1];

      return document
        ? Promise.resolve('NO! Document was null')
        : db.collection('fails')
          .add({
            wiFiAutoId: rootId,
            location:  new GeoPoint(lastLocation.latitude, lastLocation.longitude)
          });

    })
    .then(response => console.log('Added...?', response))
    .catch(err => console.error('ERR', err));

};

module.exports = { detectingFails };