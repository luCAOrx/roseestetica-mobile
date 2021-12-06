import React, { createContext, useContext, useEffect, useState } from 'react';

import * as SecureStore from 'expo-secure-store';

import { Alert } from 'react-native';

import api from '../services/api';

import { Axios, AxiosError } from 'axios';

import dayjs from 'dayjs';

interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  celular: string;
  sexo: string;
  cidade: string;
  cidade_id: number;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
  email: string;
  senha: string;
};

interface AuthState {
  cliente: Cliente;
  imagem_url: string;
  token: string;
  refreshToken: {
    id: string;
    espira_em: number;
  }
};

interface AuthContextData {
  cliente: Cliente;
  imagem_url: string;
  signIn(credentials: SignInCredentials): Promise<void>;
  requestRefreshToken(): Promise<void>;
  updateProfile(cliente: Cliente): Promise<void>;
  updatePhoto(imagem_url: string): Promise<void>;
  signOut(): void;
};

interface SignInCredentials {
  email: string;
  senha: string;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStoragedData() {
      const cliente = await SecureStore.getItemAsync('cliente');

      const imagem_url = await SecureStore.getItemAsync('imagem_url');

      const refreshToken = await SecureStore.getItemAsync('refresh_token');

      const token = await SecureStore.getItemAsync('token');

      if (cliente && imagem_url && refreshToken  && token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setData({
          cliente: JSON.parse(cliente),
          imagem_url,
          refreshToken: JSON.parse(refreshToken),
          token
        });
      };
    };

    loadStoragedData();
  }, []);

  async function signIn(credentials: SignInCredentials) {
    const { email, senha } = credentials;

    await api.post('login', {email, senha}).then(async (response) => {
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      await SecureStore.setItemAsync('cliente', JSON.stringify(response.data.cliente));
      await SecureStore.setItemAsync('imagem_url', response.data.imagem_url);
      await SecureStore.setItemAsync('refresh_token', JSON.stringify(response.data.refreshToken));
      await SecureStore.setItemAsync('token', response.data.token);

      setData({
        cliente: response.data.cliente,
        imagem_url: response.data.imagem_url,
        token: response.data.token,
        refreshToken: {
          id: response.data.refreshToken.id,
          espira_em: response.data.refreshToken.espira_em
        }
      });      
    });
  };

  async function requestRefreshToken() {
    const { id, espira_em } = data.refreshToken;

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(espira_em)
    );

    if (refreshTokenExpired) {

      await api.post('refresh_token', {refresh_token: id}).then(async response => {
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('token');
  
        await SecureStore.setItemAsync('refresh_token', JSON.stringify(response.data.refreshToken));
        await SecureStore.setItemAsync('token', response.data.token);
        
        setData({
          cliente: data.cliente,
          imagem_url: data.imagem_url,
          token: response.data.token,
          refreshToken: {
            id: response.data.refreshToken.id,
            espira_em: response.data.refreshToken.espira_em
          }
        });
  
      }).catch((error: AxiosError) => {
        Alert.alert('Erro', error.response?.data);
  
        signOut();
      });
    }
  };
  
  async function updateProfile(cliente: Cliente) {
    await SecureStore.setItemAsync('cliente', JSON.stringify(cliente));

    setData({ 
      cliente, 
      imagem_url: data.imagem_url,
      token: data.token, 
      refreshToken: data.refreshToken 
    });
  };

  async function updatePhoto(imagem_url: string) {
    await SecureStore.setItemAsync('imagem_url', imagem_url);

    setData({ 
      cliente: data.cliente, 
      imagem_url,
      token: data.token, 
      refreshToken: data.refreshToken 
    });
  };

  async function signOut() {
    await SecureStore.deleteItemAsync('cliente');
    await SecureStore.deleteItemAsync('imagem_url');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('token');

    setData({} as AuthState);
  };

  return (
    <AuthContext.Provider 
      value={{
        cliente: data.cliente, 
        imagem_url: data.imagem_url,
        signIn, 
        requestRefreshToken,
        updateProfile,
        updatePhoto,
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
};