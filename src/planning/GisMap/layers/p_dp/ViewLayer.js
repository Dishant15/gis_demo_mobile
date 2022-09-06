import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {Marker} from 'react-native-maps';
import {Button, Card} from 'react-native-paper';

import FloatingCard from '~Common/components/FloatingCard';

import {
  getGisMapState,
  getGisMapStateGeometry,
  getLayerViewData,
} from '~planning/data/planningGis.selectors';
import {
  resetMapState,
  updateMapStateCoordinates,
} from '~planning/data/planningGis.reducer';

import {LAYER_KEY} from './configurations';
import {layout, THEME_COLORS} from '~constants/constants';

import PDPIcon from '~assets/markers/p_dp_view.svg';

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > getLayerCompFromKey
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));
  const data = layerData.viewData;

  return data.map(dp => {
    const {id, coordinates} = dp;
    return (
      <Marker
        key={id}
        coordinate={coordinates}
        stopPropagation
        flat
        tracksInfoWindowChanges={false}>
        <PDPIcon />
      </Marker>
    );
  });
};

export const InfoCard = () => {
  const actionState = useSelector(getGisMapState);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleCustomBack = useCallback(() => {
    dispatch(resetMapState());
  }, []);

  const handleBtnPress = useCallback(() => {
    navigation.navigate('form');
  }, []);

  switch (actionState) {
    case 'A':
      return (
        <FloatingCard
          title="Add new element"
          subtitle="Tap on map to add element, long press and drag to change position">
          <Card.Actions>
            <Button
              mode="contained"
              icon="keyboard-backspace"
              color={THEME_COLORS.error.main}
              style={[layout.smallButton, layout.smallButtonMR]}
              onPress={handleCustomBack}>
              Cancel
            </Button>
            <Button
              mode="contained"
              icon="check"
              color={THEME_COLORS.primary.main}
              onPress={handleBtnPress}
              style={layout.smallButton}>
              Complete
            </Button>
          </Card.Actions>
        </FloatingCard>
      );
    case 'E':
      return null;
    case 'D':
      return null;
    default:
      return null;
  }
};

export const MapElement = () => {
  const coords = useSelector(getGisMapStateGeometry);
  const dispatch = useDispatch();

  const handleMarkerDrag = e => {
    const coords = e.nativeEvent.coordinate;
    dispatch(updateMapStateCoordinates(coords));
  };

  if (coords) {
    return (
      <Marker
        coordinate={coords}
        onDragEnd={handleMarkerDrag}
        tappable
        draggable
        stopPropagation
        flat
        tracksInfoWindowChanges={false}>
        <PDPIcon />
      </Marker>
    );
  } else {
    return null;
  }
};

// export EditLayer
