import React from 'react';

import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import SucessScreen from '../../../src/components/SucessScreen';
import styles from '../../../src/components/SucessScreen/styles';

describe('The sucess screen', () => {
  it('must have the same style and properties defined in the component.', () => {
    const sucessScreen = render(<SucessScreen title="Teste" show/>);

    expect(sucessScreen.container.findByProps({show: true})).toHaveProp('show', true);

    expect(sucessScreen.getByTestId('sucessScreenContainer')).toHaveStyle(styles.container);

    expect(sucessScreen.getByTestId('sucessScreenTitle')).toHaveStyle(styles.text);

    expect(sucessScreen.getByTestId('sucessScreenTitle')).toHaveTextContent('Teste');
  });
});