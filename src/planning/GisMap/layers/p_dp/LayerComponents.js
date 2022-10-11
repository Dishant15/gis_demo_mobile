import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Marker} from 'react-native-maps';

import {find, noop} from 'lodash';

import AddMarkerLayer from '~planning/GisMap/components/AddMarkerLayer';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';

import {
  getGisMapStateGeometry,
  getLayerViewData,
  getPlanningMapStateData,
} from '~planning/data/planningGis.selectors';
import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';

import {
  ELEMENT_FORM_TEMPLATE,
  INITIAL_ELEMENT_DATA,
  LAYER_KEY,
} from './configurations';

import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {latLongMapToCoords} from '~utils/map.utils';
import {LAYER_STATUS_OPTIONS, zIndexMapping} from '../common/configuration';

import Icon from '~assets/markers/p_dp_view.svg';
import EditIcon from '~assets/markers/p_dp_edit.svg';
import {getPlanningMapStateEvent} from '~planning/data/planningState.selectors';
import EditGisLayer from '~planning/GisMap/components/EditGisLayer';

export const getIcon = () => Icon;

export const Geometry = ({coordinates, isEdit, handleMarkerDrag = noop}) => {
  if (coordinates) {
    return (
      <Marker
        coordinate={coordinates}
        onDragEnd={handleMarkerDrag}
        tappable
        draggable
        stopPropagation
        flat
        tracksInfoWindowChanges={false}
        zIndex={zIndexMapping[LAYER_KEY]}>
        {isEdit ? <EditIcon /> : <Icon />}
      </Marker>
    );
  }
  return null;
};

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > LayerKeyMaping.layerKey.ViewLayer
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));
  const data = layerData.viewData;

  return (
    <>
      {data.map(dp => {
        const {id, coordinates} = dp;
        return <Geometry key={id} coordinates={coordinates} />;
      })}
    </>
  );
};

export const AddLayer = () => {
  const coordinates = useSelector(getGisMapStateGeometry);

  return (
    <AddMarkerLayer
      helpText="Click on map to add new Distribution Point location"
      nextEvent={{
        event: PLANNING_EVENT.addElementForm, // event for "layerForm"
        layerKey: LAYER_KEY,
        // init data
        data: INITIAL_ELEMENT_DATA,
      }}
      markerCoords={coordinates}
    />
  );
};

export const EditMapLayer = () => {
  return (
    <EditGisLayer
      helpText="Click or drag and drop marker to new location"
      layerKey={LAYER_KEY}
    />
  );
};

export const ElementLayer = () => {
  const dispatch = useDispatch();
  const coordinates = useSelector(getGisMapStateGeometry);
  // get map state event
  const currEvent = useSelector(getPlanningMapStateEvent);
  // check if add or edit event
  const isEdit = currEvent === PLANNING_EVENT.editElementLocation;

  const handleMarkerDrag = e => {
    const coords = e.nativeEvent.coordinate;
    dispatch(updateMapStateCoordinates(coords));
  };

  return (
    <Geometry
      coordinates={coordinates}
      handleMarkerDrag={handleMarkerDrag}
      isEdit={isEdit}
    />
  );
};

export const ElementForm = () => {
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
          geometry: latLongMapToCoords([formData.coordinates])[0],
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
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
  {label: 'Reff Code', field: 'ref_code', type: 'simple'},
  {label: 'Status', field: 'status', type: 'status'},
];

const convertDataBeforeForm = data => {
  return data;
};

export const ElementDetails = () => {
  const {elementId} = useSelector(getPlanningMapStateData);
  return (
    <ElementDetailsTable
      rowDefs={ELEMENT_TABLE_FIELDS}
      layerKey={LAYER_KEY}
      elementId={elementId}
      onEditDataConverter={convertDataBeforeForm}
    />
  );
};
