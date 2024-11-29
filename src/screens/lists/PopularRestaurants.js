import { ScrollView } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { restaurants } from "../../utilities_and_constants/constants";// to be fetched from api

const PopularRestaurants = () => {


    return (
        <ScrollView>
            {/* change to flat list :) */}
            {restaurants.map((restaurant,index) => {
                return <RestaurantListCard key={index} restaurant={restaurant} />
            })}
        </ScrollView>
    );
};

export default PopularRestaurants;
