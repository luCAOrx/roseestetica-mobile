import React, { useEffect, useRef, useState } from 'react';

import { 
  Alert,
  Animated, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TextInput, 
  View 
} from 'react-native';

import styles from './styles/signin';

import { useNavigation, useTheme } from '@react-navigation/native';

import logoDarkTheme from '../../images/logo-dark-theme.png';

import logoLightTheme from '../../images/logo-light-theme.png';

import { Input } from '../../components/Form/index';
import CustomButton from '../../components/Button';

import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useAuth } from '../../contexts/auth';

import getValidationErros from '../../utils/handleErrors';

interface SignInData {
  email: string;
  senha: string;
};

export default function Login() {
  const formRef = useRef<FormHandles>(null);
  const passwordRef = useRef<TextInput>(null);

  const {colors, dark} = useTheme();

  const {signIn} = useAuth();
  
  const navigation = useNavigation<any>();

  const [ isRequested, setIsRequested] = useState(false);

  const [logo] = useState(new Animated.ValueXY({
    x: 350, y: 55
  }));

  function handleNavigateToRegister() {
    navigation.navigate("Register");
  };

  function handleNavigateToForgotPassword() {
    navigation.navigate("ForgotPassword");
  };

  async function handleSignIn(signInData: SignInData) {
    const {email, senha} = signInData;

    const data = {email, senha};

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

      await schema.validate(data, {
        abortEarly: false
      });

      formRef.current?.setErrors({});

      await signIn(data).catch(error => {
        const apiErrorMessage = error.response?.data.erro;

        if (error.response?.status === 400) {
          Alert.alert('Erro', apiErrorMessage);
          
          setIsRequested(false);
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

  function keyboardDidShow() {
    Animated.parallel([
      Animated.timing(logo.x, {
        useNativeDriver: false,
        toValue: 240,
        duration: 100
      }),
      Animated.timing(logo.y, {
        useNativeDriver: false,
        toValue: 30,
        duration: 100
      }),
    ]).start();
  }

  function keyboardDidHide() {
    Animated.parallel([
      Animated.timing(logo.x, {
        useNativeDriver: false,
        toValue: 340,
        duration: 100
      }),
      Animated.timing(logo.y, {
        useNativeDriver: false,
        toValue: 55,
        duration: 100
      }),
    ]).start();
  }

  useEffect(() => {
    Keyboard.addListener(
      'keyboardDidShow', keyboardDidShow
    );

    Keyboard.addListener(
      'keyboardDidHide', keyboardDidHide
    );
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardDismissMode="interactive">
        <View style={styles.logo}>
          <Animated.Image 
            style={{
              height: logo.y, 
              width: logo.x,
            }} 
            source={dark ? logoDarkTheme : logoLightTheme} 
          />
        </View>
        <Form ref={formRef} onSubmit={handleSignIn}>
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
            title="Entrar" 
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

        <CustomButton 
          title="Criar uma conta" 
          backgroundColor="transparent"
          color={colors.text}
          height={50}
          fontSize={15}
          onPress={handleNavigateToRegister}
        />

        <CustomButton 
          title="Esqueci minha senha" 
          backgroundColor="transparent"
          color={colors.text}
          height={50}
          fontSize={15}
          onPress={handleNavigateToForgotPassword}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};