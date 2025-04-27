import {useContext, useEffect, useState} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FoodDetails from './FoodDetails';
import {CartContext, useCartContext} from '../../context_apis/CartContext';

const MenuFoodListCard = ({item}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {addToCart, cart, isOnCart} = useCartContext();
  const cleaned = null;

  if (!item) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-white mx-4 my-2 p-3 rounded-2xl shadow-md">
    <View className="flex flex-row items-center">
      <Image
        source={{ uri: String(item.image) }}
        className="w-16 h-16 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-grow pl-4">
        <Text className="text-sm font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-xs text-gray-500 mt-1">{item.price} ETB</Text>
        <Text className="text-xs text-green-500 font-semibold mt-1">
          {item.preparationTime} min to prepare
        </Text>
      </View>
  
      <View className="flex flex-col space-y-2">
        <TouchableOpacity
          className={`${
            isOnCart(item._id) ? 'bg-red-500' : 'bg-green-500'
          } flex flex-row items-center px-3 py-1 rounded-full`}
          onPress={() => {
            addToCart({ item, quantity: 1 });
          }}
        >
          {isOnCart(item._id) ? (
            <FontAwesome name="remove" size={14} color="#fff" />
          ) : (
            <FontAwesome name="plus" size={14} color="#fff" />
          )}
          <Text className="text-white text-xs font-semibold ml-2">
            {isOnCart(item._id) ? 'Remove' : 'Add'}
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-gray-100 p-0 rounded-full flex flex-row items-center justify-center"
      >
        <FontAwesome name="ellipsis-h" size={18} color="#555" className='w-16 mx-auto'/>
      </TouchableOpacity>
      </View>
    </View>
  
    <Modal
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
      onBackButtonPress={() => setModalVisible(false)}
      avoidKeyboard={true}
      backdropOpacity={0.3}
      style={{ margin: 0 }}
    >
      <View className="flex-1 bg-white rounded-t-2xl overflow-hidden">
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          className="absolute right-4 top-4 z-50"
        >
          <FontAwesome name="close" size={28} color="#f00" />
        </TouchableOpacity>
        <FoodDetails food={item} />
      </View>
    </Modal>
  </View>
  
  );
};

export default MenuFoodListCard;
