import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {Marker} from 'react-native-maps';
import {Button, Card} from 'react-native-paper';

import FloatingCard from '~Common/components/FloatingCard';
import AddMarkerLayer from '~planning/GisMap/components/AddMarkerLayer';
import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';

import {
  getGisMapState,
  getGisMapStateGeometry,
  getLayerViewData,
} from '~planning/data/planningGis.selectors';
import {
  resetMapState,
  setMapState,
  updateMapStateCoordinates,
} from '~planning/data/planningGis.reducer';

import {
  ELEMENT_FORM_TEMPLATE,
  INITIAL_ELEMENT_DATA,
  LAYER_KEY,
} from './configurations';
import {layout, THEME_COLORS} from '~constants/constants';

import Icon from '~assets/markers/p_dp_view.svg';
import {noop} from 'lodash';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {latLongMapToCoords} from '~utils/map.utils';
import {getSelectedPlanningTicket} from '~planningTicket/data/planningTicket.selector';

export const InfoCard = () => {
  const actionState = useSelector(getGisMapState);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleCustomBack = useCallback(() => {
    dispatch(resetMapState());
  }, []);

  const handleBtnPress = useCallback(() => {
    navigation.navigate('form');
  }, []);

  switch (actionState) {
    case 'A':
      return (
        <FloatingCard
          title="Add new element"
          subtitle="Tap on map to add element, long press and drag to change position">
          <Card.Actions>
            <Button
              mode="contained"
              icon="keyboard-backspace"
              color={THEME_COLORS.error.main}
              style={[layout.smallButton, layout.smallButtonMR]}
              onPress={handleCustomBack}>
              Cancel
            </Button>
            <Button
              mode="contained"
              icon="check"
              color={THEME_COLORS.primary.main}
              onPress={handleBtnPress}
              style={layout.smallButton}>
              Complete
            </Button>
          </Card.Actions>
        </FloatingCard>
      );
    case 'E':
      return null;
    case 'D':
      return null;
    default:
      return null;
  }
};

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
        event: PLANNING_EVENT.showElementForm, // event for "layerForm"
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
  const ticketId = useSelector(getSelectedPlanningTicket);
  const transformAndValidateData = useCallback(
    formData => {
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
          geometry: latLongMapToCoords([formData.coordinates])[0],
          // convert select fields to simple values
          status: formData.status.value,
        },
      };
    },
    [ticketId],
  );

  return (
    <GisLayerForm
      layerKey={LAYER_KEY}
      ticketId={ticketId}
      formConfig={ELEMENT_FORM_TEMPLATE}
      transformAndValidateData={transformAndValidateData}
    />
  );
};
