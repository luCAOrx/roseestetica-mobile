import React, { useEffect, useRef } from 'react';

import '../../config/locale';

import { Text } from 'react-native';

import styles from './styles/selectDate';

import { MaterialIcons as Icon } from '@expo/vector-icons';

import { Calendar } from 'react-native-calendars';
import { DateData } from 'react-native-calendars/src/types';

import { useField } from '@unform/core';
import { useTheme } from '@react-navigation/native';

interface SelectDateProps {
  name: string;
  selectedDay: string;
  onDayPress(day: DateData): void;
};

export default function SelectDate({name, selectedDay, onDayPress}: SelectDateProps) {
  const { fieldName, registerField, error } = useField(name);

  const {colors} = useTheme();

  const selectDateRef = useRef(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectDateRef.current,
      getValue() {
        return selectedDay
      }
    });
  }, [fieldName, selectedDay, registerField]);

  return (
    <>
      <Calendar 
        ref={selectDateRef}
        theme={{
          calendarBackground: colors.background,
          dayTextColor: colors.text,
          textDisabledColor: colors.border,
          arrowColor: colors.text,
          textSectionTitleColor: colors.text,
          monthTextColor: colors.text,
          textMonthFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
          selectedDayTextColor: colors.background
        }}
        onDayPress={onDayPress}
        renderArrow={(direction = "right" ) => (
          <>
            {direction === "right" &&
              <Icon 
                name="navigate-next" 
                color={colors.text}
                size={25} 
              />
            }
          </>
        )}
        markedDates={{
          [selectedDay]: {selected: true, selectedColor: colors.text}
        }}
        // hideArrows={true}
        // disableMonthChange={true}
        firstDay={7}
      />
      { error && <Text style={styles.errorMessage} testID="selectDateError">{error}</Text>}
    </>
  );
};