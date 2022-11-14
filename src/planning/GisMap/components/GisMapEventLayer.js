import React, {memo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Polyline, Polygon, Marker} from 'react-native-maps';

import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {getLayerSelectedConfiguration} from '~planning/data/planningState.selectors';
import {FEATURE_TYPES, zIndexMapping} from '../layers/common/configuration';
import {LayerKeyMappings, PLANNING_EVENT} from '../utils';
import CustomMarker from '~Common/CustomMarker';

const GisMapEventLayer = () => {
  const dispatch = useDispatch();
  const {
    layerKey,
    event,
    geometry: coordinates,
  } = useSelector(getPlanningMapState);
  const configuration = useSelector(getLayerSelectedConfiguration(layerKey));

  // for polygon and polyline
  const handlePolygonMarkerDrag = index => e => {
    let newCoords = [...coordinates];
    newCoords.splice(index, 1, e.nativeEvent.coordinate);
    dispatch(updateMapStateCoordinates(newCoords));
  };
  // for marker only
  const handleMarkerDrag = e => {
    const coords = e.nativeEvent.coordinate;
    dispatch(updateMapStateCoordinates(coords));
  };

  if (
    (event === PLANNING_EVENT.addElementGeometry ||
      event === PLANNING_EVENT.editElementGeometry) &&
    coordinates
  ) {
    const featureType = LayerKeyMappings[layerKey]['featureType'];
    const viewOptions =
      LayerKeyMappings[layerKey]['getViewOptions'](configuration);

    switch (featureType) {
      case FEATURE_TYPES.POINT:
        return (
          <Marker
            {...viewOptions}
            tappable
            draggable
            coordinate={coordinates}
            zIndex={zIndexMapping[layerKey]}
            onDragEnd={handleMarkerDrag}>
            <viewOptions.pin />
          </Marker>
        );

      case FEATURE_TYPES.POLYGON:
        return (
          <>
            {Array.isArray(coordinates)
              ? coordinates.map((marker, i) => {
                  return (
                    <CustomMarker
                      coordinate={marker}
                      key={i}
                      draggable
                      onDragEnd={handlePolygonMarkerDrag(i)}
                      stopPropagation
                      flat
                      tracksInfoWindowChanges={false}
                      zIndex={zIndexMapping[layerKey]}
                    />
                  );
                })
              : null}
            <Polygon
              {...viewOptions}
              coordinates={coordinates}
              zIndex={zIndexMapping[layerKey]}
            />
          </>
        );

      case FEATURE_TYPES.POLYLINE:
        return (
          <>
            {Array.isArray(coordinates)
              ? coordinates.map((marker, i) => {
                  return (
                    <CustomMarker
                      coordinate={marker}
                      key={i}
                      draggable
                      onDragEnd={handlePolygonMarkerDrag(i)}
                      stopPropagation
                      flat
                      tracksInfoWindowChanges={false}
                      zIndex={zIndexMapping[layerKey]}
                    />
                  );
                })
              : null}
            <Polyline
              {...viewOptions}
              coordinates={coordinates}
              zIndex={zIndexMapping[layerKey]}
            />
          </>
        );

      default:
        throw new Error('feature type is invalid');
    }
  } else {
    return null;
  }
};

export default memo(GisMapEventLayer);
