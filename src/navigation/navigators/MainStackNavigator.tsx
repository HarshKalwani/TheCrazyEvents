import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MainRoutes, MainStackParamList, RootRoutes } from '../Routes'
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator<MainStackParamList>();
const MainStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  )
}

export default MainStackNavigation

const styles = StyleSheet.create({})