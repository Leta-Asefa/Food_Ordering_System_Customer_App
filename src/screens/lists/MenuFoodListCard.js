import { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, Modal, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FoodDetails from "./FoodDetails";
import { CartContext, useCartContext } from "../../context_apis/CartContext";

const MenuFoodListCard = ({ item }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const { addToCart, cart ,isOnCart} = useCartContext()
    const cleaned = null

    if (!item) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }


    return (
        <View className='bg-gray-200 mx-2' >
            <View className=' h-auto flex flex-row justify-between items-center bg-gray-50 mx-2 my-1 rounded-lg'>

                <Image
                    source={{ uri: String(item.image) }}
                    className='w-14 h-14 rounded-lg'
                    resizeMode="cover"
                />
                <View className='flex-grow pl-4'>
                    <Text className='text-xs font-bold '>{item.name}</Text>
                    <Text className='text-xs'>{item.price} ETB</Text>
                    <Text className='text-xs text-green-600 font-bold'>{item.preparationTime} to prepare</Text>
                </View>

                <View className='flex flex-col space-y-1'>

                    <TouchableOpacity
                        className={`${isOnCart(item._id) ? 'bg-red-600' : 'bg-green-600'} flex flex-row justify-center items-center px-2 py-1 text-xs rounded-md`}
                        onPress={() => {
                            addToCart({item,quantity:1})
                        }}
                    >
                        {isOnCart(item._id) ? <FontAwesome name="remove" size={15} color="#fff" /> : <FontAwesome name="plus" size={15} color="#fff" />}
                        {isOnCart(item._id) ? <Text className=' text-white text-xs ml-1 font-bold'>Remove</Text> : <Text className=' text-white text-xs ml-1 font-bold'>Add To Cart</Text>}

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text className='text-center bg-blue-600 text-white text-xs rounded-md font-bold py-1'>Detail . . .</Text>
                        <Modal
                            animationType="slide" // Slide animation
                            transparent={false} // Makes background behind modal dimmed
                            visible={modalVisible} // Control visibility with state
                            onRequestClose={() => setModalVisible(false)} // Close modal on Android back button press
                        >
                            <TouchableOpacity onPress={() => setModalVisible(false)} className='bg-gray-50 flex flex-row justify-end pr-5'>
                                <FontAwesome name="close" size={35} color="#f00" />
                            </TouchableOpacity>
                            <FoodDetails food={item} />
                        </Modal>
                    </TouchableOpacity>

                </View>


            </View>

        </View>

    );
};

export default MenuFoodListCard;