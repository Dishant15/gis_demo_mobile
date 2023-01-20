import React, {useCallback, useState} from 'react';

import {View, StyleSheet, Keyboard} from 'react-native';
import {TextInput, IconButton} from 'react-native-paper';
import {colors, layout, THEME_COLORS} from '~constants/constants';
import {percentToHex} from '~utils/app.utils';

const SearchBox = ({onSearchPress}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = useCallback(() => {
    onSearchPress(searchText);
  }, [searchText]);

  const handleClearSearch = useCallback(() => {
    onSearchPress('');
    setSearchText('');
    Keyboard.dismiss();
  }, [searchText]);

  return (
    <View style={styles.textWrapper}>
      <TextInput
        label="Search"
        onChangeText={setSearchText}
        value={searchText}
        mode="flat"
        style={[layout.textInput, styles.text]}
        activeOutlineColor={colors.black}
        selectionColor="#3895D344"
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        right={
          searchText ? (
            <TextInput.Icon name={'close'} onPress={handleClearSearch} />
          ) : null
        }
      />
      <IconButton
        icon="magnify"
        onPress={handleSearch}
        color={THEME_COLORS.secondary.main}
        style={styles.btn}
        size={30}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    flex: 1,
    marginTop: 6,
  },
  btn: {
    backgroundColor: THEME_COLORS.secondary.main + percentToHex(16),
    marginLeft: 12,
    borderRadius: 0,
  },
});

export default SearchBox;
