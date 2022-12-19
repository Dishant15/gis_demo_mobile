import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, Platform, AppState, Linking, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import VersionInfo from 'react-native-version-info';
import {Headline, Button} from 'react-native-paper';
import {get} from 'lodash';

import {FullScreenLoader} from './Loader';

import {fetchVersionData} from '~Dashboard/data/services';
import {colors, layout} from '~constants/constants';

import DownloadApp from '~assets/svg/download.svg';

const VersionUpdateProvider = ({children}) => {
  const appState = useRef(AppState.currentState);

  const {isLoading, data, refetch} = useQuery('versionData', fetchVersionData);

  // handle refetch on appState change
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        refetch();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [refetch]);

  const updated = useMemo(() => {
    const {appVersion, buildVersion} = get(data, Platform.OS, {});
    return (
      VersionInfo.appVersion === appVersion &&
      VersionInfo.buildVersion === buildVersion
    );
  }, [data]);

  const handleClick = useCallback(() => {
    if (Platform.OS === 'ios') {
      // Linking.openURL(`https://apps.apple.com/${appStoreLocale}/app/${appName}/id${appStoreId}`);
    } else {
      Linking.openURL(
        `https://play.google.com/store/apps/details?id=${VersionInfo.bundleIdentifier}`,
      );
    }
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  } else {
    if (updated) {
      return children;
    } else {
      return (
        <View style={[layout.container, layout.center]}>
          <View style={styles.imageWrapper}>
            <DownloadApp width={200} />
          </View>
          <Headline>Update Your App</Headline>
          <Button
            style={styles.button}
            contentStyle={layout.button}
            color={colors.primaryMain}
            uppercase
            mode="contained"
            onPress={handleClick}>
            Update
          </Button>
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  imageWrapper: {
    paddingVertical: 40,
  },
  img: {
    flex: 1,
    width: null,
    height: null,
  },
  subheadingText: {
    textAlign: 'center',
  },
  button: {
    marginTop: 40,
    marginBottom: 5,
    minWidth: '50%',
  },
  deniedBtn: {
    marginVertical: 10,
  },
});

export default VersionUpdateProvider;
