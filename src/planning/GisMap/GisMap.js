import React, {useState, forwardRef, useEffect, useMemo} from 'react';
import {View, InteractionManager} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';

import {getSelectedLayerKeys} from '~planning/data/planningState.selectors';
import {
  getInfoCompFromKey,
  getLayerCompFromKey,
  getMapElementCompFromKey,
} from './utils';

import {layout} from '~constants/constants';
import {
  updateMapState,
  updateMapStateCoordinates,
} from '~planning/data/planningGis.reducer';
import {
  getGisMapInterectionEnable,
  getGisMapStateLayerKey,
} from '~planning/data/planningGis.selectors';

const GisMap = forwardRef((props, ref) => {
  const [showMap, setMapVisibility] = useState(false);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);
  const enableInterection = useSelector(getGisMapInterectionEnable);
  const mapStateLayerKey = useSelector(getGisMapStateLayerKey);
  console.log(
    '🚀 ~ file: GisMap.js ~ line 27 ~ GisMap ~ enableInterection',
    enableInterection,
  );

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setMapVisibility(true);
    });
  }, []);

  const handleMapClick = e => {
    if (!enableInterection) return;
    if (!e.nativeEvent.coordinate) return;
    const coords = e.nativeEvent.coordinate;
    dispatch(updateMapStateCoordinates(coords));
  };

  const Layers = useMemo(() => {
    return mapLayers.map(layerKey => {
      return getLayerCompFromKey(layerKey);
    });
  }, [mapLayers]);

  const InfoCard = useMemo(() => {
    return getInfoCompFromKey(mapStateLayerKey);
  }, [mapStateLayerKey]);

  const MapElement = useMemo(() => {
    return getMapElementCompFromKey(mapStateLayerKey);
  }, [mapStateLayerKey]);

  if (!isFocused) return null;

  return (
    <View style={[layout.container, layout.relative]}>
      {InfoCard}
      {showMap ? (
        <Animatable.View animation="fadeIn" style={layout.container}>
          <MapView
            showsIndoorLevelPicker
            ref={ref}
            style={layout.map}
            initialRegion={{
              longitudeDelta: 0.06032254546880722,
              latitudeDelta: 0.0005546677,
              longitude: 72.56051184609532,
              latitude: 23.024334044995985,
            }}
            loadingEnabled
            // onMapReady={onMapReady}
            provider={PROVIDER_GOOGLE}
            onPress={handleMapClick}
            onPoiClick={handleMapClick}
            showsPointsOfInterest={false}>
            {Layers}
            {MapElement}
          </MapView>
        </Animatable.View>
      ) : null}
    </View>
  );
});

export default GisMap;
