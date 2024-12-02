import { FlatList, ScrollView } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { restaurants } from "../../utilities_and_constants/constants";

const NearByRestaurants = ({navigation}) => {

    const renderRestaurants = ({ item }) => (
        <RestaurantListCard restaurant={item} navigation={navigation}/>
    );


    return (
      
        <FlatList
        data={restaurants}
        renderItem={renderRestaurants}
        keyExtractor={(item) => item.id}
        className=''
    />
    );
};

export default NearByRestaurants;
