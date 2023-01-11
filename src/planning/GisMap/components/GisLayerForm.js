import React, {useRef, useCallback} from 'react';
import {View} from 'react-native';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import get from 'lodash/get';

import DynamicForm from '~Common/DynamicForm';
import BackHeader from '~Common/components/Header/BackHeader';

import {
  addNewElement,
  addNewTicketWorkorder,
  editElementDetails,
  editTicketWorkorderElement,
} from '~planning/data/layer.services';
import {
  getPlanningMapState,
  getPlanningTicketId,
  getPlanningTicketWorkOrderId,
} from '~planning/data/planningGis.selectors';
import {
  setMapState,
  setTicketWorkOrderId,
} from '~planning/data/planningGis.reducer';
import {
  goBackFromGisEventScreen,
  onElementUpdate,
} from '~planning/data/event.actions';
import {fetchLayerListDetails} from '~planning/data/actionBar.services';
import {onFetchLayerListDetailsSuccess} from '~planning/data/planning.actions';

import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {
  LayerKeyMappings,
  PLANNING_EVENT,
  TICKET_WORKORDER_TYPE,
} from '../utils';
import {layout} from '~constants/constants';
import useValidateGeometry from '../hooks/useValidateGeometry';
import {fetchTicketWorkorderDataThunk} from '~planning/data/ticket.services';

export const GisLayerForm = ({layerKey}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const formRef = useRef();

  const {validateElementMutation, isValidationLoading} = useValidateGeometry(
    {},
  );

  const workOrderId = useSelector(getPlanningTicketWorkOrderId);
  const ticketId = useSelector(getPlanningTicketId);
  const {event, data: mapStateData} = useSelector(getPlanningMapState);

  const isEdit = event === PLANNING_EVENT.editElementForm;
  const formConfig = get(LayerKeyMappings, [layerKey, 'formConfig']);
  const transformAndValidateData = get(LayerKeyMappings, [
    layerKey,
    'transformAndValidateData',
  ]);
  const title = get(formConfig, 'sections.0.title', 'Element form');
  const isConfigurable = !!get(mapStateData, 'configuration');

  const queryRes = useQuery(
    'planningLayerConfigsDetails',
    fetchLayerListDetails,
    {
      staleTime: Infinity,
      enabled: isConfigurable,
      onSuccess: layerConfData => {
        dispatch(onFetchLayerListDetailsSuccess(layerConfData));
      },
    },
  );

  const onSuccessHandler = () => {
    showToast('Element operation completed Successfully', TOAST_TYPE.SUCCESS);
    dispatch(onElementUpdate(layerKey));
    dispatch(setTicketWorkOrderId(null));
    navigation.goBack();

    if (ticketId) {
      dispatch(fetchTicketWorkorderDataThunk(ticketId));
    }
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

  const {mutate: addElement, isLoading: isAddLoading} = useMutation(
    mutationData => addNewElement({data: mutationData, layerKey}),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  const {mutate: editElement, isLoading: isEditLoading} = useMutation(
    mutationData =>
      editElementDetails({
        data: mutationData,
        layerKey,
        elementId: mapStateData.id,
      }),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  const handleAddWorkOrder = (submitData, remark, geometry) => {
    const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);

    // @todo : dishant => improve comments
    // server side validate geometry
    let geomValidationData = {
      layerKey,
      element_id: mapStateData.id,
      featureType,
      geometry,
      ticket_id: ticketId,
    };

    validateElementMutation(geomValidationData, {
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

        // create workOrder data if isWorkOrderUpdate
        let workOrderData = {
          workOrder: {
            work_order_type: isEdit
              ? TICKET_WORKORDER_TYPE.EDIT
              : TICKET_WORKORDER_TYPE.ADD,
            layer_key: layerKey,
            remark,
          },
          element: submitData,
        };
        // add workorder data to validatedData
        addWorkOrder(workOrderData);
      },
    });
  };

  const onSubmit = (data, setError, clearErrors) => {
    clearErrors();
    let validatedData = prepareServerData(data, isEdit, formConfig);
    // convert data to server friendly form
    validatedData = transformAndValidateData
      ? transformAndValidateData(validatedData, setError, isEdit)
      : validatedData;

    const isWorkOrderUpdate = !!ticketId;
    // call addWorkOrder api if isWorkOrderUpdate, addElement api if not

    if (isEdit) {
      if (isWorkOrderUpdate) {
        // user came from a ticket
        if (workOrderId) {
          // edit work order element api
          editWorkOrderElementMutation(validatedData);
        } else {
          handleAddWorkOrder(validatedData, data.remark, data.geometry);
        }
      } else {
        // user came from planning in drawer
        // directly update element without workorder
        editElement(validatedData);
      }
    } else {
      // user came from GisMap Add Element tab
      if (isWorkOrderUpdate) {
        // user will add element with a workorder
        handleAddWorkOrder(validatedData, data.remark, data.geometry);
      } else {
        // directly add element
        addElement(validatedData);
      }
    }
  };

  const prepareServerData = useCallback((data, isEdit, formConfig) => {
    let serverData = {};
    for (let index = 0; index < formConfig.sections.length; index++) {
      const {fieldConfigs} = formConfig.sections[index];
      for (let fInd = 0; fInd < fieldConfigs.length; fInd++) {
        const {field_key} = fieldConfigs[fInd];
        serverData[field_key] = data[field_key];
      }
    }
    if (isEdit) {
      serverData['id'] = data?.id;
      delete serverData['geometry'];
    } else {
      delete serverData['coordinates'];
      // add geometry data bcoz, formConfig dont have that field
      serverData['geometry'] = data?.geometry;
    }
    // add configuration id if have
    if (data?.configuration) {
      serverData['configuration'] = data?.configuration;
    }
    if (data?.association) {
      serverData['association'] = data.association;
    }
    return serverData;
  }, []);

  const handleGoBack = () => {
    dispatch(setMapState({}));
    dispatch(setTicketWorkOrderId(null));
    dispatch(goBackFromGisEventScreen(navigation));
  };
  const isLoadingBtn =
    isLoading ||
    isAddLoading ||
    isEditLoading ||
    isEditTicketLoading ||
    isValidationLoading;

  return (
    <View style={layout.container}>
      <BackHeader title={title} onGoBack={handleGoBack} />
      <DynamicForm
        ref={formRef}
        formConfigs={formConfig}
        data={mapStateData}
        onSubmit={onSubmit}
        onCancel={handleGoBack}
        isLoading={isLoadingBtn}
        skipTitleIndex={0}
      />
    </View>
  );
};
