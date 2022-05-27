import {find, indexOf} from 'lodash';
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Button, Menu, Caption, Chip, Paragraph} from 'react-native-paper';
import {colors} from '~constants/constants';
import {noop} from '~utils/app.utils';

const TagSelect = ({
  tagList,
  selectedTags = [],
  inputLabel = '',
  onSubmit = noop,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [tags, setTags] = React.useState(selectedTags);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Menu
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: colors.blackWithOp,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      contentStyle={{
        minWidth: '70%',
        maxHeight: 400,
      }}
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Pressable onPress={openMenu} style={styles.categoryWrapper}>
          <Caption>{inputLabel}</Caption>
          <View style={styles.chipWrapper}>
            {selectedTags.length ? (
              selectedTags.map(opt => {
                const option = find(tagList, ['value', opt]);
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
        {tagList.map((tag, ind) => {
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
        <View style={styles.wrapper}>
          <Button
            style={styles.btn1}
            mode="outlined"
            onPress={() => {
              setTags([]);
            }}>
            Reset
          </Button>
          <Button
            style={styles.btn2}
            mode="contained"
            onPress={() => {
              onSubmit(tags);
              closeMenu();
            }}>
            Apply
          </Button>
        </View>
      </View>
    </Menu>
  );
};

const styles = StyleSheet.create({
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
