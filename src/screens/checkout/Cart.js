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
    <View className="flex-1">
      <Text className="text-center text-2xl mt-3 font-bold bg-gray-100 p-3">
        Your Orders
      </Text>

      <ScrollView className="">
        {cart.map((cart, index) => {
          return (
            <View
              key={index.toString()}
              className="flex flex-row justify-between space-x-2 items-center p-2 bg-gray-200 mt-1 mx-2 rounded-lg">
              <Image
                source={{uri: String(cart.item.image)}}
                className="w-14 h-14"
              />
              <View>
                <Text className="w-44">{cart.item.name}</Text>
                <Text className="w-44">{cart.item.price} ETB</Text>
              </View>
              <View className="flex flex-row justify-between space-x-2">
                <TouchableOpacity
                  className="bg-white p-1 rounded"
                  onPress={() => handleMinus(cart.item._id, cart.quantity)}>
                  <FontAwesome name="minus" size={25} color="#f00" />
                </TouchableOpacity>

                <Text className="font-bold text-lg">{cart.quantity} </Text>

                <TouchableOpacity
                  className="bg-white p-1 rounded"
                  onPress={() => handlePlus(cart.item._id, cart.quantity)}>
                  <FontAwesome name="plus" size={25} color="#0f0" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View>
        <Text className="text-center text-xl mb-3">
          Total Price : {getTotalPrice().toFixed(2)} ETB
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('deliveryaddress')}>
          <Text className="bg-orange-500 p-2 font-bold text-center text-xl rounded-lg text-white w-44 mx-auto mb-3">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
