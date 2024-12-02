import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import BackgroundImage from '../../assets/background.png'
import time from '../../assets/time.png'
import rating from '../../assets/rating.png'
import distance from '../../assets/distance.png'
import call from '../../assets/call.png'





const RestaurantListCard = ({ restaurant,navigation }) => {



    return (

        <View className='flex flex-row justify-between items-center mx-2 my-1 py-1 px-2  bg-gray-200 rounded-xl'>
            <Image source={restaurant.image} className='w-24 h-24' />
            <View>
                <Text className='text-sm font-bold w-40' numberOfLines={1} >{restaurant.name}</Text>
                <View >
                    <Text className='text-green-600 font-bold text-xs'>Opened</Text>
                    <View className='flex flex-row items-center'>
                        <Image source={distance} className='w-4 h-4 mr-1 rounded-lg' />
                        <Text className='text-xs'>{restaurant.distance}</Text>
                    </View>
                    <View className='flex flex-row items-center'>
                        <Image source={rating} className='w-4 h-4 mr-1 rounded-lg' />
                        <Text className='text-xs'>Rating : {restaurant.rating}</Text>
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
                <TouchableOpacity onPress={()=>navigation.navigate('restaurant_details')}>
                    <Text className='text-white font-bold text-center rounded-lg bg-blue-600 px-1 text-xs'>About</Text>
                </TouchableOpacity>

            </View>
        </View>

    );
};

export default RestaurantListCard;
