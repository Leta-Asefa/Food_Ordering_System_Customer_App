import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Profile from './Profile';
import CommonDeliveryLocations from './CommonDeliveryLocations';
import { useAuthUserContext } from '../../context_apis/AuthUserContext';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {
  const navigation = useNavigation();
  const {setAuthUser}=useAuthUserContext()

  return (
    <TouchableOpacity onPress={()=>{
      console.log("Loggin out ...")
      navigation.navigate('login')
    }}>
      <Text className="text-white bg-orange-500 text-center py-2 font-bold rounded-lg m-3">
        Logout
      </Text>
    </TouchableOpacity>
  );
}

const settingsOptions = [
  {title: 'Change Profile', content: <Profile />},
  {title: 'Common Delivery Locations', content: <CommonDeliveryLocations />},
  {title: 'Log out', content: <LogoutButton />},
];

const SettingsScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);

return (
    <View className="flex-1 ">
      <ScrollView>
        {settingsOptions.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <View key={index} className="mb-3 bg-white  shadow">
              <TouchableOpacity
                onPress={() => setActiveIndex(isActive ? null : index)}
                className={`py-2 px-4 ${
                  isActive ? 'bg-gray-300' : 'bg-gray-200'
                }`}>
                <View className="flex-row px-2 justify-between items-center ">
                  <Text className="text-lg font-semibold">{item.title} </Text>
                  <Text className="text-lg font-semibold">
                    {isActive ? '△' : '▽'}
                  </Text>
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={!isActive}>
                <View className="">{item.content}</View>
              </Collapsible>
            </View>
          );
        })}
      </ScrollView>
     
    </View>
  );
};

export default SettingsScreen;
