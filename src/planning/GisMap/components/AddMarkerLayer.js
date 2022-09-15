import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {View, StyleSheet} from 'react-native';

import {Button, Card} from 'react-native-paper';
import FloatingCard from '~Common/components/FloatingCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {setMapState} from '~planning/data/planningGis.reducer';
import {layout, THEME_COLORS} from '~constants/constants';

const AddMarkerLayer = ({markerCoords, helpText, nextEvent = {}}) => {
  const dispatch = useDispatch();
  const {top} = useSafeAreaInsets();
  const handleAddComplete = useCallback(() => {
    // set marker coords to form data
    nextEvent.data = {
      ...nextEvent.data,
      coordinates: markerCoords,
    };
    // complete current event -> fire next event
    dispatch(setMapState(nextEvent));
  }, [markerCoords]);

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
export default AddMarkerLayer;