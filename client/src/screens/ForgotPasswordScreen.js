import React from "react";
import { useForm } from "react-hook-form";
import usePopup from "../hooks/usePopup";
import Popup from "../components/Popup";
import { Text, View } from "react-native";
import ActionButton from "../components/ActionButton";
import InputBar from "../components/InputBar";
import KeyboardDismiss from "../components/KeyboardDismiss";
import { EMAIL_REGEX } from "../constants/regexes";
import { forgotPassword, requestOTP } from "../api/user";
import handleApiError from "../utils/handleApiError";

const ForgotPasswordScreen = ({ navigation }) => {
  const { handleSubmit, control } = useForm();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const onForgotPassword = async (data) => {
    console.log(data);

    const email = data.email;

    try {
      await forgotPassword(email);

      setModalInfo({
        ...modalInfo,
        isError: false,
        message: "קוד זיהוי נשלח לכתובת האימייל",
        onClose: async () => {
          navigation.navigate("OTP", {
            email: data.email,
            destination: "ResetPassword",
          });
          await requestOTP(email);
        },
      });
      setModalVisible(true);
    } catch (error) {
      const errorMessage = handleApiError(error);

      setModalInfo({
        ...modalInfo,
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    }
  };

  return (
    <KeyboardDismiss>
      <View className="items-center flex-1">
        <Popup
          visible={modalVisible}
          setVisible={setModalVisible}
          isError={modalInfo.isError}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
        />

        <Text className="text-base mt-10 mb-8 text-3xl">שחזור סיסמא</Text>

        <Text className="text-xl">אימייל</Text>
        <InputBar
          input="email"
          style="mt-2 mb-1 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
          align="left"
          control={control}
          rules={{
            required: "שדה זה חובה",
            pattern: { value: EMAIL_REGEX, message: "פורמט אימייל שגוי" },
          }}
        />

        <ActionButton title="המשך" handler={handleSubmit(onForgotPassword)} />
      </View>
    </KeyboardDismiss>
  );
};

export default ForgotPasswordScreen;
