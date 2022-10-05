import React, {useState, useEffect, useMemo} from 'react';
import {View, InteractionManager} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import * as Animatable from 'react-native-animatable';

import {LayerGisEventComponent} from './components/LayerToComponentMap';
import TicketMapLayers from './components/TicketMapLayers';
import Map from '~Common/components/Map';

import {getSelectedLayerKeys} from '~planning/data/planningState.selectors';
import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';
import {
  getGisMapInterectionEnable,
  getPlanningMapState,
} from '~planning/data/planningGis.selectors';
import {
  getElementCoordinates,
  getElementTypeFromLayerKey,
  LayerKeyMappings,
} from './utils';
import {layout} from '~constants/constants';
import {getMapType} from '~Common/data/appstate.selector';

/**
 * Parent
 *    PlanningScreen
 */
const GisMap = props => {
  const [showMap, setMapVisibility] = useState(false);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {top} = useSafeAreaInsets();

  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);
  const enableInterection = useSelector(getGisMapInterectionEnable);
  const mapState = useSelector(getPlanningMapState);
  const mapType = useSelector(getMapType);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setMapVisibility(true);
    });
  }, []);

  const handleMapClick = e => {
    if (!enableInterection) return;
    if (!e.nativeEvent.coordinate) return;
    let coords = e.nativeEvent.coordinate;
    coords = getElementCoordinates(
      coords,
      mapState.geometry,
      getElementTypeFromLayerKey(mapState.layerKey),
    );
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
      {showMap ? (
        <Animatable.View animation="fadeIn" style={layout.container}>
          <Map
            showMapType
            mapType={mapType}
            onPress={handleMapClick}
            onPoiClick={handleMapClick}>
            {Layers}
            <LayerGisEventComponent />
            <TicketMapLayers />
          </Map>
        </Animatable.View>
      ) : null}
    </View>
  );
};

export default GisMap;
