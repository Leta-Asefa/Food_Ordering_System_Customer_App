import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, FlatList, TouchableOpacity } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import axios from "axios";
import OrderHistoryCard from "./OrderHistoryCard";
import OrderHistoryHeader from "./OrderHistoryHeader";


const OrderHistory = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [displayedOrderGroup, setDisplayedOrderGroup] = useState({})
    const { authUser } = useAuthUserContext();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        console.log("in order history use effect");

        async function getOrderHistory() {
            console.log("function called ");

            try {
                setIsLoading(true); // Start loading
                const response = await axios.get(`http://localhost:4000/order/user/${authUser?.user?._id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log('Order History:', response.data.cancelled);
                setOrders(response.data); // Handle response
                setDisplayedOrderGroup({ orders: response.data.processing, status: "processing" })
            } catch (error) {
                console.error("Error on fetching order history", error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        }

        getOrderHistory();
    }, []);

    const renderItem = ({ item }) => {
        const [date, time] = new Date(item.createdAt).toISOString().split("T");
        const formattedTime = new Date(item.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        return <OrderHistoryCard order={item} date={date} time={formattedTime} navigation={navigation} />;
    };


    const handleHeaderPress = (status) => {
        if (status === 'pending')
            setDisplayedOrderGroup({ orders: orders.pending, status: 'pending' })
        else if (status === 'processing')
            setDisplayedOrderGroup({ orders: orders.processing, status: 'processing' })
        else if (status === 'delivered')
            setDisplayedOrderGroup({ orders: orders.delivered, status: 'delivered' })
        else if (status === 'cancelled')
            setDisplayedOrderGroup({ orders: orders.cancelled, status: 'cancelled' })


    }



    return (
        <View className='flex-1 p-2 bg-white'>
            <Text className='text-center py-3 text-xl font-bold'>Your order history</Text>

            <OrderHistoryHeader handleHeaderPress={handleHeaderPress} status={displayedOrderGroup.status} />


            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                displayedOrderGroup?.orders?.length > 0 ? (
                    <FlatList
                        data={displayedOrderGroup.orders}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                    />
                ) : (
                    <Text>No orders found.</Text>
                )
            )}
        </View>
    );
};

export default OrderHistory;
