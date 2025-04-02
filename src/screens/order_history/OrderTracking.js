import { useEffect, useRef, useState } from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const OrderTracking = ({ navigation, route }) => {

    const mapRef = useRef(null);
    const [order, setOrder] = useState(route?.params?.order || {});
    const [routeData, setRouteData] = useState({});
    const [routeCoordinates, setRouteCoordinates] = useState([
        { latitude: 9.187595, longitude: 38.763946 }, // Start
        { latitude: 9.186800, longitude: 38.764500 },
        { latitude: 9.185900, longitude: 38.765000 },
        { latitude: 9.185000, longitude: 38.765700 }, // Turn right
        { latitude: 9.184500, longitude: 38.764900 },
        { latitude: 9.183900, longitude: 38.764300 }, // Turn left
        { latitude: 9.183000, longitude: 38.763800 },
        { latitude: 9.182200, longitude: 38.763600 }, // Slight right
        { latitude: 9.181400, longitude: 38.763900 },
        { latitude: 9.180800, longitude: 38.764400 }, // Turn left
        { latitude: 9.180200, longitude: 38.765000 },
        { latitude: 9.179500, longitude: 38.765700 }, // Turn right
        { latitude: 9.178800, longitude: 38.766200 },
        { latitude: 9.178200, longitude: 38.766700 },
        { latitude: 9.177600, longitude: 38.767300 } // Destination
    ]);
    
    const userLocation = { latitude: 9.187595, longitude: 38.763946 }; // Start
    const destination = { latitude: 9.177600, longitude: 38.767300 }; // End
    

    if (!order) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading ...</Text>
            </View>
        );
    }

    useEffect(() => {
        if (mapRef.current && routeCoordinates.length > 0) {
            console.log("Fitting to coordinates:", routeCoordinates);
            mapRef.current.fitToCoordinates(routeCoordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [routeCoordinates]);


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
                    ref={(ref) => (mapRef.current = ref)}
                    provider={PROVIDER_GOOGLE}
                    mapType="standard"
                    initialRegion={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    onMapReady={() => {
                        if (mapRef.current && routeCoordinates.length > 0) {
                            mapRef.current.fitToCoordinates(routeCoordinates, {
                                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                                animated: true,
                            });
                        }
                    }}
                    className="w-full h-96"
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
                        <View className='flex flex-row items-center'>
                            <Ionicons name="star" size={15} color="#FFA500" />
                            <Text className='text-xs'>{order.deliveryPersonId.rating}</Text>
                        </View>
                        <Text className='text-xs'>{order.deliveryPersonId.vehicle}</Text>
                    </View>

                    <View>
                        <TouchableOpacity className='14' onPress={() => handleCall(order.deliveryPersonId.phoneNumber)}>
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