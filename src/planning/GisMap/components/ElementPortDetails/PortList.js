import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Subheading, Paragraph} from 'react-native-paper';

import get from 'lodash/get';
import split from 'lodash/split';

import {colors} from '~constants/constants';
import {
  getLayerKeyFromPreUid,
  LayerKeyMappings,
  LayerKeyNameMapping,
} from '~planning/GisMap/utils';

/**
 * Parent:
 *    CommonPortDetails
 */
const PortList = ({portList}) => {
  return (
    <View style={styles.container}>
      {portList.map(port => {
        const name = get(port, 'name').replace('.I', '').replace('.O', '');
        if (port.status === 'C') {
          // connectedTo = SP.cV8bPv-P1.I
          const connectedTo = split(port.connected_to, '-');
          // elementDetails = [SP, cV8bPv]
          const elementDetails = split(get(connectedTo, '0'), '.');
          // connectedPort = [P1, I]
          const connectedPort = split(get(connectedTo, '1'), '.');
          // SP
          const layerKey = getLayerKeyFromPreUid(get(elementDetails, '0'));
          const Icon = LayerKeyMappings[layerKey]['getViewOptions']({}).icon;

          return (
            <View key={port.id} style={styles.wrapper}>
              <View style={styles.portNameWrapper}>
                <Text style={styles.portName}>{name}</Text>
              </View>
              <View style={styles.content}>
                <View style={styles.leftContent}>
                  <View style={styles.iconWrapper}>
                    <Icon size={30} />
                  </View>
                  <View style={styles.leftDataContent}>
                    <Subheading style={styles.bold}>
                      {LayerKeyNameMapping[layerKey]}
                    </Subheading>
                    <Paragraph>{get(elementDetails, '1')}</Paragraph>
                  </View>
                </View>
                <View style={styles.rightContent}>
                  <Subheading style={styles.rightPortInd}>
                    {get(connectedPort, '1') === 'I' ? 'IN' : 'OUT'}
                  </Subheading>
                  <Paragraph>{get(connectedPort, '0')}</Paragraph>
                </View>
              </View>
            </View>
          );
        } else {
          return (
            <View key={port.id} style={styles.wrapper}>
              <View style={styles.portNameWrapper}>
                <Text style={styles.portName}>{name}</Text>
              </View>
              <View style={styles.noConnectedWrapper}>
                <Subheading>{get(port, 'status_display')}</Subheading>
              </View>
            </View>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  wrapper: {
    borderColor: colors.dividerColor2,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    minHeight: 66,
  },
  portNameWrapper: {
    backgroundColor: colors.grey1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portName: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 24,
  },
  noConnectedWrapper: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 6,
  },
  leftDataContent: {
    paddingLeft: 6,
  },
  rightContent: {
    padding: 6,
    paddingRight: 10,
  },
  rightPortInd: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  iconWrapper: {
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
});

export default PortList;
