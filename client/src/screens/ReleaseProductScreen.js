import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import useAuth from '../hooks/useAuth';

// Here we will have to bring the product list from  ProductBillList component
const ReleaseProductScreen = ({ navigation }) => {
  useAuth();
  return (
    <View className="items-center mt-10">
      <Text className="text-3xl">תתחדשו!</Text>
      <Text className="mt-5 mb-20 text-xl">
        הצמידו את הטלפון החכם לאטב לצורך שחרורו
      </Text>

      <View className="border-2 rounded-lg h-3/5 w-3/4 items-center">
        <ScrollView>
          <Text className=" text-xl px-10 py-4"> חולצה לבנה</Text>
        </ScrollView>
      </View>

      {/* List len will be how many products , each release will reduce this number by 1 */}
      <Text className="font-bold text-xl px-10">נותרו עוד 1 מוצרים לשחרור</Text>
    </View>
  );
};

export default ReleaseProductScreen;
