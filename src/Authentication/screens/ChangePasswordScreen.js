import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useMutation} from 'react-query';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {Button, TextInput} from 'react-native-paper';
import {get} from 'lodash';

import BackHeader from '~Common/components/Header/BackHeader';
import Input from '~Common/Input';

import {postChangePassword} from '~Authentication/data/auth.service';
import {layout, THEME_COLORS} from '~constants/constants';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';

const ChangePasswordScreen = ({navigation}) => {
  const [showCurrPass, setShowCurrPass] = useState('');
  const [showNewPass, setShowNewPass] = useState('');
  const [showConfirmPass, setShowConfirmPass] = useState('');

  const {mutate: changePasswordMutate, isLoading} = useMutation(
    postChangePassword,
    {
      onSuccess: res => {
        showToast('Password changed successfully.', TOAST_TYPE.SUCCESS);
        navigation.goBack();
      },
      onError: err => {
        const {current_password, new_password, confirm_password} = get(
          err,
          'response.data',
          {},
        );
        if (current_password) {
          showToast(current_password[0], TOAST_TYPE.ERROR);
        } else if (new_password) {
          showToast(new_password[0], TOAST_TYPE.ERROR);
        } else if (confirm_password) {
          showToast(confirm_password[0], TOAST_TYPE.ERROR);
        } else {
          showToast(err.message, TOAST_TYPE.ERROR);
        }
      },
    },
  );

  const {
    control,
    formState: {errors},
    handleSubmit,
    watch,
    setFocus,
  } = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  return (
    <View style={layout.container}>
      <BackHeader title="Change Password" onGoBack={navigation.goBack} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={styles.formWrapper}>
        <Controller
          control={control}
          name="current_password"
          rules={{
            required: 'Current Password is required.',
          }}
          render={({field: {ref, onChange, onBlur, value}}) => (
            <Input
              ref={ref}
              label="Current Password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.current_password?.message}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => setFocus('new_password')}
              secureTextEntry={!showCurrPass}
              right={
                <TextInput.Icon
                  name={showCurrPass ? 'eye-off' : 'eye'}
                  onPress={() => setShowCurrPass(!showCurrPass)}
                />
              }
            />
          )}
        />
        <Controller
          control={control}
          name="new_password"
          rules={{
            required: 'New Password is required.',
          }}
          render={({field: {ref, onChange, onBlur, value}}) => (
            <Input
              ref={ref}
              label="New Password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.new_password?.message}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => setFocus('confirm_password')}
              secureTextEntry={!showNewPass}
              right={
                <TextInput.Icon
                  name={showNewPass ? 'eye-off' : 'eye'}
                  onPress={() => setShowNewPass(!showNewPass)}
                />
              }
            />
          )}
        />
        <Controller
          control={control}
          name="confirm_password"
          rules={{
            required: 'Confirm Password is required.',
            validate: val => {
              if (watch('new_password') != val) {
                return 'New password and confirm password do not match, Please type again';
              }
            },
          }}
          render={({field: {ref, onChange, onBlur, value}}) => (
            <Input
              ref={ref}
              label="Confirm Password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.confirm_password?.message}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(changePasswordMutate)}
              secureTextEntry={!showConfirmPass}
              right={
                <TextInput.Icon
                  name={showConfirmPass ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPass(!showConfirmPass)}
                />
              }
            />
          )}
        />
        <Button
          style={styles.passwordBtn}
          contentStyle={layout.button}
          color={THEME_COLORS.secondary.main}
          labelStyle={{
            color: THEME_COLORS.secondary.contrastText,
          }}
          uppercase
          mode="contained"
          onPress={handleSubmit(changePasswordMutate)}
          loading={isLoading}>
          Submit
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    padding: 16,
  },
  passwordBtn: {
    marginTop: 36,
    marginBottom: 12,
  },
});

export default ChangePasswordScreen;
