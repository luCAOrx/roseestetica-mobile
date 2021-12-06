import React, { useCallback, useEffect, useRef, useState } from 'react'

import { ScrollView, TextInput } from 'react-native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Header from '../../../components/Header';
import { Input, InputMask, Select } from '../../../components/Form/index';
import CustomButton from '../../../components/Button';
import SucessScreen from '../../../components/SucessScreen';
import CustomModal, { CustomModalHandles } from '../../../components/CustomModal';

import { useAuth } from '../../../contexts/auth';

import * as Yup from 'yup';

import api from '../../../services/api';

import { AxiosError } from 'axios';

import getValidationErros from '../../../utils/handleErrors';

import { useTheme } from '@react-navigation/native';

interface AdressData {
  cidade_id: number;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
};

export default function ChangeAddress() {
  const {cliente, updateProfile, requestRefreshToken} = useAuth();

  const {colors} = useTheme();

  const formRef = useRef<FormHandles>(null);
  const streetRef = useRef<TextInput>(null);
  const numberRef = useRef<TextInput>(null);
  const complementRef = useRef<TextInput>(null);
  const cepRef = useRef<TextInput>(null);
  const modalRef = useRef<CustomModalHandles>(null);

  const [ sucessMessage, setSucessMessage ] = useState(false);
  const [ isRequested, setIsRequested ] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const handleOpenModal = useCallback(() => modalRef.current?.openModal(), []);

  const handleCloseModal = useCallback(() => modalRef.current?.closeModal(), []);

  useEffect(() => {
    formRef.current?.setData({
      cidade_id: cliente.cidade,
      bairro: cliente.bairro,
      logradouro: cliente.logradouro,
      numero: cliente.numero,
      complemento: cliente.complemento,
      cep: cliente.cep
    });    
  }, []);

  async function handleSubmit(adressData: AdressData) {
    const threeSeconds = 3000;

    const regexLetras = /^([a-zA-Zà-úÀ-Ú]|\s+)+$/;

    const regexNumeros = /^([0-9]|\s+)+$/;

    const {
      cidade_id,
      bairro,
      logradouro,
      numero,
      complemento,
      cep
    } = adressData;

    const data = {
      cidade_id,
      bairro,
      logradouro,
      numero,
      complemento,
      cep
    };

    try {
      const schema = Yup.object().shape({
        cidade_id: Yup.number().required("O campo cidade é obrigatório!"),
        bairro: Yup.string().strict(true)
          .trim("Não são permitidos espaços no começo ou no fim!")
          .matches(regexLetras, "O campo não aceita números!")
          .min(3, "No mínimo 3 caracteres!")
          .max(90, "No máximo 90 caracteres!")
          .required("O campo é obrigatório!"),
        logradouro: Yup.string().strict(true)
          .trim("Não são permitidos espaços no começo ou no fim!")
          .matches(regexLetras, "O campo não aceita números!")
          .min(5, "No mínimo 5 caracteres!")
          .max(90, "No máximo 90 caracteres!")
          .required("O campo é obrigatório!"),
        numero: Yup.string().strict(true)
          .trim("Não são permitidos espaços no começo ou no fim!")
          .min(1, "No mínimo 1 caractere!")
          .max(6, "No máximo 6 caracteres!")
          .required("O campo é obrigatório!"),
        complemento: Yup.string().optional().strict(true)
          .trim("Não são permitidos espaços no começo ou no fim!")
          .max(90, "No máximo 90 caracteres!"),
        cep: Yup.string()
          .min(8, "No mínimo 8 caracteres!")
          .max(8, "No máximo 8 caracteres!")
          .required("O campo é obrigatório!"),
      });

      await schema.validate(adressData, {
        abortEarly: false
      });

      formRef.current?.setErrors({});

      await api.put(`atualizar_endereco/${cliente?.id}`, data).then(response => {
        updateProfile(response.data.cliente)

        setSucessMessage(true);
        
        setTimeout(() => {  
          setSucessMessage(false);
        }, threeSeconds);

        setIsRequested(false);
      }).catch(async (error: AxiosError) => {
        const apiErrorMessage = error.response?.data.erro;

        if (error.response?.status === 401) {
          await requestRefreshToken();
          formRef.current?.submitForm();
        };

        if (error.response?.status === 400) {
          setIsRequested(false);

          handleOpenModal();
          setApiErrorMessage(apiErrorMessage);
        };
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
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Form 
          style={{flexGrow: 1}} 
          ref={formRef} 
          initialData={cliente} 
          onSubmit={handleSubmit}
        >
          <Header title="Endereço" showIcon fontSize={26}/>
          <Select 
            icon="location-city" 
            placeholder={cliente.cidade}
            placeholderTextColor={colors.text}
            name="cidade_id"
            value={cliente.cidade_id}
            modalHeight={330} 
            snapPoint={390}
            isGender={false}
          />

          <Input 
            placeholder="Bairro"
            icon="map"
            name="bairro"
            maxLength={90}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => streetRef.current?.focus()}
            blurOnSubmit={false}
          />

          <Input 
            ref={streetRef}
            placeholder="Logradouro"
            icon="home"
            name="logradouro"
            maxLength={90}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => numberRef.current?.focus()}
            blurOnSubmit={false}
          />

          <InputMask 
            ref={numberRef}
            type="only-numbers"
            placeholder="Número" 
            icon="looks-5"
            name="numero"
            maxLength={6}
            keyboardType="numeric" 
            returnKeyType="next"
            onSubmitEditing={() => complementRef.current?.focus()}
            blurOnSubmit={false}
          />

          <Input 
            ref={complementRef}
            placeholder="Complemento (opcional)" 
            icon="domain" 
            name="complemento"
            maxLength={90}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => cepRef.current?.focus()}
            blurOnSubmit={false}
          />
          
          <InputMask 
            ref={cepRef}
            type="zip-code"
            placeholder="CEP" 
            icon="place" 
            name="cep"
            keyboardType="number-pad"
            returnKeyType="send"
            maxLength={9}
            onSubmitEditing={() => {
              setIsRequested(true);
              
              formRef.current?.submitForm();
            }}
          />

          <CustomButton 
            title="Atualizar" 
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
      <SucessScreen title="Endereço atualizado!" show={sucessMessage}/>
      <CustomModal 
        ref={modalRef} 
        title="Erro" 
        message={apiErrorMessage}
        primaryButtonText="Ok"
        onPress={handleCloseModal}
        showCancel={false}
      />
    </>
  );
};