import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Polygon} from 'react-native-maps';

import {
  getGisMapStateGeometry,
  getLayerViewData,
  getPlanningMapStateData,
} from '~planning/data/planningGis.selectors';
import {
  getLayerSelectedConfiguration,
  getPlanningMapStateEvent,
} from '~planning/data/planningState.selectors';
import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';

import CustomMarker from '~Common/CustomMarker';
import EditGisLayer from '~planning/GisMap/components/EditGisLayer';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';

import {zIndexMapping} from '../common/configuration';
import {
  INITIAL_ELEMENT_DATA,
  LAYER_KEY,
  ELEMENT_FORM_TEMPLATE,
} from './configurations';
import {percentToHex} from '~utils/app.utils';
import AddGisMapLayer from '~planning/GisMap/components/AddGisMapLayer';
import {ELEMENT_TYPE, PLANNING_EVENT} from '~planning/GisMap/utils';
import AreaIcon from '~assets/markers/path.svg';

const STROKE_COLOR = '#CE855A';
const FILL_COLOR = '#CE855A' + percentToHex(30);

export const getIcon = () => AreaIcon;

export const Geometry = ({coordinates}) => {
  if (Array.isArray(coordinates)) {
    return (
      <Polygon
        coordinates={coordinates}
        strokeColor={STROKE_COLOR}
        strokeWidth={2}
        fillColor={FILL_COLOR}
        zIndex={zIndexMapping[LAYER_KEY]}
      />
    );
  }
  return null;
};

export const AddLayer = () => {
  return (
    <AddGisMapLayer
      featureType="polygon"
      helpText="Click on map to place area points on map. Complete polygon and adjust points."
      nextEvent={{
        event: PLANNING_EVENT.addElementForm, // event for "layerForm"
        layerKey: LAYER_KEY,
        // init data
        data: INITIAL_ELEMENT_DATA,
      }}
    />
  );
};

export const ElementLayer = () => {
  const coordinates = useSelector(getGisMapStateGeometry);
  const dispatch = useDispatch();

  const handleMarkerDrag = index => e => {
    let newCoords = [...coordinates];
    newCoords.splice(index, 1, e.nativeEvent.coordinate);
    dispatch(updateMapStateCoordinates(newCoords));
  };

  return (
    <>
      {Array.isArray(coordinates)
        ? coordinates.map((marker, i) => {
            return (
              <CustomMarker
                coordinate={marker}
                key={i}
                draggable
                onDragEnd={handleMarkerDrag(i)}
                stopPropagation
                flat
                tracksInfoWindowChanges={false}
                zIndex={zIndexMapping[LAYER_KEY]}
              />
            );
          })
        : null}
      <Geometry coordinates={coordinates} />
    </>
  );
};

export const EditMapLayer = () => {
  return (
    <EditGisLayer
      helpText="Click on map to place area points on map. Complete polygon and adjust points."
      featureType="polygon"
      layerKey={LAYER_KEY}
    />
  );
};

export const ElementForm = () => {
  const currEvent = useSelector(getPlanningMapStateEvent);
  const isEdit = currEvent === PLANNING_EVENT.editElementForm;

  const transformAndValidateData = useCallback(
    formData => {
      if (isEdit) {
        return {
          ...formData,
          // remove geometry
          geometry: undefined,
        };
      } else {
        return formData;
      }
    },
    [isEdit],
  );

  return (
    <GisLayerForm
      isConfigurable
      isEdit={isEdit}
      layerKey={LAYER_KEY}
      formConfig={ELEMENT_FORM_TEMPLATE}
      transformAndValidateData={transformAndValidateData}
    />
  );
};
