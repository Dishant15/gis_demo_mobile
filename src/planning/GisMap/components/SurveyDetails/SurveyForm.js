import React, {useMemo, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
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
import {pick} from 'lodash';
import {upsertSurveyWoDetails} from '~planning/data/ticket.services';
import {useMutation} from 'react-query';

const SurveyForm = () => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const surveyWorkorder = useSelector(getSurveyWorkorderDetails);
  const mapState = useSelector(getPlanningMapState);
  const ticketId = useSelector(getPlanningTicketId);

  const {data: mapStateData, currentStep, layerKey} = mapState;
  const isEdit = surveyWorkorder.screenType === 2;

  const onSuccessHandler = res => {
    if (isEdit) {
      dispatch(setSurveyWoScreenType(3));
    } else {
      if (currentStep === 4) {
        dispatch(setSurveyWoScreenType(3));
      } else if (currentStep < 4) {
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

  const onErrorHandler = err => {};

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
            'block_name',
            'block_code',
            'pop_code',
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
            'space_availibility',
            'seepage',
            'avail_swan_connectivity',
          ]),
        };
      }
      case 4: {
        {
          return {
            formConfigs: STEPS_CONFIG[3],
            submitButtonText: 'Submit',
            cancelButtonText: 'Back',
            trackIndex: 6,
            data: pick(mapStateData, [
              'contact_person_name',
              'designation',
              'mobile_no',
              'email_id',
            ]),
          };
        }
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

  const handleCancel = () => {};

  if (!stepContent) return null;

  return (
    <View>
      <TrackReturnOrder
        selectedIndex={stepContent.trackIndex}
        stepDetail={STEPS_TRACK}
      />
      <DynamicForm
        ref={formRef}
        formConfigs={stepContent.formConfigs}
        data={stepContent.data}
        isEdit={isEdit}
        isLoading={isLoading}
        skipTitleIndex={0}
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
              loading={false}
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
