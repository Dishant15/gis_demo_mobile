import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Button} from 'react-native-paper';

import {get} from 'lodash';

import Input from '~Common/Input';

import {handleLogoutUser} from '~Authentication/data/auth.actions';
import {getLoggedUserDetails} from '~Authentication/data/auth.selectors';
import {colors, layout, screens, THEME_COLORS} from '~constants/constants';

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const loggedUserDetails = useSelector(getLoggedUserDetails);

  const handleLogout = useCallback(() => {
    dispatch(handleLogoutUser);
  }, []);

  const handleChangePassword = useCallback(() => {
    navigation.navigate(screens.changePasswordScreen);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Input
        label="Name"
        value={get(loggedUserDetails, 'name', '')}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        blurOnSubmit={false}
        editable={false}
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
      />
      <Input
        label="Mobile Number"
        value={get(loggedUserDetails, 'mobile_number', '')}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        blurOnSubmit={false}
        editable={false}
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
