import React, {Fragment} from 'react';
import {useSelector} from 'react-redux';

import {Polyline, Polygon} from 'react-native-maps';

import MapMarker from '~Common/components/Map/MapMarker';
import HighlightedPolyline from '~Common/components/Map/HighlightedPolyline';

import {getLayerViewData} from '~planning/data/planningGis.selectors';
import {getSelectedLayerKeys} from '~planning/data/planningState.selectors';

import {LayerKeyMappings} from '../utils';
import {FEATURE_TYPES, zIndexMapping} from '../layers/common/configuration';

const COMMON_POLYGON_OPTIONS = {
  strokeWeight: 2,
};

const COMMON_POLYLINE_OPTIONS = {
  strokeWidth: 3,
};

const HIGHLIGHT_COLOR = '#446eca';

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
        const {id, hidden, coordinates, highlighted} = element;
        const viewOptions =
          LayerKeyMappings[layerKey]['getViewOptions'](element);

        if (hidden) return null;
        return (
          <MapMarker
            key={id}
            coordinate={coordinates}
            {...viewOptions}
            zIndex={zIndexMapping[layerKey]}
            highlighted={highlighted}>
            <viewOptions.icon />
          </MapMarker>
        );
      });

    case FEATURE_TYPES.MULTI_POLYGON:
      return layerData.map(element => {
        const {id, hidden, coordinates, highlighted} = element;
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
                  {...(highlighted
                    ? {
                        strokeColor: HIGHLIGHT_COLOR,
                        strokeOpacity: 1,
                        strokeWeight: 4,
                      }
                    : {})}
                  zIndex={
                    highlighted
                      ? zIndexMapping.highlighted
                      : zIndexMapping[layerKey]
                  }
                />
              );
            })}
          </React.Fragment>
        );
      });

    case FEATURE_TYPES.POLYGON:
      return layerData.map(element => {
        const {id, hidden, coordinates, highlighted} = element;
        const viewOptions =
          LayerKeyMappings[layerKey]['getViewOptions'](element);

        if (hidden) return null;
        return (
          <Fragment key={id}>
            <Polygon
              key={id}
              coordinates={coordinates}
              {...COMMON_POLYGON_OPTIONS}
              {...viewOptions}
              {...(highlighted
                ? {
                    strokeOpacity: 0,
                    strokeWeight: 0,
                  }
                : {})}
              zIndex={
                highlighted
                  ? zIndexMapping.highlighted
                  : zIndexMapping[layerKey]
              }
            />
            {highlighted ? (
              <HighlightedPolyline
                coordinates={coordinates}
                zIndex={zIndexMapping.highlighted}
                strokeColor={HIGHLIGHT_COLOR}
                showStartEndPoints={false}
              />
            ) : null}
          </Fragment>
        );
      });

    case FEATURE_TYPES.POLYLINE:
      return layerData.map(element => {
        const {id, hidden, coordinates, highlighted} = element;
        const viewOptions =
          LayerKeyMappings[layerKey]['getViewOptions'](element);

        if (hidden) return null;
        if (highlighted) {
          return (
            <HighlightedPolyline
              key={id}
              coordinates={coordinates}
              zIndex={zIndexMapping.highlighted}
              strokeColor={HIGHLIGHT_COLOR}
            />
          );
        } else {
          return (
            <Polyline
              key={id}
              coordinates={coordinates}
              {...COMMON_POLYLINE_OPTIONS}
              {...viewOptions}
              zIndex={zIndexMapping[layerKey]}
            />
          );
        }
      });

    default:
      throw new Error('feature type is invalid');
  }
};

export default GisMapViewLayer;
