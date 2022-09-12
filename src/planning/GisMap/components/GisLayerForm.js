import React, {useRef} from 'react';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';

import DynamicForm from '~Common/DynamicForm';

import {
  addNewElement,
  addNewTicketWorkorder,
} from '~planning/data/layer.services';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';
import {getPlanningMapStateData} from '~planning/data/planningGis.selectors';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {setMapState} from '~planning/data/planningGis.reducer';
import {fetchLayerDataThunk} from '~planning/data/actionBar.services';
import {View} from 'react-native';

export const GisLayerForm = ({
  formConfig,
  isConfigurable,
  layerKey,
  ticketId,
  transformAndValidateData,
}) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const data = useSelector(getPlanningMapStateData);
  const selectedRegionIds = useSelector(getSelectedRegionIds);

  const {mutate: addElement, isLoading} = useMutation(
    mutationData => addNewTicketWorkorder({data: mutationData, ticketId}),
    {
      onSuccess: () => {
        showToast('Element Added Successfully', TOAST_TYPE.SUCCESS);
        // close form
        dispatch(setMapState({}));
        // refetch layer
        dispatch(
          fetchLayerDataThunk({
            regionIdList: selectedRegionIds,
            layerKey,
          }),
        );
      },
      onError: err => {
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
      },
    },
  );

  const onSubmit = (data, setError, clearErrors) => {
    clearErrors();
    // convert data to server friendly form
    const validatedData = transformAndValidateData(data, setError);
    addElement(validatedData);
  };

  const onClose = () => {
    dispatch(setMapState({}));
  };

  return (
    <DynamicForm
      ref={formRef}
      formConfigs={formConfig}
      data={data}
      onSubmit={onSubmit}
      onCancel={onClose}
      isLoading={isLoading}
    />
  );
};
