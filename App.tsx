/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, setIsNavigationReady } from './src/navigation/Navigation';
import RootNavigator from './src/navigation/navigators/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // <SafeAreaProvider>
    //   <Text>Hello Sir </Text>
    // </SafeAreaProvider>
    <NavigationContainer ref={navigationRef} onReady={setIsNavigationReady}>
      <RootNavigator/>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
