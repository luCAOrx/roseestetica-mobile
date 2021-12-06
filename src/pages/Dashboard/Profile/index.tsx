import React, { useCallback, useContext, useRef, useState } from 'react';

import {  
  Image, 
  Switch, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';

import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';

import { useNavigation, useTheme } from '@react-navigation/native';

import { useAuth } from '../../../contexts/auth';

import ToggleThemeContext from '../../../contexts/toogleTheme';

import api from '../../../services/api';

import { AxiosError } from 'axios';

import CustomModal, { CustomModalHandles } from '../../../components/CustomModal';
import SucessScreen from '../../../components/SucessScreen';

import styles from '../styles/profile';

export default function Profile() {
  const {cliente, imagem_url, requestRefreshToken, signOut} = useAuth();

  const {toggleTheme} = useContext(ToggleThemeContext);

  const {colors, dark} = useTheme();

  const navigation = useNavigation<any>();

  const modalRef = useRef<CustomModalHandles>(null);

  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [sucessMessage, setSucessMessage] = useState(false);

  function handleNavigateToPersonalData() {
    navigation.navigate("ChangePersonalData");
  };

  function handleNavigateToAddress() {
    navigation.navigate("ChangeAddress");
  };

  function handleNavigateToLoginData() {
    navigation.navigate("ChangeLoginData");
  };

  const handleOpenModal = useCallback(() => modalRef.current?.openModal(), []);

  const handleCloseModal = useCallback(() => modalRef.current?.closeModal(), []);

  function handleSignOut() {
    signOut();
  };

  async function handleDeleteClient () {
    handleOpenModal();
  };
  
  return (
    <>
      <ScrollView>
        <View 
          style={[
            styles.headerContainer,
            {
              borderBottomColor: colors.border,
              marginBottom: 50
            }
          ]} 
        >
          <View style={styles.header} >
            <Image 
              style={styles.image}
              source={{uri: imagem_url}}
            />
            <View style={styles.textContainer} >
              <Text 
                style={[
                  styles.name, 
                  {color: colors.text}
                ]}
              >
                {cliente?.nome.split(' ').slice(0, 2).join(' ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.label}>
          <Text 
            style={[
              styles.name,
              {color: colors.text}
            ]}
          >
            Conta
          </Text>
        </View>

        <View 
          style={[
            styles.buttonContainer,
            {
              borderBottomColor: colors.border,
              marginTop: 20
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleNavigateToPersonalData}
          >
            <Feather 
              name="user"
              color={colors.text}
              size={25}
            />
            <View style={styles.textContainer}>
              <Text 
                style={[
                  styles.name,
                  {
                    color: colors.text,
                    fontSize: 17
                  }
                ]}
              >
                Dados pessoais
              </Text>
              <Text 
                style={[
                  styles.description,
                  {color: colors.primary}
                ]}
              >
                Meus dados pessoais
              </Text>
            </View>
            <MaterialIcons 
              name="keyboard-arrow-right"
              color={colors.border}
              size={28}
            />
          </TouchableOpacity>
        </View>

        <View 
          style={[
            styles.buttonContainer,
            {borderBottomColor: colors.border}
          ]}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={handleNavigateToAddress}
          >
            <Feather 
              name="map"
              color={colors.text}
              size={25}
            />
            <View style={styles.textContainer}>
              <Text 
                style={[
                  styles.name,
                  {
                    color: colors.text,
                    fontSize: 17
                  }
                ]}
              >
                Endereço
              </Text>
              <Text 
                style={[
                  styles.description,
                  {color: colors.primary}
                ]}
              >
                Meu endereço
              </Text>
            </View>
            <MaterialIcons 
              name="keyboard-arrow-right"
              color={colors.border}
              size={28}
            />
          </TouchableOpacity>
        </View>

        <View 
          style={[
            styles.buttonContainer,
            {
              borderBottomColor: colors.border,
              marginBottom: 50
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.button}
            onPress={handleNavigateToLoginData}
          >
            <Feather 
              name="lock"
              color={colors.text}
              size={25}
            />
            <View style={styles.textContainer}>
              <Text 
                style={[
                  styles.name,
                  {
                    color: colors.text,
                    fontSize: 17
                  }
                ]}
              >
                Login
              </Text>
              <Text 
                style={[
                  styles.description,
                  {color: colors.primary}
                ]}
              >
                Meu login
              </Text>
            </View>
            <MaterialIcons 
              name="keyboard-arrow-right"
              color={colors.border}
              size={28}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.label}>
          <Text 
            style={[
              styles.name,
              {color: colors.text}
            ]}
          >
            Configuração
          </Text>
        </View>

        <View 
          style={[
            styles.buttonContainer,
            {
              borderBottomColor: colors.border,
              marginBottom: 50
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.button} 
            onPress={toggleTheme}
          >
            <Feather 
              name={dark ? "moon" : "sun"}
              color={colors.text}
              size={25}
            />
            <View style={styles.textContainer}>
              <Text 
                style={[
                  styles.themeMode,
                  {color: colors.text}
                ]}
              >
                Modo escuro
              </Text>
            </View>
            <Switch 
              thumbColor={colors.text}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
              value={dark}
              // onValueChange={toggleTheme}
            />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.label}>
          <Text 
            style={[
              styles.name,
              {color: colors.text}
            ]}
          >
            Ajuda
          </Text>
        </View>

        <View 
          style={[
            styles.buttonContainer,
            {
              borderBottomColor: colors.border,
              marginBottom: 50
            }
          ]}
        >
          <TouchableOpacity 
            style={[
              styles.otherButton,
              {
                padding: 20,
                marginTop: 20,
                marginBottom: 20
              }
            ]} 
          >
            <FontAwesome5 
              name="whatsapp" 
              color={colors.price} 
              size={22} 
            />
            <Text style={styles.phone}>Entrar em contato pelo WhatsApp</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.label}>
          <Text 
            style={[
              styles.name,
              {color: colors.text}
            ]}
          >
            Segurança
          </Text>
        </View>

        <View 
          style={[
            styles.buttonContainer,
            {borderBottomColor: colors.border}
          ]}
        >
          <TouchableOpacity 
            style={[
              styles.otherButton,
              {
                padding: 20,
                marginTop: 20
              }
            ]} 
            onPress={handleDeleteClient} 
          >
            <Feather 
              name="alert-triangle" 
              color="#C52233" 
              size={22} 
            />
            <Text style={styles.exit}>Deletar conta</Text>
          </TouchableOpacity>
        </View>

        <View 
          style={[
            styles.buttonContainer,
            {borderBottomWidth: 0}
          ]}
        >
          <TouchableOpacity 
            style={[
              styles.otherButton,
              {padding: 20}
            ]} 
            onPress={handleSignOut} 
          >
            <Feather 
              name="log-out" 
              color="#C52233" 
              size={22} 
            />
            <Text style={styles.exit}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {
        apiErrorMessage ? (
          <CustomModal 
            ref={modalRef} 
            title="Erro" 
            message={apiErrorMessage}
            primaryButtonText="Ok"
            onPress={handleCloseModal}
            showCancel={false}
          />
        ) : (
          <CustomModal 
            ref={modalRef} 
            title="Dletar conta" 
            message="Tem certeza que deseja deletar a sua conta?"
            primaryButtonText="Sim"
            secondaryButtonText="Não"
            onPress={
              async () => await api.delete(`deletar/${cliente.id}`).then(() => {
                const threeSeconds = 3000;
                handleCloseModal();
                setSucessMessage(true);
              
                setTimeout(() => {  
                  setSucessMessage(false);
                }, threeSeconds);

                handleSignOut();
              }).catch(async (error: AxiosError) => {
                const apiErrorMessage = error.response?.data.erro;
          
                if (error.response?.status === 401) {
                  await requestRefreshToken();
          
                  await handleDeleteClient();
                };
          
                if (error.response?.status === 400) {
                  handleOpenModal();
                  setApiErrorMessage(apiErrorMessage);
                };
              })
            }
            showCancel
          />
        )
      }
      <SucessScreen title="Conta deletada!" show={sucessMessage}/>
    </>
  );
};