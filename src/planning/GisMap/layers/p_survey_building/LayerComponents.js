import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Marker} from 'react-native-maps';

import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';

import {zIndexMapping} from '../common/configuration';
import {
  getLayerViewData,
  getPlanningMapStateData,
  getGisMapStateGeometry,
} from '~planning/data/planningGis.selectors';
import {
  INITIAL_ELEMENT_DATA,
  LAYER_KEY,
  ELEMENT_FORM_TEMPLATE,
} from './configurations';
import {noop} from 'lodash';
import {updateMapStateCoordinates} from '~planning/data/planningGis.reducer';

import BuildingViewIcon from '~assets/markers/building_view.svg';
import BuildingEditIcon from '~assets/markers/building_pin.svg';
import AddGisMapLayer from '~planning/GisMap/components/AddGisMapLayer';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {getPlanningMapStateEvent} from '~planning/data/planningState.selectors';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import EditGisLayer from '~planning/GisMap/components/EditGisLayer';

export const getIcon = props =>
  props?.isEdit ? BuildingEditIcon : BuildingViewIcon;

export const Geometry = ({coordinates, isEdit, handleMarkerDrag = noop}) => {
  if (coordinates) {
    const Icon = getIcon({isEdit});
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
        const {id, coordinates} = dp;
        return <Geometry key={id} coordinates={coordinates} />;
      })}
    </>
  );
};

export const AddLayer = () => {
  return (
    <AddGisMapLayer
      helpText="Click on map to add new Distribution Point location"
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
  const dispatch = useDispatch();
  const coordinates = useSelector(getGisMapStateGeometry);
  // get map state event
  const currEvent = useSelector(getPlanningMapStateEvent);
  // check if add or edit event
  const isEdit =
    currEvent === PLANNING_EVENT.editElementLocation ||
    currEvent === PLANNING_EVENT.addElement;

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

export const EditMapLayer = () => {
  return (
    <EditGisLayer
      helpText="Click or drag and drop marker to new location"
      layerKey={LAYER_KEY}
      featureType="marker"
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
  {label: 'Tags', field: 'tags', type: 'simple'},
  {label: 'Categories', field: 'category_display', type: 'simple'},
  {label: 'Floors', field: 'floors', type: 'simple'},
  {label: 'House Per Floor', field: 'house_per_floor', type: 'simple'},
  {label: 'Total Home Pass', field: 'total_home_pass', type: 'simple'},
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
