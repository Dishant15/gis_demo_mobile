import React, {forwardRef} from 'react';
import {View} from 'react-native';
import {colors, layout} from '~constants/constants';
import {TextInput, HelperText} from 'react-native-paper';

const Input = forwardRef((props, ref) => {
  return (
    <View style={props.wrapperStyle}>
      <TextInput
        ref={ref}
        activeOutlineColor={colors.black}
        selectionColor="#3895D344"
        style={[layout.textInput, props.inputStyle]}
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
