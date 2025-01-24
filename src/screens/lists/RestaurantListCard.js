import { ActivityIndicator, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import BackgroundImage from '../../assets/background.png'
import time from '../../assets/time.png'
import rating from '../../assets/rating.png'
import distanceImage from '../../assets/distance.png'
import call from '../../assets/call.png'
import { useCartContext } from "../../context_apis/CartContext";

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


        <View className='flex flex-row justify-between items-center mx-2 my-1 py-1 px-2  bg-gray-200 rounded-xl'>

            <Image
                source={{ uri: String(item.restaurant.image) }}
                className='w-24 h-24 rounded-lg'
                resizeMode="cover"
            />
            <View>
                <Text className='text-sm font-bold w-40' numberOfLines={1} >{item.restaurant.name}</Text>
                <View >
                    <Text className='text-green-600 font-bold text-xs'>{item.restaurant.opened ? "opened" : "closed"}</Text>
                    <View className='flex flex-row items-center'>
                        <Image source={distanceImage} className='w-4 h-4 mr-1 rounded-lg' />
                        <Text className='text-xs'>{item.distance}</Text>
                    </View>
                    <View className='flex flex-row items-center'>
                        <Image source={rating} className='w-4 h-4 mr-1 rounded-lg' />
                        <Text className='text-xs'>Rating : {item.restaurant.rating}</Text>
                    </View>
                </View>
                <View className='flex flex-row items-center'>
                    <Image source={time} className='w-4 h-4 mr-1 rounded-lg' />
                    <Text className='text-xs'>{item.duration}</Text>
                </View>
            </View>
            <View className='space-y-2'>
                <Text className='text-white font-bold text-center rounded-lg bg-red-600 px-1 text-xs'>Order here</Text>
                <TouchableOpacity onPress={() => handleCall(item.restaurant.contact)}>
                    <Text className='text-white font-bold text-center rounded-lg bg-green-600 px-1 text-xs'>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setSelectedRestaurant(item)
                    navigation.navigate('restaurant_detail', { restaurant: item.restaurant,distance:item.distance,duration:item.duration })
                }}>

                    <Text className='text-white font-bold text-center rounded-lg bg-blue-600 px-1 text-xs'>About</Text>
                </TouchableOpacity>

            </View>
        </View>

    );
};

export default RestaurantListCard;
