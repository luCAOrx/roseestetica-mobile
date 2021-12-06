import React, { useEffect, useRef, useState } from 'react';

import { Text } from 'react-native';

import styles from './styles/selectProcedure';

import { TouchableOpacity } from 'react-native-gesture-handler';

import Checkbox from 'expo-checkbox';

import { useField } from '@unform/core';
import { useTheme } from '@react-navigation/native';

interface CustomCheckboxProps {
  name: string;
  procedure: string;
  price: string;
  id: number;
  handleSelectProcedure(id: number): void;
  selectedProcedure: Array<number>;
};

export default function SelectProcedure({
  name, 
  procedure, 
  price, 
  id, 
  handleSelectProcedure, 
  selectedProcedure
}: CustomCheckboxProps) {
  
  const [isChecked, setChecked] = useState(false);

  const {colors} = useTheme();

  const { fieldName, registerField, error } = useField(name);

  const selectProcedureRef = useRef(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectProcedureRef.current,
      getValue() {
        return selectedProcedure;
      }
    });
  }, [fieldName, selectedProcedure, registerField]);

  return (
    <>
      <TouchableOpacity 
        style={styles.container} 
        onPress={() => {
          setChecked(!isChecked)
          handleSelectProcedure(id)
        }}
      >
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          color={colors.text}
        />
        <Text 
          style={[
            styles.text,
            {color: colors.text}
          ]}
        >
          {procedure}
        </Text>
        <Text 
          style={[
            styles.price,
            {color: colors.price}
          ]}
        >
          {price}
        </Text>
      </TouchableOpacity>
      { error && <Text style={styles.errorMessage}>{error}</Text>}
    </>  
  );
};