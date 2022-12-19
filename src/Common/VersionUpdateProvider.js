import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text, Platform, AppState} from 'react-native';
import {useQuery} from 'react-query';
import VersionInfo from 'react-native-version-info';
import {get} from 'lodash';

import {FullScreenLoader} from './Loader';

import {fetchVersionData} from '~Dashboard/data/services';

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

  if (isLoading) {
    return <FullScreenLoader />;
  } else {
    if (updated) {
      return children;
    } else {
      return (
        <View>
          <Text>VersionUpdateProvider</Text>
        </View>
      );
    }
  }
};

export default VersionUpdateProvider;
