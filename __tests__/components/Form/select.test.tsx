import React, { forwardRef, ForwardRefRenderFunction, ReactNode, RefObject } from 'react';

import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { Select } from '../../../src/components/Form';

import styles from '../../../src/components/Form/styles/select';
import { act } from 'react-test-renderer';

interface UnformProps {
  onSubmit(): void
  children?: ReactNode
  initialData?: Record<string, unknown>
};

const UnformRoot: ForwardRefRenderFunction<FormHandles, UnformProps> = (
  { children, onSubmit, ...rest },
  ref
) => {
  const mock = jest.fn()

  return (
    <Form ref={ref} onSubmit={onSubmit || mock} {...rest}>
      {children}
    </Form>
  );
};

const Unform = forwardRef(UnformRoot);

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.useFakeTimers();

describe('The select input', () => {
  it('must have the same properties passed in the component', () => {
    const selectInput = render(
      <Form onSubmit={() => {}}>
        <Select 
          icon="face" 
          name="sexo_id"
          placeholder="Sexo"
          modalHeight={140} 
          snapPoint={155}
          isGender
        />
      </Form>
    );

    expect(selectInput.container.findByProps({icon: 'face'})).toHaveProp('icon', 'face');

    expect(selectInput.container.findByProps({name: 'sexo_id'})).toHaveProp('name', 'sexo_id');

    expect(selectInput.container.findByProps({
      placeholder: 'Sexo'
    })).toHaveProp('placeholder', 'Sexo');

    expect(selectInput.container.findByProps({
      modalHeight: 140
    })).toHaveProp('modalHeight', 140);

    expect(selectInput.container.findByProps({snapPoint: 155})).toHaveProp('snapPoint', 155);

    expect(selectInput.container.findByProps({isGender: true})).toHaveProp('isGender', true);
  });

  it('must have the same style as the parent component', () => {
    const formRef: RefObject<FormHandles> = { current: null };
    const submitMock = jest.fn();

    const {getByTestId} = render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <Select 
          icon="face" 
          name="sexo_id"
          placeholder="Sexo"
          modalHeight={140} 
          snapPoint={155}
          isGender
        />
      </Unform>
    );

    act(() => {
      formRef.current?.submitForm();
      formRef.current?.setErrors({sexo_id: 'Erro'});
    });

    expect(getByTestId('selectButtonContainer')).toHaveStyle([
      styles.container,
      {backgroundColor: 'rgb(255, 255, 255)'}
    ]);

    expect(getByTestId('selectPrimaryIcon')).toHaveStyle({margin: 10});

    expect(getByTestId('selectPlaceholderGender')).toHaveStyle([
      styles.placeholder,
      {color: 'rgb(0, 122, 255)'}
    ]);

    expect(getByTestId('selectPlaceholderGender')).toHaveStyle([
      styles.selected,
      {color: 'rgb(0, 122, 255)'}
    ]);

    expect(getByTestId('selectSecondaryIcon')).toHaveStyle({margin: 10});

    expect(getByTestId('selectErrorMessage')).toHaveStyle(styles.errorMessage);
  });

  it('must send and return the data entered in the input', () => {
    const formRef: RefObject<FormHandles> = { current: null };
    const submitMock = jest.fn();
    
    render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <Select 
          icon="face" 
          name="sexo_id"
          placeholder="Sexo"
          modalHeight={140} 
          snapPoint={155}
          isGender
        />
      </Unform>
    );

    formRef.current?.setFieldValue('sexo_id', undefined);
    formRef.current?.submitForm();

    expect(submitMock).toBeCalledWith(
      { sexo_id: undefined},
      { reset: expect.any(Function) },
      undefined
    );
  });
});