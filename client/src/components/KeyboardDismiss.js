import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';

const KeyboardDismiss = ({ children }) => {
  return (
    //   Dismiss the keyboard when pressed on the screen
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};
export default KeyboardDismiss;
