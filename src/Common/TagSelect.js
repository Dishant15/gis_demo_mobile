import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {
  Button,
  Menu,
  Caption,
  Chip,
  Paragraph,
  TextInput,
} from 'react-native-paper';

import {difference, find, indexOf, map} from 'lodash';

import {colors} from '~constants/constants';
import {noop} from '~utils/app.utils';
import Input from './Input';

const TagSelect = ({
  tagList,
  selectedTags = [],
  inputLabel = '',
  onSubmit = noop,
  creatable = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState(selectedTags);
  const [extraOpt, setExtraOpt] = useState('');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSubmit = useCallback(() => {
    onSubmit(tags);
    closeMenu();
  }, [onSubmit, closeMenu, tags]);

  const handleAddNewOpt = useCallback(() => {
    if (!extraOpt) return;
    setTags(currTags => [...currTags, extraOpt]);
    setExtraOpt('');
  }, [extraOpt, setTags, setExtraOpt]);

  // get extra options that user added and concat with input options
  const fullTagList = tagList.concat(
    difference(tags, map(tagList, 'value')).map(opt => ({
      value: opt,
      label: opt,
    })),
  );

  return (
    <Menu
      style={styles.menuModal}
      contentStyle={styles.menuContentStyle}
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Pressable onPress={openMenu} style={styles.categoryWrapper}>
          <Caption>{inputLabel}</Caption>
          <View style={styles.chipWrapper}>
            {selectedTags.length ? (
              selectedTags.map(opt => {
                const option = find(fullTagList, ['value', opt]);
                return (
                  <Chip key={option.value} style={styles.chip}>
                    {option.label}
                  </Chip>
                );
              })
            ) : (
              <Paragraph style={styles.emptyText}>
                Click Here to select
              </Paragraph>
            )}
          </View>
        </Pressable>
      }>
      <View style={styles.menuWrapper}>
        {fullTagList.map(tag => {
          const selected = tags.indexOf(tag.value) !== -1;
          return (
            <Menu.Item
              icon={
                selected ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
              }
              key={tag.value}
              onPress={() => {
                let newList = [...tags];
                toggleFromList(newList, tag.value);
                setTags(newList);
              }}
              title={tag.label}
            />
          );
        })}
        {creatable ? (
          <View style={styles.creatableWrapper}>
            <Input
              label="Other"
              onChangeText={setExtraOpt}
              value={extraOpt}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleAddNewOpt}
              right={
                <TextInput.Icon
                  name="plus"
                  color={colors.white}
                  style={styles.addIcon}
                  onPress={handleAddNewOpt}
                />
              }
            />
          </View>
        ) : null}
        <View style={styles.wrapper}>
          <Button
            style={styles.btn1}
            mode="outlined"
            onPress={() => {
              setTags([]);
            }}>
            Clear
          </Button>
          <Button style={styles.btn2} mode="contained" onPress={handleSubmit}>
            Apply
          </Button>
        </View>
      </View>
    </Menu>
  );
};

const styles = StyleSheet.create({
  menuModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.blackWithOp,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContentStyle: {
    minWidth: '70%',
    maxHeight: 400,
  },
  menuWrapper: {},
  wrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  btn1: {
    flex: 1,
    marginRight: 8,
  },
  btn2: {
    flex: 1,
    marginLeft: 8,
  },
  categoryWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 10,
    marginVertical: 6,
  },
  emptyText: {
    paddingVertical: 4,
  },
  addIcon: {
    backgroundColor: colors.primaryMain,
    borderRadius: 4,
  },
  creatableWrapper: {
    marginHorizontal: 16,
  },
});

/**
 * If element already in list remove it, else add it
 *
 * @param {Array} list List to update
 * @param {Value} element Add or remove this value
 */
export const toggleFromList = (list, element) => {
  const index = indexOf(list, element);

  if (index === -1) {
    list.push(element);
  } else {
    list.splice(index, 1);
  }

  return list;
};

export default TagSelect;
