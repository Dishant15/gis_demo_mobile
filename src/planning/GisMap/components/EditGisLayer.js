import React, {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from 'react-query';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Button} from 'react-native-paper';

import get from 'lodash/get';
import round from 'lodash/round';
import {lineString, length} from '@turf/turf';

import MapCard from '~Common/components/MapCard';

import {setMapState} from '~planning/data/planningGis.reducer';
import {
  getPlanningMapState,
  getPlanningTicketId,
  getPlanningTicketWorkOrderId,
} from '~planning/data/planningGis.selectors';
import {
  editElementDetails,
  editTicketWorkorderElement,
} from '~planning/data/layer.services';
import {fetchLayerDataThunk} from '~planning/data/actionBar.services';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';

import {FEATURE_TYPES} from '../layers/common/configuration';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {latLongMapToCoords, latLongMapToLineCoords} from '~utils/map.utils';
import {LayerKeyMappings} from '../utils';
import {colors, layout, THEME_COLORS} from '~constants/constants';

const EditGisLayer = () => {
  const dispatch = useDispatch();

  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const ticketId = useSelector(getPlanningTicketId);
  const workOrderId = useSelector(getPlanningTicketWorkOrderId);
  const {
    geometry: coordinates,
    data,
    layerKey,
  } = useSelector(getPlanningMapState);
  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);

  const onSuccessHandler = () => {
    showToast('Element location updated Successfully', TOAST_TYPE.SUCCESS);
    // close form
    dispatch(setMapState({}));
    // refetch layer
    dispatch(
      fetchLayerDataThunk({
        regionIdList: selectedRegionIds,
        layerKey,
      }),
    );
  };

  const onErrorHandler = err => {
    const errStatus = get(err, 'response.status');
    let notiText;
    if (errStatus === 400) {
      // handle bad data
      let errData = get(err, 'response.data');
      for (const fieldKey in errData) {
        if (Object.hasOwnProperty.call(errData, fieldKey)) {
          const errList = errData[fieldKey];
          notiText = get(errList, '0', '');
          break;
        }
      }
    } else {
      notiText =
        'Something went wrong at our side. Please try again after refreshing the page.';
    }

    showToast(notiText, TOAST_TYPE.ERROR);
  };

  const {mutate: editElement, isLoading: isEditLoading} = useMutation(
    mutationData =>
      editElementDetails({data: mutationData, layerKey, elementId: data.id}),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  const {mutate: editTicketElement, isLoading: isEditTicketLoading} =
    useMutation(
      mutationData =>
        editTicketWorkorderElement({
          data: mutationData,
          workOrderId,
        }),
      {
        onSuccess: onSuccessHandler,
        onError: onErrorHandler,
      },
    );

  const handleUpdate = useCallback(() => {
    const isWorkOrderUpdate = !!ticketId;
    // create submit data
    let submitData = {};
    if (featureType === FEATURE_TYPES.POLYLINE) {
      const geometry = latLongMapToLineCoords(coordinates);
      submitData = {
        geometry,
        gis_len: round(length(lineString(geometry)), 4),
      };
    } else if (featureType === FEATURE_TYPES.POLYGON) {
      submitData = {
        geometry: latLongMapToCoords(coordinates),
      };
    } else if (featureType === FEATURE_TYPES.POINT) {
      submitData = {
        geometry: latLongMapToCoords([coordinates])[0],
      };
    } else {
      throw new Error('feature type is invalid');
    }
    // hit api
    if (isWorkOrderUpdate) {
      editTicketElement(submitData);
    } else {
      editElement(submitData);
    }
  }, [coordinates, ticketId, featureType]);

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
        return 'Click or drag and drop marker to new location';
      default:
        return '';
    }
  }, [featureType]);

  const ActionContent = useMemo(() => {
    return (
      <>
        <TouchableOpacity onPress={handleUpdate}>
          <Button
            mode="text"
            color={colors.white}
            style={{backgroundColor: THEME_COLORS.secondary.main}}
            loading={isEditLoading || isEditTicketLoading}>
            Update
          </Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel}>
          <Button
            mode="text"
            color={THEME_COLORS.error.main}
            style={layout.mrl8}>
            Cancel
          </Button>
        </TouchableOpacity>
      </>
    );
  }, [isEditLoading, isEditTicketLoading]);

  return <MapCard title={mapCardTitle} actionContent={ActionContent} />;
};

export default EditGisLayer;
