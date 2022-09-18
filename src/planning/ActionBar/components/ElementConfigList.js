import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Subheading, Divider} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  getLayerSelectedConfiguration,
  getSingleLayerConfigurationList,
} from '~planning/data/planningState.selectors';
import {selectConfiguration} from '~planning/data/planningState.reducer';
import {colors} from '~constants/constants';

const ElementConfigList = ({layerKey, onClose}) => {
  const dispatch = useDispatch();
  const configList = useSelector(getSingleLayerConfigurationList(layerKey));
  const configuration = useSelector(getLayerSelectedConfiguration(layerKey));

  const handleConfigChange = config => () => {
    dispatch(
      selectConfiguration({
        layerKey,
        configuration: {...config},
      }),
    );
    onClose();
  };

  return (
    <View style={styles.content}>
      <Subheading style={styles.heading}>Select Configuration</Subheading>
      {configList.map(config => {
        const {id, config_name} = config;
        const isActive = configuration.id === id;
        return (
          <View key={id}>
            <Pressable
              onPress={handleConfigChange(config)}
              style={styles.wrapper}>
              <Subheading
                style={[styles.title, isActive && {color: colors.primaryMain}]}>
                {config_name}
              </Subheading>
              <View style={styles.iconWrap}>
                <MaterialIcons
                  size={22}
                  name={'check'}
                  color={
                    isActive ? colors.primaryMain : colors.primaryFontColor
                  }
                />
              </View>
            </Pressable>
            <Divider />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
  heading: {
    textAlign: 'center',
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    paddingVertical: 8,
    // paddingLeft: 36,
  },
  iconWrap: {
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ElementConfigList;
