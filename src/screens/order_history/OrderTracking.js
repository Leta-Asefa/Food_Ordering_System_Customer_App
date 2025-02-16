import { useEffect, useState } from "react";
import { Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import RouteMap from "./MapRoute";
const OrderTracking = ({ navigation, route }) => {

    const [order, setOrder] = useState(route?.params?.order || {});
    const [routeData, setRouteData] = useState({});

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

            if(response.data.routes.length>0){
                setRouteData(response.data)
            }

        }



        fetch()

    }, [order])



    return (
        <View>
            <Text className='font-bold text-center text-xl'>Status : <Text className='text-green-600 '>{order.status}</Text></Text>
           
            {/* <RouteMap routeData={routeData} /> */}
        
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

                    <Image source={require('../../assets/profilepic.jpg')} className='w-16 h-16 rounded-lg' />

                    <View className='w-40'>
                        <Text className='font-bold'>Solomon Burhan</Text>
                        <Text className='text-xs'>Rating : 5</Text>
                        <Text className='text-xs'>white Bycycle with red tyers</Text>
                    </View>

                    <View>
                        <TouchableOpacity className='14'>
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
