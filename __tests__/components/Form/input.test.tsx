import React, { forwardRef, ForwardRefRenderFunction, ReactNode, RefObject, useRef } from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { Input, InputMask } from '../../../src/components/Form';
import CustomButton from '../../../src/components/Button';

import styles from '../../../src/components/Form/styles/input';
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
}

const Unform = forwardRef(UnformRoot);

describe('The input', () => {
  it('must have the same properties passed in the component', () => {
    const formInput = render(
      <Form onSubmit={() => {}}>
        <Input 
          placeholder="Senha"
          icon="lock"
          name="senha"
          maxLength={90}
          returnKeyType="next"
          blurOnSubmit={false}
          isPassword
        />
      </Form>
    );

    expect(formInput.getByTestId('formInput')).toHaveProp('placeholder', 'Senha');

    expect(formInput.container.findByProps({icon: 'lock'})).toHaveProp('icon', 'lock');

    expect(formInput.container.findByProps({name: 'senha'})).toHaveProp('name', 'senha');

    expect(formInput.container.findByProps({isPassword: true})).toHaveProp('isPassword', true);

    expect(formInput.getByTestId('formInput')).toHaveProp('maxLength', 90);

    expect(formInput.getByTestId('formInput')).toHaveProp('returnKeyType', 'next');

    expect(formInput.getByTestId('formInput')).toHaveProp('blurOnSubmit', false);
  });

  it('must have the same style as the parent component', () => {
    const formRef: RefObject<FormHandles> = { current: null };
    const submitMock = jest.fn();

    const { getByTestId } = render(
      <Form ref={formRef} onSubmit={submitMock}>
        <Input 
          placeholder="Senha"
          icon="lock"
          name="senha"
          maxLength={90}
          returnKeyType="next"
          blurOnSubmit={false}
          isPassword
        />
      </Form>
    );

    act(() => {
      formRef.current?.submitForm();
      formRef.current?.setErrors({senha: 'Erro'});
    });

    expect(getByTestId('formInputContainer')).toHaveStyle([
      styles.container,
      {
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'transparent',
        borderWidth: 1
      }
    ]);

    expect(getByTestId('formInput')).toHaveStyle([
      styles.input,
      {color: 'rgb(28, 28, 30)'}
    ]);

    expect(getByTestId('formInputIcon')).toHaveStyle({margin: 10});

    expect(getByTestId('formInputButtonPasswordVisibility')).toHaveStyle({marginRight: 10});

    expect(getByTestId('formInputError')).toHaveStyle(styles.errorMessage);
  });

  it('must send and return the data entered in the input', () => {
    const formRef: RefObject<FormHandles> = { current: null }
    const submitMock = jest.fn()
  
    render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <Input 
          placeholder="Senha"
          icon="lock"
          name="senha"
          maxLength={90}
          returnKeyType="next"
          blurOnSubmit={false}
          isPassword
        />
      </Unform>
    )
  
    formRef.current?.setFieldValue('senha', '12345678')
    formRef.current?.submitForm()
  
    expect(submitMock).toBeCalledWith(
      { senha: '12345678' },
      { reset: expect.any(Function) },
      undefined
    );
  });
});

describe('The input mask', () => {
  it('must have the same properties passed with type cpf in the component', () => {
    const formInputMask = render(
      <Form onSubmit={() => {}}>
        <InputMask 
          type="cpf"
          placeholder="CPF"
          icon="fingerprint"
          name="cpf"
          maxLength={14}
          keyboardType="numeric"
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </Form>
    );

    expect(formInputMask.container.findByProps({type: 'cpf'})).toHaveProp('type', 'cpf');

    expect(formInputMask.getByTestId('formInput')).toHaveProp('placeholder', 'CPF');

    expect(formInputMask.container.findByProps({
      icon: 'fingerprint'
    })).toHaveProp('icon', 'fingerprint');

    expect(formInputMask.container.findByProps({name: 'cpf'})).toHaveProp('name', 'cpf');

    expect(formInputMask.getByTestId('formInput')).toHaveProp('maxLength', 14);

    expect(formInputMask.getByTestId('formInput')).toHaveProp('keyboardType', 'numeric');

    expect(formInputMask.getByTestId('formInput')).toHaveProp('returnKeyType', 'next');

    expect(formInputMask.getByTestId('formInput')).toHaveProp('blurOnSubmit', false);
  });

  it('must have the same properties passed with the cell phone type in the component', () => {
    const formInputMask = render(
      <Form onSubmit={() => {}}>
        <InputMask 
          type="cel-phone"
          placeholder="Número de celular" 
          icon="phone-android" 
          name="celular"
          maxLength={15}
          keyboardType="number-pad"
        />
      </Form>
    );

    expect(formInputMask.container.findByProps({
      type: 'cel-phone'
    })).toHaveProp('type', 'cel-phone');

    expect(formInputMask.getByTestId('formInput')).toHaveProp(
      'placeholder', 'Número de celular'
    );

    expect(formInputMask.container.findByProps({
      icon: 'phone-android'
    })).toHaveProp('icon', 'phone-android');

    expect(formInputMask.container.findByProps({
      name: 'celular'
    })).toHaveProp('name', 'celular');

    expect(formInputMask.getByTestId('formInput')).toHaveProp('maxLength', 15);

    expect(formInputMask.getByTestId('formInput')).toHaveProp('keyboardType', 'number-pad');
  });
});