import React, {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {lineString, length, area, polygon, convertArea} from '@turf/turf';

import get from 'lodash/get';
import size from 'lodash/size';
import round from 'lodash/round';

import {Button} from 'react-native-paper';

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

const AddGisMapLayer = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
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
      // get length and round to 4 decimals
      const gis_len = length(lineString(submitData.geometry));
      submitData.gis_len = String(round(gis_len, 4));
    }
    //
    else if (featureType === FEATURE_TYPES.POLYGON) {
      submitData.geometry = latLongMapToCoords(featureCoords);
      // get area of polygon
      const areaInMeters = area(polygon([submitData.geometry]));
      submitData.gis_area = String(
        round(convertArea(areaInMeters, 'meters', 'kilometers'), 4),
      );
    }
    //
    else if (featureType === FEATURE_TYPES.POINT) {
      submitData.geometry = pointLatLongMapToCoords(featureCoords);
    }
    //
    else {
      throw new Error('feature type is invalid');
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
          loading={isValidationLoading}>
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
