import React, {memo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Polyline, Polygon, Marker} from 'react-native-maps';

import size from 'lodash/size';

import CustomMarker from '~Common/CustomMarker';

import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {FEATURE_TYPES, zIndexMapping} from '../layers/common/configuration';
import {LayerKeyMappings, PLANNING_EVENT} from '../utils';
import {percentToHex} from '~utils/app.utils';

const errPolygonsFillColor = '#FF0000' + percentToHex(50);

/**
 * Render map element based on featureType
 * show map element and interect with them when user only adding, editing geometry
 *
 * Parent:
 *    GisMap
 *
 */
const AddEditGeometryLayer = () => {
  const dispatch = useDispatch();
  const {
    layerKey,
    event,
    geometry: coordinates,
    errPolygons,
    data,
  } = useSelector(getPlanningMapState);

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

  const mayRenderErrPolygons = size(errPolygons)
    ? errPolygons.map((ePoly, eInd) => {
        return (
          <Polygon
            key={eInd}
            strokeColor="red"
            fillColor={errPolygonsFillColor}
            strokeWidth={2}
            coordinates={ePoly}
            zIndex={zIndexMapping.edit}
          />
        );
      })
    : null;

  if (
    (event === PLANNING_EVENT.addElementGeometry ||
      event === PLANNING_EVENT.editElementGeometry) &&
    coordinates
  ) {
    const featureType = LayerKeyMappings[layerKey]['featureType'];
    const viewOptions = LayerKeyMappings[layerKey]['getViewOptions'](data);

    switch (featureType) {
      case FEATURE_TYPES.POINT:
        return (
          <>
            {mayRenderErrPolygons}
            <Marker
              {...viewOptions}
              tappable
              draggable
              coordinate={coordinates}
              zIndex={zIndexMapping.edit}
              onDragEnd={handleMarkerDrag}>
              <viewOptions.pin />
            </Marker>
          </>
        );

      case FEATURE_TYPES.POLYGON:
        return (
          <>
            {mayRenderErrPolygons}
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
                      zIndex={zIndexMapping.edit}
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
            {mayRenderErrPolygons}
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
                      zIndex={zIndexMapping.edit}
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

export default memo(AddEditGeometryLayer);
