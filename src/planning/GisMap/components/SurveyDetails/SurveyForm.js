import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {layout, THEME_COLORS} from '~constants/constants';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import DynamicForm from '~Common/DynamicForm';
import TrackReturnOrder from '~Common/TrackReturnOrder';
import {
  getPlanningMapState,
  getPlanningTicketId,
  getSurveyWorkorderDetails,
} from '~planning/data/planningGis.selectors';
import {
  setMapState,
  setSurveyWoScreenType,
} from '~planning/data/planningGis.reducer';
import {STEPS_CONFIG, STEPS_TRACK} from './configuration';
import {get, pick} from 'lodash';
import {upsertSurveyWoDetails} from '~planning/data/ticket.services';
import {useMutation} from 'react-query';
import {useFocusEffect} from '@react-navigation/native';
import {openElementDetails} from '~planning/data/planning.actions';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import SurverImageUpload from './SurverImageUpload';

const LAST_STEP = 5;

const SurveyForm = () => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const surveyWorkorder = useSelector(getSurveyWorkorderDetails);
  const mapState = useSelector(getPlanningMapState);
  const ticketId = useSelector(getPlanningTicketId);

  const {data: mapStateData, currentStep, layerKey} = mapState;
  const isEdit = surveyWorkorder.screenType === 2;

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', navigateToReview);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', navigateToReview);
    }, [isEdit]),
  );

  const navigateToReview = () => {
    if (isEdit) {
      dispatch(setSurveyWoScreenType(3));
    } else {
      dispatch(
        openElementDetails({layerKey, elementId: mapStateData.elementId}),
      );
    }
    return true; // required for backHandler
  };

  const onSuccessHandler = res => {
    if (isEdit) {
      dispatch(setSurveyWoScreenType(3));
      dispatch(
        setMapState({
          ...mapState,
          data: {...mapState.data, ...res},
        }),
      );
      showToast('Survey updated successfully.', TOAST_TYPE.SUCCESS);
    } else {
      if (currentStep === LAST_STEP) {
        dispatch(setSurveyWoScreenType(3));
        dispatch(
          setMapState({
            ...mapState,
            data: {...mapState.data, ...res},
          }),
        );
        showToast('Survey created successfully.', TOAST_TYPE.SUCCESS);
      } else if (currentStep < LAST_STEP) {
        dispatch(
          setMapState({
            ...mapState,
            data: {...mapState.data, ...res},
            currentStep: currentStep + 1,
          }),
        );
      }
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
      notiText =
        'Something went wrong at our side. Please try again after refreshing the page.';
    }
    showToast(notiText, TOAST_TYPE.ERROR);
  };

  const {mutate, isLoading} = useMutation(
    mutationData => upsertSurveyWoDetails(mutationData),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    },
  );

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1: {
        return {
          formConfigs: STEPS_CONFIG[0],
          submitButtonText: 'Next',
          cancelButtonText: 'Cancel',
          trackIndex: 0,
          data: pick(mapStateData, ['address', 'lat', 'long']),
        };
      }

      case 2: {
        return {
          formConfigs: STEPS_CONFIG[1],
          submitButtonText: 'Next',
          cancelButtonText: 'Back',
          trackIndex: 2,
          data: pick(mapStateData, [
            'package',
            'msi_name',
            'district_name',
            'district_code',
            'block_name',
            'block_code',
            'pop_name',
            'pop_code',
            'pop_type',
            'installation_floor',
            'land_mark',
            'location_details',
            'connected_from',
            'connected_to',
          ]),
        };
      }

      case 3: {
        return {
          formConfigs: STEPS_CONFIG[2],
          submitButtonText: 'Next',
          cancelButtonText: 'Back',
          trackIndex: 4,
          data: pick(mapStateData, [
            'building_condition',
            'ceil_condition',
            'pop_location_reachability',
            'eb_service_connection_availability',
            'regular_power_availability',
            'input_voltage',
            'service_connection',
            'total_contracted_load',
            'load_for_pop_room',
            'incoming_eb_cable_size',
            'main_door_entry_size',
            'number_of_windows',
            'space_availibility',
            'seepage',
            'power_backup',
            'avail_swan_connectivity',
            'dist_near_swan_pop',
          ]),
        };
      }
      case 4: {
        return {
          formConfigs: STEPS_CONFIG[3],
          submitButtonText: 'Next',
          cancelButtonText: 'Back',
          trackIndex: 6,
          data: pick(mapStateData, [
            'contact_person_name',
            'designation',
            'mobile_no',
            'email_id',
            'alternate_name',
            'alternate_designation',
            'alternate_mobile_no',
            'alternate_email_id',
          ]),
        };
      }
      case 5: {
        return {
          uploadImage: true,
          submitButtonText: 'Submit',
          cancelButtonText: 'Back',
          trackIndex: 8,
        };
      }
      default: {
        return null;
      }
    }
  }, [currentStep, isEdit, mapStateData]);

  const handleFormSubmit = data => {
    const isEditApiCall = isEdit || currentStep !== 1;
    mutate({
      isEdit: isEditApiCall,
      layerKey,
      elementId: mapStateData.elementId,
      data: {...data, ticketId},
    });
  };

  const handleCancel = () => {
    navigateToReview();
  };

  if (!stepContent) return null;

  if (stepContent.uploadImage) {
    return (
      <View style={layout.box}>
        <TrackReturnOrder
          selectedIndex={stepContent.trackIndex}
          stepDetail={STEPS_TRACK}
        />
        <SurverImageUpload
          onSuccess={onSuccessHandler}
          onError={onErrorHandler}
        />
      </View>
    );
  }
  return (
    <View>
      <DynamicForm
        key={currentStep}
        ref={formRef}
        formConfigs={stepContent.formConfigs}
        data={stepContent.data}
        isEdit={isEdit}
        isLoading={isLoading}
        skipTitleIndex={0}
        headerElement={
          <TrackReturnOrder
            selectedIndex={stepContent.trackIndex}
            stepDetail={STEPS_TRACK}
          />
        }
        actionElement={handleSubmit => (
          <View style={styles.btnWrapper}>
            <Button
              style={[styles.btn1, {borderColor: THEME_COLORS.error.main}]}
              contentStyle={layout.button}
              color={THEME_COLORS.error.main}
              uppercase
              mode="outlined"
              onPress={handleCancel}>
              Cancel
            </Button>
            <Button
              style={[styles.btn2, {borderColor: THEME_COLORS.secondary.main}]}
              loading={isLoading}
              contentStyle={[layout.button]}
              color={THEME_COLORS.secondary.main}
              uppercase
              mode="outlined"
              onPress={handleSubmit(handleFormSubmit)}>
              {isEdit ? 'Submit' : stepContent.submitButtonText}
            </Button>
          </View>
        )}
      />
    </View>
  );
};

export default SurveyForm;

const styles = StyleSheet.create({
  btnWrapper: {
    flexDirection: 'row',
    paddingVertical: 24,
    marginBottom: 200,
  },
  btn1: {
    flex: 1,
    marginRight: 6,
  },
  btn2: {
    flex: 1,
    marginLeft: 6,
  },
});
