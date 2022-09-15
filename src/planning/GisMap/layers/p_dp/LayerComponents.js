import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Marker} from 'react-native-maps';

import {find, noop} from 'lodash';

import AddMarkerLayer from '~planning/GisMap/components/AddMarkerLayer';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';

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

import Icon from '~assets/markers/p_dp_view.svg';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {latLongMapToCoords} from '~utils/map.utils';
import {LAYER_STATUS_OPTIONS} from '../common/configuration';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';

export const MapElement = () => {
  const coords = useSelector(getGisMapStateGeometry);
  const dispatch = useDispatch();

  const handleMarkerDrag = e => {
    const coords = e.nativeEvent.coordinate;
    dispatch(updateMapStateCoordinates(coords));
  };

  if (coords) {
    return (
      <Marker
        coordinate={coords}
        onDragEnd={handleMarkerDrag}
        tappable
        draggable
        stopPropagation
        flat
        tracksInfoWindowChanges={false}>
        <PDPIcon />
      </Marker>
    );
  } else {
    return null;
  }
};

export const Geometry = ({coordinates, handleMarkerDrag = noop}) => {
  if (coordinates) {
    return (
      <Marker
        coordinate={coordinates}
        onDragEnd={handleMarkerDrag}
        tappable
        draggable
        stopPropagation
        flat
        tracksInfoWindowChanges={false}>
        <Icon />
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

export const ElementLayer = () => {
  const coordinates = useSelector(getGisMapStateGeometry);
  const dispatch = useDispatch();

  const handleMarkerDrag = e => {
    const coords = e.nativeEvent.coordinate;
    dispatch(updateMapStateCoordinates(coords));
  };

  return (
    <Geometry coordinates={coordinates} handleMarkerDrag={handleMarkerDrag} />
  );
};

export const ElementForm = () => {
  // SUGGESTED_UPDATES ---- remove workOrder object from this
  const transformAndValidateData = useCallback(formData => {
    return {
      ...formData,
      // remove coordinates and add geometry
      coordinates: undefined,
      geometry: latLongMapToCoords([formData.coordinates])[0],
      // convert select fields to simple values
      status: formData.status.value,
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

const ELEMENT_TABLE_FIELDS = [
  {label: 'Name', field: 'name', type: 'simple'},
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Unique Id', field: 'unique_id', type: 'simple'},
  {label: 'Reff Code', field: 'ref_code', type: 'simple'},
  {label: 'Status', field: 'status', type: 'status'},
];

const convertDataBeforeForm = data => {
  return {
    ...data,
    // convert status to select format
    status: find(LAYER_STATUS_OPTIONS, ['value', data.status]),
  };
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
