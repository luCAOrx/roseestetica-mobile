import React, { 
  forwardRef, 
  useCallback, 
  useEffect, 
  useImperativeHandle, 
  useState 
} from 'react';

import {
  BackHandler,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { useTheme } from '@react-navigation/native';

import { styles } from './styles';
import CustomButton from '../Button';

interface CustomModalProps {
  title: string;
  message: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  showCancel: boolean;
  onPress: (type: any) => void;
}

export interface CustomModalHandles {
  openModal: () => void;
  closeModal: () => void;
}

const CustomModal: React.ForwardRefRenderFunction<CustomModalHandles, CustomModalProps> = ({
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  showCancel,
  onPress
}, ref) => {
  const [ visisble, setVisible ] = useState(false);

  const {colors} = useTheme();

  const openModal = useCallback(() => setVisible(true), []);

  const closeModal = useCallback(() => setVisible(false), []);

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    };
  });

  useEffect(() => {
    const backAction = () => {
      closeModal();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (!visisble) return null;

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
          <TouchableOpacity onPress={closeModal}>
            <Icon name="close" size={30} color={colors.text}/>
          </TouchableOpacity>
        </View>

        <View style={{borderWidth: 1, borderColor: colors.separator}}/>

        <View style={styles.messageContainer}>
          <Text style={[styles.message, {color: colors.text}]}>{message}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {showCancel && (
            <CustomButton 
              title={secondaryButtonText || "Cancelar"}
              backgroundColor={colors.buttonTertiaryBackground}
              color={colors.buttonText}
              fontSize={16}
              height={50}
              width={80}
              onPress={closeModal}
            />
          )}

          <CustomButton 
            title={primaryButtonText}
            backgroundColor={colors.buttonPrimaryBackground}
            color={colors.buttonText}
            fontSize={16}
            height={50}
            width={50}
            onPress={onPress}
          />
        </View>
      </View>
    </View>
  );
}

export default forwardRef(CustomModal);