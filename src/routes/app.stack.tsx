import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import Header from '../components/Header';

import Schedule from '../pages/Dashboard';
import Appointments from '../pages/Dashboard/Appointments';
import Profile from '../pages/Dashboard/Profile';

const AppStack = createStackNavigator();

const ScheduleStack = () => (
  <AppStack.Navigator
    screenOptions={{headerShown: false}}
  >
    <AppStack.Screen 
      name="Schedule" 
      component={Schedule}
      options={{headerShown: false}}
    />
  </AppStack.Navigator>
);
  
const AppointmentsStack = () => (
  <AppStack.Navigator
    screenOptions={{headerShown: false}}
  >
    <AppStack.Screen 
      name="Appointments"
      component={Appointments}
      options={{ 
        headerShown: true, 
        header: () => (
          <Header title="Meus agendamentos" showIcon={false} fontSize={26} />
        )
      }}
    />
  </AppStack.Navigator>
);
  
const ProfileStack = () => (
  <AppStack.Navigator
    screenOptions={{headerShown: false}}
  >
    <AppStack.Screen 
      name="Profile" 
      component={Profile}
    />
  </AppStack.Navigator>
);

export {ScheduleStack, AppointmentsStack, ProfileStack};