import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Button,
  Menu,
  Caption,
  Chip,
  Paragraph,
  TextInput,
  Portal,
  Title,
} from 'react-native-paper';
import Modal from 'react-native-modal';

import {difference, find, indexOf, map} from 'lodash';

import {colors} from '~constants/constants';
import {noop} from '~utils/app.utils';
import Input from './Input';
import {useKeyboard} from '~utils/useKeyboard';
import CloseIcon from '~assets/svg/icon_close.svg';

const {height, width} = Dimensions.get('screen');

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
  const scrollRef = useRef();

  const isKeyboardVisible = useKeyboard();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleReset = useCallback(() => {
    setTags([]);
    onSubmit([]);
    closeMenu();
  }, [onSubmit, closeMenu, tags]);

  const handleSubmit = useCallback(() => {
    onSubmit(tags);
    closeMenu();
  }, [onSubmit, closeMenu, tags]);

  const handleAddNewOpt = useCallback(() => {
    if (!extraOpt) return;
    setTags(currTags => [...currTags, extraOpt]);
    setExtraOpt('');
    scrollRef.current.scrollToEnd({animated: true});
  }, [extraOpt, setTags, setExtraOpt, scrollRef]);

  // get extra options that user added and concat with input options
  const fullTagList = tagList.concat(
    difference(tags, map(tagList, 'value')).map(opt => ({
      value: opt,
      label: opt,
    })),
  );

  return (
    <>
      <Pressable onPress={openMenu} style={styles.categoryWrapper}>
        <Caption>{inputLabel}</Caption>
        <View style={styles.chipWrapper}>
          {selectedTags.length ? (
            selectedTags.map(opt => {
              const option = find(fullTagList, ['value', opt]);
              if (option) {
                return (
                  <Chip key={option.value} style={styles.chip}>
                    {option.label}
                  </Chip>
                );
              } else {
                return null;
              }
            })
          ) : (
            <Paragraph style={styles.emptyText}>Click Here to select</Paragraph>
          )}
        </View>
      </Pressable>
      {visible ? (
        <Portal>
          <Modal
            useNativeDriver={true}
            animationIn="slideInUp"
            animationOut="slideInDown"
            isVisible={true}
            hideModalContentWhileAnimating
            style={styles.modalWrapper}
            onBackButtonPress={closeMenu}
            onBackdropPress={closeMenu}
            avoidKeyboard>
            <View
              style={[
                styles.menuContentStyle,
                {maxHeight: isKeyboardVisible ? height * 0.5 : height * 0.8},
              ]}>
              <View style={styles.titleWrapper}>
                <Title
                  style={styles.title}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {inputLabel}
                </Title>
                <Pressable style={styles.iconWrapper} onPress={closeMenu}>
                  <CloseIcon width={18} height={18} color="red" />
                </Pressable>
              </View>
              <ScrollView keyboardShouldPersistTaps="always" ref={scrollRef}>
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
                        let newList = [...tags];
                        toggleFromList(newList, tag.value);
                        setTags(newList);
                      }}
                      title={tag.label}
                    />
                  );
                })}
              </ScrollView>
              <View style={styles.actionsWrapper}>
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
                    onPress={handleReset}>
                    Clear
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
      ) : null}
    </>
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
