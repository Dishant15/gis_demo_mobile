import React, {useRef} from 'react';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';

import DynamicForm from '~Common/DynamicForm';
import {CustomBottomPopup} from '~Common/CustomPopup';

import {
  addNewElement,
  addNewTicketWorkorder,
} from '~planning/data/layer.services';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';
import {
  getPlanningMapStateData,
  getPlanningTicketWorkOrderId,
} from '~planning/data/planningGis.selectors';
import {setMapState} from '~planning/data/planningGis.reducer';
import {fetchLayerDataThunk} from '~planning/data/actionBar.services';
import {getSelectedPlanningTicket} from '~planningTicket/data/planningTicket.selector';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';

export const GisLayerForm = ({
  formConfig,
  layerKey,
  transformAndValidateData,
  isConfigurable,
  isEdit,
}) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const data = useSelector(getPlanningMapStateData);
  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const ticketId = useSelector(getSelectedPlanningTicket);
  const workOrderId = useSelector(getPlanningTicketWorkOrderId);

  const onSuccessHandler = () => {
    showToast('Element operation completed Successfully', TOAST_TYPE.SUCCESS);
    // close form
    dispatch(setMapState({}));
    // refetch layer
    dispatch(
      fetchLayerDataThunk({
        regionIdList: selectedRegionIds,
        layerKey,
      }),
    );
  };

  const onErrorHandler = err => {
    const errStatus = get(err, 'response.status');
    let notiText;
    if (errStatus === 400) {
      let errData = get(err, 'response.data');
      for (const fieldKey in errData) {
        if (Object.hasOwnProperty.call(errData, fieldKey)) {
          const errList = errData[fieldKey];
          formRef.current.onError(fieldKey, get(errList, '0', ''));
        }
      }
      notiText = 'Please correct input errors and submit again';
    } else {
      // maybe Internal server or network error
      formRef.current.onError(
        '__all__',
        'Something went wrong. Can not perform operation',
      );
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

  const {mutate: addElement, isLoading: isAddLoading} = useMutation(
    mutationData => addNewElement({data: mutationData, layerKey}),
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
    const validatedData = transformAndValidateData(data, setError);
    const isWorkOrderUpdate = !!ticketId;
    // call addWorkOrder api if isWorkOrderUpdate, addElement api if not
    if (isWorkOrderUpdate) {
      if (isEdit) {
        // --- call edit work order element api
      } else {
        // create workOrder data if isWorkOrderUpdate
        const workOrderData = {
          workOrder: {
            work_order_type: workOrderId,
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
        // editElement(validatedData);
      } else {
        addElement(validatedData);
      }
    }
  };

  const onClose = () => {
    dispatch(setMapState({}));
  };

  return (
    <CustomBottomPopup
      wrapperStyle={{
        height: '100%',
        maxHeight: '100%',
      }}
      handleClose={onClose}>
      <DynamicForm
        ref={formRef}
        formConfigs={formConfig}
        data={data}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </CustomBottomPopup>
  );
};
