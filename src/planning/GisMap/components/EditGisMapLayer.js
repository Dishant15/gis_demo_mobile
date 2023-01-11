import React, {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from 'react-query';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Button} from 'react-native-paper';

import get from 'lodash/get';
import round from 'lodash/round';
import size from 'lodash/size';
import {lineString, length, area, polygon, convertArea} from '@turf/turf';

import MapCard from '~Common/components/MapCard';

import useValidateGeometry from '../hooks/useValidateGeometry';

import {
  setMapState,
  setTicketWorkOrderId,
  unHideElement,
  updateMapStateDataErrPolygons,
} from '~planning/data/planningGis.reducer';
import {
  getPlanningMapState,
  getPlanningTicketData,
  getPlanningTicketWorkOrderId,
} from '~planning/data/planningGis.selectors';
import {
  addNewTicketWorkorder,
  editElementDetails,
  editTicketWorkorderElement,
} from '~planning/data/layer.services';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';
import {onElementUpdate} from '~planning/data/event.actions';

import {FEATURE_TYPES} from '../layers/common/configuration';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {
  latLongMapToCoords,
  latLongMapToLineCoords,
  pointLatLongMapToCoords,
} from '~utils/map.utils';
import {
  LayerKeyMappings,
  PLANNING_EVENT,
  TICKET_WORKORDER_TYPE,
} from '../utils';
import {colors, layout, THEME_COLORS} from '~constants/constants';
import {fetchTicketWorkorderDataThunk} from '~planning/data/ticket.services';

