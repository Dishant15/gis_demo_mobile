import React from 'react';
import {useSelector} from 'react-redux';

import {Polyline, Polygon, Marker} from 'react-native-maps';

import {getLayerViewData} from '~planning/data/planningGis.selectors';
import {getSelectedLayerKeys} from '~planning/data/planningState.selectors';

import {LayerKeyMappings} from '../utils';
import {FEATURE_TYPES, zIndexMapping} from '../layers/common/configuration';

const COMMON_POLYGON_OPTIONS = {
  strokeWeight: 2,
};

const COMMON_POLYLINE_OPTIONS = {
  strokeWeight: 2,
};

const COMMON_MARKER_OPTIONS = {
  tappable: false,
  draggable: false,
  stopPropagation: true,
  flat: true,
  tracksInfoWindowChanges: false,
};

const GisMapViewLayer = () => {
  // get list of selected layer-keys
  const mapLayers = useSelector(getSelectedLayerKeys);

  return mapLayers.map(layerKey => {
    return <ViewLayer key={layerKey} layerKey={layerKey} />;
  });
};

const ViewLayer = ({layerKey}) => {
  const layerData = useSelector(getLayerViewData(layerKey));
  // marker | polyline | polygon
  const featureType = LayerKeyMappings[layerKey]['featureType'];

  switch (featureType) {
    case FEATURE_TYPES.POINT:
      return layerData.map(element => {
        const {id, hidden, coordinates} = element;
        const viewOptions =
          LayerKeyMappings[layerKey]['getViewOptions'](element);

        if (hidden) return null;
        return (
          <Marker
            key={id}
            coordinate={coordinates}
            {...COMMON_MARKER_OPTIONS}
            {...viewOptions}
            zIndex={zIndexMapping[layerKey]}>
            <viewOptions.icon />
          </Marker>
        );
      });

    case FEATURE_TYPES.MULTI_POLYGON:
      return layerData.map(element => {
        const {id, hidden, coordinates} = element;
        const viewOptions =
          LayerKeyMappings[layerKey]['getViewOptions'](element);

        if (hidden) return null;
        return (
          <React.Fragment key={id}>
            {coordinates.map((polyCoord, ind) => {
              return (
                <Polygon
                  key={ind}
                  coordinates={polyCoord}
                  {...viewOptions}
                  zIndex={zIndexMapping[layerKey]}
                />
              );
            })}
          </React.Fragment>
        );
      });

    case FEATURE_TYPES.POLYGON:
      return layerData.map(element => {
        const {id, hidden, coordinates} = element;
        const viewOptions =
          LayerKeyMappings[layerKey]['getViewOptions'](element);

        if (hidden) return null;
        return (
          <Polygon
            key={id}
            coordinates={coordinates}
            {...COMMON_POLYGON_OPTIONS}
            {...viewOptions}
            zIndex={zIndexMapping[layerKey]}
          />
        );
      });

    case FEATURE_TYPES.POLYLINE:
      return layerData.map(element => {
        const {id, hidden, coordinates} = element;
        const viewOptions =
          LayerKeyMappings[layerKey]['getViewOptions'](element);

        if (hidden) return null;
        return (
          <Polyline
            key={id}
            coordinates={coordinates}
            {...COMMON_POLYLINE_OPTIONS}
            {...viewOptions}
            zIndex={zIndexMapping[layerKey]}
          />
        );
      });

    default:
      throw new Error('feature type is invalid');
  }
};

export default GisMapViewLayer;
