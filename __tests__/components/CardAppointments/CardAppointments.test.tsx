import React from 'react';

import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import dayjs from 'dayjs';

import CardAppointments from '../../../src/components/CardAppointments';

import styles from '../../../src/components/CardAppointments/styles';

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

describe('The appointments card', () => {
  it('must have the default style and the property', () => {
    const {getByTestId} = render(
      <CardAppointments 
        text='seg 08 de set de 2021 ás 08:00h' 
        agendamento_id={1} 
        id={1} 
        data='08-09-2021'
      />
    );

    const dataDeAgora = dayjs().format('YYYY/MM/DD');

    expect(getByTestId('card')).toHaveStyle([
      styles.card,
      {
        backgroundColor: 'rgb(255, 255, 255)',
        height: dayjs('08-09-2021').isBefore(dayjs(dataDeAgora)) ? 160 : 400
      }
    ]);
  });

  it('must have the same text as the property passed', () => {
    const cardAppointments = render(
      <CardAppointments 
        text='seg 08 de set de 2021 ás 08:00h' 
        agendamento_id={1} 
        id={1} 
        data='08-09-2021'
      />
    );

    expect(cardAppointments.getByTestId('text-card')).toHaveTextContent('seg 08 de set de 2021 ás 08:00h');

    expect(cardAppointments.container.findByProps({
      agendamento_id: 1
    })).toHaveProp('agendamento_id', 1);
    
    expect(cardAppointments.container.findByProps({id: 1})).toHaveProp('id', 1);
  });
});