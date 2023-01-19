import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, Platform, AppState, Linking, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import VersionInfo from 'react-native-version-info';
import {Headline, Subheading, Button} from 'react-native-paper';
import {get} from 'lodash';

import {FullScreenLoader} from './Loader';

import {fetchHealthCheck} from '~Dashboard/data/services';
import {colors, layout} from '~constants/constants';

import DownloadApp from '~assets/svg/download.svg';

const VersionUpdateProvider = ({children}) => {
  const appState = useRef(AppState.currentState);

  const {isLoading, data, refetch} = useQuery('healthCheck', fetchHealthCheck);

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

  const {updated, appVersion, buildVersion} = useMemo(() => {
    const {appVersion, buildVersion} = get(
      data,
      ['version_info', Platform.OS],
      {},
    );
    console.log(
      '🚀 ~ file: appVersion, buildVersion',
      appVersion,
      buildVersion,
    );
    const updated =
      VersionInfo.appVersion === appVersion &&
      VersionInfo.buildVersion === buildVersion;
    return {updated, appVersion, buildVersion};
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
          <Subheading style={styles.subheadingText}>
            {`Your current version is v ${VersionInfo.appVersion} (${VersionInfo.buildVersion}) \n and latest version is v ${appVersion} (${buildVersion})`}
          </Subheading>
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
