import { FlatList, ScrollView, View } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { drinkList, foodList } from "../../utilities_and_constants/constants";// to be fetched from api
import FoodListCard from "./HomeFoodListCard";
import MenuFoodListCard from "./MenuFoodListCard";

const DrinkList = ({navigation}) => {

    const renderDrink = ({ item }) => (
        <MenuFoodListCard food={item} navigation={navigation}/>
    );


    return (
      <View>

        <FlatList
        data={drinkList}
        renderItem={renderDrink}
        keyExtractor={(item) => item.id}
        className=''
        />

        </View>
    );
};

export default DrinkList;
