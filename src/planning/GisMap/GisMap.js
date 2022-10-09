import React, {useState, useEffect, useMemo, useRef} from 'react';
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
  getPlanningTicketData,
} from '~planning/data/planningGis.selectors';
import {
  getElementCoordinates,
  getElementTypeFromLayerKey,
  LayerKeyMappings,
} from './utils';
import {INIT_MAP_LOCATION, layout} from '~constants/constants';
import {getMapType} from '~Common/data/appstate.selector';
import {get} from 'lodash';

const getEdgePadding = (bottom = 50) => {
  return {
    top: 150,
    right: 5,
    bottom,
    left: 5,
  };
};

/**
 * Parent
 *    PlanningScreen
 */
const GisMap = props => {
  const [showMap, setMapVisibility] = useState(false);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const mapRef = useRef();

  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);
  const enableInterection = useSelector(getGisMapInterectionEnable);
  const mapState = useSelector(getPlanningMapState);
  const mapType = useSelector(getMapType);
  const ticketData = useSelector(getPlanningTicketData);

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

  const onMapReady = () => {
    // set map region to ticket area
    const ticketArea = get(ticketData, 'area_pocket.coordinates', null);
    if (ticketArea) {
      mapRef.current.fitToCoordinates(ticketArea, {
        edgePadding: getEdgePadding(bottom),
        animated: true,
      });
    } else {
      // otherwise set to initial region
      mapRef.current.animateToRegion(INIT_MAP_LOCATION, 100);
    }
  };

  if (!isFocused) return null;

  return (
    <View style={[layout.container, layout.relative]}>
      {showMap ? (
        <Animatable.View animation="fadeIn" style={layout.container}>
          <Map
            ref={mapRef}
            onMapReady={onMapReady}
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
