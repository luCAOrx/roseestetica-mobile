import React from 'react';

import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import Loading from '../Loading';

import styles from './styles';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  width?: number;
  backgroundColor: string;
  height: number;
  fontSize: number;
  marginBottom?: number;
  color: string;
  isRequested?: Boolean;
}

export default function CustomButton({
  title, 
  width, 
  backgroundColor, 
  height,
  fontSize,
  marginBottom,
  color,
  isRequested,
  ...rest
}: CustomButtonProps) {
  return(
    <TouchableOpacity 
      style={[
        styles.container,
        {
          height: height,
          width: width,
          marginBottom: marginBottom,
          backgroundColor: backgroundColor
        }
      ]} 
      {...rest}
      testID="button"
    >
      <Text 
        style={[
          styles.title,
          {
            fontSize: fontSize,
            color: color
          }
        ]}
        testID="text"
      >
        { isRequested ? <Loading /> : title }
      </Text>
    </TouchableOpacity>
    
  );
}