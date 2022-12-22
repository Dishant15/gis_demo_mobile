import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useMutation} from 'react-query';
import {Button, HelperText} from 'react-native-paper';

import {get} from 'lodash';

import Input from '~Common/Input';

import {postProfileEdit} from '~Authentication/data/auth.service';
import {handleLogoutUser} from '~Authentication/data/auth.actions';
import {getLoggedUserDetails} from '~Authentication/data/auth.selectors';
import {colors, layout, screens, THEME_COLORS} from '~constants/constants';
import {updateUserDetails} from '~Authentication/data/auth.reducer';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const loggedUserDetails = useSelector(getLoggedUserDetails);

  const [name, setName] = useState(get(loggedUserDetails, 'name', ''));
  const [nameError, setNameError] = useState(false);

  const {mutate, isLoading} = useMutation(postProfileEdit, {
    onSuccess: res => {
      dispatch(updateUserDetails(res));
      showToast('Profile updated successfully.', TOAST_TYPE.SUCCESS);
    },
    onError: err => {
      showToast(err.message, TOAST_TYPE.ERROR);
    },
  });

  const handleUpdateProfile = useCallback(() => {
    setNameError(!name);
    if (!name) {
      return;
    }
    mutate({name});
  }, [mutate, name]);

  const handleLogout = useCallback(() => {
    dispatch(handleLogoutUser);
  }, []);

  const handleChangePassword = useCallback(() => {
    navigation.navigate(screens.changePasswordScreen);
  }, []);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Input
        label="Name"
        value={name}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onChangeText={setName}
        onSubmitEditing={handleUpdateProfile}
      />
      {nameError ? (
        <HelperText type="error" visible={nameError}>
          This field is required.
        </HelperText>
      ) : null}
      <Input
        label="Username"
        value={get(loggedUserDetails, 'username', '')}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        blurOnSubmit={false}
        editable={false}
        disabled={true}
      />
      <Input
        label="Email"
        value={get(loggedUserDetails, 'email', '')}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        blurOnSubmit={false}
        editable={false}
        disabled={true}
      />
      <Input
        label="Mobile Number"
        value={get(loggedUserDetails, 'mobile_number', '-NA-')}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        blurOnSubmit={false}
        editable={false}
        disabled={true}
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
        onPress={handleUpdateProfile}
        loading={isLoading}>
        Update Profile
      </Button>
      <Button
        style={styles.passwordBtn}
        contentStyle={layout.button}
        color={THEME_COLORS.secondary.main}
        uppercase
        mode="outlined"
        onPress={handleChangePassword}>
        Change Password
      </Button>
      <Button
        contentStyle={layout.button}
        color={THEME_COLORS.error.main}
        onPress={handleLogout}
        uppercase
        mode="outlined">
        LOGOUT
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 16,
  },
  headline: {
    fontSize: 28,
    lineHeight: 36,
  },
  passwordBtn: {
    marginTop: 36,
    marginBottom: 12,
  },
});
export default ProfileScreen;
