import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {Button, Caption, Chip} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';

import BackHeader from '~components/Header/BackHeader';
import Input from '~components/Common/Input';
import TagSelect from '~components/Common/TagSelect';

import {layout, screens, colors, SURVEY_TAG_LIST} from '~constants/constants';
import {
  getGeoSurveySelectedUnitData,
  getGeoSurveySelectedUnitIndex,
  getGeoSurveyTags,
  getIsReviewed,
} from '~data/selectors/geoSurvey.selectors';
import {updateUnitData} from '~data/reducers/geoSurvey.reducer';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {filter, includes, multiply} from 'lodash';

const CATEGORY_OPTS = ['MDU', 'SDU', 'BOTH'];
const UnitForm = ({navigation}) => {
  const isFocused = useIsFocused();
  const unitData = useSelector(getGeoSurveySelectedUnitData);
  const selectedSurveyTags = useSelector(getGeoSurveyTags);
  const unitIndex = useSelector(getGeoSurveySelectedUnitIndex);
  const isReviewed = useSelector(getIsReviewed);
  const dispatch = useDispatch();

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
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: unitData.name,
      category: unitData.category,
      floors: unitData.floors,
      tags: unitData.tags,
      house_per_floor: unitData.house_per_floor,
      total_home_pass: unitData.total_home_pass,
    },
  });

  const handleAnotherUnit = data => {
    dispatch(
      updateUnitData({
        unitIndex,
        data,
      }),
    );
    if (isReviewed) {
      navigation.navigate(screens.reviewScreen);
    } else {
      navigation.navigate(screens.unitList);
    }
  };

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
                error={false}
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
              <TagSelect
                tagList={surveyTagList}
                onSubmit={onChange}
                selectedTags={value}
              />
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
                      const selected = opt === value;
                      return (
                        <Chip
                          key={opt}
                          style={styles.chip}
                          selected={selected}
                          onPress={() => onChange(opt)}>
                          {opt}
                        </Chip>
                      );
                    })}
                  </View>
                </View>
              );
            }}
          />

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
                error={false}
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
                error={false}
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
          <Controller
            control={control}
            name="total_home_pass"
            rules={{
              required: 'Total home pass is required.',
            }}
            render={({field: {ref, onChange, onBlur, value}}) => (
              <Input
                ref={ref}
                label="Total home pass"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={false}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                keyboardType="number-pad"
                onSubmitEditing={handleSubmit(handleAnotherUnit)}
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
              onPress={handleSubmit(handleAnotherUnit)}>
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
});

export default UnitForm;
