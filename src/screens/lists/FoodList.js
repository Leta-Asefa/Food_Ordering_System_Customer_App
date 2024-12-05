import { FlatList, ScrollView, View } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { foodList } from "../../utilities_and_constants/constants";// to be fetched from api
import FoodListCard from "./HomeFoodListCard";
import MenuFoodListCard from "./MenuFoodListCard";
import { useEffect, useState } from "react";

const FoodList = ({navigation}) => {

    const [temporaryCart, setTemporaryCart] = useState([])

    const addToTemporaryCart = (item) => {
        let status=null
        setTemporaryCart((prevTemporaryCart) => {
            if (prevTemporaryCart.some(cartItem => cartItem.name === item.name)) {
                status=false
                return prevTemporaryCart.filter(cartItem => cartItem.name !== item.name);
            } else {
                status=true
                return [...prevTemporaryCart, item];
            }
        });

        return status

    };

    useEffect(() => {
        console.log(temporaryCart);
    }, [temporaryCart]);


    const renderFood = ({ item }) => (
        <MenuFoodListCard food={item} navigation={navigation} addToTemporaryCart={addToTemporaryCart}/>
    );


    return (
      <View>

        <FlatList
        data={foodList}
        renderItem={renderFood}
        keyExtractor={(item) => item.id}
        className=''
        />

        </View>
    );
};

export default FoodList;
