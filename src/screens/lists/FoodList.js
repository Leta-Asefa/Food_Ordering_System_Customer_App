import { FlatList, ScrollView, View } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { foodList } from "../../utilities_and_constants/constants";// to be fetched from api
import FoodListCard from "./HomeFoodListCard";
import MenuFoodListCard from "./MenuFoodListCard";
import { useContext, useEffect, useState } from "react";

const FoodList = ({navigation,item}) => {

    const renderFood = ({ item }) => (
        <MenuFoodListCard item={item} navigation={navigation} />
    );


    return (
      <View>

        <FlatList
        data={item}
        renderItem={renderFood}
        keyExtractor={(item) => item._id}
        className=''
        />

        </View>
    );
};

export default FoodList;