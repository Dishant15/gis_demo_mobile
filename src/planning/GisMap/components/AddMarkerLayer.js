import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {Button, Card} from 'react-native-paper';
import FloatingCard from '~Common/components/FloatingCard';

import {setMapState} from '~planning/data/planningGis.reducer';
import {layout, THEME_COLORS} from '~constants/constants';

const AddMarkerLayer = ({markerCoords, helpText, nextEvent = {}}) => {
  const dispatch = useDispatch();

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
    <FloatingCard
      title={helpText}
      // subtitle="Tap on map to add element, long press and drag to change position"
    >
      <Card.Actions>
        <Button
          mode="contained"
          icon="keyboard-backspace"
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
  );
};

export default AddMarkerLayer;
