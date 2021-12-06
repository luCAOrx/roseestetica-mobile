import React from 'react';

import { ActivityIndicator } from 'react-native';

import { useTheme } from '@react-navigation/native';

export default function Loading() {
  const { colors } = useTheme();

  return (
    <ActivityIndicator 
      size="large"
      color={colors.text}
      animating
      style={{ justifyContent: 'center', alignItems: 'center' }}
      testID="loading"
    />
  );
};