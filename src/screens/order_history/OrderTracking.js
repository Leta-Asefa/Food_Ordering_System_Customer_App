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
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    
    const [userLocation,setUserLocation] = useState({})
    const [destination,setDestination] = useState({})
    

    if (!order) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading ...</Text>
            </View>
        );
    }

    useEffect(() => {
        if (mapRef.current && routeCoordinates.length > 0) {
            mapRef.current.fitToCoordinates(routeCoordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [routeCoordinates]); // Runs every time routeCoordinates updates



    useEffect(() => {
        async function fetch() {

            const response = await axios.get(`http://localhost:4000/order/routemap/${order.shippingAddress.latitude}/${order.shippingAddress.longitude}/${order.restaurantId.location}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            console.log(response.data);

            if (response.data) {
                setRouteCoordinates(response.data.routeCoordinates)
                setUserLocation(response.data.userLocation)
            
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
                    ref={mapRef}
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