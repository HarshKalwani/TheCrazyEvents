import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootRoutes } from '../Routes';
import AuthNavigator from './AuthNavigator';
import MainStackNavigation from './MainStackNavigator';

const RootNavigator = () => {
  const Stack = createNativeStackNavigator();
  const isAuthenticated = false
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      {isAuthenticated ? (
        <Stack.Screen name={RootRoutes.MainTabs} component={MainStackNavigation}/>
      ) : (
        <Stack.Screen name={RootRoutes.AuthStack} component={AuthNavigator} />
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator

const styles = StyleSheet.create({})