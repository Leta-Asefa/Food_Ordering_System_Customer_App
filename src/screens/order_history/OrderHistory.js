import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, FlatList } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import axios from "axios";
import OrderHistoryCard from "./OrderHistoryCard";

const OrderHistory = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const { authUser } = useAuthUserContext();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("in order history use effect");

        async function getOrderHistory() {
            console.log("function called ");

            try {
                setIsLoading(true); // Start loading
                const response = await axios.get(`http://localhost:4000/order/user/${authUser.user._id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log('Order History:', response.data);
                setOrders(response.data); // Handle response
            } catch (error) {
                console.error("Error on fetching order history", error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        }

        getOrderHistory();
    });

    const renderItem = ({ item }) => {
        const [date, time] = new Date(item.createdAt).toISOString().split("T");
        return <OrderHistoryCard  order={item._id} date={date} time={time.split(".")[0]} />;
    };

    return (
        <View className='flex-1 '>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                orders.length > 0 ? (
                    <FlatList
                        data={orders}
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
