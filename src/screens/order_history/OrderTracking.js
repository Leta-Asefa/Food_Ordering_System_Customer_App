import { useEffect, useState } from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const OrderTracking = ({ navigation, route }) => {

    const [order, setOrder] = useState(route?.params?.order || {});
    const [routeData, setRouteData] = useState({});
    const routeCoordinates = [
        { latitude: 9.0360, longitude: 38.7612 }, // Start: Gurd Shola
        { latitude: 9.0349, longitude: 38.7639 }, // Right turn near Century Mall
        { latitude: 9.0388, longitude: 38.7668 }, // Slight left turn towards CMC road
        { latitude: 9.0400, longitude: 38.7790 }, // Right turn near CMC Michael Church
        { latitude: 9.0439, longitude: 38.7728 }, // Left curve before Summit Avenue
        { latitude: 9.0435, longitude: 38.7762 }, // Zigzag path near Ayat
        { latitude: 9.0486, longitude: 38.7807 }, // Destination: Summit
    ];
    
    const userLocation = { latitude: 9.0360, longitude: 38.7612 }; // Start: Gurd Shola
    const destination = { latitude: 9.0486, longitude: 38.7807 }; // Destination: Summit
    

    if (!order) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading ...</Text>
            </View>
        );
    }

    useEffect(() => {
        async function fetch() {

            const response = await axios.get(`http://localhost:4000/order/routemap/${order.shippingAddress.latitude}/${order.shippingAddress.longitude}/${order.restaurantId.location}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.data.routes.length > 0) {
                setRouteData(response.data)
            }

        }



        fetch()

    }, [order])

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
        <View>
            <Text className='font-bold text-center text-xl'>Status : <Text className='text-green-600 '>{order.status}</Text></Text>

            <View className='border-y-2 border-gray-300'>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    mapType="standard"
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    className='w-full h-96'
                >
                    <Marker coordinate={userLocation} title="My Location" />
                    <Marker coordinate={destination} title="Destination" />
                    {routeCoordinates.length > 0 && (
                        <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
                    )}
                </MapView>
            </View>
            <View className='rounded-lg'>

                <View className='flex flex-row  space-x-3 px-5 py-1 mt-2'>
                    <View className='w-16'>
                        <FontAwesome name="clock-o" size={40} color="#000" />
                    </View>
                    <View className='px-5'>
                        <Text className='text-gray-500 font-semibold text-xs'>Delivery Time</Text>
                        <Text className='text-lg font-bold'>{order.eta} Minutes</Text>
                    </View>
                </View>

                <View className='flex flex-row justify-between items-center space-x-2 px-3 py-1 mx-1 mt-2 rounded-lg'>

                <Image
                source={{ uri: String(order.deliveryPersonId.image) }}
                className='w-16 h-16 rounded-lg'
                resizeMode="cover"
            />
                    <View className='w-40'>
                        <Text className='font-bold'>{order.deliveryPersonId.username}</Text>
                        <Text className='text-xs'>Rating : {order.deliveryPersonId.rating}</Text>
                        <Text className='text-xs'>{order.deliveryPersonId.vehicle}</Text>
                    </View>

                    <View>
                        <TouchableOpacity className='14' onPress={()=>handleCall(order.deliveryPersonId.phoneNumber)}>
                            <FontAwesome name="phone" size={40} color="#000" />
                        </TouchableOpacity>
                    </View>


                </View>
            </View>

            <View className='p-2 bg-gray-200 rounded-lg'>
                <Text className='text-lg font-bold text-center'>Order Id :{order._id}</Text>
                <View className='flex flex-row justify-center'>
                    <QRCode
                        value={order._id}
                        size={60}
                        color="black"
                        backgroundColor="white"
                    />
                </View>
            </View>

        </View>
    );
};

export default OrderTracking;
