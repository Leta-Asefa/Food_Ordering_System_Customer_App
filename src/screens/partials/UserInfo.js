import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {useLocationContext} from '../../context_apis/Location';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';
import { useNavigation } from '@react-navigation/native';

const UserInfo = () => {
  const {address} = useLocationContext();
  const {authUser} = useAuthUserContext();
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-end bg-orange-600">
      <View className="flex-row justify-end gap-2 items-center px-2 py-0.5">
        <Text className="text-white text-xs w-64 text-right" numberOfLines={1}>
          Welcome, {authUser?.user?.username} ({address})
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('settings')}>
          <Image
            source={{uri: String(authUser.user.image)}}
            className="w-5 h-5 rounded-lg"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserInfo;
