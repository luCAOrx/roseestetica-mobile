import React, { useRef, useState } from 'react'

import { View, TextInput, Alert } from 'react-native';

import { useNavigation, useRoute, useTheme } from '@react-navigation/native';

import { ScrollView } from 'react-native-gesture-handler';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Header from '../../../components/Header';
import { Input } from '../../../components/Form/index';
import CustomButton from '../../../components/Button';
import SucessScreen from '../../../components/SucessScreen';

import * as Yup from 'yup';

import api from '../../../services/api';

import { AxiosError } from 'axios';

import getValidationErros from '../../../utils/handleErrors';

interface Data {
  foto: string;
  nome: string;
  cpf: string;
  telefone: string;
  celular: string;
  sexo_id: number;
  cidade_id: number;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
};

interface LoginData {
  email: string;
  senha: string;
};

export default function LoginData() {
  const formRef = useRef<FormHandles>(null);
  const passwordRef = useRef<TextInput>(null);

  const {colors} = useTheme();

  const [ sucessMessage, setSucessMessage ] = useState(false);
  const [ isRequested, setIsRequested ] = useState(false);

  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as Data;

  function handleNavigateToSignIn() {
    navigation.navigate("SignIn");
  };
  
  async function handleSubmit(loginData: LoginData) {
    const {
      foto,
      nome, 
      cpf, 
      telefone, 
      celular, 
      sexo_id, 
      cidade_id, 
      bairro, 
      logradouro, 
      numero, 
      complemento, 
      cep 
    } = params;

    const { email, senha } = loginData;

    const threeSeconds = 3000;

    const data = new FormData();

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("O campo e-mail precisa ser um e-mail válido!")
          .max(80, "No máximo 80 caracteres!")
          .required("O campo e-mail é obrigatório!"),
        senha: Yup.string()
          .min(8, "No mínimo 8 caracteres!")
          .max(50, "No máximo 50 caracteres!")
          .required("O campo senha é obrigatório!"),
      });

      await schema.validate(loginData, {
        abortEarly: false
      });

      formRef.current?.setErrors({});

      data.append('foto', {
        name: 'image_mobile.jpg',
        type: 'image/jpeg',
        uri: foto
      } as any);
      data.append('nome', nome); 
      data.append('cpf', cpf); 
      data.append('telefone', telefone); 
      data.append('celular', celular); 
      data.append('sexo_id', String(sexo_id)); 
      data.append('cidade_id', String(cidade_id)); 
      data.append('bairro', bairro); 
      data.append('logradouro', logradouro); 
      data.append('numero', numero); 
      data.append('complemento', complemento); 
      data.append('cep', cep);
      data.append('email', email);
      data.append('senha', senha);

      await api.post('cadastro', data).then(() => {
        setSucessMessage(true);
        
        setTimeout(() => {
          handleNavigateToSignIn();
        }, threeSeconds);
      }).catch((error: AxiosError) => {
        setIsRequested(false);

        const apiErrorMessage = error.response?.data.erro;

        formRef.current?.setErrors(apiErrorMessage);

        Alert.alert('Erro', apiErrorMessage);
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setIsRequested(false);

        const errors = getValidationErros(err);
        
        formRef.current?.setErrors(errors);
      }
    }
  }

  return (
    <View>
      <ScrollView>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Header title="Dados de Login" showIcon showStep position={2} fontSize={26} />
          <View style={{marginTop: 20}} />
          <Input 
            placeholder="E-mail"
            icon="email"
            name="email"
            maxLength={80}
            keyboardType="email-address"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />

          <Input 
            ref={passwordRef}
            placeholder="Senha"
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

          <CustomButton 
            title="Finalizar" 
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
        </Form>
      </ScrollView>
      <SucessScreen title="Cadastro concluído!" show={sucessMessage}/>
    </View>
  );
};