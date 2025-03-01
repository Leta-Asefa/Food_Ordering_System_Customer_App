import React from "react";
import { View, Image, Text } from "react-native";
import { useLocationContext } from "../../context_apis/Location";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";

const UserInfo = () => {
    const { address } = useLocationContext();
const {authUser}=useAuthUserContext()
   
    return (
        <View className="flex-row justify-end bg-orange-600">

             

            <View className="flex-row justify-end gap-2 items-center px-2 py-0.5">
                <Text className="text-white text-xs w-64 text-right" numberOfLines={1}>
                    Welcome, {authUser?.user?.username} ({address})
                </Text>
                <Image
                    source={{ uri: String(authUser.user.image) }}
                    className="w-5 h-5 rounded-lg"
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

export default UserInfo;
