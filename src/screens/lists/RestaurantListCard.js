import { ActivityIndicator, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import BackgroundImage from '../../assets/background.png'
import time from '../../assets/time.png'
import rating from '../../assets/rating.png'
import distanceImage from '../../assets/distance.png'
import call from '../../assets/call.png'
import { useCartContext } from "../../context_apis/CartContext";
import Ionicons from 'react-native-vector-icons/Ionicons'


const RestaurantListCard = ({ navigation, item }) => {

    const { setSelectedRestaurant } = useCartContext()


    if (!item) {
        return (
            <View className="flex justify-center items-center py-4">
                <ActivityIndicator size="small" color="#000" />
                <Text>Loading...</Text>
            </View>
        );
    }


    const handleCall = async (phoneNumber) => {
        if (phoneNumber) {
            const phoneUrl = `tel:${phoneNumber}`;

            const supported = await Linking.canOpenURL(phoneUrl);
            if (supported) {
                await Linking.openURL(phoneUrl);
            } else {
                Alert.alert('Error', 'Unable to open the dialer');
            }

        } else {
            Alert.alert('Error', 'No phone number provided');
        }
    }


    return (


        <View className='flex flex-row justify-between items-center mx-2 mb-1   bg-gray-100 rounded-xl'>

            <View className='border border-gray-800 rounded-lg'>

                <Image
                    source={{ uri: String(item.restaurant.image) }}
                    className='w-20 h-20 rounded-lg border-2 border-gray-500'
                    resizeMode="cover"
                />
            </View>
            
            <View className='ml-4'>
                <Text className='text-sm font-bold w-36 underline' numberOfLines={1} >{item.restaurant.name}</Text>
                <Text className='text-green-600 font-bold text-xs'>{item.restaurant.opened ? "opened" : "closed"}</Text>
                <View className='flex flex-row items-center'>
                    <Ionicons name="location" size={15} color="#000" />
                    <Text className='text-xs pl-1'>{item.distance}</Text>
                </View>
                <View className='flex flex-row items-center'>
                    <Ionicons name="star" size={15} color="#FFA500" />
                    <Text className='text-xs pl-1'>{item.restaurant.rating}</Text>
                </View>
                <View className='flex flex-row items-center'>
                    <Ionicons name="time" size={15} color="#0096FF" />
                    <Text className='text-xs pl-1'>{item.duration}</Text>
                </View>
            </View>

            <View className='space-y-2 mr-1 flex-col justify-center  '>

                <View className='w-24'>
                    <Text numberOfLines={1} className='text-xs font-semibold text-right' > {item.restaurant.cuisine}</Text>
                </View>

                <TouchableOpacity onPress={() => handleCall(item.restaurant.contact)} className='bg-green-600  px-2 py-0.5  flex-row  justify-center items-center  rounded-lg'>
                    <Ionicons name="call" size={10} color="#fff" />

                    <Text className='text-white text-xs font-bold text-center px-2'>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setSelectedRestaurant(item)
                    navigation.navigate('restaurant_detail', { restaurant: item.restaurant, distance: item.distance, duration: item.duration })
                }}

                    className='bg-red-500  px-1 py-0.5  flex-row justify-center items-center  rounded-lg'>

                    <Ionicons name="list" size={10} color="#fff" />
                    <Text className='text-white font-bold text-center text-xs px-1'>Order </Text>
                </TouchableOpacity>


            </View>
        </View>

    );
};

export default RestaurantListCard;
