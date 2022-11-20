import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';

import {setCurrentLocation} from '~Common/data/appstate.reducer';
import {colors} from '~constants/constants';
import {MY_LOCATION_BUTTON_POSITION} from './map.constants';

/**
 * show my location button on map
 * set current location to redux button press.
 */
const MyLocationButton = ({position, onLocationPress}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleLocationPress = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = parseFloat(position.coords.latitude);
        const longitude = parseFloat(position.coords.longitude);
        dispatch(
          setCurrentLocation({
            latitude,
            longitude,
          }),
        );
        onLocationPress();
      },
      error => {},
      {enableHighAccuracy: true, timeout: 150000},
    );
  }, [onLocationPress]);

  const wrapperStyle = useMemo(() => {
    switch (position) {
      case MY_LOCATION_BUTTON_POSITION.TOP_LEFT:
        return [
          styles.actionWrapper,
          {left: 11, top: Math.max(insets.top + 11, 11)},
        ];
      case MY_LOCATION_BUTTON_POSITION.TOP_RIGHT:
        return [
          styles.actionWrapper,
          {right: 11, top: Math.max(insets.top + 11, 11)},
        ];
      case MY_LOCATION_BUTTON_POSITION.BOTTOM_LEFT:
        return [
          styles.actionWrapper,
          {left: 11, bottom: Math.max(insets.bottom + 11, 11)},
        ];
      case MY_LOCATION_BUTTON_POSITION.BOTTOM_RIGHT:
        return [
          styles.actionWrapper,
          {right: 11, bottom: Math.max(insets.bottom + 11, 11)},
        ];
      default:
        return styles.actionWrapper;
    }
  }, [position]);
  return (
    <View style={wrapperStyle}>
      <TouchableOpacity style={styles.action} onPress={handleLocationPress}>
        <MaterialIcons
          size={30}
          name="my-location"
          color={colors.primaryFontColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MyLocationButton;

const styles = StyleSheet.create({
  actionWrapper: {
    position: 'absolute',
    zIndex: 1,
  },
  action: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
