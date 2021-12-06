import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/Header';

import Detail from '../pages/Dashboard/Appointments/Detail';
import Reschedule from '../pages/Dashboard/Appointments/Reschedule';
import ChangeProcedure from '../pages/Dashboard/Appointments/ChangeProcedure';
import ChangePersonalData from '../pages/Dashboard/Profile/ChangePersonalData';
import ChangeAddress from '../pages/Dashboard/Profile/ChangeAddress';
import ChangeLoginData from '../pages/Dashboard/Profile/ChangeLoginData';

import Dashboard from './app.tab';

const AppStack = createStackNavigator();

export default function AppTabs() {
  return(
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{ headerShown: false }}
      />

      <AppStack.Screen 
        name="Detail" 
        component={ Detail }
        options={{
          headerShown: true,
          header: () => (
            <Header title="Detalhes do agendamento" showIcon={true} fontSize={23} />
          )
        }}
      />

      <AppStack.Screen 
        name="Reschedule" 
        component={ Reschedule }
        options={{ headerShown: false }}
      />

      <AppStack.Screen 
        name="ChangeProcedure" 
        component={ ChangeProcedure }
        options={{ headerShown: false }}
      />

      <AppStack.Screen 
        name="ChangePersonalData"
        component={ChangePersonalData}
        options={{headerShown: false}}
      />

      <AppStack.Screen 
        name="ChangeAddress"
        component={ChangeAddress}
        options={{headerShown: false}}
      />

      <AppStack.Screen 
        name="ChangeLoginData"
        component={ChangeLoginData}
        options={{headerShown: false}}
      />
    </AppStack.Navigator>
  );
}