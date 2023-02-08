import React, {useMemo, useRef, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {layout, THEME_COLORS} from '~constants/constants';
import {Button, Card} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import DynamicForm, {FIELD_TYPES} from '~Common/DynamicForm';
import TrackReturnOrder from '~Common/TrackReturnOrder';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {setMapState} from '~planning/data/planningGis.reducer';
import {STEPS_CONFIG, STEPS_TRACK} from './configuration';

const SurveyForm = () => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const mapState = useSelector(getPlanningMapState);
  console.log(
    '🚀 ~ file: SurveyForm.js:234 ~ FormAddContainer ~ mapState',
    mapState,
  );
  const currStep = mapState.data.currentStep;

  const isEdit = false;
  const stepContent = useMemo(() => {
    switch (currStep) {
      case 1: {
        return {
          formConfigs: STEPS_CONFIG[0].formConfig,
          submitButtonText: 'Next',
          cancelButtonText: 'Cancel',
          trackIndex: 0,
        };
      }

      case 2: {
        return {
          formConfigs: STEPS_CONFIG[1].formConfig,
          submitButtonText: 'Next',
          cancelButtonText: 'Back',
          trackIndex: 2,
        };
      }
      case 3: {
        return {
          formConfigs: STEPS_CONFIG[2].formConfig,
          submitButtonText: 'Next',
          cancelButtonText: 'Back',
          trackIndex: 4,
        };
      }
      case 4: {
        {
          return {
            formConfigs: STEPS_CONFIG[3].formConfig,
            submitButtonText: 'Submit',
            cancelButtonText: 'Back',
            trackIndex: 6,
          };
        }
      }
      default: {
        return null;
      }
    }
  }, [currStep]);

  const handleFormSubmit = () => {
    switch (currStep) {
      case 1:
        dispatch(
          setMapState({
            ...mapState,
            data: {...mapState.data, step: 2},
          }),
        );
        break;
      case 2:
        dispatch(
          setMapState({
            ...mapState,
            data: {...mapState.data, step: 3},
          }),
        );
        break;
      case 3:
        dispatch(
          setMapState({
            ...mapState,
            data: {...mapState.data, step: 4},
          }),
        );
        break;
      case 4:
        // dispatch(
        //   setMapState({
        //     ...mapState,
        //     data: {...mapState.data, step: 2},
        //   }),
        // );
        break;

      default:
        break;
    }
  };

  const handleCancel = () => {
    switch (currStep) {
      case 1:
        // dispatch(
        //   setMapState({
        //     ...mapState,
        //     data: {...mapState.data, step: 2},
        //   }),
        // );
        break;
      case 2:
        dispatch(
          setMapState({
            ...mapState,
            data: {...mapState.data, step: 1},
          }),
        );
        break;
      case 3:
        dispatch(
          setMapState({
            ...mapState,
            data: {...mapState.data, step: 2},
          }),
        );
        break;
      case 4:
        dispatch(
          setMapState({
            ...mapState,
            data: {...mapState.data, step: 3},
          }),
        );
        break;

      default:
        break;
    }
  };

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
        data={{}}
        isEdit={isEdit}
        actionElement={handleSubmit => (
          <View style={styles.btnWrapper}>
            <Button
              style={[styles.btn1, {borderColor: THEME_COLORS.error.main}]}
              contentStyle={layout.button}
              color={THEME_COLORS.error.main}
              uppercase
              mode="outlined"
              onPress={handleCancel}>
              {isEdit ? 'Cancel' : stepContent.cancelButtonText}
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
