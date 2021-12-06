import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '@react-navigation/native';

import { MaterialIcons as Icon } from '@expo/vector-icons';

import { ScheduleStack, AppointmentsStack, ProfileStack } from './app.stack';

const AppTab = createBottomTabNavigator();

export default function Dashboard() {
  const {colors} = useTheme();

  return (
    <AppTab.Navigator 
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 70,

        },

        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },

        tabBarIconStyle: {
          flex: 0,
          width: 20,
          height: 20,
        },

        tabBarLabelStyle: {
          fontFamily: "Roboto_400Regular",
          fontSize: 15,
        },

        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.border
      }}
    >

      <AppTab.Screen 
        name="ScheduleStack" 
        component={ScheduleStack}
        options={{
          headerShown: false,
          tabBarLabel: "Agendar",
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon 
                name="control-point" 
                size={20} 
                color={focused ? colors.text : color}
              />
            );
          },
          unmountOnBlur: true
        }}
      />     

      <AppTab.Screen 
        name="AppointmentsStack" 
        component={AppointmentsStack}
        options={{
          headerShown: false,
          tabBarLabel: "Agendamentos",
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon 
                name="event-available" 
                size={20} 
                color={focused ? colors.text : color}
              />
            );
          }
        }}
      />

      <AppTab.Screen 
        name="ProfileStack" 
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon 
                name="person" 
                size={20} 
                color={focused ? colors.text : color}
              />
            );
          }
        }}
      />     
    </AppTab.Navigator>
  );
};