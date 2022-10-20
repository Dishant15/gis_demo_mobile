import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from 'react-query';

import Input from '~Common/Input';
import {login} from '~Authentication/data/auth.reducer';
import {postLogin} from '~Authentication/data/auth.service';
import {
  colors,
  fonts,
  HOST_CONFIG,
  layout,
  THEME_COLORS,
} from '~constants/constants';
import {parseErrorMessagesWithFields} from '~utils/api.utils';
import {find, get, noop} from 'lodash';
import {getHostConfig} from '~Common/data/appstate.selector';
import SelectModel from '~Common/components/SelectModel';
import {updateHostConfig} from '~Common/data/appstate.reducer';

import authBg from '~assets/img/authBg.png';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';

const {width, height} = Dimensions.get('screen');

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setshowPopup] = useState(false);

  const hostConfig = useSelector(getHostConfig);
  const dispatch = useDispatch();

  const handleShowPopup = useCallback(() => {
    setshowPopup(true);
  }, []);

  const handleHidePopup = useCallback(() => {
    setshowPopup(false);
  }, []);

  const handleHostSubmit = useCallback(value => {
    const valueList = Object.values(HOST_CONFIG);
    const selectedObj = find(valueList, ['value', value]);
    dispatch(updateHostConfig(selectedObj));
    showToast(selectedObj.label, TOAST_TYPE.INFO);
  }, []);

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: {errors},
  } = useForm();

  const {mutate, isLoading} = useMutation(postLogin, {
    onSuccess: res => {
      // {token, user, permissions}
      dispatch(login(res));
    },
    onError: err => {
      const {fieldList, messageList} = parseErrorMessagesWithFields(err);
      for (let index = 0; index < fieldList.length; index++) {
        const field = fieldList[index];
        const errorMessage = messageList[index];
        setError(field, {message: errorMessage});
      }
    },
  });

  const emaiError = errors.username?.message;
  const passwordError = errors.password?.message;

  return (
    <View style={[styles.container]}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <FastImage
        style={styles.backgroundImg}
        source={authBg}
        resizeMode={FastImage.resizeMode.cover}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollWrapper}>
        <View style={styles.formWrapper}>
          <Text style={styles.formLabel} maxFontSizeMultiplier={1}>
            NETWORK GIS
          </Text>

          <Controller
            control={control}
            name="username"
            rules={{
              required: 'Username is required.',
            }}
            render={({field: {ref, onChange, onBlur, value}}) => (
              <Input
                ref={ref}
                label="Username"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={emaiError}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => setFocus('password')}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required.',
            }}
            render={({field: {ref, onChange, onBlur, value}}) => (
              <Input
                ref={ref}
                label="Password"
                secureTextEntry={!showPassword}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={passwordError}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(mutate)}
                right={
                  <TextInput.Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            )}
          />
          {/* <Text
            style={styles.forgetPass}
            maxFontSizeMultiplier={1}
            onPress={() => {}}>
            Forgot Password
          </Text> */}

          {!!errors.__all__ ? (
            <HelperText type="error" visible={true}>
              {get(errors, '__all__.message', '')}
            </HelperText>
          ) : null}

          <Input
            label="Server"
            onChangeText={noop}
            onFocus={handleShowPopup}
            value={hostConfig.label}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            right={<TextInput.Icon name="pencil" onPress={handleShowPopup} />}
          />

          <View style={styles.submitBtnWrapper}>
            <Button
              loading={isLoading}
              contentStyle={layout.button}
              color={THEME_COLORS.secondary.main}
              labelStyle={{
                color: THEME_COLORS.secondary.contrastText,
              }}
              uppercase
              mode="contained"
              onPress={handleSubmit(mutate)}>
              Login
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {showPopup ? (
        <SelectModel
          inputLabel="Select Server"
          tagList={Object.values(HOST_CONFIG)}
          onSubmit={handleHostSubmit}
          closeMenu={handleHidePopup}
          selectedTags={hostConfig.value}
          simpleValue
        />
      ) : null}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBgColor,
  },
  backgroundImg: {
    width,
    height,
    ...StyleSheet.absoluteFillObject,
  },
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  formLabel: {
    fontFamily: fonts.fontMedium,
    color: colors.black,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: '10%',
  },
  formWrapper: {
    padding: '10%',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 11,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  forgetPass: {
    fontFamily: fonts.fontRegular,
    fontSize: 14,
    color: colors.black,
    textDecorationLine: 'underline',
    textAlign: 'right',
    paddingVertical: 4,
  },

  submitBtnWrapper: {
    paddingVertical: '10%',
  },
});
