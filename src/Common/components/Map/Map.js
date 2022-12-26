import React, {forwardRef, useCallback} from 'react';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';

import MapType from './MapType';

import {getCurrentLocation, getMapType} from '../../data/appstate.selector';
import {colors, INIT_MAP_LOCATION, layout} from '~constants/constants';
import MyLocationButton from './MyLocationButton';

const Map = forwardRef((props, ref) => {
  const {
    children,
    style,
    mapTypeStyle,
    showsUserLocation,
    showMapType = false,
    myLocationButtonPosition = null,
    ...rest
  } = props;

  const currentLocation = useSelector(getCurrentLocation);

  const onLocationPress = useCallback(() => {
    if (ref.current) {
      ref.current.animateCamera(
        {center: currentLocation, zoom: 14},
        {duration: 100},
      );
    }
  }, [ref]);

  const mapType = useSelector(getMapType);

  return (
    <>
      <MapView
        ref={ref}
        style={style || layout.map}
        initialRegion={INIT_MAP_LOCATION}
        provider={PROVIDER_GOOGLE}
        mapType={showMapType ? mapType : undefined}
        loadingEnabled
        loadingIndicatorColor={colors.primaryMain}
        loadingBackgroundColor={colors.blackWithOp}
        showsIndoorLevelPicker
        showsPointsOfInterest={false}
        // showsUserLocation={showsUserLocation}
        {...rest}>
        {children}
      </MapView>
      {showMapType ? <MapType style={mapTypeStyle} /> : null}
      {showsUserLocation ? (
        <MyLocationButton
          position={myLocationButtonPosition}
          onLocationPress={onLocationPress}
        />
      ) : null}
    </>
  );
});

export default Map;
