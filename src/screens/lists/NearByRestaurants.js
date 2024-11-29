import { ScrollView } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { restaurants } from "../../utilities_and_constants/constants";

const NearByRestaurants = () => {


    return (
        <ScrollView>
            {/* change to flat list :) */}
            {restaurants.map((restaurant,index) => {
                return <RestaurantListCard key={index} restaurant={restaurant} />
            })}
        </ScrollView>
    );
};

export default NearByRestaurants;
