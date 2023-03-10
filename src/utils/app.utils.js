import {get} from 'lodash';

export const noop = data => console.log('noop => ', data);

/**
 * helper function to show initial map with default zoom level
 * zoom is depend on latitudeDelta and longitudeDelta
 * and can work accordigly screen size
 *
 * latitudeDelta ==> higher value represent zoom out, lower value represent zoom in
 * change latitudeDelta to 0.00444;
 */
export const getInitialRegion = (width, height, latitudeDelta = 0.102) => {
  const aspectRatio = width / height;
  // const latitudeDelta = 0.00444;
  return {
    longitude: 72.56123771890998,
    latitude: 23.027954677505853,
    latitudeDelta,
    longitudeDelta: latitudeDelta * aspectRatio,
  };
  // static values
  return {
    longitudeDelta: 0.06032254546880722,
    latitudeDelta: 0.10201336785146964,
    longitude: 72.56051184609532,
    latitude: 23.024334044995985,
  };
};

// check if usefull for zoom
export const getRegionFromZoom = () => {
  // Initial values
  const latitudeDelta = 0.004757;
  const longitudeDelta = 0.006866;

  const coef = latitudeDelta / longitudeDelta; // always the same no matter your zoom

  // Find zoom level
  const zoomLvlCalculated = calcZoom(longitudeDelta);
  console.log(zoomLvlCalculated); // 15.678167523696594

  // Find longitudeDelta based on the found zoom
  const longitudeDeltaCalculated = calcLongitudeDelta(zoomLvlCalculated);
  console.log(calcLongitudeDelta(zoomLvlCalculated));
  // 0.006865999999999988 which is the same like the initial longitudeDelta, if we omit the floating point calc difference

  // Find the latitudeDelta with the coefficient
  const latitudeDeltaCalculated = longitudeDeltaCalculated * coef;
  console.log(latitudeDeltaCalculated);
  //0.004756999999999992 which is the same like the initial latitudeDelta, if we omit the floating point calc difference
  return {
    longitudeDelta: longitudeDeltaCalculated,
    latitudeDelta: latitudeDeltaCalculated,
  };
};

// let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
const calcZoom = longitudeDelta => {
  // Omit rounding intentionally for the example
  return Math.log(360 / longitudeDelta) / Math.LN2;
};

const calcLongitudeDelta = zoom => {
  const power = Math.log2(360) - zoom;
  return Math.pow(2, power);
};

export const percentToHex = p => {
  const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
  const intValue = Math.round((p / 100) * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
};

export const getEdgePadding = (bottom = 50) => {
  return {
    top: 150,
    right: 5,
    bottom,
    left: 5,
  };
};

export const getFormattedAddressFromGoogleAddress = data => {
  const address = get(data, 'results.0.formatted_address', '');
  const firstAddress = get(data, 'results.0.address_components', []);
  let city = '';
  let state = '';
  let country = '';
  let pincode = '';
  let name = '';
  let area = '';
  for (let i = 0; i < firstAddress.length; i++) {
    for (let j = 0; j < firstAddress[i].types.length; j++) {
      switch (firstAddress[i].types[j]) {
        case 'premise':
          name = firstAddress[i].long_name;
          break;
        case 'sublocality_level_1':
          area = firstAddress[i].long_name;
          break;
        case 'locality':
          city = firstAddress[i].long_name;
          break;
        case 'administrative_area_level_1':
          state = firstAddress[i].long_name;
          break;
        case 'country':
          country = firstAddress[i].long_name;
          break;
        case 'postal_code':
          pincode = firstAddress[i].long_name;
          break;
      }
    }
  }
  return {name, area, city, state, country, pincode, address};
};
