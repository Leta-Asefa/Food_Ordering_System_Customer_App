import { FlatList, ScrollView, View } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { drinkList, foodList } from "../../utilities_and_constants/constants";// to be fetched from api
import FoodListCard from "./HomeFoodListCard";
import MenuFoodListCard from "./MenuFoodListCard";

const DrinkList = ({navigation,item}) => {

    const renderDrink = ({ item }) => (
        <MenuFoodListCard item={item} navigation={navigation}/>
    );


    return (
      <View>

        <FlatList
        data={item}
        renderItem={renderDrink}
        keyExtractor={(item) => item._id}
        className=''
        />

        </View>
    );
};

export default DrinkList;
