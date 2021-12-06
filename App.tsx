import 'react-native-gesture-handler';

import React, { useState, useCallback } from 'react';

import AppLoading from 'expo-app-loading';

import { 
  Roboto_400Regular, 
  Roboto_900Black, 
  Roboto_700Bold, 
  useFonts 
} from '@expo-google-fonts/roboto';

import { Calligraffitti_400Regular } from '@expo-google-fonts/calligraffitti';

import { AuthProvider } from './src/contexts/auth';

import ToggleThemeContext from './src/contexts/toogleTheme';

import {NavigationContainer} from '@react-navigation/native';

import Routes from './src/routes';

import usePersistedState from './src/hooks/usePersistedState';

import { dark } from './src/themes/dark';
import { light } from './src/themes/light';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [theme, setTheme] = usePersistedState("theme", dark);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(!isDarkMode);

    setTheme(isDarkMode ? dark : light)
  }, [theme]);

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_900Black,
    Roboto_700Bold,
    Calligraffitti_400Regular
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <AuthProvider>
        <ToggleThemeContext.Provider value={{toggleTheme, isDarkMode}}>
          <NavigationContainer theme={theme}>
            <Routes />
          </NavigationContainer>
        </ToggleThemeContext.Provider>
      </AuthProvider>
    );
  }
}
