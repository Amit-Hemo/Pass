import React, { useState } from 'react';
import { Text, View, Image } from 'react-native';
import ActionButton from './ActionButton';
import useProductStore, { setScanned } from '../stores/product';
import { setAmount } from '../stores/cart';
import PurchasePopup from './PurchasePopup';

const ProductBillDetails = ({ navigation }) => {
  const name = useProductStore((state) => state.name);
  const size = useProductStore((state) => state.size);
  const price = useProductStore((state) => state.price);
  const image = useProductStore((state) => state.image);
  const [visible, setVisible] = useState(false);

  const handleAddToCart = async () => {
    setScanned(false);
    
  };

  const handleFastPurchase = () => {
    setVisible(true);
  };

  return (
    <View className="items-center">
      <View className="items-center w-80">
        <View className="flex-row mt-4">
          <Text className="text-xl px-10 ">{`${price} ש"ח`}</Text>
          <Text className=" text-xl px-10 mb-2">{`${name} - ${size}`}</Text>
        </View>

        <Image className="rounded-xl w-60 h-60 mb-6" source={{ uri: image }} />

        <View className="flex-row">
          <ActionButton title="רכישה מהירה" handler={handleFastPurchase} />
          <View className="" />
          <ActionButton title="הוספה לסל" handler={handleAddToCart} />
        </View>
      </View>

      <PurchasePopup
        visible={visible}
        setVisible={setVisible}
        navigation={navigation}
      />
    </View>
  );
};

export default ProductBillDetails;
