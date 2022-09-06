import React, {useMemo} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useQuery} from 'react-query';

import {filter, isNull} from 'lodash';
import {Subheading, Paragraph, Title} from 'react-native-paper';

import Loader from '~Common/Loader';

import {fetchLayerList} from '~planning/data/actionBar.services';

import {colors, layout} from '~constants/constants';
import {ICONS} from '~utils/icons';

const {width} = Dimensions.get('window');
const itemWidth = (width - 24) / 3;

const AddElementContent = () => {
  const {isLoading, data} = useQuery('planningLayerConfigs', fetchLayerList, {
    staleTime: Infinity,
  });

  const layerCofigs = useMemo(() => {
    return filter(data, ['can_add', true]);
  }, [data]);

  if (layerCofigs.length) {
    return (
      <View style={styles.container}>
        {isLoading ? <Loader /> : null}
        <Title style={styles.title}>GIS Layers</Title>

        <View style={styles.grid}>
          {layerCofigs.map(config => {
            let SvgComp = ICONS(config.layer_key);
            SvgComp = isNull(SvgComp) ? <></> : <SvgComp width={30} />;
            return (
              <View
                style={[{width: itemWidth, height: itemWidth, padding: 8}]}
                key={config.layer_key}>
                <View style={styles.gridItem}>
                  {SvgComp}
                  <Paragraph style={layout.textCenter}>{config.name}</Paragraph>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {isLoading ? <Loader /> : null}
        <Title style={styles.title}>GIS Layers</Title>
        <Subheading style={layout.textCenter}>
          No elements created yet.
        </Subheading>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },
  gridItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  title: {
    color: colors.primaryMain,
    textAlign: 'center',
  },
});

export default AddElementContent;
