import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Text, View, ActivityIndicator, FlatList, TouchableOpacity, Alert } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import { CartContext, useCartContext } from "../../context_apis/CartContext";
import { useLocationContext } from "../../context_apis/Location";
import QRCode from "react-native-qrcode-svg";
import { useSocketContext } from "../../context_apis/SocketContext";

const ConfirmOrder = ({ navigation, route }) => {
    const [deliveryaddress, setDeliveryAddress] = useState(route?.params?.deliveryaddress || {});
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [orderResponse, setOrderResponse] = useState(null); // State to handle API response or errors

    const { authUser } = useAuthUserContext();
    const { cart, selectedRestaurant, clearCart, setSelectedRestaurant } = useCartContext()
 const socket= useSocketContext()

 console.log("SelectedRestaurant : ",selectedRestaurant);

    useEffect(() => {
        if (socket) {

            socket.on('order_status_update', (message) =>
                {
                    Alert.alert(message.message,message.message)
                } 
            )
            return () => socket.off('order_status_update')
        }
    }, [socket])



    if (!deliveryaddress) {
        console.log("Delivery address is not set yet");
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading delivery address...</Text>
            </View>
        );
    }

    useEffect(() => {
        if (!deliveryaddress || !cart || cart.length === 0) {
            console.log("Delivery address or cart is missing");
            return;
        }

        const registerAnOrder = async () => {
            setIsLoading(true); // Start loading
            let longestPreparationTime = 0
            const cartItems = cart.map((i) => {
                longestPreparationTime = Math.max(i.item.preparationTime, longestPreparationTime);
                return {
                    item: i.item._id,
                    quantity: i.quantity,
                }
            }
            );

            const eta=longestPreparationTime+ Number(selectedRestaurant.durationValue)
            console.log(eta, longestPreparationTime,selectedRestaurant.durationValue)
            console.log(selectedRestaurant)
            const formData = {
                items: cartItems,
                shippingAddress: deliveryaddress,
                userId: authUser.user._id,
                restaurantId: selectedRestaurant.restaurant._id,
                eta
            };

            try {
                console.log("Registering an order with formData: ", formData);
                const response = await axios.post(`http://localhost:4000/order/add`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                setOrderResponse(response.data); // Handle response
            } catch (error) {
                console.error("Error placing order: ", error.response || error.message);
                setOrderResponse({ error: error.response?.data || "Failed to place order" });
            } finally {
                setIsLoading(false); // Stop loading
            }
        };


        registerAnOrder();

    }, [deliveryaddress]);



    const handlePayment = async (method) => {
        if (method === "payNow") {

            const formData = { amount: orderResponse.totalAmount, firstName: authUser.user.username, phoneNumber: authUser.user.phoneNumber,subAccountId:selectedRestaurant.restaurant.subAccountId,orderId:orderResponse.orderId,userId:authUser.user._id }
            const response = await axios.post(`http://localhost:4000/payment/getOrderPaymentPage`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

console.log(response.data)
            navigation.navigate('payment', { checkouturl: response.data.checkout_url })

        }
        else if (method === 'payLater') {
            clearCart()
            setSelectedRestaurant('')
            navigation.navigate('restaurants')

        }

    }
    const handleCancel =async () => {

        const response = await axios.post(`http://localhost:4000/order/${orderResponse._id}/status`, {status:'Cancelled'}, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });


    }



    const renderItem = ({ item }) => (
        <View className="flex-row justify-between py-2 px-4 bg-white shadow-md rounded-lg mb-0">
            <Text className="text-sm font-medium text-gray-700">{item.item.name}  ({item.quantity}X)</Text>
            <Text className="text-sm text-gray-700 font-semibold">${(item.item.price * item.quantity).toFixed(2)}</Text>
        </View>
    );



    return (
        <View className="flex-1 p-4 bg-gray-50">
            <Text className="text-2xl text-center font-bold text-gray-800 mb-4">Order Confirmation</Text>

{
isLoading? ( <Text>Loading ...</Text>):(


            orderResponse?.message ? (
                <View className="bg-white p-5 rounded-lg shadow-lg">
                    <Text className="text-xs text-gray-800 font-semibold mb-2">Order ID: {orderResponse?.orderId}</Text>
                    <View className='flex flex-row justify-center'>
                        <QRCode
                            value={orderResponse?.orderId}
                            size={100}
                            color="black"
                            backgroundColor="white"
                        />
                    </View>
                    <Text className="text-xs text-gray-600 mb-2">Status : {orderResponse?.orderStatus}</Text>
                    <Text className="text-xs text-gray-600 mb-2">Customer: {authUser.user.username}</Text>
                    <Text className="text-xs text-gray-600 mb-2">Delivery Address: {deliveryaddress?.address}</Text>


                    <Text className="text-lg text-gray-800 font-semibold mt-3 mb-1">Items:</Text>
                    <FlatList
                        data={cart}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.item._id.toString()}
                        className='h-36'
                    />

                    <View className="border-t border-gray-200 mt-4 pt-4">
                        <Text className="text-md text-gray-600 mb-2">Estimated Delivery Time: {orderResponse?.eta} minutes</Text>
                        <Text className="text-md text-gray-600 mb-2">Total Price: ETB {orderResponse?.totalAmount}</Text>
                    </View>
                    <View className="mt-6 flex-row justify-between">
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
            ) : (
                <Text className="text-red-600 text-center">{orderResponse?.error || "Failed to confirm order"}</Text>
            ) )
}


        </View>
    );
};

export default ConfirmOrder;
