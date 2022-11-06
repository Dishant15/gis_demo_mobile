import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Polyline} from 'react-native-maps';

import {
  CABLE_TYPE_OPTIONS,
  ELEMENT_FORM_TEMPLATE,
  INITIAL_ELEMENT_DATA,
  LAYER_KEY,
} from './configurations';
import {ELEMENT_TYPE, PLANNING_EVENT} from '~planning/GisMap/utils';
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

import AddPolyLineLayer from '~planning/GisMap/components/AddPolyLineLayer';
import CustomMarker from '~Common/CustomMarker';
import {latLongMapToLineCoords} from '~utils/map.utils';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import {LAYER_STATUS_OPTIONS, zIndexMapping} from '../common/configuration';
import {find} from 'lodash';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';
import EditGisLayer from '~planning/GisMap/components/EditGisLayer';

import CableIcon from '~assets/markers/line_pin.svg';

export const getIcon = ({color_on_map}) => CableIcon;

export const Geometry = ({coordinates, color_on_map}) => {
  if (Array.isArray(coordinates)) {
    return (
      <Polyline
        coordinates={coordinates}
        strokeColor={color_on_map}
        strokeWidth={2}
        zIndex={zIndexMapping[LAYER_KEY]}
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

export const EditMapLayer = () => {
  return (
    <EditGisLayer
      helpText="Click on map to create line on map. Double click to complete."
      layerKey={LAYER_KEY}
      featureType={ELEMENT_TYPE.POLYLINE}
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
      <Geometry coordinates={coordinates} {...configuration} />
    </>
  );
};

export const ElementForm = () => {
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));
  // get map state event
  const currEvent = useSelector(getPlanningMapStateEvent);
  // check if add or edit event
  const isEdit = currEvent === PLANNING_EVENT.editElementDetails;

  const transformAndValidateData = useCallback(
    formData => {
      if (isEdit) {
        return {
          ...formData,
          // remove geometry
          geometry: undefined,
        };
      } else {
        return {
          ...formData,
          // remove coordinates and add geometry
          coordinates: undefined,
          remark: undefined,
          geometry: latLongMapToLineCoords(formData.coordinates),
          // convert select fields to simple values
          configuration: configuration.id,
        };
      }
    },
    [isEdit],
  );

  return (
    <GisLayerForm
      isEdit={isEdit}
      layerKey={LAYER_KEY}
      formConfig={ELEMENT_FORM_TEMPLATE}
      transformAndValidateData={transformAndValidateData}
    />
  );
};

const ELEMENT_TABLE_FIELDS = [
  {label: 'Name', field: 'name', type: 'simple'},
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
  {label: 'Reff Code', field: 'ref_code', type: 'simple'},
  {label: 'Cable Type', field: 'cable_type_display', type: 'simple'},
  {label: 'Gis Length', field: 'gis_len', type: 'simple'},
  {label: 'Actual Length', field: 'actual_len', type: 'simple'},
  {label: 'Start Reading', field: 'start_reading', type: 'simple'},
  {label: 'End Reading', field: 'end_reading', type: 'simple'},
  {label: 'No of tubes', field: 'no_of_tube', type: 'simple'},
  {label: 'Core / Tube', field: 'core_per_tube', type: 'simple'},
  {label: 'Specification', field: 'specification', type: 'simple'},
  {label: 'Vendor', field: 'vendor', type: 'simple'},
  {label: 'Status', field: 'status', type: 'status'},
];

const convertDataBeforeForm = data => data;

export const ElementDetails = () => {
  const {elementId} = useSelector(getPlanningMapStateData);

  return (
    <ElementDetailsTable
      rowDefs={ELEMENT_TABLE_FIELDS}
      layerKey={LAYER_KEY}
      elementId={elementId}
      onEditDataConverter={convertDataBeforeForm}
      featureType={ELEMENT_TYPE.POLYLINE}
    />
  );
};
