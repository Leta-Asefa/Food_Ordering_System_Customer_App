import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const Cart = ({ navigation }) => {

    const [orders, setOrders] = useState([
        { name: 'Burger', price: 400, quantity: 2, image: require('../../assets/food1.jpeg') },
        { name: 'coca cola', price: 200, quantity: 1, image: require('../../assets/food2.jpeg') },
        { name: 'Salad', price: 300, quantity: 3, image: require('../../assets/food3.jpeg') },
        { name: 'Tea', price: 100, quantity: 5, image: require('../../assets/food3.jpeg') },
        { name: 'coca cola', price: 200, quantity: 1, image: require('../../assets/food2.jpeg') },
        { name: 'Salad', price: 300, quantity: 3, image: require('../../assets/food3.jpeg') },
        { name: 'Tea', price: 100, quantity: 5, image: require('../../assets/food3.jpeg') },
        { name: 'coca cola', price: 200, quantity: 1, image: require('../../assets/food2.jpeg') },
        { name: 'Salad', price: 300, quantity: 3, image: require('../../assets/food3.jpeg') },
        { name: 'Tea', price: 100, quantity: 5, image: require('../../assets/food3.jpeg') },

    ])




    return (
        <View className='flex-1'>
            <Text className='text-center text-2xl mt-3 font-bold bg-gray-100 p-3'>Your Orders</Text>

            <ScrollView className=''>
                {orders.map((order, index) => {
                    return <View key={index.toString()} className='flex flex-row justify-between space-x-2 items-center p-2 bg-gray-200 mt-1 mx-2 rounded-lg'>
                        <Image source={order.image} className='w-14 h-14' />
                        <View>
                            <Text className='w-44'>{order.name}</Text>
                            <Text className='w-44'>{order.price} ETB</Text>
                        </View>
                        <View className='flex flex-row justify-between space-x-2'>
                            <TouchableOpacity className='bg-white p-1 rounded'>
                                <FontAwesome name="minus" size={25} color="#f00" />
                            </TouchableOpacity>

                            <Text className='font-bold text-lg'>{order.quantity} </Text>

                            <TouchableOpacity className='bg-white p-1 rounded'>
                                <FontAwesome name="plus" size={25} color="#0f0" />
                            </TouchableOpacity>

                        </View>
                    </View>
                })}
            </ScrollView>


            <View>
                <Text className='text-center text-xl mb-3'>Total Price : {orders[0].price + orders[1].price + orders[2].price} ETB</Text>
                <TouchableOpacity>
                    <Text className='text-center w-40 mx-auto bg-green-600 text-white text-lg rounded-lg font-bold'>Continue</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
};

export default Cart;
