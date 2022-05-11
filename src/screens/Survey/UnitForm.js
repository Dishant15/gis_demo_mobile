import React, {useRef, useState, useCallback} from 'react';
import {View, StyleSheet, Dimensions, Keyboard} from 'react-native';
import {Button} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';

import BackHeader from '~components/Header/BackHeader';
import Input from '~components/Common/Input';

import {layout, screens, colors} from '~constants/constants';
import {
  getGeoSurveyCoords,
  getGeoSurveySelectedUnitData,
  getGeoSurveySelectedUnitIndex,
} from '~data/selectors/geoSurvey.selectors';
import {addUnit, updateUnitData} from '~data/reducers/geoSurvey.reducer';
import {useIsFocused} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const UnitForm = ({navigation}) => {
  const isFocused = useIsFocused();
  const unitData = useSelector(getGeoSurveySelectedUnitData);
  const unitIndex = useSelector(getGeoSurveySelectedUnitIndex);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: {errors},
  } = useForm();

  const onSubmit = data => {
    dispatch(
      updateUnitData({
        unitIndex,
        data,
      }),
    );
    console.log('🚀 ~ file: UnitForm.js ~ line 34 ~ UnitForm ~ data', data);
  };

  const handleAnotherUnit = data => {
    dispatch(
      updateUnitData({
        unitIndex,
        data,
      }),
    );
    // dispatch(addUnit());
    navigation.navigate(screens.unitList);
  };

  const handleReview = data => {
    dispatch(
      updateUnitData({
        unitIndex,
        data,
      }),
    );
    navigation.navigate(screens.reviewScreen);
  };

  const handleFocus = useCallback(
    fieldName => () => {
      setFocus(fieldName);
    },
    [],
  );

  if (!isFocused) return null;

  return (
    <View style={layout.container}>
      <BackHeader title="Add unit details" onGoBack={navigation.goBack} />
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
                onSubmitEditing={handleFocus('category')}
              />
            )}
          />
          <Controller
            control={control}
            name="category"
            rules={{
              required: 'Category is required.',
            }}
            render={({field: {ref, onChange, onBlur, value}}) => (
              <Input
                ref={ref}
                label="Category"
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
                onBlur={onBlur}
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
});

export default UnitForm;
