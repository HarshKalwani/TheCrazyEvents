/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import {
  navigationRef,
  setIsNavigationReady,
} from './src/navigation/Navigation';
import RootNavigator from './src/navigation/navigators/RootNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef} onReady={setIsNavigationReady}>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
