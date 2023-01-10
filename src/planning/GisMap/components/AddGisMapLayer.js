import React, {useCallback, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {
  lineString,
  length,
  area,
  polygon,
  convertArea,
  centroid,
  points,
  center as centerFn,
} from '@turf/turf';
import get from 'lodash/get';
import size from 'lodash/size';
import round from 'lodash/round';

import {Button} from 'react-native-paper';
import Geocoder from 'react-native-geocoding';

import MapCard from '~Common/components/MapCard';

import {
  setMapState,
  updateMapStateDataErrPolygons,
} from '~planning/data/planningGis.reducer';
import {
  getPlanningMapState,
  getPlanningTicketData,
} from '~planning/data/planningGis.selectors';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {
  latLongMapToCoords,
  latLongMapToLineCoords,
  pointLatLongMapToCoords,
} from '~utils/map.utils';
import {LayerKeyMappings} from '../utils';
import {FEATURE_TYPES} from '../layers/common/configuration';
import {colors, layout, THEME_COLORS} from '~constants/constants';
import useValidateGeometry from '../hooks/useValidateGeometry';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';
import {onAddElementDetails} from '~planning/data/planning.actions';
import {getFormattedAddressFromGoogleAddress} from '~utils/app.utils';

const AddGisMapLayer = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [fetchingAddress, setFetchingAddress] = useState(false);

  const {validateElementMutation, isValidationLoading} = useValidateGeometry({
    setErrPolygonAction: updateMapStateDataErrPolygons,
  }); // once user adds marker go in edit mode

  const ticketData = useSelector(getPlanningTicketData);
  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const {
    geometry: featureCoords,
    layerKey,
    data,
  } = useSelector(getPlanningMapState);

  const {restriction_ids = null} = data;
  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);
  const ticketId = get(ticketData, 'id');

  const formMetaData = get(
    LayerKeyMappings,
    [layerKey, 'formConfig', 'metaData'],
    {},
  );

  /**************************** */
  //        Handlers            //
  /**************************** */

  const handleAddComplete = () => {
    // geometry validation
    if (
      featureType === FEATURE_TYPES.POLYLINE ||
      featureType === FEATURE_TYPES.POLYGON
    ) {
      if (size(featureCoords) < 2) {
        showToast('Invalid line', TOAST_TYPE.ERROR);
        return;
      }
    }
    // set coords to form data
    let submitData = {};
    if (featureType === FEATURE_TYPES.POLYLINE) {
      submitData.geometry = latLongMapToLineCoords(featureCoords);
    }
    //
    else if (featureType === FEATURE_TYPES.POLYGON) {
      submitData.geometry = latLongMapToCoords(featureCoords);
    }
    //
    else if (featureType === FEATURE_TYPES.POINT) {
      submitData.geometry = pointLatLongMapToCoords(featureCoords);
    }
    //
    else {
      throw new Error('feature type is invalid');
    }

    /**
     * get form config from LayerKeyMappings > layerKey
     * check form config have meta data and geometryFields exist
     * geometryFields used to auto calculate some fields and pre-fields into form
     */
    const geometryFields = Array.isArray(formMetaData.geometryUpdateFields)
      ? formMetaData.geometryUpdateFields
      : [];

    for (let index = 0; index < geometryFields.length; index++) {
      const field = geometryFields[index];
      if (field === 'gis_len') {
        // get length and round to 4 decimals
        submitData.gis_len = round(length(lineString(submitData.geometry)), 4);
      } else if (field === 'gis_area') {
        // get area of polygon
        const areaInMeters = area(polygon([submitData.geometry]));
        submitData.gis_area = round(
          convertArea(areaInMeters, 'meters', 'kilometers'),
          4,
        );
      }
    }

    // server side validate geometry
    let mutationData = {
      layerKey,
      element_id: data?.elementId,
      featureType,
      geometry: submitData.geometry,
    };
    if (ticketId) {
      mutationData['ticket_id'] = ticketId;
    } else if (size(selectedRegionIds)) {
      mutationData['region_id_list'] = selectedRegionIds;
    }

    if (!!restriction_ids) {
      // validate with parent geometry contains check
      mutationData['restriction_ids'] = restriction_ids;
    }

    validateElementMutation(mutationData, {
      onSuccess: res => {
        /**
         * get form config from LayerKeyMappings > layerKey
         * check form config have meta data and getElementAddressData exist
         * getElementAddressData used to fetch address from lat, lng
         */
        if (formMetaData.getElementAddressData) {
          let latLong; // [lat, lng]
          if (featureType === FEATURE_TYPES.POLYLINE) {
            const features = points(submitData.geometry);
            const centerRes = centerFn(features);
            const center = centerRes.geometry.coordinates;
            latLong = [center[1], center[0]];
          }
          //
          else if (featureType === FEATURE_TYPES.POLYGON) {
            const turfPoint = polygon([submitData.geometry]);
            const centerRes = centroid(turfPoint);
            const center = centerRes.geometry.coordinates;
            latLong = [center[1], center[0]];
          }
          //
          else if (featureType === FEATURE_TYPES.POINT) {
            latLong = [submitData.geometry[1], submitData.geometry[0]];
          }
          setFetchingAddress(true);
          // Get address from latitude, longitude.
          Geocoder.from({
            latitude: latLong[0],
            longitude: latLong[1],
          }).then(
            response => {
              const formattedAddress =
                getFormattedAddressFromGoogleAddress(response);

              formMetaData.getElementAddressData(formattedAddress, submitData);
              setFetchingAddress(false);
              // complete current event -> fire next event
              dispatch(
                onAddElementDetails({
                  layerKey,
                  submitData,
                  validationRes: res,
                  navigation,
                }),
              );
            },
            error => {
              setFetchingAddress(false);
              // address can not be fetched
              console.log('address can not be fetched ', error);
              // complete current event -> fire next event
              dispatch(
                onAddElementDetails({
                  layerKey,
                  submitData,
                  validationRes: res,
                  navigation,
                }),
              );
            },
          );
        } else {
          // complete current event -> fire next event
          dispatch(
            onAddElementDetails({
              layerKey,
              submitData,
              validationRes: res,
              navigation,
            }),
          );
        }
      },
    });
  };

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
  }, []);

  // helpText show in popup based on featureType
  const mapCardTitle = useMemo(() => {
    switch (featureType) {
      case FEATURE_TYPES.POLYLINE:
        return 'Click on map to create line on map. Double click to complete.';
      case FEATURE_TYPES.POLYGON:
        return 'Click on map to place area points on map. Complete polygon and adjust points.';
      case FEATURE_TYPES.POINT:
        return 'Click on map to add new location';
      default:
        return '';
    }
  }, [featureType]);

  const ActionContent = (
    <>
      <TouchableOpacity onPress={handleAddComplete}>
        <Button
          mode="text"
          color={colors.white}
          style={{backgroundColor: THEME_COLORS.secondary.main}}
          loading={isValidationLoading || fetchingAddress}>
          Submit
        </Button>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCancel}>
        <Button mode="text" color={THEME_COLORS.error.main} style={layout.mrl8}>
          Cancel
        </Button>
      </TouchableOpacity>
    </>
  );

  return (
    <MapCard
      title={ticketData?.name ? ticketData.name : 'Planning'}
      subTitle={mapCardTitle}
      actionContent={ActionContent}
    />
  );
};
export default AddGisMapLayer;
