import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, FlatList, TouchableOpacity } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import axios from "axios";
import OrderHistoryCard from "./OrderHistoryCard";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const OrderHistory = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [displayedOrderGroup,setDisplayedOrderGroup]=useState('active')
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




    return (
        <View className='flex-1 p-2'>
            <Text className='text-center py-3 text-xl font-bold'>Your order history</Text>


            <View className='flex-row flex-wrap justify-center items-center gap-1 mb-5'>

                <TouchableOpacity className='bg-yellow-500 rounded-md flex-row items-center px-2'>
                    <MaterialIcons
                        name="pending"
                        size={13}
                        color={'#fff'} />
                    <Text className='p-1 text-center text-xs  w-auto  text-white flex-row items-center font-semibold'>Pending</Text>
                </TouchableOpacity>

                <TouchableOpacity className='bg-blue-500 rounded-md flex-row items-center px-2'>
                    <MaterialCommunityIcons
                        name="chef-hat"
                        size={13}
                        color={'#fff'} />
                    <Text className='p-1 text-center text-xs  w-auto  text-white flex-row items-center font-semibold'>Active</Text>
                </TouchableOpacity>

                <TouchableOpacity className='bg-green-500 rounded-md flex-row items-center px-2'>
                    <MaterialCommunityIcons
                        name="truck-delivery"
                        size={13}
                        color={'#fff'} />
                    <Text className='p-1 text-center text-xs  w-auto  text-white flex-row items-center font-semibold'>Delivered</Text>
                </TouchableOpacity>

                <TouchableOpacity className='bg-red-500 rounded-md flex-row items-center px-2'>
                    <MaterialCommunityIcons
                        name="cancel"
                        size={13}
                        color={'#fff'} />
                    <Text className='p-1 text-center text-xs  w-auto  text-white flex-row items-center font-semibold'>Cancelled</Text>
                </TouchableOpacity>


            </View>


            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                orders?.cancelled?.length > 0 ? (
                    <FlatList
                        data={orders.cancelled}
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
