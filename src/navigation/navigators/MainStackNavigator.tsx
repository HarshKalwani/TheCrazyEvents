import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MainRoutes, MainStackParamList, RootRoutes } from '../Routes'
import MainTabNavigator from './MainTabNavigator';
import ProfileScreen from '../../screens/ProfileScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();
const MainStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name={MainRoutes.Profile} component={ProfileScreen}/>
    </Stack.Navigator>
  )
}

export default MainStackNavigation

const styles = StyleSheet.create({})