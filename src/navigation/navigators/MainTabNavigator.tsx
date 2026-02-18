import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MainRoutes, MainTabsParamList } from '../Routes'
import HomeScreen from '../../screens/HomeScreen';
import ExploreScreen from '../../screens/ExploreScreen';
import NotificationScreen from '../../screens/NotificationScreen';
import MessageScreen from '../../screens/MessageScreen';
import Ionicons from "react-native-vector-icons/Ionicons"



const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={MainRoutes.Explore}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";
          if (route?.name == MainRoutes.Home) iconName = "home";
          else if (route.name == MainRoutes.Explore) iconName = "search";
          else if (route.name == MainRoutes.Notification) iconName = 'notifications';
          else if (route.name == MainRoutes.Messages) iconName = 'chatbubble';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#14b8a6",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0 },
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen name={MainRoutes.Home} component={HomeScreen} />
      <Tab.Screen name={MainRoutes.Explore} component={ExploreScreen} />
      <Tab.Screen name={MainRoutes.Notification} component={NotificationScreen} />
      <Tab.Screen name={MainRoutes.Messages} component={MessageScreen} />
    </Tab.Navigator>
  )
}

export default MainTabNavigator

const styles = StyleSheet.create({})