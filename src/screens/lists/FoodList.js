import { FlatList, ScrollView, View } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { foodList } from "../../utilities_and_constants/constants";// to be fetched from api
import FoodListCard from "./HomeFoodListCard";
import MenuFoodListCard from "./MenuFoodListCard";

const FoodList = ({navigation}) => {

    const renderFood = ({ item }) => (
        <MenuFoodListCard food={item} navigation={navigation}/>
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
