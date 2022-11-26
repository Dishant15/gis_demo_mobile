import React, {useState, useEffect, useRef, forwardRef} from 'react';
import {View, InteractionManager} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import * as Animatable from 'react-native-animatable';
import get from 'lodash/get';

import TicketMapViewLayer from './components/TicketMapViewLayer';
import Map from '~Common/components/Map';
import GisMapViewLayer from './components/GisMapViewLayer';
import AddEditGeometryLayer from './components/AddEditGeometryLayer';

import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';
import {
  getGisMapInterectionEnable,
  getPlanningMapPosition,
  getPlanningMapState,
} from '~planning/data/planningGis.selectors';
import {
  getLocationPermissionType,
  getMapType,
} from '~Common/data/appstate.selector';
import {getElementCoordinates, LayerKeyMappings, PLANNING_EVENT} from './utils';
import {INIT_MAP_LOCATION, layout} from '~constants/constants';
import {getEdgePadding} from '~utils/app.utils';
import {PERMISSIONS_TYPE} from '~Common/data/appstate.reducer';
import {MY_LOCATION_BUTTON_POSITION} from '~Common/components/Map/map.constants';

/**
 * Parent
 *    PlanningScreen
 */
const GisMap = props => {
  const [showMap, setMapVisibility] = useState(false);
  const [showMapRender, setMapRender] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const mapRef = useRef();

  const enableInterection = useSelector(getGisMapInterectionEnable);
  const {geometry, layerKey, event} = useSelector(getPlanningMapState);
  const mapType = useSelector(getMapType);
  const locationPermType = useSelector(getLocationPermissionType);
  const mapPosition = useSelector(getPlanningMapPosition);

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
    setIsMapReady(true);
    if (isMapReady) return;

    centerElementsOnMap();

    setTimeout(() => {
      setMapRender(true);
    }, 20);
  };

  const onLayout = () => {
    if (isMapReady) {
      centerElementsOnMap();
    }
  };

  const centerElementsOnMap = () => {
    // set map region to ticket area
    if (mapPosition.center) {
      mapRef.current.animateCamera(
        {center: mapPosition.center, zoom: mapPosition.zoom},
        {duration: 100},
      );
    } else if (mapPosition.coordinates) {
      mapRef.current.fitToCoordinates(mapPosition.coordinates, {
        edgePadding: getEdgePadding(bottom),
        animated: true,
      });
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
            onLayout={onLayout}
            showMapType
            mapType={mapType}
            onPress={handleMapClick}
            onPoiClick={handleMapClick}
            onMarkerPress={handleMapClick}
            showsUserLocation={locationPermType === PERMISSIONS_TYPE.ALLOW}
            myLocationButtonPosition={MY_LOCATION_BUTTON_POSITION.BOTTOM_RIGHT}>
            {showMapRender ? (
              <>
                <GisMapViewLayer />
                <TicketMapViewLayer />
                <AddEditGeometryLayer />
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
