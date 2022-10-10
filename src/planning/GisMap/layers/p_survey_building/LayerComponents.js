import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {Marker} from 'react-native-maps';

import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';

import {zIndexMapping} from '../common/configuration';
import {
  getLayerViewData,
  getPlanningMapStateData,
} from '~planning/data/planningGis.selectors';
import {LAYER_KEY} from './configurations';
import {noop} from 'lodash';

import BuildingViewIcon from '~assets/markers/building_view.svg';
import BuildingEditIcon from '~assets/markers/building_pin.svg';

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
