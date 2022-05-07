import React from 'react';
import {View, Text, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

import {colors, fonts, layout} from '~constants/constants';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import authBg from '~assets/img/authBg.png';
import {useDispatch} from 'react-redux';
import {login} from '~redux/reducers/auth.reducer';
const {width, height} = Dimensions.get('screen');

const LoginScreen = () => {
  const dispatch = useDispatch();
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

          <View>
            <TextInput
              label="Email"
              mode="outlined"
              activeOutlineColor={colors.black}
              style={layout.textInput}
            />
            <TextInput
              mode="outlined"
              label="Password"
              secureTextEntry
              activeOutlineColor={colors.black}
              style={layout.textInput}
              right={<TextInput.Icon name="eye" />}
            />

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
                onPress={() => dispatch(login('token'))}>
                Login
              </Button>
            </View>
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
