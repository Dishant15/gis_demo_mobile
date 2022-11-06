import React, {forwardRef} from 'react';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';

import MapType from './MapType';

import {getMapType} from '../../data/appstate.selector';
import {colors, INIT_MAP_LOCATION, layout} from '~constants/constants';

const Map = forwardRef((props, ref) => {
  const {children, style, mapTypeStyle, showMapType = false, ...rest} = props;

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
        {...rest}>
        {children}
      </MapView>
      {showMapType ? <MapType style={mapTypeStyle} /> : null}
    </>
  );
});

export default Map;