const EditGisLayer = () => {
  const dispatch = useDispatch();
  const {validateElementMutation, isValidationLoading} = useValidateGeometry({
    setErrPolygonAction: updateMapStateDataErrPolygons,
  });

  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const ticketData = useSelector(getPlanningTicketData);
  const workOrderId = useSelector(getPlanningTicketWorkOrderId);
  const {
    geometry: featureCoords,
    data: mapStateData,
    layerKey,
  } = useSelector(getPlanningMapState);

  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);
  const ticketId = get(ticketData, 'id');
  const ticketName = get(ticketData, 'name');
  const {elementId, remark} = mapStateData;

  const formMetaData = get(
    LayerKeyMappings,
    [layerKey, 'formConfig', 'metaData'],
    {},
  );

  const onSuccessHandler = () => {
    showToast('Element location updated Successfully', TOAST_TYPE.SUCCESS);
    dispatch(onElementUpdate(layerKey));
    dispatch(setTicketWorkOrderId(null));

    if (ticketId) {
      dispatch(fetchTicketWorkorderDataThunk(ticketId));
    }
  };

  const onErrorHandler = err => {
    const errStatus = get(err, 'response.status');
    let notiText;
    if (errStatus === 400) {
      // handle bad data
      let errData = get(err, 'response.data');
      for (const fieldKey in errData) {
        if (Object.hasOwnProperty.call(errData, fieldKey)) {
          const errList = errData[fieldKey];
          notiText = get(errList, '0', '');
          break;
        }
      }
    } else {
      notiText =
        'Something went wrong at our side. Please try again after refreshing the page.';
    }

    showToast(notiText, TOAST_TYPE.ERROR);
  };

  const {mutate: addWorkOrder, isLoading} = useMutation(
    mutationData => addNewTicketWorkorder({data: mutationData, ticketId}),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  const {mutate: editWorkOrderElementMutation, isLoading: isEditTicketLoading} =
    useMutation(
      mutationData =>
        editTicketWorkorderElement({
          data: mutationData,
          workOrderId,
        }),
      {
        onSuccess: onSuccessHandler,
        onError: onErrorHandler,
      },
    );

  const {mutate: editElement, isLoading: isEditLoading} = useMutation(
    mutationData =>
      editElementDetails({data: mutationData, layerKey, elementId}),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  const handleAddWorkOrder = (submitData, remark) => {
    // create workOrder data if isWorkOrderUpdate
    let workOrderData = {
      workOrder: {
        work_order_type: TICKET_WORKORDER_TYPE.EDIT,
        layer_key: layerKey,
        remark,
      },
      element: {...submitData, id: elementId},
    };
    // add workorder data to validatedData
    addWorkOrder(workOrderData);
  };

  const handleSubmit = () => {
    const isWorkOrderUpdate = !!ticketId;
    // create submit data
    let submitData = {};
    if (featureType === FEATURE_TYPES.POLYLINE) {
      submitData.geometry = latLongMapToLineCoords(featureCoords);
    }
    //
    else if (featureType === FEATURE_TYPES.POLYGON) {
      submitData.geometry = latLongMapToCoords(featureCoords);
    }
    //
    else if (featureType === FEATURE_TYPES.POINT) {
      submitData.geometry = pointLatLongMapToCoords(featureCoords);
    }
    //
    else {
      throw new Error('feature type is invalid');
    }

    /**
     * get form config from LayerKeyMappings > layerKey
     * check form config have meta data and geometryFields exist
     * geometryFields used to auto calculate some fields and pre-fields into form
     */
    const geometryFields = Array.isArray(formMetaData.geometryUpdateFields)
      ? formMetaData.geometryUpdateFields
      : [];

    for (let index = 0; index < geometryFields.length; index++) {
      const field = geometryFields[index];
      if (field === 'gis_len') {
        // get length and round to 4 decimals
        submitData.gis_len = round(length(lineString(submitData.geometry)), 4);
      } else if (field === 'gis_area') {
        // get area of polygon
        const areaInMeters = area(polygon([submitData.geometry]));
        submitData.gis_area = round(
          convertArea(areaInMeters, 'meters', 'kilometers'),
          4,
        );
      }
    }

    // server side validate geometry
    let validationData = {
      layerKey,
      element_id: elementId,
      featureType,
      geometry: submitData.geometry,
    };
    if (ticketId) {
      validationData['ticket_id'] = ticketId;
    } else if (size(selectedRegionIds)) {
      validationData['region_id_list'] = selectedRegionIds;
    }

    validateElementMutation(validationData, {
      onSuccess: res => {
        // update submit data based on validation res
        const children = get(res, 'data.children', {});
        const getDependantFields = get(
          LayerKeyMappings,
          [layerKey, 'getDependantFields'],
          ({submitData}) => submitData,
        );
        submitData = getDependantFields({submitData, children});
        submitData.association = get(res, 'data', {});

        if (isWorkOrderUpdate) {
          // user came from a ticket
          if (workOrderId) {
            // edit work order element api
            editWorkOrderElementMutation(submitData);
          } else {
            // edit planning element and submit with new work order
            handleAddWorkOrder(submitData, remark);
          }
        } else {
          // user came from planning in drawer
          // directly update element without workorder
          editElement(submitData);
        }
      },
    });
  };

  const handleCancel = useCallback(() => {
    // unhide element from layerData
    dispatch(
      unHideElement({
        layerKey,
        elementId: elementId,
        isTicket: !!ticketId,
      }),
    );
    // go back to details
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: {elementId},
      }),
    );
  }, [layerKey, ticketId, elementId]);

  // helpText show in popup based on featureType
  const mapCardTitle = useMemo(() => {
    switch (featureType) {
      case FEATURE_TYPES.POLYLINE:
        return 'Click on map to create line on map. Double click to complete.';
      case FEATURE_TYPES.POLYGON:
        return 'Click on map to place area points on map. Complete polygon and adjust points.';
      case FEATURE_TYPES.POINT:
        return 'Click or drag and drop marker to new location';
      default:
        return '';
    }
  }, [featureType]);

  const isLoadingBtn =
    isLoading || isEditLoading || isEditTicketLoading || isValidationLoading;
  const ActionContent = (
    <>
      <TouchableOpacity onPress={handleSubmit}>
        <Button
          mode="text"
          color={colors.white}
          style={{backgroundColor: THEME_COLORS.secondary.main}}
          loading={isLoadingBtn}>
          Submit
        </Button>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCancel}>
        <Button mode="text" color={THEME_COLORS.error.main} style={layout.mrl8}>
          Cancel
        </Button>
      </TouchableOpacity>
    </>
  );

  return (
    <MapCard
      title={ticketName ? ticketName : 'Planning'}
      subTitle={mapCardTitle}
      actionContent={ActionContent}
    />
  );
};

export default EditGisLayer;
