import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import FastImage from 'react-native-fast-image';

import {getMapType} from '~Common/data/appstate.selector';
import {toggleMapType} from '~Common/data/appstate.reducer';
import {colors} from '~constants/constants';

import DefaultMapImg from '~assets/img/map_default.png';
import SatelliteMapImg from '~assets/img/map_satellite.png';
import {zIndexMapping} from '~planning/GisMap/layers/common/configuration';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const BOTTOM_POSITION = 66;
/**
 * Parent
 *    Map
 */
const MapType = () => {
  const mapType = useSelector(getMapType);
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const handleMapType = () => {
    dispatch(toggleMapType());
  };

  return (
    <View
      style={[
        styles.mapTypeWrapper,
        {bottom: Math.max(bottom + BOTTOM_POSITION, BOTTOM_POSITION)},
      ]}>
      <TouchableOpacity onPress={handleMapType}>
        <FastImage
          style={styles.mapTypeImage}
          resizeMode="cover"
          source={mapType === 'standard' ? SatelliteMapImg : DefaultMapImg}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mapTypeWrapper: {
    position: 'absolute',
    left: 14,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: zIndexMapping.mapType,
  },
  mapTypeImage: {
    width: 44,
    height: 44,
  },
});

export default MapType;
