import React from 'react';

import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import Loading from '../../../src/components/Loading';

describe('The loading', () => {
  it('must have the same style and properties defined in the component', () => {
    const {getByTestId} = render(<Loading />);

    expect(getByTestId('loading')).toHaveStyle({ 
      justifyContent: 'center', 
      alignItems: 'center' 
    });

    expect(getByTestId('loading')).toHaveProp('size', 'large');
    expect(getByTestId('loading')).toHaveProp('color', '#333');
    expect(getByTestId('loading')).toHaveProp('animating', true);
  });
});