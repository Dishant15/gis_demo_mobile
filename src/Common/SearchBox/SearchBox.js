import React, {useCallback, useState} from 'react';

import {View, StyleSheet} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
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
      <Button
        style={styles.btn}
        color={THEME_COLORS.secondary.main}
        contentStyle={layout.button}
        uppercase
        // icon="magnify"
        onPress={handleSearch}>
        Go
      </Button>
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
  },
  btn: {
    backgroundColor: THEME_COLORS.secondary.main + percentToHex(16),
    marginLeft: 8,
  },
});

export default SearchBox;
