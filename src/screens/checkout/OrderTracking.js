import { useState } from "react";
import { Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const OrderTracking = ({ navigation }) => {




    return (
        <View>
            <Text>Track Your Order</Text>

            <Image source={require('../../assets/map.png')} className='w-full h-96' />

            <View className='rounded-lg'>

                <View className='flex flex-row  space-x-3 px-5 py-1 mt-3'>
                    <View className='w-16'>
                        <FontAwesome name="clock-o" size={40} color="#000" />
                    </View>
                    <View className='px-5'>
                        <Text className='text-gray-500 font-semibold text-xs'>Delivery Time</Text>
                        <Text className='text-lg font-bold'>29 - 35 Minutes</Text>
                    </View>
                </View>

                <View className='flex flex-row justify-between items-center space-x-2 px-3 py-1 mx-1 mt-3 rounded-lg'>

                    <Image source={require('../../assets/profilepic.jpg')} className='w-16 h-16 rounded-lg' />

                    <View className='w-40'>
                        <Text className='font-bold'>Solomon Burhan</Text>
                        <Text>Rating : 5</Text>
                    </View>

                    <View>
                        <TouchableOpacity className='14'>
                            <FontAwesome name="phone" size={40} color="#000" />
                        </TouchableOpacity>
                    </View>


                </View>
            </View>

            <View className='mt-2 bg-gray-200 rounded-lg'>
                <Text className='text-lg font-bold text-center'>Order Id : 33432346845</Text>
                <View className='w-32 mx-auto'>
                    <FontAwesome name="barcode" size={90} color="#000" />
                </View>
            </View>

        </View>
    );
};

export default OrderTracking;
