import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet} from 'react-native';

import {Button, Card} from 'react-native-paper';
import FloatingCard from '~Common/components/FloatingCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {lineString, length} from '@turf/turf';
import {size, round} from 'lodash';

import {setMapState} from '~planning/data/planningGis.reducer';
import {layout, THEME_COLORS} from '~constants/constants';
import {getGisMapStateGeometry} from '~planning/data/planningGis.selectors';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {latLongMapToLineCoords} from '~utils/map.utils';

const AddPolyLineLayer = ({helpText, nextEvent = {}}) => {
  const dispatch = useDispatch();
  const {top} = useSafeAreaInsets();

  const coordinates = useSelector(getGisMapStateGeometry);

  const handleAddComplete = useCallback(() => {
    if (size(coordinates) < 2) {
      showToast('Invalid line', TOAST_TYPE.ERROR);
      return;
    }
    const gis_len = length(lineString(latLongMapToLineCoords(coordinates)));
    // set marker coords to form data
    nextEvent.data = {
      ...nextEvent.data,
      // get gis_len
      gis_len: String(round(gis_len, 4)),
      coordinates: coordinates,
    };
    // complete current event -> fire next event
    dispatch(setMapState(nextEvent));
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
export default AddPolyLineLayer;
