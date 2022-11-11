import countBy from 'lodash/countBy';
import size from 'lodash/size';
import get from 'lodash/get';

// coordinates :- isMulti ? [ [ [lng, lat] ] ] : [ [lng, lat], ...]
export const coordsToLatLongMap = (coordinates, isMulti = false) => {
  // coordinates : isMulti : [ [ [ [ ...list of coords ] ] ] ]
  const inputCoords = isMulti ? get(coordinates, '0') : [coordinates];
  let resultPolyData = [];

  for (let mInd = 0; mInd < inputCoords.length; mInd++) {
    const polyCoords = inputCoords[mInd];

    const latLongMap = [];
    for (let cInd = 0; cInd < polyCoords.length; cInd++) {
      const coord = polyCoords[cInd];
      latLongMap.push({
        latitude: Number(coord[1]),
        longitude: Number(coord[0]),
      });
    }
    resultPolyData.push(latLongMap);
  }

  if (isMulti) return resultPolyData;
  // return single polygon coords if not multi
  return resultPolyData[0];
};

// latLongMap :- [ {latitude, longitude}, ...]
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

// latLongMap :- [ {lat, lng}, ...]
export const latLongMapToLineCoords = latLongMap => {
  const coordinates = [];
  for (let lInd = 0; lInd < latLongMap.length; lInd++) {
    const currLatLong = latLongMap[lInd];
    coordinates.push([currLatLong.longitude, currLatLong.latitude]);
  }
  return coordinates;
};

// latLongObj :- { longitude, latitude }
export const pointLatLongMapToCoords = latLongObj => {
  return [latLongObj.longitude, latLongObj.latitude];
};

export const convertWorkOrderData = workOrder => {
  let convertedWorkOrder = {...workOrder};
  let {area_pocket, work_orders} = convertedWorkOrder;

  convertedWorkOrder.survey_count = size(work_orders);
  // get counts
  convertedWorkOrder.countByStatus = countBy(work_orders, 'status');
  // convert area coordinate data
  area_pocket.coordinates = coordsToLatLongMap(area_pocket.coordinates);
  // convert work_orders coordinate, tags data
  for (let s_ind = 0; s_ind < work_orders.length; s_ind++) {
    const survey = work_orders[s_ind];
    const {units} = survey;
    // convert work_orders.units coordinate, tags data
    survey.coordinates = coordsToLatLongMap(survey.coordinates);
    survey.tags = survey.tags.toString().split(',');
    try {
      survey.broadband_availability = survey.broadband_availability
        ? survey.broadband_availability.toString().split(',')
        : [];
    } catch (error) {
      survey.broadband_availability = [];
    }
    try {
      survey.cable_tv_availability = survey.cable_tv_availability
        ? survey.cable_tv_availability.toString().split(',')
        : [];
    } catch (error) {
      survey.cable_tv_availability = [];
    }
    for (let u_ind = 0; u_ind < units.length; u_ind++) {
      const unit = units[u_ind];
      // convert work_orders.units coordinate, tags data
      unit.coordinates = coordsToLatLongMap([unit.coordinates])[0];
      unit.tags = unit.tags.toString().split(',');
    }
  }

  return convertedWorkOrder;
};

export const getFillColor = layer_index => {
  return get(uniq_colors, layer_index - 1, '#59666C');
};

export const uniq_colors = [
  '#59666C',
  '#51ADAC',
  '#CE855A',
  '#88B14B',
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
  '#1b9e77',
  '#d95f02',
  '#7570b3',
  '#e7298a',
  '#66a61e',
  '#e6ab02',
  '#a6761d',
  '#666',
  '#7fc97f',
  '#beaed4',
  '#fdc086',
  '#ffff99',
  '#386cb0',
  '#f0027f',
];
