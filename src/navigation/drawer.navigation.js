import React from 'react';
import {Dimensions, View, StyleSheet} from 'react-native';
import {Title, List, Headline, Divider} from 'react-native-paper';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {layout, screens} from '~constants/constants';
import DashboardScreen from '~screens/DashboardScreen';
import SurveyList from '~screens/Survey/SurveyList';
import NetworkScreen from '~screens/NetworkScreen';
import ClientScreen from '~screens/ClientScreen';
import PlanningScreen from '~screens/PlanningScreen';
import {DrawerButton} from '~components/Header/ActionButtons';
import ComingSoon from '~components/ComingSoon';
import AreaList from '~screens/Survey/AreaList';

const Drawer = createDrawerNavigator();

const DrawerContent = props => {
  const {navigation} = props;

  return (
    <View style={layout.container}>
      <View style={styles.headerContent}>
        <Headline>Network GIS</Headline>
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
      </List.Section>
    </View>
  );
};

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
          headerTitle: () => <Title>NETWORK GIS</Title>,
          headerLeft: () => <DrawerButton />,
        }}
      />
      <Drawer.Screen
        name={screens.areaList}
        component={AreaList}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => <Title>Geographic</Title>,
          headerLeft: () => <DrawerButton />,
        }}
      />
      <Drawer.Screen
        name={screens.networkScreen}
        component={ComingSoon}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => <Title>Network</Title>,
          headerLeft: () => <DrawerButton />,
        }}
      />
      <Drawer.Screen
        name={screens.clientScreen}
        component={ComingSoon}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => <Title>Client</Title>,
          headerLeft: () => <DrawerButton />,
        }}
      />
      <Drawer.Screen
        name={screens.planningScreen}
        component={ComingSoon}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => <Title>Planning</Title>,
          headerLeft: () => <DrawerButton />,
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});

export default DrawerNavigation;
