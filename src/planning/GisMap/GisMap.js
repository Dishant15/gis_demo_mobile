import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
} from 'react';
import {View, InteractionManager} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import * as Animatable from 'react-native-animatable';
import get from 'lodash/get';

import TicketMapViewLayer from './components/TicketMapViewLayer';
import Map from '~Common/components/Map';
import GisMapViewLayer from './components/GisMapViewLayer';
import AddEditGeometryLayer from './components/AddEditGeometryLayer';
import GisMapSpecialLayer from './components/GisMapSpecialLayer';

import {
  setMapBounds,
  updateMapStateCoordinates,
} from '~planning/data/planningGis.reducer';
import {
  getPlanningMapPosition,
  getPlanningMapState,
} from '~planning/data/planningGis.selectors';
import {
  getLocationPermissionType,
  getMapType,
} from '~Common/data/appstate.selector';
import {getElementCoordinates, LayerKeyMappings, PLANNING_EVENT} from './utils';
import {layout} from '~constants/constants';
import {getEdgePadding} from '~utils/app.utils';
import {PERMISSIONS_TYPE} from '~Common/data/appstate.reducer';
import {MY_LOCATION_BUTTON_POSITION} from '~Common/components/Map/map.constants';
import {onGisMapClick} from '~planning/data/planning.actions';

/**
 * Parent
 *    PlanningScreen
 */
const GisMap = props => {
  const [showMap, setMapVisibility] = useState(false);
  const [showMapRender, setMapRender] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();
  const mapRef = useRef();

  // @TODO: move to Map component
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

  // @TODO: move to Map component
  const handleMapClick = e => {
    if (!e.nativeEvent.coordinate) return;
    let coords = e.nativeEvent.coordinate;
    if (
      event === PLANNING_EVENT.addElementGeometry ||
      event === PLANNING_EVENT.editElementGeometry
    ) {
      coords = getElementCoordinates(coords, geometry, featureType);
      dispatch(updateMapStateCoordinates(coords));
    }

    if (event === PLANNING_EVENT.selectElementsOnMapClick) {
      dispatch(onGisMapClick(coords, navigation));
    }
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

  const handleRegionChangeComplete = useCallback(async region => {
    const camera = await mapRef.current.getCamera();
    dispatch(setMapBounds({region, zoom: camera.zoom}));
  }, []);

  return (
    <View style={[layout.container, layout.relative]}>
      {showMap ? (
        <Animatable.View animation="fadeIn" style={layout.container}>
          <MapController ref={mapRef} mapPosition={mapPosition} />
          <Map
            ref={mapRef}
            onMapReady={onMapReady}
            onLayout={onLayout}
            showMapType
            mapType={mapType}
            onPress={handleMapClick}
            onPoiClick={handleMapClick}
            onMarkerPress={handleMapClick}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation={locationPermType === PERMISSIONS_TYPE.ALLOW}
            myLocationButtonPosition={MY_LOCATION_BUTTON_POSITION.BOTTOM_RIGHT}>
            {showMapRender ? (
              <>
                <GisMapViewLayer />
                <TicketMapViewLayer />
                <AddEditGeometryLayer />
                <GisMapSpecialLayer />
              </>
            ) : null}
          </Map>
        </Animatable.View>
      ) : null}
    </View>
  );
};

const MapController = forwardRef((props, ref) => {
  const {mapPosition = {}} = props;

  useEffect(() => {
    if (ref && ref.current) {
      if (mapPosition.center) {
        ref.current.animateCamera(
          {center: mapPosition.center, zoom: mapPosition.zoom},
          {duration: 100},
        );
      } else if (mapPosition.coordinates) {
        ref.current.fitToCoordinates(mapPosition.coordinates, {
          edgePadding: getEdgePadding(),
          animated: true,
        });
      }
    }
  }, [ref, mapPosition]);

  return null;
});

export default GisMap;
