import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
 * predefine style is bottom left including safe area
 *
 * Parent
 *    Map
 */
const MapType = ({style = 'bottom-left-safe'}) => {
  const mapType = useSelector(getMapType);
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();

  const handleMapType = () => {
    dispatch(toggleMapType());
  };

  const mapTypeStyle = useMemo(() => {
    switch (style) {
      case 'bottom-left-safe':
        return [
          styles.mapTypeWrapper,
          {
            bottom: Math.max(bottom + BOTTOM_POSITION, BOTTOM_POSITION),
            left: 14,
          },
        ];
      case 'bottom-left':
        return [styles.mapTypeWrapper, {left: 14, bottom: 14}];
      case 'bottom-right-safe':
        return [
          styles.mapTypeWrapper,
          {
            bottom: Math.max(bottom + BOTTOM_POSITION, BOTTOM_POSITION),
            right: 14,
          },
        ];
      case 'bottom-right':
        return [styles.mapTypeWrapper, {right: 14, bottom: 14}];
      default:
        return {};
    }
  }, [style]);

  return (
    <View style={mapTypeStyle}>
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
