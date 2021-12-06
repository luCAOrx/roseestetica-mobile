import React, { useCallback, useEffect, useRef, useState } from 'react'

import { View, Image, ScrollView, Text, TextInput } from 'react-native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useTheme } from '@react-navigation/native';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { Modalize } from 'react-native-modalize';

import Header from '../../../components/Header';
import { ImagePicker, Input, InputMask } from '../../../components/Form/index';
import CustomButton from '../../../components/Button';
import SucessScreen from '../../../components/SucessScreen';
import Loading from '../../../components/Loading';
import CustomModal, { CustomModalHandles } from '../../../components/CustomModal';

import styles from '../styles/ChangePersonalData';

import { MaterialIcons as Icon } from '@expo/vector-icons';

import { useAuth } from '../../../contexts/auth';

import * as Yup from 'yup';

import api from '../../../services/api';

import { AxiosError } from 'axios';

import getValidationErros from '../../../utils/handleErrors';

interface PersonalData {
  foto: string;
  nome: string;
  telefone: string;
  celular: string;
};

export default function ChangePersonalData() {
  const {cliente, imagem_url, updateProfile, updatePhoto, requestRefreshToken} = useAuth();
  
  const {colors} = useTheme();
  
  const formRef = useRef<FormHandles>(null);
  const phoneNumberInputRef = useRef<TextInput>(null);
  const cellPhoneNumberInputRef = useRef<TextInput>(null);
  const modalizeRef = useRef<Modalize>(null);
  const modalRef = useRef<CustomModalHandles>(null);

  const [ sucessMessage, setSucessMessage ] = useState<Boolean>(false);
  const [ sucessMessagePhoto, setSucessMessagePhoto ] = useState<Boolean>(false);
  const [ isRequested, setIsRequested ] = useState(false);
  const [ isUpdatingImage, setIsUpdatingImage ] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  
  const onClose = () => {
    modalizeRef.current?.close();
  };

  const handleOpenModal = useCallback(() => modalRef.current?.openModal(), []);

  const handleCloseModal = useCallback(() => modalRef.current?.closeModal(), []);

  useEffect(() => {
    formRef.current?.setData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      celular: cliente.celular,
      sexo: cliente.sexo
    });
  }, []);

  async function handleSubmit(personalData: PersonalData) {
    const threeSeconds = 3000;

    const onlyWords = /^([a-zA-Zà-úÀ-Ú]|\s+)+$/;

    const onlyNumbers = /^([0-9]|\s+)+$/;

    const {nome, telefone, celular} = personalData;

    const data = {nome, telefone, celular};

    try {
      const schema = Yup.object().shape({
        nome: Yup.string().strict(true)
          .trim("Não são permitidos espaços no começo ou no fim!")
          .matches(onlyWords, "O campo nome completo só aceita letras!")
          .min(5, "No mínimo 5 caracteres!")
          .max(90, "No máximo 90 caracteres!")
          .required("Campo obrigatório!"),
        telefone: Yup.string().optional().strict(true)
          .trim("Não são permitidos espaços no começo ou no fim!")
          .length(!telefone.length ? 0 : 10, "Deve conter 10 caracteres!"),
        celular: Yup.string().strict(true)
          .trim("Não são permitidos espaços no começo ou no fim!")
          .matches(onlyNumbers, "O campo não aceita letras!")
          .length(11, "Deve conter 11 caracteres!")
          .required("Campo obrigatório!")
      });

      await schema.validate(data, {
        abortEarly: false
      });

      formRef.current?.setErrors({});

      await api.put(`atualizar_dados_pessoais/${cliente.id}`, data).then(response => {
        updateProfile(response.data.cliente);

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

        if (error.response?.status === 500) {
          setIsRequested(false);
        }
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setIsRequested(false);

        const errors = getValidationErros(err);
        
        formRef.current?.setErrors(errors);
      };
    };
  };

  async function handleUpdateImage(personalData: PersonalData) {
    const { foto } = personalData;

    const threeSeconds = 3000;

    const data = new FormData();

    try {
      const schema = Yup.object().shape({
        foto: Yup.string().required('Campo obrigatório.'),
      });

      await schema.validate(personalData, {
        abortEarly: false
      });

      formRef.current?.setErrors({});

      const localUri = foto;
      const filename = localUri.split('/').pop();
    
      const match = /\.(\w+)$/.exec(String(filename));
      const type = match ? `image/${match[1]}` : `image`;

      data.append('foto', {
        name: filename,
        type,
        uri: foto
      } as any);

      await api.patch(`atualizar_foto/${cliente.id}`, data).then(response => {
        updatePhoto(response.data.imagem_url);
        
        onClose();

        setSucessMessagePhoto(true);

        setIsUpdatingImage(false);
        
        setTimeout(() => {
          setSucessMessagePhoto(false);
        }, threeSeconds);
      }).catch(async (error: AxiosError) => {
        const apiErrorMessage = error.response?.data.erro;

        if (error.response?.status === 401) {
          await requestRefreshToken();
          formRef.current?.submitForm();
        }

        if (error.response?.status === 400) {
          setIsUpdatingImage(false);

          handleOpenModal();
          setApiErrorMessage(apiErrorMessage);
        };
        
        if (error.response?.status === 500) {
          setIsUpdatingImage(false);
        };
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setIsUpdatingImage(false);

        const errors = getValidationErros(err);
        
        formRef.current?.setErrors(errors);
      };
    };
  };

  return (
    <>
      <ScrollView style={{flexGrow: 1}}>
        <Form ref={formRef} onSubmit={handleSubmit} initialData={cliente}>
          <Header title="Dados pessoais" showIcon fontSize={26}/>

          <View style={styles.imageProfileContainer}>
            <Image 
              style={styles.imageProfile}
              source={{ uri: imagem_url }}
            />

            <CustomButton 
              title="Alterar foto do perfil" 
              backgroundColor={colors.buttonSecondaryBackground}
              color={colors.buttonText}
              height={35}
              width={170}
              fontSize={15}
              marginBottom={50}
              onPress={onOpen}
            />
          </View>

          <Input 
            placeholder="Nome completo"
            icon="person"
            name="nome"
            maxLength={90}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => phoneNumberInputRef.current?.focus()}
            blurOnSubmit={false}
          />

          <InputMask 
            placeholder="CPF"
            type="cpf"
            icon="fingerprint"
            name="cpf"
            editable={false}
            keyboardType="numeric"
            returnKeyType="next"
          />

          <InputMask 
            ref={phoneNumberInputRef}
            placeholder="Número de Telefone (opcional)"
            type="custom"
            options={{
              mask: '(99) 9999-9999',
              getRawValue: value => value.replace(/[()\s-]/g, '')
            }}
            icon="local-phone" 
            name="telefone"
            keyboardType="number-pad"
            returnKeyType="next"
            maxLength={14}
            onSubmitEditing={() => cellPhoneNumberInputRef.current?.focus()}
            blurOnSubmit={false}
          />
          
          <InputMask 
            ref={cellPhoneNumberInputRef}
            placeholder="Número de celular" 
            type="cel-phone"
            icon="phone-android" 
            name="celular"
            maxLength={15}
            keyboardType="number-pad"
          />

          <Input 
            icon="face" 
            placeholder="Sexo"
            name="sexo"
            editable={false}
          />

          <CustomButton 
            title="Atualizar" 
            backgroundColor={colors.buttonPrimaryBackground}
            color={colors.buttonText}
            height={50}
            fontSize={18}
            isRequested={isRequested}
            onPress={() => {
              formRef.current?.submitForm();

              setIsRequested(true);
            }} 
          />
        </Form>
      </ScrollView>  
      <Modalize 
        ref={modalizeRef}
        snapPoint={300}
        modalHeight={300}
        modalStyle={[
          styles.modal,
          {backgroundColor: colors.background}
        ]}
        withHandle={false}
        HeaderComponent={
          <View style={styles.headerModalContainer}>
            <TouchableOpacity onPress={onClose}>
              <Icon name='close' size={30} color="#ff669d"/>
            </TouchableOpacity>

            <Text 
              style={[
                styles.title,
                {color: colors.text}
              ]}
            >
              Alterar foto do perfil
            </Text>

            <TouchableOpacity 
              onPress={() => {
                formRef.current?.submitForm()

                setIsUpdatingImage(true);
              }}
            >
              {isUpdatingImage ? 
                <Loading /> : 
                <Icon name='done' size={30} color="#34CB79"/>
              }
            </TouchableOpacity>
          </View>
        }
      >
        <Form ref={formRef} onSubmit={handleUpdateImage}>
          <ImagePicker name="foto" />
        </Form>
      </Modalize>
      <SucessScreen title="Foto do perfil atualizada" show={sucessMessagePhoto}/>
      <SucessScreen title="Dados pessoais atualizados" show={sucessMessage}/>
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