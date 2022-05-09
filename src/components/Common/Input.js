import {View, Text} from 'react-native';
import React, {forwardRef} from 'react';
import {colors, fonts, layout} from '~constants/constants';
import {TextInput, Button, HelperText} from 'react-native-paper';

const Input = forwardRef((props, ref) => {
  return (
    <View>
      <TextInput
        ref={ref}
        activeOutlineColor={colors.black}
        style={layout.textInput}
        mode="outlined"
        {...props}
      />
      {props.error ? (
        <HelperText type="error" visible={props.error}>
          {props.error}
        </HelperText>
      ) : null}
    </View>
  );
});

export default Input;
