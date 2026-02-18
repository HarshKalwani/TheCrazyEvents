import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthRoutes, AuthStackParamList } from '../Routes';
import LoginScreen from '../../screens/LoginScreen';
import SignupScreen from '../../screens/SignupScreen';


const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name={AuthRoutes.Login} component={LoginScreen}/>
      <Stack.Screen name={AuthRoutes.SignUp} component={SignupScreen}/>
      <Stack.Screen name={AuthRoutes.ForgotPassword} component={SignupScreen}/>
    </Stack.Navigator>
  )
}

export default AuthNavigator

const styles = StyleSheet.create({})