import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {useMutation} from 'react-query';

import Input from '~Common/Input';
import {login} from '~Authentication/data/auth.reducer';
import {postLogin} from '~Authentication/data/auth.service';
import {colors, fonts, layout} from '~constants/constants';
import {parseErrorMessage} from '~utils/app.utils';
import authBg from '~assets/img/authBg.png';

const {width, height} = Dimensions.get('screen');

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: {errors},
  } = useForm();

  const {mutate, isLoading} = useMutation(postLogin, {
    onSuccess: res => {
      dispatch(login(res.token));
    },
    onError: err => {
      const errorMessage = parseErrorMessage(err);
      setError('password', {message: errorMessage});
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

          <View style={styles.submitBtnWrapper}>
            <Button
              loading={isLoading}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              mode="contained"
              onPress={handleSubmit(mutate)}>
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