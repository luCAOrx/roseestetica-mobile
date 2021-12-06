import React, { useCallback, useEffect, useRef, useState } from 'react'

import api from '../../../services/api';

import { FlatList, Text, ScrollView, RefreshControl } from 'react-native';

import styles from '../styles/appointments';

import CardAppointments from '../../../components/CardAppointments';
import Loading from '../../../components/Loading';
import CustomModal, { CustomModalHandles } from '../../../components/CustomModal';

import { format, utcToZonedTime } from 'date-fns-tz';
import ptBR from 'date-fns/locale/pt-BR';

import { useAuth } from '../../../contexts/auth';

import { useNavigation, useTheme } from '@react-navigation/native';
import { AxiosError } from 'axios';

interface MySchedules {
  id: number;
  data: string;
  horario: string;
};

export default function Appointments() {
  const {cliente, requestRefreshToken} = useAuth();

  const {colors} = useTheme();

  const navigation = useNavigation<any>();

  const modalRef = useRef<CustomModalHandles>(null);

  const [ mySchedules, setMySchedules ] = useState<MySchedules[]>([]);
  const [ page, setPage ] = useState(1);
  const [ totalPage, setTotalPage ] = useState(0);
  const [ loading, setLoading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ isRequested, setIsRequested] = useState(false);
  const [ apiErrorMessage, setApiErrorMessage ] = useState('');

  const handleOpenModal = useCallback(() => modalRef.current?.openModal(), []);

  const handleCloseModal = useCallback(() => modalRef.current?.closeModal(), []);

  async function loadSchedules(pageNumber = page, shouldRefresh = false) {
    if (loading) return;

    if (totalPage && pageNumber > totalPage) return;
    
    setLoading(true);
    
    await api.get(`meus_agendamentos/${cliente?.id}`, {params: {
      page: pageNumber
    }}).then(response => {
      const totalSchedules = response.headers['x-total-count'];

      setMySchedules(shouldRefresh ? response.data : [...mySchedules, ...response.data]);
      setTotalPage(Math.ceil(Number(totalSchedules) / 5));
      setPage(pageNumber + 1);
      setLoading(false);
      
    }).catch(async (error: AxiosError) => {
      const apiErrorMessage = error.response?.data.erro;

      if (error.response?.status === 401) {
        await requestRefreshToken();
        await loadSchedules(1, true);
      };

      if (error.response?.status === 400) {
        handleOpenModal();
        setApiErrorMessage(apiErrorMessage);
      };
    });
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  async function refreshList() {
    setRefreshing(true);

    await loadSchedules(1, true);

    setRefreshing(false);
  };

  return (
    <>
      {!mySchedules.length ? (
        <ScrollView
         contentContainerStyle={{flex:1, justifyContent: 'center'}}
         refreshControl={
            <RefreshControl 
              progressBackgroundColor={colors.background}
              colors={[colors.text]}
              refreshing={refreshing}
              onRefresh={refreshList}
            />
          }
        >
          <Text style={styles.text}>Sem agendamento(s)</Text>
        </ScrollView>
      ) : (
        <FlatList 
          data={mySchedules}
          keyExtractor={schedule => String(schedule.id)}
          disableVirtualization={false}
          onEndReached={() => loadSchedules()}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl 
              progressBackgroundColor={colors.card}
              colors={[colors.text]}
              refreshing={refreshing}
              onRefresh={refreshList}
            />
          }
          ListFooterComponent={loading ? <Loading /> : null}
          renderItem={({ item: schedule }) => (
            <CardAppointments 
              text={`${
                format(utcToZonedTime(schedule.data, 'South_America/BRT'), "eeeeee dd 'de' MMM 'de' yyyy" , {
                  timeZone: 'South_America/BRT',
                  locale: ptBR,
                })} às ${schedule.horario}h`
              }
              agendamento_id={schedule.id}
              id={schedule.id}
              data={schedule.data}
            />
          )}
        />
      )}
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