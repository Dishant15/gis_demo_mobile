import React, {useCallback} from 'react';
import {Dimensions, View, StyleSheet} from 'react-native';
import {Title, List, Headline, Divider, Subheading} from 'react-native-paper';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {get} from 'lodash';

import {DrawerButton} from '~Common/components/Header/ActionButtons';
import ComingSoon from '~Common/components/ComingSoon';
import DashboardScreen from '~Dashboard/DashboardScreen';
import SurveyTicketList from '~GeoServey/screens/SurveyTicketList';
import PlanningTicket from '~planningTicket/screen/PlanningTicketListScreen';
import PlanningScreen from '~planning/screens/PlanningScreen';

import {colors, layout, screens} from '~constants/constants';
import {
  getIsSuperAdminUser,
  getUserPermissions,
} from '~Authentication/data/auth.selectors';
import {handleLogoutUser} from '~Authentication/data/auth.actions';

import GTPL_LOGO from '~assets/img/gtpl.jpeg';
import GPSTEKLOGO from '~assets/svg/gpstek.svg';
import {clearPlanningData} from '~planning/data/planning.actions';

const Drawer = createDrawerNavigator();

/**
 * Custom Drawer component
 *
 * Parent:
 *    root.navigation
 * Renders:
 *    below are file names called drawer
 *    DashboardScreen
 *    NetworkScreen
 *    ClientScreen
 *    PlanningScreen
 */
const DrawerContent = props => {
  const {top, bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const isSuperAdminUser = useSelector(getIsSuperAdminUser);
  const permissions = useSelector(getUserPermissions);

  const canPlanningView =
    get(permissions, 'planning_view', false) || isSuperAdminUser;

  const handleLogout = useCallback(() => {
    dispatch(handleLogoutUser);
  }, []);

  return (
    <View style={layout.container}>
      <View
        style={[
          styles.headerContent,
          {paddingTop: top + 20, backgroundColor: colors.primaryMainDark},
        ]}>
        <Headline style={styles.headerText}>Network GIS</Headline>
        <View style={{paddingTop: 8}}>
          <FastImage
            source={GTPL_LOGO}
            style={{
              height: 64,
              width: 150,
            }}
          />
        </View>
      </View>
      <Divider />
      <View style={{flex: 1}}>
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
            title="Ticket"
            left={props => <List.Icon {...props} icon="earth" />}>
            <List.Item
              title="Survey"
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate(screens.surveyTicketList);
              }}
            />
            <List.Item
              title="Network"
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate(screens.planningTicketList);
              }}
            />
            {/* <List.Item
            title="Client"
            onPress={() => {
              props.navigation.closeDrawer();
              props.navigation.navigate(screens.clientScreen);
            }}
          /> */}
          </List.Accordion>
          {canPlanningView ? (
            <List.Item
              title="Planning"
              left={() => <List.Icon icon="vector-polyline" />}
              onPress={() => {
                dispatch(clearPlanningData);
                props.navigation.closeDrawer();
                props.navigation.navigate(screens.planningScreen);
              }}
            />
          ) : null}
          <List.Item
            title="Logout"
            left={() => <List.Icon icon="logout" />}
            onPress={handleLogout}
          />
        </List.Section>
      </View>
      <View
        style={{
          alignItems: 'center',
          paddingBottom: bottom + 20,
        }}>
        <Subheading>Powered by</Subheading>
        <GPSTEKLOGO width={180} />
      </View>
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
      initialRouteName={screens.dashboardScreen}
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
        name={screens.surveyTicketList}
        component={SurveyTicketList}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Title style={styles.headerText}>Survey Tickets</Title>
          ),
          headerLeft: () => <DrawerButton />,
          headerStyle: {
            backgroundColor: colors.primaryMain,
          },
        }}
      />

      <Drawer.Screen
        name={screens.planningTicketList}
        component={PlanningTicket}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Title style={styles.headerText}>Network Tickets</Title>
          ),
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
        component={PlanningScreen}
        initialParams={{
          fromPlanning: true,
        }}
        options={{
          headerShown: false,
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
