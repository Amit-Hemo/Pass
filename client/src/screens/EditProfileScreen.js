import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import { EMAIL_REGEX } from '../constants/regexes';
import useAuth from '../hooks/useAuth';
import useUserStore, {
  setEmail,
  setFirstName,
  setLastName,
} from '../stores/user';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';
import handleApiError from '../utils/handleApiError';
import { updateUser } from '../api/user';
import { updateCustomer } from '../api/payment';

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
      <View className="items-center flex-1 ">
        <Text className="mt-10 mb-5 text-3xl ">עריכת פרופיל</Text>

        <View className="items-center mb-16">
          <Text className="text-xl">שם פרטי</Text>
          <InputBar
            input="firstName"
            control={control}
            align={'right'}
            style="mt-2 mb-1 h-9 w-60 text-xl border-2 rounded-lg p-0.5"
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

          <Text className="text-xl">שם משפחה</Text>
          <InputBar
            input="lastName"
            style="mt-2 mb-1 h-9 w-60 text-xl border-2 rounded-lg p-0.5"
            align="right"
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

          <Text className="text-xl">אימייל</Text>
          <InputBar
            input="email"
            style="mt-2 mb-1 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
            align="left"
            control={control}
            rules={{
              required: 'שדה זה חובה',
              pattern: { value: EMAIL_REGEX, message: 'פורמט אימייל שגוי' },
            }}
          />

          <ActionButton title="ערוך" handler={handleSubmit(onEditProfile)} />
          <ActionButton
            title="ערוך סיסמא"
            handler={() => navigation.navigate('UpdatePassword')}
          />

          <Popup
            visible={modalVisible}
            isError={modalInfo.isError}
            setVisible={setModalVisible}
            onClose={modalInfo.onClose}
            message={modalInfo.message}
          />
        </View>
      </View>
    </KeyboardDismiss>
  );
};

export default EditProfileScreen;
