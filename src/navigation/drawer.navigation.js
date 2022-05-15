import React from 'react';
import {Dimensions, View, StyleSheet} from 'react-native';
import {Title, List, Headline, Divider, useTheme} from 'react-native-paper';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {colors, layout, screens} from '~constants/constants';
import DashboardScreen from '~Dashboard/DashboardScreen';
import {DrawerButton} from '~Common/components/Header/ActionButtons';
import ComingSoon from '~Common/components/ComingSoon';
import AreaList from '~GeoServey/screens/AreaList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {logout} from '~Authentication/data/auth.reducer';

const Drawer = createDrawerNavigator();

/**
 * Custom Drawer component
 */
const DrawerContent = props => {
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();

  return (
    <View style={layout.container}>
      <View
        style={[
          styles.headerContent,
          {paddingTop: top + 20, backgroundColor: colors.primaryMainDark},
        ]}>
        <Headline style={styles.headerText}>Network GIS</Headline>
      </View>
      <Divider />
      <List.Section>
        <List.Item
          title="Dashboard"
          left={() => <List.Icon icon="home" />}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate(screens.dashboardScreen);
          }}
        />
        <List.Accordion
          title="Survey"
          left={props => <List.Icon {...props} icon="earth" />}>
          <List.Item
            title="Geographic"
            onPress={() => {
              props.navigation.closeDrawer();
              props.navigation.navigate(screens.areaList);
            }}
          />
          <List.Item
            title="Network"
            onPress={() => {
              props.navigation.closeDrawer();
              props.navigation.navigate(screens.networkScreen);
            }}
          />
          <List.Item
            title="Client"
            onPress={() => {
              props.navigation.closeDrawer();
              props.navigation.navigate(screens.clientScreen);
            }}
          />
        </List.Accordion>
        <List.Item
          title="Planning"
          left={() => <List.Icon icon="vector-polyline" />}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate(screens.planningScreen);
          }}
        />
        <List.Item
          title="Logout"
          left={() => <List.Icon icon="logout" />}
          onPress={() => {
            dispatch(logout());
          }}
        />
      </List.Section>
    </View>
  );
};

/**
 * Navigation component
 *
 * Parent
 *    root.navigation
 */
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerStyle={{
        width: Dimensions.get('screen').width * 0.8,
        maxWidth: 330,
      }}
      drawerContent={props => {
        return <DrawerContent {...props} />;
      }}>
      <Drawer.Screen
        name={screens.dashboardScreen}
        component={DashboardScreen}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Title style={styles.headerText}>NETWORK GIS</Title>
          ),
          headerLeft: () => <DrawerButton />,
          headerStyle: {
            backgroundColor: colors.primaryMain,
          },
        }}
      />
      <Drawer.Screen
        name={screens.areaList}
        component={AreaList}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Title style={styles.headerText}>Geographic</Title>
          ),
          headerLeft: () => <DrawerButton />,
          headerStyle: {
            backgroundColor: colors.primaryMain,
          },
        }}
      />
      <Drawer.Screen
        name={screens.networkScreen}
        component={ComingSoon}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => <Title style={styles.headerText}>Network</Title>,
          headerLeft: () => <DrawerButton />,
          headerStyle: {
            backgroundColor: colors.primaryMain,
          },
        }}
      />
      <Drawer.Screen
        name={screens.clientScreen}
        component={ComingSoon}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => <Title style={styles.headerText}>Client</Title>,
          headerLeft: () => <DrawerButton />,
          headerStyle: {
            backgroundColor: colors.primaryMain,
          },
        }}
      />
      <Drawer.Screen
        name={screens.planningScreen}
        component={ComingSoon}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => <Title style={styles.headerText}>Planning</Title>,
          headerLeft: () => <DrawerButton />,
          headerStyle: {
            backgroundColor: colors.primaryMain,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  headerText: {
    color: colors.accentTextColor,
  },
});

export default DrawerNavigation;
