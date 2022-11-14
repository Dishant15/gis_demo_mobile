import React, {useState, useEffect, useRef, forwardRef} from 'react';
import {View, InteractionManager} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import * as Animatable from 'react-native-animatable';
import get from 'lodash/get';

import TicketMapLayers from './components/TicketMapLayers';
import Map from '~Common/components/Map';
import GisMapViewLayer from './components/GisMapViewLayer';
import GisMapEventLayer from './components/GisMapEventLayer';

import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';
import {
  getGisMapInterectionEnable,
  getPlanningMapState,
  getPlanningTicketData,
} from '~planning/data/planningGis.selectors';
import {getMapType} from '~Common/data/appstate.selector';
import {getElementCoordinates, LayerKeyMappings, PLANNING_EVENT} from './utils';
import {INIT_MAP_LOCATION, layout} from '~constants/constants';
import {getEdgePadding} from '~utils/app.utils';

/**
 * Parent
 *    PlanningScreen
 */
const GisMap = props => {
  const [showMap, setMapVisibility] = useState(false);
  const [showMapRender, setMapRender] = useState(false);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const mapRef = useRef();

  const enableInterection = useSelector(getGisMapInterectionEnable);
  const {geometry, layerKey, event} = useSelector(getPlanningMapState);
  const mapType = useSelector(getMapType);
  const ticketData = useSelector(getPlanningTicketData);

  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setMapVisibility(true);
    });
  }, []);

  const handleMapClick = e => {
    if (!enableInterection) return;
    if (!e.nativeEvent.coordinate) return;
    let coords = e.nativeEvent.coordinate;
    coords = getElementCoordinates(coords, geometry, featureType);
    dispatch(updateMapStateCoordinates(coords));
  };

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
    setTimeout(() => {
      setMapRender(true);
    }, 20);
  };

  if (!isFocused) return null;

  return (
    <View style={[layout.container, layout.relative]}>
      {showMap ? (
        <Animatable.View animation="fadeIn" style={layout.container}>
          <MapController ref={mapRef} mapState={{event, geometry}} />
          <Map
            ref={mapRef}
            onMapReady={onMapReady}
            showMapType
            mapType={mapType}
            onPress={handleMapClick}
            onPoiClick={handleMapClick}>
            {showMapRender ? (
              <>
                <GisMapViewLayer />
                <TicketMapLayers />
                <GisMapEventLayer />
              </>
            ) : null}
          </Map>
        </Animatable.View>
      ) : null}
    </View>
  );
};

const MapController = forwardRef((props, ref) => {
  const {mapState} = props;

  useEffect(() => {
    if (mapState.event === PLANNING_EVENT.editElementGeometry) {
      // geometry can be Array or object
      if (!Array.isArray(mapState.geometry)) {
        ref.current.animateToRegion(
          {...INIT_MAP_LOCATION, ...mapState.geometry},
          100,
        );
      }
    }
  }, [mapState.event]);

  return null;
});

export default GisMap;
