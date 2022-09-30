import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Marker} from 'react-native-maps';

import {find, noop} from 'lodash';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {
  ELEMENT_FORM_TEMPLATE,
  INITIAL_ELEMENT_DATA,
  LAYER_KEY,
} from './configurations';

import {
  getGisMapStateGeometry,
  getLayerViewData,
  getPlanningMapStateData,
} from '~planning/data/planningGis.selectors';

import {latLongMapToCoords} from '~utils/map.utils';
import AddMarkerLayer from '~planning/GisMap/components/AddMarkerLayer';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';

import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';
import {
  getLayerSelectedConfiguration,
  getPlanningMapStateEvent,
} from '~planning/data/planningState.selectors';
import {LAYER_STATUS_OPTIONS, zIndexMapping} from '../common/configuration';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';
import EditGisLayer from '~planning/GisMap/components/EditGisLayer';

import SecondarySpliterIcon from '~assets/markers/spliter_view.svg';
import SecondarySpliterEditIcon from '~assets/markers/spliter_edit.svg';
import PrimarySpliterIcon from '~assets/markers/spliter_view_primary.svg';
import PrimarySpliterEditIcon from '~assets/markers/spliter_edit_primary.svg';

export const getIcon = ({splitter_type, isEdit}) => {
  if (isEdit) {
    return splitter_type === 'P'
      ? PrimarySpliterEditIcon
      : SecondarySpliterEditIcon;
  } else {
    return splitter_type === 'P' ? PrimarySpliterIcon : SecondarySpliterIcon;
  }
};

export const Geometry = ({
  coordinates,
  splitter_type,
  isEdit,
  handleMarkerDrag = noop,
}) => {
  if (coordinates) {
    const Icon = getIcon({splitter_type, isEdit});
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
        <Icon />
      </Marker>
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
      {data.map(dp => {
        const {id, coordinates, splitter_type} = dp;
        return (
          <Geometry
            key={id}
            splitter_type={splitter_type}
            coordinates={coordinates}
          />
        );
      })}
    </>
  );
};

export const AddLayer = () => {
  const coordinates = useSelector(getGisMapStateGeometry);

  return (
    <AddMarkerLayer
      helpText="Click on map to add new Splitter"
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
  const configuration = useSelector(getLayerSelectedConfiguration(LAYER_KEY));
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
      splitter_type={configuration.splitter_type}
      isEdit={isEdit}
    />
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
          status: formData.status.value,
        };
      } else {
        return {
          ...formData,
          // remove coordinates and add geometry
          coordinates: undefined,
          remark: undefined,
          geometry: latLongMapToCoords([formData.coordinates])[0],
          // convert select fields to simple values
          status: formData.status.value,
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
  {label: 'Splitter Type', field: 'splitter_type_display', type: 'simple'},
  {label: 'Address', field: 'address', type: 'simple'},
  {label: 'Ratio', field: 'ratio', type: 'simple'},
  {label: 'Specification', field: 'specification', type: 'simple'},
  {label: 'Vendor', field: 'vendor', type: 'simple'},
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
