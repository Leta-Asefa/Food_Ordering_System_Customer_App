import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable, FlatList } from "react-native";
import QRCode from "react-native-qrcode-svg";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useCartContext } from "../../context_apis/CartContext";

const OrderHistoryCard = ({ order, date, time,navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [longestPreparationTime, setLongestPreparationTime] = useState(0);

    const handlePayment = async (method) => {
        console.log("handle payment is called ")
        if (method === "payNow") {

            const formData = { amount:totalPrice,firstName:authUser.user.username , phoneNumber:authUser.user.phoneNumber }
            const response = await axios.post(`http://localhost:4000/payment/getOrderPaymentPage`, formData, {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            });

            console.log("payment url : " ,response)

            navigation.navigate('payment',{checkouturl:response.data.checkout_url})

        }
        else if(method==='payLater'){
            navigation.navigate('restaurants')

        }

    }
    const handleCancel = (method) => {

    }

    useEffect(()=>{
        let longestPreparationTime = 0
        order.items.forEach((i) => {
            longestPreparationTime = Math.max(i.item.preparationTime, longestPreparationTime);
        });
        setLongestPreparationTime(longestPreparationTime )

    },[modalVisible])

    const renderItem = ({ item }) => (
        <View className="flex-row justify-between py-3 px-4 bg-white shadow-md rounded-lg mb-2">
            <Text className="text-sm font-medium text-gray-700">{item.item.name}  ({item.quantity}X)</Text>
            <Text className="text-sm text-gray-700 font-semibold">${(item.item.price * item.quantity).toFixed(2)}</Text>
        </View>
    );

    return (
        <>
            {/* Order Card */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View className="bg-gray-50 p-2 rounded-md">
                    <Text>
                        Order ID: <Text className="font-semibold">{order._id}</Text>
                    </Text>

                    <View className="flex flex-row justify-between">
                        <View>
                            <View className="flex-row gap-2 items-center">
                                <MaterialIcons name="restaurant" size={15} color="#000" />
                                <Text className="text-xs">{order.restaurantId.name}</Text>
                            </View>
                            <View className="flex-row gap-2 items-center">
                                <MaterialIcons
                                    name="circle"
                                    size={15}
                                    color={order.status === "Pending" ? "#0f0" : "#000"}
                                />
                                <Text className="text-xs">{order.status}</Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-xs">Date: {date}</Text>
                            <Text className="text-xs">Time: {time}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

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
                    <Text className="text-md text-gray-600 mb-4">Status : {order.status}</Text>
                    <Text className="text-md text-gray-600 mb-2">Delivery Address: {order.shippingAddress.address}</Text>


                    <Text className="text-lg text-gray-800 font-semibold mt-5 mb-3">Items:</Text>
                    <FlatList
                        data={order.items}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        className='h-auto max-h-56'
                    />

                    <View className="border-t border-gray-200 mt-4 pt-4">
                        <Text className="text-md text-gray-600 mb-2">Estimated Delivery Time: {longestPreparationTime} minutes</Text>
                        <Text className="text-md text-gray-600 mb-2">Total Price: ETB {order.totalAmount}</Text>
                    </View>
                    <View className="mt-6  gap-2 flex-row justify-between">
                        <TouchableOpacity
                            className="bg-blue-600 px-3 py-2 rounded-lg shadow-md"
                            onPress={() => handlePayment("payNow")}
                        >
                            <Text className="text-white text-center font-semibold">Pay Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-gray-300 px-3 py-2 rounded-lg shadow-md"
                            onPress={() => handlePayment("payLater")}
                        >
                            <Text className="text-gray-800 text-center font-semibold">Pay Later</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            className="bg-red-600  px-3 py-2 rounded-lg shadow-md"
                            onPress={() => handleCancel("payLater")}
                        >
                            <Text className="text-white text-center font-semibold">Cancel Order</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                </View>
            </Modal>
        </>
    );
};

export default OrderHistoryCard;
