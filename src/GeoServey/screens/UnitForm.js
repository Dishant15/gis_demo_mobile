import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {Button, Caption, Chip, HelperText} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';

import BackHeader from '~Common/components/Header/BackHeader';
import Input from '~Common/Input';
import TagSelect from '~Common/TagSelect';

import {layout, screens, colors, SURVEY_TAG_LIST} from '~constants/constants';
import {
  getGeoSurveySelectedUnitData,
  getGeoSurveySelectedUnitIndex,
  getGeoSurveyTags,
  getGeoSurveyUnitFormData,
  getIsReviewed,
  getSelectedSurveyId,
} from '~GeoServey/data/geoSurvey.selectors';
import {
  updateSurveyUnitList,
  updateUnitData,
  updateUnitFormData,
} from '~GeoServey/data/geoSurvey.reducer';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {filter, has, includes, join, multiply, split} from 'lodash';
import {upsertSurveyUnit} from '~GeoServey/data/geoSurvey.service';
import {useMutation} from 'react-query';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {unitAddSuccess} from '~constants/messages';

const CATEGORY_OPTS = [
  {value: 'M', label: 'MDU'},
  {value: 'S', label: 'SDU'},
];

/**
 * Parent:
 *    root.navigation
 */
const UnitForm = ({navigation}) => {
  const isFocused = useIsFocused();
  const selectedSurveyTags = useSelector(getGeoSurveyTags);
  const unitData = useSelector(getGeoSurveyUnitFormData);
  const unitIndex = useSelector(getGeoSurveySelectedUnitIndex);
  const isReviewed = useSelector(getIsReviewed);
  const surveyId = useSelector(getSelectedSurveyId);
  const dispatch = useDispatch();
  const isAdd = unitIndex === -1;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isReviewed) {
          navigation.navigate(screens.reviewScreen);
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isReviewed]),
  );

  const surveyTagList = useMemo(() => {
    return filter(SURVEY_TAG_LIST, function (o) {
      return includes(selectedSurveyTags, o.value);
    });
  }, [selectedSurveyTags]);

  const {
    control,
    handleSubmit,
    setFocus,
    getValues,
    setValue,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: unitData.name,
      category: unitData.category,
      tags: unitData.tags,
      floors: String(unitData.floors),
      house_per_floor: String(unitData.house_per_floor),
      total_home_pass: String(unitData.total_home_pass),
    },
  });

  const {mutate, isLoading} = useMutation(upsertSurveyUnit, {
    onSuccess: res => {
      const newData = {
        ...res,
        tags: split(res.tags, ','),
        coordinates: {
          latitude: res.coordinates[1],
          longitude: res.coordinates[0],
        },
      };
      dispatch(updateUnitFormData(newData));
      dispatch(updateSurveyUnitList(newData));
      showToast(unitAddSuccess(), TOAST_TYPE.SUCCESS);
      if (isReviewed) {
        navigation.navigate(screens.reviewScreen);
      } else {
        navigation.navigate(screens.unitList);
      }
    },
    onError: err => {
      console.log('🚀 ~ file: UnitForm.js err', err.response);
      showToast('Input Error', TOAST_TYPE.ERROR);
    },
  });

  const handleUnitSubmit = useCallback(
    data => {
      if (isLoading) return;
      let valideData = {...data};
      valideData.tags = join(valideData.tags, ',');
      valideData.parentId = surveyId;
      valideData.coordinates = unitData.coordinates;
      if (data.category === 'S') {
        valideData.floors = 1;
        valideData.house_per_floor = 1;
      }
      if (has(unitData, 'id')) {
        valideData.id = unitData.id;
      }
      mutate(valideData);
    },
    [unitData],
  );

  const handleFocus = useCallback(
    fieldName => () => {
      setFocus(fieldName);
    },
    [],
  );

  const handleCustomBack = () => {
    if (isReviewed) {
      navigation.navigate(screens.reviewScreen);
    } else {
      navigation.goBack();
    }
  };

  const selectedCategory = watch('category');

  if (!isFocused) return null;

  return (
    <View style={layout.container}>
      <BackHeader title="Add unit details" onGoBack={handleCustomBack} />
      <View style={layout.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.scrollWrapper}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Name is required.',
            }}
            render={({field: {ref, onChange, onBlur, value}}) => (
              <Input
                ref={ref}
                label="Name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.name?.message}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={handleFocus('floors')}
              />
            )}
          />
          <Controller
            control={control}
            name="tags"
            rules={{
              required: 'Tags is required.',
            }}
            render={({field: {ref, onChange, onBlur, value}}) => (
              <>
                <TagSelect
                  tagList={surveyTagList}
                  onSubmit={onChange}
                  selectedTags={value}
                />
                {!!errors.tags?.message ? (
                  <HelperText type="error" visible={!!errors.tags?.message}>
                    {errors.tags?.message}
                  </HelperText>
                ) : null}
              </>
            )}
          />
          <Controller
            control={control}
            name="category"
            rules={{
              required: 'Category is required.',
            }}
            render={({field: {ref, onChange, onBlur, value}}) => {
              return (
                <View style={styles.categoryWrapper}>
                  <Caption>Category</Caption>
                  <View style={styles.chipWrapper}>
                    {CATEGORY_OPTS.map(opt => {
                      const selected = opt.value === value;
                      return (
                        <Chip
                          key={opt.value}
                          style={[styles.chip, selected && styles.chipActive]}
                          selected={selected}
                          selectedColor={selected ? colors.white : null}
                          onPress={() => onChange(opt.value)}>
                          {opt.label}
                        </Chip>
                      );
                    })}
                  </View>
                  {!!errors.category?.message ? (
                    <HelperText
                      type="error"
                      visible={!!errors.category?.message}>
                      {errors.category?.message}
                    </HelperText>
                  ) : null}
                </View>
              );
            }}
          />
          {selectedCategory === 'M' ? (
            <Controller
              control={control}
              name="floors"
              rules={{
                required: 'Floors is required.',
              }}
              render={({field: {ref, onChange, onBlur, value}}) => (
                <Input
                  ref={ref}
                  label="Floors"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.floors?.message}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={handleFocus('house_per_floor')}
                />
              )}
            />
          ) : null}

          {selectedCategory === 'M' ? (
            <Controller
              control={control}
              name="house_per_floor"
              rules={{
                required: 'House per floor is required.',
              }}
              render={({field: {ref, onChange, onBlur, value}}) => (
                <Input
                  ref={ref}
                  label="House per floor"
                  onChangeText={onChange}
                  onBlur={e => {
                    const [house_per_floor, floors] = getValues([
                      'house_per_floor',
                      'floors',
                    ]);
                    setValue(
                      'total_home_pass',
                      String(multiply(floors, house_per_floor)),
                    );
                    onBlur(e);
                  }}
                  value={value}
                  error={errors.house_per_floor?.message}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={handleFocus('total_home_pass')}
                />
              )}
            />
          ) : null}
          <Controller
            control={control}
            name="total_home_pass"
            rules={{
              required: 'Total home pass is required.',
            }}
            render={({field: {ref, onChange, onBlur, value}}) => (
              <Input
                ref={ref}
                label={
                  selectedCategory === 'M' ? 'Total home pass' : 'No. of units'
                }
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.total_home_pass?.message}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                keyboardType="number-pad"
                onSubmitEditing={handleSubmit(handleUnitSubmit)}
              />
            )}
          />
          <View style={styles.buttonWrapper}>
            <Button
              style={styles.reviewBtn}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              mode="contained"
              loading={isLoading}
              onPress={handleSubmit(handleUnitSubmit)}>
              Submit
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollWrapper: {
    padding: 12,
  },
  buttonWrapper: {
    paddingTop: 18,
    paddingBottom: 36,
  },
  addBtn: {
    // flex: 2,
    // marginRight: 6,
  },
  reviewBtn: {
    // flex: 1,
    // marginLeft: 6,
  },
  categoryWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  chipWrapper: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 10,
    marginTop: 8,
  },
  chipActive: {
    backgroundColor: colors.primaryMain + 'cc',
  },
});

export default UnitForm;
