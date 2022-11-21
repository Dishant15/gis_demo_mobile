import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from 'react-query';
import {View, StyleSheet, BackHandler, Pressable} from 'react-native';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {Button, HelperText, Chip, Caption, Text} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {groupBy, get, join, split, size} from 'lodash';
import {polygon, centroid} from '@turf/turf';

import Input from '~Common/Input';
import BackHeader from '~Common/components/Header/BackHeader';
import Loader from '~Common/Loader';
import TagSelect from '~Common/TagSelect';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  updateSurveyFormData,
  updateSurveyList,
} from '~GeoServey/data/geoSurvey.reducer';
import {
  getGeoSurveyFormData,
  getIsReviewed,
  getTicketId,
} from '~GeoServey/data/geoSurvey.selectors';
import Api from '~utils/api.utils';
import {getGoogleAddress} from '~constants/url.constants';
import {updateGeoServey} from '~GeoServey/data/geoSurvey.service';
import {coordsToLatLongMap, latLongMapToCoords} from '~utils/map.utils';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {
  BroadbandProviders,
  colors,
  getRequiredFieldMessage,
  layout,
  LOCALITY_OPTS,
  screens,
  SURVEY_TAG_LIST,
  THEME_COLORS,
  TVProviders,
} from '~constants/constants';

/**
 * Parent:
 *    root.navigation
 */
