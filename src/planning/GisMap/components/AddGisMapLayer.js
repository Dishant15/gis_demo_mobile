import React, {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {lineString, length} from '@turf/turf';

import get from 'lodash/get';
import size from 'lodash/size';
import round from 'lodash/round';

import MapCard from '~Common/components/MapCard';

import {setMapState} from '~planning/data/planningGis.reducer';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {
  latLongMapToCoords,
  latLongMapToLineCoords,
  pointLatLongMapToCoords,
} from '~utils/map.utils';
import {LayerKeyMappings, PLANNING_EVENT} from '../utils';
import {FEATURE_TYPES} from '../layers/common/configuration';
import {colors, layout, THEME_COLORS} from '~constants/constants';
import {onElementGeometryEdit} from '~planning/data/event.actions';

const AddGisMapLayer = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {geometry: coordinates, layerKey} = useSelector(getPlanningMapState);
  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);
  const initialData = get(LayerKeyMappings, [layerKey, 'initialElementData']);

  const handleAddComplete = () => {
    let submitData = {};
    if (featureType === FEATURE_TYPES.POLYLINE) {
      if (size(coordinates) < 2) {
        showToast('Invalid line', TOAST_TYPE.ERROR);
        return;
      }
      submitData.geometry = latLongMapToLineCoords(coordinates);
      const gis_len = length(lineString(submitData.geometry));
      submitData.gis_len = String(round(gis_len, 4));
    } else if (featureType === FEATURE_TYPES.POLYGON) {
      submitData.geometry = latLongMapToCoords(coordinates);
    } else if (featureType === FEATURE_TYPES.POINT) {
      submitData.geometry = pointLatLongMapToCoords(coordinates);
    } else {
      throw new Error('feature type is invalid');
    }
    // complete current event -> fire next event
    dispatch(
      onElementGeometryEdit(
        {
          event: PLANNING_EVENT.addElementForm, // event for "layerForm"
          layerKey,
          data: {...initialData, ...submitData}, // init data
        },
        navigation,
      ),
    );
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
          style={{backgroundColor: THEME_COLORS.secondary.main}}>
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

  return <MapCard title={mapCardTitle} actionContent={ActionContent} />;
};
export default AddGisMapLayer;
