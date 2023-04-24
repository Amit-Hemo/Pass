import { useState } from "react";

function usePopup() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    isError: false,
    message: '',
    onClose: () => {},
  });

  return {modalVisible, setModalVisible, modalInfo, setModalInfo}
}

export default usePopup