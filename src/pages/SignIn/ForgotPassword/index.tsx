import React, { useRef, useState } from 'react';

import { ScrollView } from 'react-native';

import { useNavigation, useTheme } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { Input } from '../../../components/Form';
import CustomButton from '../../../components/Button';

import * as Yup from 'yup';

import api from '../../../services/api';

import { AxiosError } from 'axios';

import getValidationErros from '../../../utils/handleErrors';

interface Credentials {
  email: string;
};

export default function ForgotMyPassword() {
  const [ isRequested, setIsRequested ] = useState(false);

  const {colors} = useTheme();

  const formRef = useRef<FormHandles>(null);

  const navigation = useNavigation<any>();

  function handleNavigateToRecoverPassword() {
    navigation.navigate("RecoverPassword");
  };

  async function handleSubmit(credentials: Credentials) {
    const { email } = credentials;

    const data = { email };

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("O campo e-mail precisa ser um e-mail válido!")
          .max(80, "No máximo 80 caracteres!")
          .required("O campo email é obrigatório!")
      });

      await schema.validate(credentials, {
        abortEarly: false
      });

      formRef.current?.setErrors({});

      await api.post('esqueci_minha_senha', data).then(() => {
        handleNavigateToRecoverPassword();
      }).catch((error: AxiosError) => {
        setIsRequested(false);

        const apiErrorMessage = error.response?.data.erro;

        formRef.current?.setFieldError("email", apiErrorMessage);
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErros(err);
        
        formRef.current?.setErrors(errors);

        setIsRequested(false);
      };
    };
  };

  return (

    <ScrollView>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input 
          placeholder="E-mail"
          icon="email"
          name="email"
          maxLength={80}
          keyboardType="email-address"
          autoCapitalize="words"
          returnKeyType="next"
          textContentType="emailAddress"
          onSubmitEditing={() => {
            setIsRequested(true);

            formRef.current?.submitForm();
          }}
        />
      </Form>

      <CustomButton 
        title="Próximo" 
        backgroundColor={colors.buttonPrimaryBackground}
        color={colors.buttonText}
        height={50}
        fontSize={18}
        isRequested={isRequested}
        onPress={() => {
          setIsRequested(true);

          formRef.current?.submitForm();
        }}
      />
    </ScrollView>
  );
};