import React, { forwardRef, ForwardRefRenderFunction, ReactNode, RefObject } from 'react';

import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import { act } from 'react-test-renderer';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { SelectDate } from '../../../src/components/Form';

import styles from '../../../src/components/Form/styles/selectDate';

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

describe('The select date input', () => {
  it('must have the same properties passed in the component', () => {
    const onDayPress = jest.fn();

    const selectDate = render(
      <Form onSubmit={() => {}}>
        <SelectDate 
          name="data" 
          selectedDay="2021-09-23" 
          onDayPress={onDayPress}
        />
      </Form>
    );

    expect(selectDate.container.findByProps({name: 'data'})).toHaveProp('name', 'data');

    expect(selectDate.container.findByProps({
      selectedDay: '2021-09-23'
    })).toHaveProp('selectedDay', '2021-09-23');

    expect(selectDate.container.findByProps({
      onDayPress: onDayPress
    })).toHaveProp('onDayPress', onDayPress);
  });

  it('must send and return the data entered in the input', () => {
    const formRef: RefObject<FormHandles> = { current: null }
    const onDayPress = jest.fn();
    const submitMock = jest.fn();

    render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <SelectDate 
          name="data" 
          selectedDay="2021-09-23" 
          onDayPress={onDayPress}
        />
      </Unform>
    );

    formRef.current?.setFieldValue('data', '2021-09-23');
    formRef.current?.submitForm();
  
    expect(submitMock).toBeCalledWith(
      { data: '2021-09-23' },
      { reset: expect.any(Function) },
      undefined
    );
  });

  it('should return error and style should be the same as the parent component', () => {
    const formRef: RefObject<FormHandles> = { current: null }
    const onDayPress = jest.fn();
    const submitMock = jest.fn();

    const {getByTestId} = render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <SelectDate 
          name="data" 
          selectedDay="2021-09-23" 
          onDayPress={onDayPress}
        />
      </Unform>
    );

    act(() => {
      formRef.current?.setFieldError('data', 'Erro');
      formRef.current?.submitForm();
    });
  
    expect(getByTestId('selectDateError')).toHaveStyle(styles.errorMessage);
  });
});