import React, { useEffect, useRef, useState } from 'react';

import { Text, View, TouchableOpacity } from 'react-native';

import { useTheme } from '@react-navigation/native';

import styles from './styles/select';

import { MaterialIcons as Icon } from '@expo/vector-icons';

import { Modalize } from 'react-native-modalize';

import { useField } from '@unform/core';

import api from '../../services/api';

interface SelectProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  placeholder: string;
  modalHeight: number;
  snapPoint: number;
  isGender: boolean;
  name: string;
  placeholderTextColor?: string;
  value?: number;
};

// interface SelectReference extends TouchableOpacity {
//   value: number;
// }

interface Gender {
  id: number;
  sexo: string;
};

interface City {
  id: number;
  cidade: string;
};

export default function Select({
  icon, 
  placeholder, 
  modalHeight,
  snapPoint,
  isGender,
  name,
  placeholderTextColor,
  value
}: SelectProps) {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>();
  const [selectedGenderId, setSelectedGenderId] = useState<number>();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedCityId, setSelectedCityId] = useState<number>();

  const { fieldName, registerField, error } = useField(name);

  const modalizeRef = useRef<Modalize>(null);
  const selectRef = useRef(null);

  const {colors} = useTheme();

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  function handleSelectGender(sex: string, id: number) {
    setSelectedGender(sex);
    setSelectedGenderId(id);
  };

  function handleSelectCity(city: string, id: number) {
    setSelectedCity(city);
    setSelectedCityId(id);
  };

  useEffect(() => {
    api.get('generos').then(response => {
      setGenders(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('cidades').then(response => {
      setCities(response.data);
    });
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue() {
        return isGender ? selectedGenderId : selectedCityId;
      },
      setValue() {
        if (selectRef.current) {
          if (isGender) {
            setSelectedGenderId(value);

            return selectedGenderId;
          } else {
            setSelectedCityId(value);

            return selectedCityId
          }
        }
      }
    });
  }, [fieldName, selectedGenderId, selectedCityId, registerField]);

  return (
    <>
      <TouchableOpacity 
        ref={selectRef}
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: error ? '#c52626' : "transparent",
            borderWidth: 1
          }
        ]} 
        onPress={onOpen}
        testID="selectButtonContainer"
      >
        <Icon 
          style={{margin: 10}} 
          name={icon} 
          size={20} 
          color={colors.primary} 
          testID="selectPrimaryIcon"
        />
        
        {isGender ? (
          <Text 
            style={
              selectedGender?.length || placeholderTextColor ?
              [styles.selected, 
                {color: colors.text}
              ] : 
              [styles.placeholder,
                {color: colors.primary}
              ]
            }
            testID="selectPlaceholderGender"
          >
            {selectedGender?.length ? selectedGender : placeholder}
          </Text>

        ) : (
          <Text 
            style={
              selectedCity?.length || placeholderTextColor ?
              [styles.selected, 
                {color: colors.text}
              ] : 
              [styles.placeholder,
                {color: colors.primary}
              ]
            }
            testID="selectPlaceholderCity"
          >
            {selectedCity?.length ? selectedCity : placeholder}
          </Text>
        )}

        <Icon 
          style={{margin: 10}} 
          name="keyboard-arrow-down"
          size={20} 
          color={colors.primary} 
          testID="selectSecondaryIcon"
        />
      </TouchableOpacity>

      <Modalize 
        ref={modalizeRef}
        snapPoint={snapPoint}
        modalHeight={modalHeight}
        modalStyle={[
          styles.modal,
          {backgroundColor: colors.secondary}
        ]}
      >
        {isGender && genders.map(gender => (
          <View 
            style={[
              styles.itemContainer,
              {borderBottomColor: colors.separator}
            ]}
            key={gender.id}
          >
            <TouchableOpacity 
              style={[styles.item]}
              onPress={() => {
                onClose();
                handleSelectGender(gender.sexo, gender.id);
              }}
            >
              <Text 
                style={[
                  styles.itemTitle,
                  {color: colors.text}
                ]}
              >
                {gender.sexo}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {!isGender && cities.map(city => (
          <View 
            style={[
              styles.itemContainer,
              {borderBottomColor: colors.separator}
            ]}
            key={city.id}
          >
            <TouchableOpacity 
              style={styles.item}
              onPress={() => {
                onClose();
                handleSelectCity(city.cidade, city.id);
              }}
            >
              <Text 
                style={[
                  styles.itemTitle,
                  {color: colors.text}
                ]}
              >
                {city.cidade}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </Modalize>
      { error && <Text style={styles.errorMessage} testID="selectErrorMessage">{error}</Text>}
    </>
  );
};