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


        <View className='flex flex-row justify-between items-center mx-2 my-1   bg-gray-200 rounded-xl'>

            <Image
                source={{ uri: String(item.restaurant.image) }}
                className='w-24 h-24 rounded-lg'
                resizeMode="cover"
            />
            <View className='ml-5'>
                <Text className='text-sm font-bold w-36' numberOfLines={1} >{item.restaurant.name}</Text>
                <View >
                    <Text className='text-green-600 font-bold text-xs'>{item.restaurant.opened ? "opened" : "closed"}</Text>
                    <View className='flex flex-row items-center'>
                        <Ionicons name="location" size={15} color="#000" />
                        <Text className='text-xs pl-1'>{item.distance}</Text>
                    </View>
                    <View className='flex flex-row items-center'>
                        <Ionicons name="star" size={15} color="#FFA500" />
                        <Text className='text-xs pl-1'>{item.restaurant.rating}</Text>
                    </View>
                </View>
                <View className='flex flex-row items-center'>
                        <Ionicons name="time" size={15} color="#0096FF" />
                    <Text className='text-xs pl-1'>{item.duration}</Text>
                </View>
            </View>

            <View className='space-y-2 mr-8'>
                <TouchableOpacity onPress={() => handleCall(item.restaurant.contact)} className='bg-green-600  px-2 py-1.5 flex-row  items-center  rounded-lg'>
                    <Ionicons name="call" size={15} color="#fff" />

                    <Text className='text-white font-bold text-center px-2'>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setSelectedRestaurant(item)
                    navigation.navigate('restaurant_detail', { restaurant: item.restaurant, distance: item.distance, duration: item.duration })
                }}

                    className='bg-red-600  px-2 py-1.5 flex-row justify-between items-center  rounded-lg'>

                    <Ionicons name="list" size={15} color="#fff" />
                    <Text className='text-white font-bold text-center px-1.5'>Order </Text>
                </TouchableOpacity>

            </View>
        </View>

    );
};

export default RestaurantListCard;