const SurveyForm = props => {
  const {navigation} = props;
  const isFocused = useIsFocused();
  const formData = useSelector(getGeoSurveyFormData);
  const isReviewed = useSelector(getIsReviewed);
  const ticketId = useSelector(getTicketId);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const {mutate, isLoading} = useMutation(updateGeoServey, {
    onSuccess: res => {
      let newData = {
        ...res,
        coordinates: coordsToLatLongMap(res.coordinates),
        tags: split(res.tags, ','),
        broadband_availability: res.broadband_availability
          ? split(res.broadband_availability, ',')
          : '',
        cable_tv_availability: res.cable_tv_availability
          ? split(res.cable_tv_availability, ',')
          : '',
      };
      if (!size(res.units)) {
        newData.units = [];
      }
      if (size(formData.units)) {
        newData.units = formData.units;
      }
      dispatch(updateSurveyFormData(newData));
      dispatch(updateSurveyList(newData));
      showToast(
        `Survey boundary ${isReviewed ? 'updated' : 'created'} successfully.`,
        TOAST_TYPE.SUCCESS,
      );
      navigation.navigate(isReviewed ? screens.reviewScreen : screens.unitList);
    },
    onError: err => {
      console.log('🚀 ~ file: SurveyForm.js ~ line 54 ~ err', err.response);
      showToast('Input Error', TOAST_TYPE.ERROR);
    },
  });

  const {
    control,
    handleSubmit,
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
      tags: formData.tags,
      broadband_availability: formData.broadband_availability,
      cable_tv_availability: formData.cable_tv_availability,
      over_head_cable: formData.over_head_cable,
      cabling_required: formData.cabling_required,
      poll_cabling_possible: formData.poll_cabling_possible,
      locality_status: formData.locality_status,
    },
  });

  useEffect(() => {
    const polygonPoint = latLongMapToCoords(formData.coordinates);

    const turfPoint = polygon([polygonPoint]);
    const centerRes = centroid(turfPoint);
    // center: [longitude, latitude]
    const center = centerRes.geometry.coordinates;

    Api.get(getGoogleAddress(center[0], center[1]))
      .then(res => {
        const data = res.data;
        const errorMessage = get(data, 'error_message');
        if (errorMessage) {
          showToast(errorMessage, TOAST_TYPE.ERROR);
          setLoading(false);
          return;
        }
        const firstAddress = get(data, 'results.0.address_components', []);
        const address = get(data, 'results.0.formatted_address', '');
        // get country, state, pincode, city
        const otherAddressData = groupBy(firstAddress, 'types.0');
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
      broadband_availability: join(formState.broadband_availability, ','),
      cable_tv_availability: join(formState.cable_tv_availability, ','),
      id: formData.id,
      coordinates: latLongMapToCoords(formData.coordinates),
      ticketId,
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
              returnKeyType="next"
              blurOnSubmit={true}
              multiline={true}
              onSubmitEditing={handleFocus('area')}
              inputStyle={{
                height: 100,
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
        <Controller
          control={control}
          name="tags"
          rules={{
            required: 'Tags is required.',
          }}
          render={({field: {ref, onChange, onBlur, value}}) => (
            <>
              <TagSelect
                inputLabel="Select Tags"
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
          name="broadband_availability"
          render={({field: {ref, onChange, onBlur, value}}) => (
            <>
              <TagSelect
                inputLabel="Broadband Service Availability"
                tagList={BroadbandProviders}
                onSubmit={onChange}
                selectedTags={value}
                creatable
              />
              {!!errors.broadband_availability?.message ? (
                <HelperText
                  type="error"
                  visible={!!errors.broadband_availability?.message}>
                  {errors.broadband_availability?.message}
                </HelperText>
              ) : null}
            </>
          )}
        />
        <Controller
          control={control}
          name="cable_tv_availability"
          render={({field: {ref, onChange, onBlur, value}}) => (
            <>
              <TagSelect
                inputLabel="Cable TV Service Availability"
                tagList={TVProviders}
                onSubmit={onChange}
                selectedTags={value}
                creatable
              />
              {!!errors.cable_tv_availability?.message ? (
                <HelperText
                  type="error"
                  visible={!!errors.cable_tv_availability?.message}>
                  {errors.cable_tv_availability?.message}
                </HelperText>
              ) : null}
            </>
          )}
        />
        <Controller
          control={control}
          name="locality_status"
          rules={{
            required: getRequiredFieldMessage('Locality'),
          }}
          render={({field: {ref, onChange, onBlur, value}}) => {
            return (
              <>
                <View style={styles.categoryWrapper}>
                  <Caption>Locality</Caption>
                  <View style={styles.chipWrapper}>
                    {LOCALITY_OPTS.map(opt => {
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
                </View>
                {!!errors.locality_status?.message ? (
                  <HelperText
                    type="error"
                    visible={!!errors.locality_status?.message}>
                    {errors.locality_status?.message}
                  </HelperText>
                ) : null}
              </>
            );
          }}
        />
        <Controller
          control={control}
          name="over_head_cable"
          render={({field: {onChange, value}}) => (
            <>
              <Pressable
                style={styles.checkboxWrapper}
                onPress={() => onChange(!value)}>
                <MaterialCommunityIcons
                  size={26}
                  name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  color={value ? colors.primaryMain : colors.primaryFontColor}
                  style={{textAlign: 'center'}}
                />
                <Text style={styles.checkboxText}>Over head cable allowed</Text>
              </Pressable>
              {!!errors.over_head_cable?.message ? (
                <HelperText
                  type="error"
                  visible={!!errors.over_head_cable?.message}>
                  {errors.over_head_cable?.message}
                </HelperText>
              ) : null}
            </>
          )}
        />
        <Controller
          control={control}
          name="cabling_required"
          render={({field: {onChange, value}}) => (
            <>
              <Pressable
                style={styles.checkboxWrapper}
                onPress={() => onChange(!value)}>
                <MaterialCommunityIcons
                  size={26}
                  name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  color={value ? colors.primaryMain : colors.primaryFontColor}
                  style={{textAlign: 'center'}}
                />
                <Text style={styles.checkboxText}>
                  In Building cabeling required
                </Text>
              </Pressable>

              {!!errors.cabling_required?.message ? (
                <HelperText
                  type="error"
                  visible={!!errors.cabling_required?.message}>
                  {errors.cabling_required?.message}
                </HelperText>
              ) : null}
            </>
          )}
        />
        <Controller
          control={control}
          name="poll_cabling_possible"
          render={({field: {onChange, value}}) => (
            <>
              <Pressable
                style={styles.checkboxWrapper}
                onPress={() => onChange(!value)}>
                <MaterialCommunityIcons
                  size={26}
                  name={value ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  color={value ? colors.primaryMain : colors.primaryFontColor}
                  style={{textAlign: 'center'}}
                />
                <Text style={styles.checkboxText}>
                  Pole to pole cabling possible
                </Text>
              </Pressable>
              {!!errors.poll_cabling_possible?.message ? (
                <HelperText
                  type="error"
                  visible={!!errors.poll_cabling_possible?.message}>
                  {errors.poll_cabling_possible?.message}
                </HelperText>
              ) : null}
            </>
          )}
        />
        <View style={styles.buttonWrapper}>
          <Button
            loading={isLoading}
            contentStyle={layout.button}
            color={THEME_COLORS.secondary.main}
            labelStyle={{
              color: THEME_COLORS.secondary.contrastText,
            }}
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
  categoryWrapper: {
    paddingTop: 8,
    paddingBottom: 4,
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
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 8,
  },
  checkboxText: {
    fontSize: 17,
    paddingLeft: 8,
  },
});

export default SurveyForm;
