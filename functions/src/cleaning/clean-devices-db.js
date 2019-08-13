const { DateTime, Interval } = require('luxon');

const cleanOldDevices = db => {
  return db.collection('entries')
    .get()
    .then(entriesSnapshot => {

      return entriesSnapshot.docs.map(ssidRef => {
        return db.collection(`entries/${ssidRef.id}/devices`)
          .get()
          .then(devicesSnapshot => {

            return devicesSnapshot.docs.map(deviceRef => {

              const today = new Date();
              const endDate = deviceRef.data().timestamp.toDate();

              const todayDateTime = DateTime.fromJSDate(today);
              const endDateTime = DateTime.fromJSDate(endDate);

              const interval = Interval.fromDateTimes(endDateTime, todayDateTime);

              const minutes = interval.length('minutes', true);

              return minutes > 1
                ? deviceRef.ref.delete()
                : Promise.resolve('Its going to be deleted');

            });

          });
      });

    }).catch(err => console.log('Error deleting documents', err));
};

module.exports = { cleanOldDevices };