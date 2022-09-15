import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Polyline} from 'react-native-maps';

import {
  ELEMENT_FORM_TEMPLATE,
  INITIAL_ELEMENT_DATA,
  LAYER_KEY,
} from './configurations';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {
  getGisMapStateGeometry,
  getLayerViewData,
} from '~planning/data/planningGis.selectors';
import {getLayerSelectedConfiguration} from '~planning/data/planningState.selectors';
import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';

import CableIcon from '~assets/markers/line_pin.svg';
import AddPolyLineLayer from '~planning/GisMap/components/AddPolyLineLayer';
import CustomMarker from '~Common/CustomMarker';
import {latLongMapToCoords} from '~utils/map.utils';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';

export const getIcon = ({color_on_map}) => CableIcon;

export const Geometry = ({coordinates, color_on_map}) => {
  if (Array.isArray(coordinates)) {
    return (
      <Polyline
        coordinates={coordinates}
        strokeColor={color_on_map}
        strokeWidth={2}
      />
    );
  }
  return null;
};

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > getLayerCompFromKey
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));
  const data = layerData.viewData;

  return (
    <>
      {data.map(element => {
        const {id, hidden, coordinates, color_on_map} = element;
        if (hidden) return null;
        return (
          <Geometry
            key={id}
            coordinates={coordinates}
            color_on_map={color_on_map}
          />
        );
      })}
    </>
  );
};

export const AddLayer = () => {
  return (
    <AddPolyLineLayer
      helpText="Click on map to create line on map. Double click to complete."
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
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));
  const dispatch = useDispatch();

  const handleMarkerDrag = index => e => {
    let newCoords = [...coordinates];
    newCoords.splice(index, 1, e.nativeEvent.coordinate);
    dispatch(updateMapStateCoordinates(coords));
  };

  return (
    <>
      {Array.isArray(coordinates)
        ? coordinates.map((marker, i) => {
            return (
              <CustomMarker
                coordinate={marker}
                anchor={{
                  x: 0.5,
                  y: 0.5,
                }}
                key={i}
                draggable
                onDragEnd={handleMarkerDrag(i)}
                stopPropagation
                flat
                tracksInfoWindowChanges={false}
              />
            );
          })
        : null}
      <Geometry
        coordinates={coordinates}
        color_on_map={configuration.color_on_map}
      />
    </>
  );
};

export const ElementForm = () => {
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));

  const transformAndValidateData = useCallback(formData => {
    return {
      workOrder: {
        work_order_type: 'A',
        layer_key: LAYER_KEY,
        remark: formData.remark,
      },
      element: {
        ...formData,
        // remove coordinates and add geometry
        coordinates: undefined,
        remark: undefined,
        geometry: latLongMapToCoords(formData.coordinates),
        // convert select fields to simple values
        status: formData.status.value,
        cable_type: formData.cable_type.value,
        configuration: configuration.id,
      },
    };
  }, []);

  return (
    <GisLayerForm
      layerKey={LAYER_KEY}
      formConfig={ELEMENT_FORM_TEMPLATE}
      transformAndValidateData={transformAndValidateData}
    />
  );
};
