import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet} from 'react-native';

import {Button, Card} from 'react-native-paper';
import FloatingCard from '~Common/components/FloatingCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {get, round} from 'lodash';
import {lineString, length} from '@turf/turf';

import {setMapState} from '~planning/data/planningGis.reducer';
import {layout, THEME_COLORS} from '~constants/constants';
import {
  getGisMapStateGeometry,
  getPlanningMapStateData,
  getPlanningTicketWorkOrderId,
} from '~planning/data/planningGis.selectors';
import {useMutation} from 'react-query';
import {
  editElementDetails,
  editTicketWorkorderElement,
} from '~planning/data/layer.services';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {fetchLayerDataThunk} from '~planning/data/actionBar.services';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';
import {getSelectedPlanningTicket} from '~planningTicket/data/planningTicket.selector';
import {latLongMapToCoords, latLongMapToLineCoords} from '~utils/map.utils';
import {ELEMENT_TYPE} from '../utils';
import {zIndexMapping} from '../layers/common/configuration';

const EditGisLayer = ({
  helpText,
  layerKey,
  featureType, // marker | polyline
}) => {
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const coordinates = useSelector(getGisMapStateGeometry);
  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const ticketId = useSelector(getSelectedPlanningTicket);
  const workOrderId = useSelector(getPlanningTicketWorkOrderId);
  const data = useSelector(getPlanningMapStateData);

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
    console.log(
      '🚀 ~ file: EditGisLayer.js ~ line 46 ~ onErrorHandler ~ err',
      err,
    );
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
    if (featureType === ELEMENT_TYPE.POLYLINE) {
      const geometry = latLongMapToLineCoords(coordinates);
      submitData = {
        geometry,
        gis_len: round(length(lineString(geometry)), 4),
      };
    } else {
      submitData = {
        geometry: latLongMapToCoords([coordinates])[0],
      };
    }
    // hit api
    if (isWorkOrderUpdate) {
      editTicketElement(submitData);
    } else {
      editElement(submitData);
    }
  }, [coordinates, ticketId]);

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
  }, [featureType]);

  return (
    <View
      style={[
        styles.contentWrapper,
        {top: Math.max(top, 14), zIndex: zIndexMapping.edit},
      ]}>
      <View style={styles.content}>
        <FloatingCard
          title={helpText}
          isAbsolute={false}
          // subtitle="Tap on map to add element, long press and drag to change position"
        >
          <Card.Actions>
            <Button
              mode="contained"
              icon="close"
              color={THEME_COLORS.error.main}
              style={[layout.smallButton, layout.smallButtonMR]}
              onPress={handleCancel}>
              Cancel
            </Button>
            <Button
              mode="contained"
              icon="check"
              color={THEME_COLORS.primary.main}
              onPress={handleUpdate}
              style={layout.smallButton}
              loading={isEditLoading || isEditTicketLoading}>
              Update
            </Button>
          </Card.Actions>
        </FloatingCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    position: 'absolute',
    top: 14,
    left: 58,
    right: 14,
  },
  content: {
    paddingLeft: 8,
  },
});
export default EditGisLayer;
