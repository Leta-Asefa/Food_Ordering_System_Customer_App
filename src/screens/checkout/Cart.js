import {useContext, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useCartContext} from '../../context_apis/CartContext';
const Cart = ({navigation}) => {
  const {cart, updateCartItem} = useCartContext();
  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.item.price * item.quantity,
      0,
    );
  };

  const handleMinus = (itemId, previousQuantity) => {
    updateCartItem(itemId, previousQuantity - 1);
    // what
  };

  const handlePlus = (itemId, previousQuantity) => {
    updateCartItem(itemId, previousQuantity + 1);
  };

  return (
    <View className="flex-1 bg-[#f9fafb]">
    <Text className="text-center text-3xl font-extrabold text-gray-800 mt-5 mb-4">
      🛒 Your Cart
    </Text>
  
    <ScrollView className="px-4">
      {cart.map((cart, index) => (
        <View
          key={index.toString()}
          className="flex flex-row items-center bg-white rounded-2xl shadow-sm p-3 mb-3"
        >
          <Image
            source={{ uri: String(cart.item.image) }}
            className="w-16 h-16 rounded-xl"
            resizeMode="cover"
          />
  
          <View className="flex-grow pl-4">
            <Text className="text-base font-semibold text-gray-800 text-ellipsis w-36" numberOfLines={1}>
              {cart.item.name}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">{cart.item.price} ETB</Text>
          </View>
  
          <View className="flex flex-row items-center space-x-3">
            <TouchableOpacity
              className="bg-gray-100 p-2 rounded-full"
              onPress={() => handleMinus(cart.item._id, cart.quantity)}
            >
              <FontAwesome name="minus" size={20} color="#ef4444" />
            </TouchableOpacity>
  
            <Text className="font-bold text-lg text-gray-700">{cart.quantity}</Text>
  
            <TouchableOpacity
              className="bg-gray-100 p-2 rounded-full"
              onPress={() => handlePlus(cart.item._id, cart.quantity)}
            >
              <FontAwesome name="plus" size={20} color="#10b981" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  
    <View className="p-5 bg-white border-t border-gray-200">
      <Text className="text-center text-xl font-bold text-gray-800 mb-4">
        Total: {getTotalPrice().toFixed(2)} ETB
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('deliveryaddress')}
        className="bg-orange-500 py-3 rounded-xl mx-10"
      >
        <Text className="text-center text-white text-lg font-bold">
          Proceed to Checkout
        </Text>
      </TouchableOpacity>
    </View>
  </View>
  
  );
};

export default Cart;
