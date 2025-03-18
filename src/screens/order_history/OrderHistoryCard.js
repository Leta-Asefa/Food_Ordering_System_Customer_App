import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, ToastAndroid } from "react-native";
import QRCode from "react-native-qrcode-svg";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useCartContext } from "../../context_apis/CartContext";
import axios from "axios";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";

const OrderHistoryCard = ({ order, date, time, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [longestPreparationTime, setLongestPreparationTime] = useState(0);
    const { authUser } = useAuthUserContext()

    const handlePayment = async (method) => {
        if (method === "payNow") {

            const formData = { amount: order.totalAmount, firstName: authUser.user.username, phoneNumber: authUser.user.phoneNumber,subAccountId:order.restaurantId.subAccountId,orderId:order._id,userId:authUser.user._id }
            const response = await axios.post(`http://localhost:4000/payment/getOrderPaymentPage`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            setModalVisible(false)
            navigation.navigate('payment', { checkouturl: response.data.checkout_url })

        }
        else if (method === 'payLater') {
            setModalVisible(false)
        }

    }
    const handleCancel = async (method) => {
        try {
            const response = await axios.put(`http://localhost:4000/order/${order._id}/status`, { status: 'Cancelled' }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.data.message) {
                ToastAndroid.showWithGravity("Order Cancelled Successfully", ToastAndroid.LONG, ToastAndroid.TOP)
            } else {
                ToastAndroid.showWithGravity("Preparing your order is started. You can't cancel.", ToastAndroid.LONG, ToastAndroid.TOP)
            }

            setModalVisible(false)

        } catch (error) {
            console.log(error)
        }


    }


    useEffect(() => {

        const fetch = async () => {
            let longestPreparationTime = 0
            order.items.forEach((i) => {
                longestPreparationTime = Math.max(i.item.preparationTime, longestPreparationTime);
            });

            const response = await axios.get(`http://localhost:4000/restaurant/eta/${order.shippingAddress.longitude}/${order.shippingAddress.latitude}/${order.restaurantId._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            setLongestPreparationTime(longestPreparationTime + Number(response.data.durationValue))

        }


        fetch()

    }, [modalVisible])

    const renderItem = ({ item }) => (
        <View className="flex-row justify-between py-2 px-4 bg-white shadow-md rounded-lg">
            <Text className="text-sm font-medium text-gray-700">{item.item.name}  ({item.quantity}X)</Text>
            <Text className="text-sm text-gray-700 font-semibold">${(item.item.price * item.quantity).toFixed(2)}</Text>
        </View>
    );

    return (
        <>
            {/* Order Card */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View className="bg-gray-300 px-8 py-2 rounded-md mb-2 border border-gray-300">

                    <Text className='text-center'>
                        Order Id: <Text className="font-semibold text-xs text-center">{order._id}</Text>
                    </Text>

                    <View className="flex flex-row justify-between">
                        <View>
                            <View className="flex-row gap-2 items-center">
                                <MaterialIcons name="restaurant" size={15} color="#000" />
                                <Text className="text-xs">{order.restaurantId.name}</Text>
                            </View>
                            <View className="flex-row gap-2 items-center">
                                <FontAwesome
                                    name="money"
                                    size={15}
                                    color={"#000"}
                                />
                                <Text className="text-xs">{order.totalAmount} ETB</Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-xs text-right">Date: {date}</Text>
                            <Text className="text-xs text-right">Time: {time}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            {

                order.status === 'Processing' ? (
                    <TouchableOpacity onPress={() => navigation.navigate('order_tracking', { order })}>
                        <Text className='bg-red-400 text-center text-white font-semibold rounded-lg p-1.5'>Track Order</Text>
                    </TouchableOpacity>) : ('')
            }

            {/* Order Details Modal------------------------------------------------------------------------- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1  justify-center items-center bg-black/50 py-3">
                    <View className="bg-white p-5 rounded-md">
                        <Text className="text-xs text-gray-800 font-semibold mb-2">Order ID: {order._id}</Text>
                        <View className='flex flex-row justify-center'>
                            <QRCode
                                value={order._id}
                                size={100}
                                color="black"
                                backgroundColor="white"
                            />
                        </View>
                        <Text className="text-xs text-gray-600 mb-2">Status : {order.status}</Text>
                        <Text className="text-xs text-gray-600 mb-2">Delivery Address: {order.shippingAddress.address}</Text>
                        <Text className="text-xs text-gray-600 mb-2">Time Stamp : {date} {time}</Text>


                        <Text className="text-lg text-gray-800 font-semibold mt-5 mb-3">Items:</Text>
                        <FlatList
                            data={order.items}
                            renderItem={renderItem}
                            keyExtractor={(item) => item._id}
                            className='h-auto max-h-44'
                        />

                        <View className="border-t border-gray-200 mt-4 pt-4">
                            <Text className="text-md text-gray-600 mb-2">Estimated Delivery Time: {order.eta} minutes</Text>
                            <Text className="text-md text-gray-600 mb-2">Total Price: ETB {order.totalAmount}</Text>
                        </View>


                        <View className="mt-6  gap-2 flex-row justify-center">
                            <TouchableOpacity
                                className={`bg-blue-600 px-3 py-2 rounded-lg shadow-md ${order.status==="Pending"?'visible':'hidden'}`}
                                onPress={() => handlePayment("payNow")}
                            >
                                <Text className="text-white text-center font-semibold">Pay Now</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`bg-gray-300 px-3 py-2 rounded-lg shadow-md ${order.status==='Pending'?'visible':'hidden'} `}
                                onPress={() => handlePayment("payLater")}
                            >
                                <Text className="text-gray-800 text-center font-semibold">Pay Later</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                className={`bg-red-600  px-3 py-2 rounded-lg shadow-md ${order.status==="Processing"?'visible':'hidden'}`}
                                onPress={() => handleCancel("payLater")}
                            >
                                <Text className="text-white text-center font-semibold">Cancel Order</Text>
                            </TouchableOpacity>

                        </View>
                        {

                            order.status === 'Processing' ? (
                                <TouchableOpacity onPress={() => navigation.navigate('order_tracking', { order })}>
                                    <Text className='bg-red-400 text-center text-white font-semibold rounded-lg p-1.5 mt-2'>Track Order</Text>
                                </TouchableOpacity>) : ('')
                        }
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default OrderHistoryCard;
