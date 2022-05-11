import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-native-paper';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors, layout} from '~constants/constants';
import Input from '~components/Common/Input';
import {updateSurveyFormData} from '~data/reducers/geoSurvey.reducer';
import {getGeoSurveyFormData} from '~data/selectors/geoSurvey.selectors';

const SurveyForm = props => {
  const {onSaveDetails} = props;
  const formData = useSelector(getGeoSurveyFormData);

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: formData.name,
      address: formData.address,
      area: formData.area,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    },
  });
  const dispatch = useDispatch();

  const onSubmit = data => {
    dispatch(updateSurveyFormData({...data, tags: []}));
    if (onSaveDetails) {
      onSaveDetails();
    }
  };

  const handleFocus = useCallback(
    fieldName => () => {
      setFocus(fieldName);
    },
    [],
  );

  return (
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
            onSubmitEditing={handleFocus('address')}
          />
        )}
      />
      <Controller
        control={control}
        name="address"
        rules={{
          required: 'Address is required.',
        }}
        render={({field: {ref, onChange, onBlur, value}}) => (
          <Input
            ref={ref}
            label="Address"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={handleFocus('area')}
          />
        )}
      />
      <Controller
        control={control}
        name="area"
        rules={{
          required: 'Area is required.',
        }}
        render={({field: {ref, onChange, onBlur, value}}) => (
          <Input
            ref={ref}
            label="Area"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={handleFocus('city')}
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        rules={{
          required: 'City is required.',
        }}
        render={({field: {ref, onChange, onBlur, value}}) => (
          <Input
            ref={ref}
            label="City"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={handleFocus('state')}
          />
        )}
      />
      <Controller
        control={control}
        name="state"
        rules={{
          required: 'State is required.',
        }}
        render={({field: {ref, onChange, onBlur, value}}) => (
          <Input
            ref={ref}
            label="State"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={handleFocus('pincode')}
          />
        )}
      />
      <Controller
        control={control}
        name="pincode"
        rules={{
          required: 'Pincode is required.',
        }}
        render={({field: {ref, onChange, onBlur, value}}) => (
          <Input
            ref={ref}
            label="Pincode"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={false}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            keyboardType="number-pad"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
      <View style={styles.buttonWrapper}>
        <Button
          contentStyle={layout.button}
          color={colors.black}
          uppercase
          mode="contained"
          onPress={handleSubmit(onSubmit)}>
          Save
        </Button>
      </View>
    </KeyboardAwareScrollView>
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
});

export default SurveyForm;
