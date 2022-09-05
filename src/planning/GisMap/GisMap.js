import React, {useState, forwardRef, useEffect, useMemo} from 'react';
import {View, InteractionManager} from 'react-native';
import {useSelector} from 'react-redux';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';

import {getSelectedLayerKeys} from '~planning/data/planningState.selectors';
import {getLayerCompFromKey} from './utils';

import {layout} from '~constants/constants';

const GisMap = forwardRef((props, ref) => {
  const [showMap, setMapVisibility] = useState(false);
  const isFocused = useIsFocused();

  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setMapVisibility(true);
    });
  }, []);

  const Layers = useMemo(() => {
    return mapLayers.map(layerKey => {
      return getLayerCompFromKey(layerKey);
    });
  }, [mapLayers]);

  if (!isFocused) return null;

  return (
    <View style={[layout.container, layout.relative]}>
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
            // onPress={handleMapClick}
            // onPoiClick={handleMapPoiClick}
            showsPointsOfInterest={false}>
            {Layers}
          </MapView>
        </Animatable.View>
      ) : null}
    </View>
  );
});

export default GisMap;
