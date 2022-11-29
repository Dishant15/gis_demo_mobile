import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '~constants/constants';

const Checkbox = ({label, checked, onChange, style, textStyle}) => {
  return (
    <TouchableOpacity
      style={[styles.checkboxWrapper, style]}
      onPress={onChange}>
      <MaterialCommunityIcons
        size={26}
        name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
        color={checked ? colors.primaryMain : colors.primaryFontColor}
        style={{textAlign: 'center'}}
      />
      <Text style={[styles.checkboxText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 17,
    paddingLeft: 8,
  },
});
export default Checkbox;
