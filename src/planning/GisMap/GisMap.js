import React, {useState, forwardRef, useEffect, useMemo} from 'react';
import {View, InteractionManager} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';

import {getSelectedLayerKeys} from '~planning/data/planningState.selectors';

import {layout} from '~constants/constants';
import {
  updateMapState,
  updateMapStateCoordinates,
} from '~planning/data/planningGis.reducer';
import {
  getGisMapInterectionEnable,
  getGisMapStateLayerKey,
  getPlanningMapState,
} from '~planning/data/planningGis.selectors';
import GisMapEventLayer, {
  GisMapElementLayer,
} from './components/GisMapEventLayer';
import {getElementCoordinates, LayerKeyMappings} from './utils';

const GisMap = forwardRef((props, ref) => {
  const [showMap, setMapVisibility] = useState(false);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);
  const enableInterection = useSelector(getGisMapInterectionEnable);
  const mapState = useSelector(getPlanningMapState);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setMapVisibility(true);
    });
  }, []);

  const handleMapClick = e => {
    if (!enableInterection) return;
    if (!e.nativeEvent.coordinate) return;
    let coords = e.nativeEvent.coordinate;
    coords = getElementCoordinates(coords, [], mapState.layerKey);
    dispatch(updateMapStateCoordinates(coords));
  };

  const Layers = useMemo(() => {
    return mapLayers.map(layerKey => {
      const ViewLayerComponent = LayerKeyMappings[layerKey]['ViewLayer'];
      return <ViewLayerComponent key={layerKey} />;
    });
  }, [mapLayers]);

  if (!isFocused) return null;

  return (
    <View style={[layout.container, layout.relative]}>
      {/* <GisMapEventLayer /> */}
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
            <GisMapElementLayer />
          </MapView>
        </Animatable.View>
      ) : null}
    </View>
  );
});

export default GisMap;
