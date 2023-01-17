import { View, TextInput } from "react-native";

const InputBar = ({
  input,
  onInputChange,
  visible,
  placeHolder,
  algin,
  style,
  keyboardType,
  maxLength,
}) => {
  let isPassword = false;
  return (
    <View className="w-44 mb-2 items-center">
      {/* Check if the input should be visible or invisible */}
      {visible === false ? (visible = true) : (visible = false)}

      <TextInput
        className={style}
        secureTextEntry={visible}
        autoCapitalize="none"
        autoCorrect={false}
        value={input}
        onChangeText={onInputChange}
        placeholder={placeHolder}
        textAlign={algin}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
};

export default InputBar;
