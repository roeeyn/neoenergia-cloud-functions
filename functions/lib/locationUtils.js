const parseStringLocation = strLocation => {

  // INPUT: "lat: 37.4219983, lng: -122.084"
  // OUTPUT: { lat: 37.4219983, lng: -122.084 }
  return strLocation
    .split(',')
    .map(element => element.split(':')[1].trim())
    .reduce((carry, element, index) => {
      carry[index === 0 ? 'lat' : 'lng'] = element;
      return { ... carry };
    }, {});

};

module.exports = { parseStringLocation };