import React, { memo, useState } from 'react';

import api from '../../services/api';

import { Alert, Text, View } from 'react-native';

import styles from './styles';

import { AxiosError } from 'axios';

import { useNavigation, useTheme } from '@react-navigation/native';

import { MaterialIcons as Icon } from '@expo/vector-icons';

import CustomButton from '../../components/Button';

import dayjs from 'dayjs';

import { useAuth } from '../../contexts/auth';

interface CardAppointmentsProps {
  text: string;
  agendamento_id: number;
  id: number;
  data: string;
};

function CardAppointments({text, agendamento_id, id, data}: CardAppointmentsProps) {
  const [ isRequested, setIsRequested] = useState(false);

  const {colors} = useTheme();

  const navigation = useNavigation<any>();

  const dataDeAgora = dayjs().format('YYYY/MM/DD');

  const {requestRefreshToken} = useAuth();

  function handleNavigateToDetail() {
    navigation.navigate('Detail', {agendamento_id});
  };

  function handleNavigateToReschedule() {
    navigation.navigate('Reschedule', {id});
  };

  function handleNavigateToChangeProcedure() {
    navigation.navigate('ChangeProcedure', {agendamento_id});
  };

  async function handleDeleteSchedule() {
    Alert.alert('Cancelar agendamento', 'Tem certeza que deseja cancelar seu agendamento?', [
      {
        text: 'Sim',
        onPress: async () => await api.delete(`cancelar/${id}`).then(() => {
          setIsRequested(true);
          
          navigation.reset({
            index: 0,
            routes: [{name: 'Appointments'}]
          });
        }).catch(async (error: AxiosError) => {
          const apiErrorMessage = error.response?.data.mensagem;
    
          if (error.response?.status === 401) {
            await requestRefreshToken();
    
            await handleDeleteSchedule();
          };
    
          if (error.response?.status === 400) {
            Alert.alert('Falha ao cancelar agendamento', apiErrorMessage);
    
            setIsRequested(false);
          };
    
        })
      },
      {
        text: 'Não',
        onPress: () => { setIsRequested(false) }
      }
    ]);
  };

  return (
    <View 
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          height: dayjs(data).isBefore(dayjs(dataDeAgora)) ? 160 : 400
        }
      ]}
      testID="card"
    >
      <View style={styles.header}>
        <Icon name="event-available" size={20} color={colors.text}/>
        <Text 
          style={[
            styles.text,
            {color: colors.text}
          ]}
          testID="text-card"
        >
          {text}
        </Text>
      </View>
      <CustomButton 
        title="VER DETALHES" 
        backgroundColor={colors.buttonSecondaryBackground} 
        color={colors.buttonText}
        height={50}
        fontSize={15}
        onPress={handleNavigateToDetail}
      />
      {
        dayjs(data).isBefore(dataDeAgora) ? <View /> : (
          <>
            <CustomButton 
              title="REMARCAR" 
              backgroundColor={colors.buttonSecondaryBackground} 
              color={colors.buttonText}
              height={50}
              fontSize={15}
              onPress={handleNavigateToReschedule}
            />
            <CustomButton 
              title="ALTERAR PROCEDIMENTO" 
              backgroundColor={colors.buttonSecondaryBackground} 
              color={colors.buttonText}
              height={50}
              fontSize={15}
              onPress={handleNavigateToChangeProcedure}
            />
            <CustomButton 
              title="CANCELAR" 
              backgroundColor={colors.buttonTertiaryBackground} 
              color={colors.buttonText}
              height={50}
              fontSize={15}
              isRequested={isRequested}
              onPress={() => handleDeleteSchedule()}
            />
          </>
        )
      }
    </View>
  );
};

export default memo(CardAppointments);