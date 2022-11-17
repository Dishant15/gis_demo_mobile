import React, {useState, useCallback, useRef, useMemo} from 'react';
import {View, StyleSheet, Pressable, Dimensions} from 'react-native';
import {Button, Menu, Modal, Portal, Title} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {difference, map} from 'lodash';

import {colors} from '~constants/constants';
import {noop} from '~utils/app.utils';
import {useKeyboard} from '~utils/useKeyboard';

import {toggleFromList} from '~Common/TagSelect';
import CloseIcon from '~assets/svg/icon_close.svg';

const SelectModel = ({
  closeMenu,
  tagList,
  selectedTags = [],
  inputLabel = '',
  onSubmit = noop,
}) => {
  const [tags, setTags] = useState(selectedTags);
  const scrollRef = useRef();
  const {availableHeight} = useKeyboard();

  const handleSubmit = useCallback(() => {
    onSubmit(tags);
    closeMenu();
  }, [onSubmit, closeMenu, tags]);

  // get extra options that user added and concat with input options
  const fullTagList = tagList.concat(
    difference(tags, map(tagList, 'value')).map(opt => ({
      value: opt,
      label: opt,
    })),
  );

  return (
    <Portal>
      <Modal visible={true} onDismiss={closeMenu}>
        <View style={[styles.menuContentStyle, {maxHeight: availableHeight}]}>
          <View style={styles.titleWrapper}>
            <Title style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {inputLabel}
            </Title>
            <Pressable style={styles.iconWrapper} onPress={closeMenu}>
              <CloseIcon width={18} height={18} color="red" />
            </Pressable>
          </View>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            ref={scrollRef}>
            {fullTagList.map(tag => {
              const selected = tags.indexOf(tag.value) !== -1;
              return (
                <Menu.Item
                  style={styles.itemMax}
                  icon={
                    selected
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  key={tag.value}
                  onPress={() => {
                    if (selected) return;
                    let newList = [];
                    toggleFromList(newList, tag.value);
                    setTags(newList[0]);
                  }}
                  title={tag.label}
                />
              );
            })}
          </KeyboardAwareScrollView>
          <View style={styles.actionsWrapper}>
            <View style={styles.wrapper}>
              <Button style={styles.btn1} mode="outlined" onPress={closeMenu}>
                Close
              </Button>
              <Button
                style={styles.btn2}
                mode="contained"
                onPress={handleSubmit}>
                Done
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  menuContentStyle: {
    // maxHeight: height * 0.8,
    backgroundColor: colors.white,
    marginHorizontal: 30,
    borderRadius: 4,
  },
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
  itemMax: {
    maxWidth: '100%',
  },
  actionsWrapper: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  iconWrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    width: 40,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryMain,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.white,
    flex: 1,
  },
});

export default SelectModel;
