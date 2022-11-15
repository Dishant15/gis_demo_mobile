import React, {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from 'react-query';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Button} from 'react-native-paper';

import get from 'lodash/get';
import round from 'lodash/round';
import size from 'lodash/size';
import {lineString, length} from '@turf/turf';

import MapCard from '~Common/components/MapCard';

import useValidateGeometry from '../hooks/useValidateGeometry';

import {setMapState} from '~planning/data/planningGis.reducer';
import {
  getPlanningMapState,
  getPlanningTicketData,
  getPlanningTicketWorkOrderId,
} from '~planning/data/planningGis.selectors';
import {
  addNewElement,
  addNewTicketWorkorder,
  editElementDetails,
  editTicketWorkorderElement,
} from '~planning/data/layer.services';
import {fetchLayerDataThunk} from '~planning/data/actionBar.services';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';

import {FEATURE_TYPES} from '../layers/common/configuration';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {latLongMapToCoords, latLongMapToLineCoords} from '~utils/map.utils';
import {
  LayerKeyMappings,
  PLANNING_EVENT,
  TICKET_WORKORDER_TYPE,
} from '../utils';
import {colors, layout, THEME_COLORS} from '~constants/constants';

const EditGisLayer = () => {
  const dispatch = useDispatch();
  const {validateElementMutation, isValidationLoading} = useValidateGeometry();

  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const ticketData = useSelector(getPlanningTicketData);
  const workOrderId = useSelector(getPlanningTicketWorkOrderId);
  const {
    geometry: coordinates,
    data,
    layerKey,
    event,
  } = useSelector(getPlanningMapState);

  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);
  const ticketId = get(ticketData, 'id');
  const ticketName = get(ticketData, 'name');
  const isEdit = event === PLANNING_EVENT.editElementGeometry;

  const onSuccessHandler = () => {
    showToast('Element location updated Successfully', TOAST_TYPE.SUCCESS);
    // close form
    dispatch(setMapState({}));
    // refetch layer
    if (size(selectedRegionIds)) {
      dispatch(
        fetchLayerDataThunk({
          regionIdList: selectedRegionIds,
          layerKey,
        }),
      );
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

  const {mutate: editWorkOrder, isLoading: isEditTicketLoading} = useMutation(
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

  const {mutate: addElement, isLoading: isAddLoading} = useMutation(
    mutationData => addNewElement({data: mutationData, layerKey}),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  const {mutate: editElement, isLoading: isEditLoading} = useMutation(
    mutationData =>
      editElementDetails({data: mutationData, layerKey, elementId: data.id}),
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
      element: {...submitData, id: data?.data},
    };
    // add workorder data to validatedData
    addWorkOrder(workOrderData);
  };

  const handleUpdate = () => {
    const isWorkOrderUpdate = !!ticketId;
    // remove remark from data and pass in workorder data
    const remark = data.remark;
    delete data.remark;
    // create submit data
    let submitData = {};
    if (featureType === FEATURE_TYPES.POLYLINE) {
      const geometry = latLongMapToLineCoords(coordinates);
      submitData = {
        geometry,
        gis_len: round(length(lineString(geometry)), 4),
      };
    } else if (featureType === FEATURE_TYPES.POLYGON) {
      submitData = {
        geometry: latLongMapToCoords(coordinates),
      };
    } else if (featureType === FEATURE_TYPES.POINT) {
      submitData = {
        geometry: latLongMapToCoords([coordinates])[0],
      };
    } else {
      throw new Error('feature type is invalid');
    }

    // server side validate geometry
    let validationData = {
      layerKey,
      element_id: data?.elementId,
      featureType,
      geometry: submitData.geometry,
      region_id_list: selectedRegionIds,
    };
    if (size(selectedRegionIds)) {
      validationData['region_id_list'] = selectedRegionIds;
    } else if (ticketId) {
      validationData['ticket_id'] = ticketId;
    }
    validateElementMutation(validationData, {
      onSuccess: () => {
        if (isEdit) {
          if (isWorkOrderUpdate) {
            if (workOrderId) {
              // edit work order element api
              editWorkOrder(submitData);
            } else {
              handleAddWorkOrder(submitData, remark);
            }
          } else {
            editElement(submitData);
          }
        } else {
          // add
          if (isWorkOrderUpdate) {
            console.log('add work order if not edit and ticket id exist');
            handleAddWorkOrder(submitData, remark);
          } else {
            addElement(submitData);
          }
        }
      },
    });
  };

  const handleCancel = useCallback(() => {
    dispatch(setMapState({}));
  }, []);

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
    isLoading ||
    isAddLoading ||
    isEditLoading ||
    isEditTicketLoading ||
    isValidationLoading;
  const ActionContent = (
    <>
      <TouchableOpacity onPress={handleUpdate}>
        <Button
          mode="text"
          color={colors.white}
          style={{backgroundColor: THEME_COLORS.secondary.main}}
          loading={isLoadingBtn}>
          Update
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
