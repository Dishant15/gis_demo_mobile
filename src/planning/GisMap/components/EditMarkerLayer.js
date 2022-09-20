import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet} from 'react-native';

import {Button, Card} from 'react-native-paper';
import FloatingCard from '~Common/components/FloatingCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {setMapState} from '~planning/data/planningGis.reducer';
import {layout, THEME_COLORS} from '~constants/constants';
import {getGisMapStateGeometry} from '~planning/data/planningGis.selectors';
import {useMutation} from 'react-query';
import {editElementDetails} from '~planning/data/layer.services';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {fetchLayerDataThunk} from '~planning/data/actionBar.services';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';
import {PLANNING_EVENT} from '../utils';
import {get} from 'lodash';

const EditMarkerLayer = ({helpText, layerKey}) => {
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();
  const coordinates = useSelector(getGisMapStateGeometry);
  const selectedRegionIds = useSelector(getSelectedRegionIds);

  const onSuccessHandler = () => {
    showToast('Element location updated Successfully', TOAST_TYPE.SUCCESS);
    // refetch layer
    dispatch(
      fetchLayerDataThunk({
        regionIdList: selectedRegionIds,
        layerKey,
      }),
    );
    // complete current event -> fire next event OR go to details by default
    // dispatch(
    //   setMapState({
    //     event: PLANNING_EVENT.showElementDetails,
    //     layerKey,
    //     data: { elementId },
    //     ...nextEvent,
    //   })
    // );
  };

  const onErrorHandler = err => {
    console.log(
      '🚀 ~ file: EditMarkerLayer.js ~ line 46 ~ onErrorHandler ~ err',
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
      editElementDetails({data: mutationData, layerKey, elementId}),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  const {mutate: editTicketElement, isLoading: isEditTicketLoading} =
    useMutation(
      mutationData =>
        editElementDetails({data: mutationData, layerKey, elementId}),
      {
        onSuccess: onSuccessHandler,
        onError: onErrorHandler,
      },
    );

  const handleAddComplete = useCallback(() => {
    console.log('coordinates', coordinates);
  }, [coordinates]);

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
  }, []);

  return (
    <View style={[styles.contentWrapper, {top: Math.max(top, 14)}]}>
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
              onPress={handleAddComplete}
              style={layout.smallButton}>
              Complete
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
export default EditMarkerLayer;
