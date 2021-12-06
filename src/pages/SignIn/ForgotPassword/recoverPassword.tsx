import React, { useRef, useState } from 'react';

import { Text, ScrollView, View, TextInput } from 'react-native';

import styles from '../styles/recoverPassword';

import { useNavigation, useTheme } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Header from '../../../components/Header';
import { Input } from '../../../components/Form';
import CustomButton from '../../../components/Button';
import SucessScreen from '../../../components/SucessScreen';

import * as Yup from 'yup';

import api from '../../../services/api';

import { AxiosError } from 'axios';

import getValidationErros from '../../../utils/handleErrors';

interface ForgotPassword {
  email: string;
  token: string;
  senha: string;
};

export default function RecoverPassword() {
  const [ sucessMessage, setSucessMessage ] = useState<Boolean>(false);
  const [ isRequested, setIsRequested ] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const tokenInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const {colors} = useTheme();

  const navigation = useNavigation<any>();

  function handleNavigateToSignIn() {
    navigation.navigate("SignIn");
  };

  async function handleSubmit(forgotPassword: ForgotPassword) {
    const threeSeconds = 3000;

    const { email, token, senha } = forgotPassword;

    const data = { email, token, senha };

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("O campo e-mail precisa ser um e-mail válido!")
          .max(80, "No máximo 80 caracteres!")
          .required("O campo email é obrigatório!"),
        token: Yup.string().required("O campo código é obrigatório"),
        senha: Yup.string()
          .min(8, "No mínimo 8 caracteres!")
          .max(50, "No máximo 50 caracteres!")
          .required("O campo senha é obrigatório!"),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      formRef.current?.setErrors({});

      await api.put('atualizar_senha', data).then(() => {
        setSucessMessage(true);
        
        setTimeout(() => {
          handleNavigateToSignIn();
        }, threeSeconds);
      }).catch((error: AxiosError) => {
        setIsRequested(false);

        const apiEmailErrorMessage = error.response?.data.EmailError;
        const apiTokenErrorMessage = error.response?.data.TokenError;

        formRef.current?.setFieldError("email", apiEmailErrorMessage);
        formRef.current?.setFieldError("token", apiTokenErrorMessage);
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setIsRequested(false);

        const errors = getValidationErros(err);
        
        formRef.current?.setErrors(errors);
      };
    };
  };

  return ( 
    <>
      <ScrollView>
        <Header title="Recuperar Senha" showIcon fontSize={26} />
        <View 
          style={[
            styles.noticeContainer,
            {backgroundColor: colors.card}
          ]}
        >
          <View style={styles.title}>
            <MaterialIcons name="new-releases" size={20} color="#FD5151" />
            <Text style={{marginLeft: 5, color: "#FD5151"}}>ATENÇÃO</Text>
          </View>
    
          <Text 
            style={[
              styles.text,
              {color: colors.text}
            ]} 
          >
            Foi enviado ao seu e-mail cadastrado um código para recuperar sua senha, cheque sua caixa de entrada ou span, copie o código e depois cole-o no campo código.
          </Text>
        </View>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input 
            placeholder="E-mail"
            icon="email"
            name="email"
            maxLength={80}
            keyboardType="email-address"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => tokenInputRef.current?.focus()}
            blurOnSubmit={false}
          />
          
          <Input 
            ref={tokenInputRef}
            placeholder="Código"
            icon="vpn-key"
            name="token"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={false}
          />
    
          <Input 
            ref={passwordInputRef}
            placeholder="Sua nova senha"
            icon="lock"
            name="senha"
            maxLength={50}
            isPassword
            returnKeyType="send"
            onSubmitEditing={() => {
              setIsRequested(true);

              formRef.current?.submitForm();
            }}
          />
        </Form>
    
        
        <CustomButton 
          title="Recuperar senha"
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
      <SucessScreen title="Senha recuperada!" show={sucessMessage}/>
    </>
  );
};