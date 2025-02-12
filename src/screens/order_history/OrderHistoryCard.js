import { useEffect, useState } from "react";
import { View, Text } from "react-native";
const OrderHistoryCard = ({ order, date, time }) => {


    return (
        <View className='px-5 py-8'>

            <Text>Order ID: {order._id}</Text>

            <View className='flex flex-row justify-between'>

                <View>
                    <Text className='text-xs'>from {order.restaurantId.name}</Text>
                    <Text className='text-xs'>{order.status}</Text>
                </View>

                <View>
                    <Text className='text-xs'>Date: {date}</Text>
                    <Text className='text-xs'>Time: {time}</Text>
                </View>

            </View>

        </View>
    );
};

export default OrderHistoryCard;
