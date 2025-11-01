import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './pages/home';
import Favourite from './pages/favourite';
import Addtocart from './pages/addtocart';
import Profile from './pages/Profile';

const Tab = createBottomTabNavigator();
const { height } = Dimensions.get('window');

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
      }}
      safeAreaInsets={{ bottom: 0 }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={25}
              color={focused ? '#1521C4' : '#094092'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={Favourite}
        options={{
          tabBarIcon: ({ focused }) => (
            
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={25}
              color={focused ? '#1521C4' : '#094092'}
              
            />
          ),
        }}
      />
      <Tab.Screen
        name="Addtocart"
        component={Addtocart}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              size={25}
              color={focused ? '#1521C4' : '#094092'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={25}
              color={focused ? '#1521C4' : '#094092'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? height * 0.09 : height * 0.09,
      height: Platform.OS === 'Android' ? height * 0.07 : height * 0.06,
    backgroundColor: '#e8eaebff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5, // shadow on Android
  },
});

export default Tabs;
