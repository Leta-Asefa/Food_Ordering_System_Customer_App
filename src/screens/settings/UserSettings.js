import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView } from "react-native";
import Collapsible from "react-native-collapsible";
import Profile from "./Profile";
import CommonDeliveryLocations from "./CommonDeliveryLocations";

const settingsOptions = [
  { title: "Change Profile", content: <Profile /> },
  { title: "Common Delivery Locations", content: <CommonDeliveryLocations/> },
];

const SettingsScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <View className="flex-1 ">
      <>

      {settingsOptions.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <View key={index} className="mb-3 bg-white  shadow">
            <TouchableOpacity
              onPress={() => setActiveIndex(isActive ? null : index)}
              className={`py-2 px-4 ${isActive ? "bg-gray-400" : "bg-gray-200"}`}
              >
              <Text className="text-lg font-bold">{item.title}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={!isActive}>
              <View className='' >{item.content}</View>
            </Collapsible>
          </View>
        );
      })}

      </>
    </View>
  );
};

export default SettingsScreen;
