import React, { forwardRef, ForwardRefRenderFunction, ReactNode, RefObject } from 'react';

import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

import { act } from 'react-test-renderer';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { SelectHour } from '../../../src/components/Form';

import styles from '../../../src/components/Form/styles/selectHour';

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

describe('The select hour', () => {
  it('must have the same properties passed in the component', () => {
    const available = ['ocupado'];
    const availableTime = ['08:00'];

    const selectHour = render(
      <Form onSubmit={() => {}}>
        <SelectHour
          name="horario_id"
          available={available}
          availableTime={availableTime}
          selectedDay="2021-09-23" 
        />
      </Form>
    );

    expect(selectHour.container.findByProps({
      name: 'horario_id'
    })).toHaveProp('name', 'horario_id');

    expect(selectHour.container.findByProps({
      available
    })).toHaveProp('available', available);

    expect(selectHour.container.findByProps({
      availableTime
    })).toHaveProp('availableTime', availableTime);

    expect(selectHour.container.findByProps({
      selectedDay: '2021-09-23'
    })).toHaveProp('selectedDay', '2021-09-23');
  });

  it('must have the same style as the parent component', () => {
    const available = ['ocupado'];
    const availableTime = ['08:00'];
    const formRef: RefObject<FormHandles> = { current: null };
    const submitMock = jest.fn();

    const { getByTestId } = render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <SelectHour
          name="horario_id"
          available={available}
          availableTime={availableTime}
          selectedDay="2021-09-23" 
        />
      </Unform>
    );

    act(() => {
      formRef.current?.setFieldError('horario_id', 'Erro');
      formRef.current?.submitForm();
    });

    expect(getByTestId('selectHourError')).toHaveStyle(styles.errorMessage);
  });

  it('must send and return the data entered in the input', () => {
    const available = ['ocupado'];
    const availableTime = ['08:00'];
    const formRef: RefObject<FormHandles> = { current: null };
    const submitMock = jest.fn();

    render(
      <Unform ref={formRef} onSubmit={submitMock}>
        <SelectHour
          name="horario_id"
          available={available}
          availableTime={availableTime}
          selectedDay="2021-09-23" 
        />
      </Unform>
    ); 

    formRef.current?.setFieldValue('horario_id', []);
    formRef.current?.submitForm();
  
    expect(submitMock).toBeCalledWith(
      { horario_id: [] },
      { reset: expect.any(Function) },
      undefined
    );
  });
});