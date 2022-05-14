// coordinates :- [ [lat, lng], ...]
export const coordsToLatLongMap = coordinates => {
  const latLongMap = [];
  for (let cInd = 0; cInd < coordinates.length; cInd++) {
    const coord = coordinates[cInd];
    latLongMap.push({
      latitude: Number(coord[1]),
      longitude: Number(coord[0]),
    });
  }
  return latLongMap;
};

// latLongMap :- [ {lat, lng}, ...]
export const latLongMapToCoords = latLongMap => {
  const coordinates = [];
  for (let lInd = 0; lInd < latLongMap.length; lInd++) {
    const currLatLong = latLongMap[lInd];
    coordinates.push([currLatLong.longitude, currLatLong.latitude]);
  }
  // create a closed polygon
  if (
    coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
    coordinates[0][1] !== coordinates[coordinates.length - 1][1]
  ) {
    coordinates.push(coordinates[0]);
  }
  return coordinates;
};
