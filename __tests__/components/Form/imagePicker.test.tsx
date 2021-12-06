import React, { forwardRef, ForwardRefRenderFunction, ReactNode, RefObject } from 'react';

import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { ImagePicker } from '../../../src/components/Form';

import styles from '../../../src/components/Form/styles/imagePicker';
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

describe('The image picker', () => {
  it('must have the same property passed in the component', () => {
    const imagePicker = render(
      <Form onSubmit={() => {}}>
        <ImagePicker name="foto" />
      </Form>
    );

    expect(imagePicker.container.findByProps({name: 'foto'})).toHaveProp('name', 'foto');
  });

  it('must have the same styles as the parent component', () => {
    const formRef: RefObject<FormHandles> = { current: null };
    const submitMock = jest.fn();
    
    const {getByTestId} = render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <ImagePicker name="foto"/>
      </Unform>
    );

    act(() => {
      formRef.current?.submitForm();
      formRef.current?.setErrors({foto: 'Erro'});
    });

    expect(getByTestId('imageInputContainer')).toHaveStyle(styles.imageInputContainer);

    expect(getByTestId('imageInputButton')).toHaveStyle([
      styles.imageInput,
      {
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(0, 122, 255)'
      }
    ]);

    expect(getByTestId('imageInputText')).toHaveStyle([
      styles.imageInputText,
      {color: 'rgb(0, 122, 255)'}
    ]);

    expect(getByTestId('imagePickerErrorMessage')).toHaveStyle(styles.errorMessage);
  });

  it('must send and return the data entered in the input', () => {
    const formRef: RefObject<FormHandles> = { current: null };
    const submitMock = jest.fn();
  
    render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <ImagePicker name="foto"/>
      </Unform>
    );
  
    formRef.current?.setFieldValue('foto', '');
    formRef.current?.submitForm();
      
    expect(submitMock).toBeCalledWith(
      { foto: '' },
      { reset: expect.any(Function) },
      undefined
    );
  });
});