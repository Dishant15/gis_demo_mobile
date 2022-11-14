import React, {useRef} from 'react';
import {View} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import get from 'lodash/get';
import size from 'lodash/size';

import DynamicForm from '~Common/DynamicForm';
import BackHeader from '~Common/components/Header/BackHeader';

import {
  addNewElement,
  addNewTicketWorkorder,
  editElementDetails,
  editTicketWorkorderElement,
} from '~planning/data/layer.services';
import {
  getLayerSelectedConfiguration,
  getSelectedRegionIds,
} from '~planning/data/planningState.selectors';
import {
  getPlanningMapState,
  getPlanningTicketId,
  getPlanningTicketWorkOrderId,
} from '~planning/data/planningGis.selectors';
import {setMapState} from '~planning/data/planningGis.reducer';
import {fetchLayerDataThunk} from '~planning/data/actionBar.services';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {
  LayerKeyMappings,
  PLANNING_EVENT,
  TICKET_WORKORDER_TYPE,
} from '../utils';
import {layout, screens} from '~constants/constants';

export const GisLayerForm = ({layerKey}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const formRef = useRef();

  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const workOrderId = useSelector(getPlanningTicketWorkOrderId);
  const ticketId = useSelector(getPlanningTicketId);
  const {event, data} = useSelector(getPlanningMapState);
  const configuration = useSelector(getLayerSelectedConfiguration(layerKey));

  const isEdit = event === PLANNING_EVENT.editElementForm;
  const formConfig = get(LayerKeyMappings, [layerKey, 'formConfig']);
  const transformAndValidateData = get(LayerKeyMappings, [
    layerKey,
    'transformAndValidateData',
  ]);

  const onSuccessHandler = () => {
    showToast('Element operation completed Successfully', TOAST_TYPE.SUCCESS);
    // close form
    dispatch(setMapState({}));
    if (size(selectedRegionIds)) {
      // refetch layer
      dispatch(
        fetchLayerDataThunk({
          regionIdList: selectedRegionIds,
          layerKey,
        }),
      );
    }
    // navigate to planning map
    navigation.navigate(screens.planningScreen);
  };

  const onErrorHandler = err => {
    const errStatus = get(err, 'response.status');
    let notiText;
    if (errStatus === 400) {
      let errData = get(err, 'response.data');
      for (const fieldKey in errData) {
        if (Object.hasOwnProperty.call(errData, fieldKey)) {
          const errList = errData[fieldKey];
          if (fieldKey === 'geometry') continue;
          formRef.current.onError(fieldKey, get(errList, '0', ''));
        }
      }
      notiText = 'Please correct input errors and submit again';
    } else {
      // maybe Internal server or network error
      // formRef.current.onError(
      //   '__all__',
      //   'Something went wrong. Can not perform operation',
      // );
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

  const onSubmit = (data, setError, clearErrors) => {
    clearErrors();
    // remove remark from data and pass in workorder data
    const remark = data.remark;
    delete data.remark;
    // convert data to server friendly form
    const validatedData = transformAndValidateData
      ? transformAndValidateData(data, setError, isEdit, configuration)
      : data;
    const isWorkOrderUpdate = !!ticketId;
    // call addWorkOrder api if isWorkOrderUpdate, addElement api if not
    if (isWorkOrderUpdate) {
      if (isEdit && workOrderId) {
        // edit work order element api
        editWorkOrder({...validatedData, geometry: undefined});
      } else {
        // create workOrder data if isWorkOrderUpdate
        let workOrderData = {
          workOrder: {
            work_order_type: TICKET_WORKORDER_TYPE.ADD,
            layer_key: layerKey,
            remark,
          },
          element: validatedData,
        };
        // add workorder data to validatedData
        addWorkOrder(workOrderData);
      }
    } else {
      if (isEdit) {
        editElement({...validatedData, geometry: undefined});
      } else {
        addElement(validatedData);
      }
    }
  };

  const handleGoBack = () => {
    dispatch(setMapState({}));
    navigation.goBack();
  };

  return (
    <View style={layout.container}>
      <BackHeader title="Element form" onGoBack={handleGoBack} />
      <DynamicForm
        ref={formRef}
        formConfigs={formConfig}
        data={data}
        onSubmit={onSubmit}
        onCancel={handleGoBack}
        isLoading={
          isLoading || isAddLoading || isEditLoading || isEditTicketLoading
        }
      />
    </View>
  );
};
