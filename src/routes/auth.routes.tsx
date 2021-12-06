import React from 'react';

import {createStackNavigator} from '@react-navigation/stack'

import SignIn from '../pages/SignIn/index';

import { ForgotPasswordScreen, RegisterScreen } from './auth.stack';

const AuthStack = createStackNavigator();

export default function AuthRoutes() {
  return (
    <AuthStack.Navigator
      screenOptions={{headerShown: false}}
    >
      <AuthStack.Screen 
        name="SignIn" 
        component={SignIn}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};