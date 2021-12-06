import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Text, TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useField } from '@unform/core';

import { useTheme } from '@react-navigation/native';

import styles from './styles/input';

interface InputProps extends TextInputProps {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  name: string;
  isPassword?: boolean;
  rawText?: string;
  onInitialData?: (defaultValue: any) => void;
}

interface InputReference extends TextInput {
  value: string
}

interface InputHandles {
  focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputHandles, InputProps> = ({ 
  icon,
  name,
  isPassword,
  rawText, 
  onInitialData,
  onChangeText,
  ...rest
}, ref) => {
  const [show, setShow] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [focus, setFocus] = useState(false);

  const { fieldName, registerField, defaultValue = '', error } = useField(name);
  
  const inputRef = useRef<InputReference>(null);

  const {colors} = useTheme();

  const handleChangeText = useCallback(
    (value: string) => {
      if (inputRef.current) inputRef.current.value = value;

      if (onChangeText) onChangeText(value);
    },
    [onChangeText]
  );

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    }
  }));

  useEffect(() => {
    if (onInitialData) onInitialData(defaultValue);
  }, [defaultValue, onInitialData]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue() {
        if (rawText) return rawText;

        if (inputRef.current) return inputRef.current.value;
        
        return '';
      },
      setValue(ref, value: string) {
        if (inputRef.current) {
          inputRef.current.setNativeProps({ text: value });
          
          inputRef.current.value = value;
        }
      },
      clearValue() {
        if (inputRef.current) {
          inputRef.current.setNativeProps({ text: '' });

          inputRef.current.value = '';
        }
      },
    });
  }, [fieldName, rawText, registerField]);

  return (
    <>
      <View 
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: focus === true ? colors.text : "transparent" && 
            error ? '#c52626' : "transparent",
            borderWidth: 1
          }
        ]}
        testID="formInputContainer"
      >
        <MaterialIcons 
          style={{margin: 10}} 
          name={icon} 
          size={20} 
          color= {focus ? colors.text : colors.primary}
          testID="formInputIcon"
        />
        
        <TextInput 
          ref={inputRef}
          style={[
            styles.input,
            {color: colors.text}
          ]}
          defaultValue={defaultValue}
          placeholderTextColor={colors.primary}
          secureTextEntry={isPassword ? visiblePassword : !visiblePassword}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChangeText={handleChangeText}
          {...rest}
          testID="formInput"
        />

        {isPassword && 
          <TouchableOpacity 
            style={{marginRight: 10}} 
            onPress={() => {
              setShow(!show) 
              setVisiblePassword(!visiblePassword)
            }}
            testID="formInputButtonPasswordVisibility"
          >
            <MaterialIcons 
              name={show === false ? "visibility" : "visibility-off"} 
              size={20} 
              color={colors.buttonSecondaryBackground}
            />
          </TouchableOpacity>
        }
      </View>
      { error && <Text style={styles.errorMessage} testID="formInputError">{error}</Text>}
    </>
  )
};

export default forwardRef(Input);