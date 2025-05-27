import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, FlatList, TouchableOpacity } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import axios from "axios";
import OrderHistoryCard from "./OrderHistoryCard";
import OrderHistoryHeader from "./OrderHistoryHeader";
import { useSocketContext } from "../../context_apis/SocketContext";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const OrderHistory = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [displayedOrderGroup, setDisplayedOrderGroup] = useState({})
    const { authUser } = useAuthUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const socket= useSocketContext()

    useEffect(() => {
        if (socket) {

            socket.on('order_history_updated', (new_order_history) =>
                {
                    setOrders(new_order_history)
                } 
            )
            return () => socket.off('order_history_updated')
        }
    }, [socket])

    useEffect(()=>{
        handleHeaderPress(displayedOrderGroup.status)
    },[orders])

    const getOrderHistory = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:4000/order/user/${authUser?.user?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setOrders(response.data);
            setDisplayedOrderGroup({ orders: response.data.processing, status: "processing" })
        } catch (error) {
            console.error("Error on fetching order history", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("in order history use effect");
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
        <View className='flex-1 p-2  bg-white'>
            <View className='flex-row items-center justify-between bg-gray-200 mb-5'>
                <Text className='text-center py-1 text-xl font-bold text-black w-72'>Your order history</Text>
                <TouchableOpacity onPress={getOrderHistory} style={{marginRight: 8, marginTop: 2}}>
                    <FontAwesome name="refresh" size={22} color="#333" />
                </TouchableOpacity>
            </View>

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
