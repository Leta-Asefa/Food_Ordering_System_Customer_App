import { useState } from "react";
import { Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const DeliveryAddress = ({ navigation }) => {




    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>

        <View className='flex-1'>
            <Text className='text-center my-5 font-bold text-xl'>Add Your Delivery Address</Text>

              <Image source={require('../../assets/location.jpeg')} className='w-40 h-40 mx-auto mb-5 rounded-xl'/>
            <TextInput className='bg-gray-300 mx-5 rounded-lg text-xl py-3 px-5'>
                your current location
            </TextInput>
            <Text className='text-xs text-center'>if it is somewhere else enter the address</Text>


            <TouchableOpacity >
                <Text className='bg-green-600 w-56 mx-auto text-center text-xl text-white rounded-lg mt-3 p-1'>Go To Payment</Text>
            </TouchableOpacity>

        </View>
        </TouchableWithoutFeedback>
    );
};

export default DeliveryAddress;
