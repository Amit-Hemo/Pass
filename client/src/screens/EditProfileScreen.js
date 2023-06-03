import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { updateCustomer } from '../api/payment';
import { updateUser } from '../api/user';
import ActionButton from '../components/ActionButton';
import Box from '../components/Box';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import Popup from '../components/Popup';
import { EMAIL_REGEX } from '../constants/regexes';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import useUserStore, {
  setEmail,
  setFirstName,
  setLastName,
} from '../stores/user';
import handleApiError from '../utils/handleApiError';

const EditProfileScreen = ({ navigation }) => {
  useAuth();

  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const uuid = useUserStore((state) => state.uuid);
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const email = useUserStore((state) => state.email);
  const isCustomer = useUserStore((state) => state.isCustomer);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      firstName,
      lastName,
      email,
    },
  });

  const onEditProfile = async (data) => {
    try {
      await updateUser(uuid, data);

      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);

      if (isCustomer) await updateCustomer(uuid, data);

      setModalInfo({
        isError: false,
        message: 'הפרטים עודכנו בהצלחה!',
        onClose: () => {
          navigation.navigate('ProfileScreen');
        },
      });
      setModalVisible(true);
    } catch (error) {
      const errorMessage = handleApiError(error);

      console.log(error);

      setModalInfo({
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    }
  };

  return (
    <KeyboardDismiss>
      <View className='items-center px-7 mt-5'>
        <Box>
          <Text className='font-semibold self-start text-slate-600 mb-1'>
            שם פרטי
          </Text>
          <InputBar
            input='firstName'
            control={control}
            rules={{
              required: 'שדה זה חובה',
              minLength: {
                value: 2,
                message: 'שדה זה מכיל לפחות 2 אותיות',
              },
              maxLength: {
                value: 100,
                message: 'שדה זה מכיל לכל היותר 100 אותיות',
              },
            }}
          />

          <Text className='font-semibold self-start text-slate-600 mb-1'>
            שם משפחה
          </Text>
          <InputBar
            input='lastName'
            control={control}
            rules={{
              required: 'שדה זה חובה',
              minLength: {
                value: 2,
                message: 'שדה זה מכיל לפחות 2 אותיות',
              },
              maxLength: {
                value: 100,
                message: 'שדה זה מכיל לכל היותר 100 אותיות',
              },
            }}
          />

          <Text className='font-semibold self-start text-slate-600 mb-1'>
            אימייל
          </Text>
          <InputBar
            input='email'
            control={control}
            rules={{
              required: 'שדה זה חובה',
              pattern: { value: EMAIL_REGEX, message: 'פורמט אימייל שגוי' },
            }}
          />

          <ActionButton
            title='סיום'
            handler={handleSubmit(onEditProfile)}
          />

          <Popup
            visible={modalVisible}
            isError={modalInfo.isError}
            setVisible={setModalVisible}
            onClose={modalInfo.onClose}
            message={modalInfo.message}
          />
        </Box>
      </View>
    </KeyboardDismiss>
  );
};

export default EditProfileScreen;
