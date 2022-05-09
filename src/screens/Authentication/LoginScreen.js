import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';

import {colors, fonts, layout} from '~constants/constants';
import authBg from '~assets/img/authBg.png';
import {useMutation} from 'react-query';
import {postLogin} from './services';
import {login} from '~data/reducers/auth.reducer';
import Input from '~components/Common/Input';

const {width, height} = Dimensions.get('screen');

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: {errors},
  } = useForm();
  console.log(
    '🚀 ~ file: LoginScreen.js ~ line 25 ~ LoginScreen ~ errors',
    errors,
  );
  const dispatch = useDispatch();

  // const mutation = useMutation(postLogin, {
  //   onSuccess: res => {
  //     console.log(
  //       '🚀 ~ file: LoginScreen.js ~ line 32 ~ useMutation ~ res',
  //       res,
  //     );
  //   },
  //   onError: err => {
  //     console.log(
  //       '🚀 ~ file: LoginScreen.js ~ line 33 ~ useMutation ~ err',
  //       err,
  //     );
  //   },
  // });

  const onSubmit = data => {
    postLogin(data)
      .then(res => dispatch(login(res.token)))
      .catch(err =>
        setError('password', {message: 'Credentials are invalid.'}),
      );
  };

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
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollWrapper}>
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
                mode="outlined"
                activeOutlineColor={colors.black}
                style={layout.textInput}
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
          {/* {emaiError ? (
            <HelperText type="error" visible={emaiError}>
              {emaiError}
            </HelperText>
          ) : null} */}
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
                mode="outlined"
                secureTextEntry={!showPassword}
                activeOutlineColor={colors.black}
                style={layout.textInput}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={passwordError}
                underlineColorAndroid="transparent"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                right={
                  <TextInput.Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            )}
          />
          {/* {passwordError ? (
            <HelperText type="error" visible={passwordError}>
              {passwordError}
            </HelperText>
          ) : null} */}
          <Text
            style={styles.forgetPass}
            maxFontSizeMultiplier={1}
            onPress={() => {}}>
            Forgot Password
          </Text>

          {/* <ErrorBlock error={errors} field="__all__" /> */}

          <View style={styles.submitBtnWrapper}>
            <Button
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              mode="contained"
              onPress={handleSubmit(onSubmit)}>
              Login
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
