import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {Button, HelperText} from 'react-native-paper';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors, layout, screens, SURVEY_TAG_LIST} from '~constants/constants';
import Input from '~Common/Input';
import {updateSurveyFormData} from '~GeoServey/data/geoSurvey.reducer';
import {
  getGeoSurveyCoords,
  getGeoSurveyFormData,
  getIsReviewed,
  getParentId,
} from '~GeoServey/data/geoSurvey.selectors';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {groupBy, map, get, join, split} from 'lodash';
import Api from '~utils/api.utils';
import {getGoogleAddress} from '~constants/url.constants';
import BackHeader from '~Common/components/Header/BackHeader';
import Loader from '~Common/Loader';
import TagSelect from '~Common/TagSelect';
import {useMutation} from 'react-query';
import {updateGeoServey} from '~GeoServey/data/geoSurvey.service';
import {latLongMapToCoords} from '~utils/map.utils';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';

var turf = require('@turf/turf');

/**
 * Parent:
 *    root.navigation
 */
const SurveyForm = props => {
  const {navigation} = props;
  const isFocused = useIsFocused();
  const formData = useSelector(getGeoSurveyFormData);
  const coords = useSelector(getGeoSurveyCoords);
  const isReviewed = useSelector(getIsReviewed);
  const parentId = useSelector(getParentId);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const {mutate, isLoading} = useMutation(updateGeoServey, {
    onSuccess: res => {
      dispatch(updateSurveyFormData(res));
      navigation.navigate(isReviewed ? screens.reviewScreen : screens.unitList);
    },
    onError: err => {
      showToast('Input Error', TOAST_TYPE.ERROR);
      console.log('🚀 ~ file: SurveyForm.js ~ line 54 ~ err', err.response);
      // const errorMessage = parseErrorMessage(err);
      // setError('password', {message: errorMessage});
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: formData.name,
      address: formData.address,
      area: formData.area,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      tags: Array.isArray(formData.tags)
        ? formData.tags
        : split(formData.tags, ','),
    },
  });

  useEffect(() => {
    const polygonPoint = map(coords, point => [
      point.latitude,
      point.longitude,
    ]);
    const turfPoint = turf.points(polygonPoint);
    const centerRes = turf.center(turfPoint);
    const center = centerRes.geometry.coordinates; // [lat, lng]
    Api.get(getGoogleAddress(center[0], center[1]))
      .then(res => {
        const data = res.data;
        console.log(
          '🚀 ~ file: SurveyForm.js ~ line 41 ~ useEffect ~ data',
          data,
        );
        const firstAddress = get(data, 'results.0.address_components', []);
        const address = get(data, 'results.0.formatted_address', '');
        // get country, state, pincode, city
        const otherAddressData = groupBy(firstAddress, 'types.0');
        console.log(
          '🚀 ~ file: SurveyForm.js ~ line 73 ~ useEffect ~ otherAddressData',
          otherAddressData,
        );
        const pincode = get(otherAddressData, 'postal_code.0.long_name', '');
        const state = get(
          otherAddressData,
          'administrative_area_level_1.0.long_name',
          '',
        );
        const city = get(
          otherAddressData,
          'administrative_area_level_2.0.long_name',
          '',
        );
        const area = get(otherAddressData, 'political.0.long_name', '');
        const premise = get(otherAddressData, 'premise.0.long_name', '');
        setValue('address', formData.address || address);
        setValue('pincode', formData.pincode || pincode);
        setValue('state', formData.state || state);
        setValue('city', formData.city || city);
        setValue('area', formData.area || area);
        setValue('name', formData.name || premise || area);
        setLoading(false);
      })
      .catch(err => {
        console.log('err', err.response);
        setLoading(false);
      });
  }, []);

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

  const onSubmit = formState => {
    const data = {
      ...formState,
      tags: join(formState.tags, ','),
      id: formData.id,
      coordinates: latLongMapToCoords(coords),
      parentId,
    };
    mutate(data);
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
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Add Details" onGoBack={handleCustomBack} />
      {loading ? <Loader /> : null}
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
              onSubmitEditing={handleFocus('address')}
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
                tagList={SURVEY_TAG_LIST}
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
              error={errors.address?.message}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit={true}
              multiline={true}
              onSubmitEditing={handleFocus('area')}
              inputStyle={{
                minHeight: 100,
              }}
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
              error={errors.area?.message}
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
              error={errors.city?.message}
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
              error={errors.state?.message}
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
              error={errors.pincode?.message}
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
            loading={isLoading}
            contentStyle={layout.button}
            color={colors.black}
            uppercase
            mode="contained"
            onPress={handleSubmit(onSubmit)}>
            Save
          </Button>
        </View>
      </KeyboardAwareScrollView>
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
});

export default SurveyForm;
