import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Marker} from 'react-native-maps';

import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';
import AddGisMapLayer from '~planning/GisMap/components/AddGisMapLayer';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import EditGisLayer from '~planning/GisMap/components/EditGisLayer';

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

import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {getPlanningMapStateEvent} from '~planning/data/planningState.selectors';

import BuildingViewIcon from '~assets/markers/building_view.svg';
import BuildingEditIcon from '~assets/markers/building_pin.svg';

export const getIcon = props =>
  props?.isEdit ? BuildingEditIcon : BuildingViewIcon;

export const Geometry = ({
  coordinates,
  isEdit,
  handleMarkerDrag = noop,
  tappable = false,
  draggable = false,
}) => {
  if (coordinates) {
    const Icon = getIcon({isEdit});
    return (
      <Marker
        coordinate={coordinates}
        onDragEnd={handleMarkerDrag}
        tappable={tappable}
        draggable={draggable}
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
    currEvent === PLANNING_EVENT.editElementGeometry ||
    currEvent === PLANNING_EVENT.addElementGeometry;

  const handleMarkerDrag = e => {
    const coords = e.nativeEvent.coordinate;
    dispatch(updateMapStateCoordinates(coords));
  };

  return (
    <Geometry
      coordinates={coordinates}
      handleMarkerDrag={handleMarkerDrag}
      isEdit={isEdit}
      tappable={true}
      draggable={true}
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
