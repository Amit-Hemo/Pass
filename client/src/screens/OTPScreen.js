import React, { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import ActionButton from "../components/ActionButton";
import KeyboardDismiss from "../components/KeyboardDismiss";
import { validateOTP, requestOTP } from "../api/user";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";
import handleApiError from "../utils/handleApiError";

const OTPScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitted },
    reset,
  } = useForm();

  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const inputRefs = useRef([]);
  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const onOTPSend = async (data) => {
    console.log(data);
    const otp = Object.values(data).join("");

    const email = route.params?.email;
    const destination = route.params?.destination;

    try {
      const { data: response } = await validateOTP({ otp, email });
      setModalInfo({
        ...modalInfo,
        isError: false,
        message: "תהליך האימות הסתיים בהצלחה!",
        onClose: () => {
          navigation.navigate(destination, { uuid: response.uuid });
        },
      });
      setModalVisible(true);
    } catch (error) {
      const errorMessage = handleApiError(error);

      setModalInfo({
        ...modalInfo,
        isError: true,
        message: errorMessage,
        onClose: () => {
          reset();
          inputRefs.current[0].focus();
        },
      });
      setModalVisible(true);
    }
  };

  const onResendOTP = async () => {
    const email = route.params?.email;

    setIsLoading(true);
    try {
      setModalVisible(true);
      await requestOTP(email);
      setModalInfo({
        ...modalInfo,
        isError: false,
        message: "קוד חדש נשלח בהצלחה!",
      });
      setIsLoading(false);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setIsLoading(false);

      setModalInfo({
        ...modalInfo,
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    }
  };

  const focusPrevInput = (index) => {
    if (inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const focusNextInput = (index) => {
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
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
          isLoading={isLoading}
        />

        <Text className="mt-10 mb-5 text-3xl ">אימות</Text>
        <Text className="mb-5 text-lg">נא להזין את הקוד שנשלח לאימייל</Text>

        <View className="flex-row items-center justify-center mb-2">
          {[...Array(4)].map((_, index) => (
            <Controller
              key={index}
              control={control}
              name={`otp${index + 1}`}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border-[1.5px] ${
                    errors[`otp${index + 1}`] && "border-red-500"
                  } rounded-md text-3xl text-center p-2 mr-2`}
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(value) => {
                    onChange(value);
                    if (value === "") {
                      focusPrevInput(index);
                    } else {
                      focusNextInput(index);
                    }
                  }}
                  onBlur={onBlur}
                  ref={(input) => {
                    inputRefs.current[index] = input;
                  }}
                  maxLength={1}
                />
              )}
            />
          ))}
        </View>
        {isSubmitted && !isValid && (
          <Text className="text-red-500 text-lg">אנא הזן קוד תקין</Text>
        )}

        <ActionButton title="אישור" handler={handleSubmit(onOTPSend)} />
        <ActionButton title="שליחת קוד מחדש" handler={onResendOTP} />
      </View>
    </KeyboardDismiss>
  );
};

export default OTPScreen;
