import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackgroundImage from '../../assets/background.png'
import time from '../../assets/time.png'
import rating from '../../assets/rating.png'
import distance from '../../assets/distance.png'
import call from '../../assets/call.png'

const RestaurantListCard = ({ navigation, restaurant }) => {
    console.log(restaurant.image)
    return (

        <View className='flex flex-row justify-between items-center mx-2 my-1 py-1 px-2  bg-gray-200 rounded-xl'>
            <Image
                source={{ uri: String(restaurant.image) }}
                style={{ width: 96, height: 96 }}
                resizeMode="cover"
            />
            <View>
                <Text className='text-sm font-bold w-40' numberOfLines={1} >{restaurant.name}</Text>
                <View >
                    <Text className='text-green-600 font-bold text-xs'>{restaurant.opened}</Text>
                    <View className='flex flex-row items-center'>
                        <Image source={distance} className='w-4 h-4 mr-1 rounded-lg' />
                        <Text className='text-xs'>distance</Text>
                    </View>
                    <View className='flex flex-row items-center'>
                        <Image source={rating} className='w-4 h-4 mr-1 rounded-lg' />
                        <Text className='text-xs'>Rating : 5</Text>
                    </View>
                </View>
                <View className='flex flex-row items-center'>
                    <Image source={time} className='w-4 h-4 mr-1 rounded-lg' />
                    <Text className='text-xs'>Delivery time: ~ 50min</Text>
                </View>
            </View>
            <View className='space-y-2'>
                <Text className='text-white font-bold text-center rounded-lg bg-red-600 px-1 text-xs'>Order here</Text>
                <Text className='text-white font-bold text-center rounded-lg bg-green-600 px-1 text-xs'>Call</Text>
                <TouchableOpacity onPress={() => navigation.navigate('restaurant_detail')}>
                    <Text className='text-white font-bold text-center rounded-lg bg-blue-600 px-1 text-xs'>About</Text>
                </TouchableOpacity>

            </View>
        </View>

    );
};

export default RestaurantListCard;
