import { useEffect, useState } from "react";
import { Image, ImageBackground, Modal, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FoodDetails from "./FoodDetails";

const MenuFoodListCard = ({ food, addToTemporaryCart }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [isOnCart, setIsOnCart] = useState(false)


    return (
        <View className='bg-gray-200 mx-2' >
            <View className=' h-auto flex flex-row justify-between items-center bg-gray-50 mx-2 my-1 rounded-lg'>

                <Image source={food.image} resizeMode="center" className='w-14 h-14 flex-none ' />

                <View className='flex-grow pl-4'>
                    <Text className='text-xs font-bold '>{food.name}</Text>
                    <Text className='text-xs'>{food.price}</Text>
                    <Text className='text-xs text-green-600 font-bold'>20 min(s) to prepare</Text>
                </View>

                <View className='flex flex-col space-y-1'>

                    <TouchableOpacity
                        className={`${isOnCart ? 'bg-red-600' : 'bg-green-600'} flex flex-row justify-center items-center px-2 py-1 text-xs rounded-md`}
                        onPress={() => setIsOnCart(addToTemporaryCart(food))}
                    >
                        {isOnCart ? <FontAwesome name="remove" size={15} color="#fff" /> : <FontAwesome name="plus" size={15} color="#fff" />}
                        {isOnCart ? <Text className=' text-white text-xs ml-1 font-bold'>Remove</Text> : <Text className=' text-white text-xs ml-1 font-bold'>Add To Cart</Text>}

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
                            <FoodDetails />
                        </Modal>
                    </TouchableOpacity>

                </View>


            </View>

        </View>

    );
};

export default MenuFoodListCard;
