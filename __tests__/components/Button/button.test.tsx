import React from 'react';

import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import CustomButton from '../../../src/components/Button';

import styles from '../../../src/components/Button/styles';

describe('The button', () => {
  it('must have the same text as the property passed', () => {
    const button = render(
      <CustomButton 
        title='Press here'
        backgroundColor='#29214e'
        color='#d2d2e3'
        fontSize={15}
        height={50}
        width={50}
      />
    );
  
    expect(button.getByTestId('text')).toHaveTextContent('Press here');

    expect(button.container.findByProps({
      backgroundColor: '#29214e'
    })).toHaveProp('backgroundColor', '#29214e');

    expect(button.container.findByProps({
      color: '#d2d2e3'
    })).toHaveProp('color', '#d2d2e3');

    expect(button.container.findByProps({fontSize: 15})).toHaveProp('fontSize', 15);

    expect(button.container.findByProps({height: 50})).toHaveProp('height', 50);

    expect(button.container.findByProps({width: 50})).toHaveProp('width', 50);
  });

  it('must have the default style and the property', () => {
    const {getByTestId} = render(
      <CustomButton 
        title='Press here'
        backgroundColor='#29214e'
        color='#d2d2e3'
        fontSize={15}
        height={50}
        width={50}
        marginBottom={50}
      />
    );
  
    expect(getByTestId('button')).toHaveStyle([
      styles.container,
      {
        height: 50,
        width: 50,
        marginBottom: 50,
        backgroundColor: '#29214e'
      }
    ]);

    expect(getByTestId('text')).toHaveStyle([
      styles.title,
      {
        fontSize: 15,
        color: '#d2d2e3'
      }
    ]);
  });
});