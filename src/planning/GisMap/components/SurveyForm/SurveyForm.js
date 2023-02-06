import React, {useMemo, useRef, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, layout, THEME_COLORS} from '~constants/constants';
import BackHeader from '~Common/components/Header/BackHeader';
import {useNavigation} from '@react-navigation/native';
import {Button, Card} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentFormStep} from '~planning/data/surveyForm.selectors';
import ReviewScreen from './ReviewScreen';
import DynamicForm, {FIELD_TYPES} from '~Common/DynamicForm';
import TrackReturnOrder from '~Common/TrackReturnOrder';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {setMapState} from '~planning/data/planningGis.reducer';

const YES_NO_OPTS = [
  {value: 'Y', label: 'Yes'},
  {value: 'N', label: 'No'},
];

const GOOD_BAD_OPTS = [
  {value: 'G', label: 'Good'},
  {value: 'B', label: 'Bad'},
];

const STEPS_TRACK = [
  {
    id: 1,
    title: 'Auto Address',
  },
  {id: 2, separator: true},
  {
    id: 3,
    title: 'PoP Survey Format',
  },
  {id: 4, separator: true},
  {
    id: 5,
    title: 'Civil & Electrical',
  },
  {id: 6, separator: true},
  {
    id: 7,
    title: 'Contact details',
  },
];
export const STEPS_CONFIG = [
  {
    step: 1,
    stepName: 'Auto Address',
    formConfig: {
      sections: [
        {
          title: 'Auto Address',
          fieldConfigs: [
            {
              field_key: 'address',
              label: 'Address',
              field_type: FIELD_TYPES.TextArea,
            },
            {
              field_key: 'lat',
              label: 'Latitude',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'long',
              label: 'Longitude',
              field_type: FIELD_TYPES.Input,
            },
          ],
        },
      ],
      metaData: {
        getElementAddressData: (address, submitData) => {
          submitData.address = address.address;
        },
      },
    },
  },
  {
    step: 2,
    stepName: 'PoP Survey Format',
    formConfig: {
      sections: [
        {
          title: 'PoP Survey Format',
          fieldConfigs: [
            {
              field_key: 'package',
              label: 'Package (A/B/C/D)',
              field_type: FIELD_TYPES.ChipSelect,
              options: [
                {value: 'A', label: 'A'},
                {value: 'B', label: 'B'},
                {value: 'C', label: 'C'},
                {value: 'D', label: 'D'},
              ],
            },
            {
              field_key: 'msi_name',
              label: 'MSI/SI Name',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'district_name',
              label: 'District Name',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'block_name',
              label: 'Block Name',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'block_code',
              label: 'Block Code',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'pop_code',
              label: 'POP Code',
              field_type: FIELD_TYPES.Input,
            },
          ],
        },
      ],
    },
  },

  {
    step: 3,
    stepName: 'Civil & Electrical',
    formConfig: {
      sections: [
        {
          title: 'Civil & Electrical',
          fieldConfigs: [
            {
              field_key: 'building_condition',
              label: 'Building Condition',
              field_type: FIELD_TYPES.ChipSelect,
              options: GOOD_BAD_OPTS,
            },
            {
              field_key: 'ceil_condition',
              label: 'Rooftop/ceiling Condition',
              field_type: FIELD_TYPES.ChipSelect,
              options: GOOD_BAD_OPTS,
            },
            {
              field_key: 'pop_location_reachability',
              label: 'Pop location reachability',
              field_type: FIELD_TYPES.ChipSelect,
              options: YES_NO_OPTS,
            },
            {
              field_key: 'space_availibility',
              label: 'Space availibility',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'seepage',
              label: 'Seepage',
              field_type: FIELD_TYPES.ChipSelect,
              options: YES_NO_OPTS,
            },
            {
              field_key: 'avail_swan_connectivity',
              label: 'Availibility of SWAN connectivity',
              field_type: FIELD_TYPES.ChipSelect,
              options: YES_NO_OPTS,
            },
          ],
        },
      ],
    },
  },

  {
    step: 4,
    stepName: 'Contact details',
    formConfig: {
      sections: [
        {
          title: 'Contact details',
          fieldConfigs: [
            {
              field_key: 'contact_person_name',
              label: 'Contact person name',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'designation',
              label: 'Designation',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'mobile_no',
              label: 'Mobile No',
              field_type: FIELD_TYPES.Input,
            },
            {
              field_key: 'email_id',
              label: 'Email Id',
              field_type: FIELD_TYPES.Input,
            },
          ],
        },
      ],
    },
  },
];
/**
 * hit api check for new form or existing form
 */
const SurveyForm = () => {
  const navigation = useNavigation();

  const isEdit = false;
  return (
    <View style={layout.container}>
      <BackHeader title={'Survey Form'} onGoBack={navigation.goBack} />
      {isEdit ? <ReviewScreen /> : <FormAddContainer />}
    </View>
  );
};

const FormAddContainer = () => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const mapState = useSelector(getPlanningMapState);
  console.log(
    '🚀 ~ file: SurveyForm.js:234 ~ FormAddContainer ~ mapState',
    mapState,
  );
  const currStep = mapState.data.step;

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
