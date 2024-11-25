import React, { useState } from 'react'
import { FlatList, Image, ImageBackground, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import backgroud from '../../assets/background.png'

export default function Restaurants({ navigation }) {

    const [restaurantsList, setRestaurantsList] = useState([{
        id: 'promo1',
        imageUrl: require('../../assets/background.png'),
        title: '50% Off on Your First Order',
        description: 'Enjoy a huge discount on your first order from select restaurants.',
        retaurantName:'ABC Restaurant',restaurantId: 'restaurant1'
    },
    {
        id: 'promo2',
        imageUrl: require('../../assets/login.jpg'),
        title: 'Free Delivery',
        description: 'Get free delivery on all orders above $20.',
        retaurantName:'ABC Restaurant',restaurantId: 'restaurant2'
    },
    {
        id: 'promo3',
        imageUrl: require('../../assets/background.png'),
        title: 'Buy One Get One Free',
        description: 'Order from participating restaurants and get a second item free.',
        retaurantName:'ABC Restaurant',restaurantId: 'restaurant3'
    },
    {
        id: 'promo4',
        imageUrl: require('../../assets/login.jpg'),
        title: '20% Off on Desserts',
        description: 'Satisfy your sweet tooth with a 20% discount on all desserts.',
        retaurantName:'ABC Restaurant',restaurantId: 'restaurant4'
    },
    {
        id: 'promo5',
        imageUrl: require('../../assets/background.png'),
        title: 'Free Drink with Any Meal',
        description: 'Get a free drink with any meal purchase at select restaurants.',
        retaurantName:'ABC Restaurant',restaurantId: 'restaurant5'
    },
    {
        id: 'promo6',
        imageUrl: require('../../assets/login.jpg'),
        title: 'Happy Hour Specials',
        description: 'Enjoy exclusive happy hour specials from 4 PM to 6 PM.',
        retaurantName:'ABC Restaurant',restaurantId: 'restaurant6'
    }])


    const renderItem = ({ item }) => (
        <TouchableOpacity className='w-80 rounded-lg m-2 border-2 border-black'>
            <ImageBackground source={item.imageUrl} className='h-32 w-80'>
                <View className=' h-32 flex flex-col justify-between'>
                    <Text className='bg-white text-red-600 text-lg text-center font-bold rounded-lg  w-80 mx-auto'>{item.title}</Text>
                    <Text className='text-center text-2xl text-red-600'>{item.retaurantName}</Text>
                    <Text className='text-center text-xs bg-white text-red-600'>{item.description}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );


    return (
        <View>
            {/* Header -> search bar */}

            <View  className='flex flex-row justify-center p-1'>
                <TextInput placeholder='search restaurants, food ...' className='w-60 bg-white rounded-lg' />
                <TouchableOpacity>
                    <Text className='text-xl'>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Promotion Banner (Discounts ...) Restarurants */}
            <View className='bg-gray-50'>
                <FlatList
                    data={restaurantsList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    horizontal
                    className=''
                />
            </View>


            {/*Restaurant filter tap options ( nearby , popular, new )  */}






        </View>
    )

}
