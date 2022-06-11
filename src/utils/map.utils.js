import {orderBy, size} from 'lodash';

// coordinates :- [ [latitude, longitude], ...]
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

export const convertWorkOrderData = workOrder => {
  let convertedWorkOrder = {...workOrder};
  let {area_pocket, work_orders} = convertedWorkOrder;

  convertedWorkOrder.survey_count = size(work_orders);
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
        .toString()
        .split(',');
    } catch (error) {
      survey.broadband_availability = [];
    }
    try {
      survey.cable_tv_availability = survey.cable_tv_availability
        .toString()
        .split(',');
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
