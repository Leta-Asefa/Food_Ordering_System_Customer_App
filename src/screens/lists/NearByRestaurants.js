import { FlatList, Text, View } from "react-native"; // Added Text import for loading message
import RestaurantListCard from "./RestaurantListCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocationContext } from "../../context_apis/Location";

const NearByRestaurants = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const { latitude, longitude } = useLocationContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function get() {
            try {
                const response = await axios.get(`http://localhost:4000/restaurant/all/near/${longitude}/${latitude}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                setRestaurants(response.data); // Update state with fetched restaurants
            } catch (error) {
                console.error("Error fetching nearby restaurants: ", error);
            } finally {
                setIsLoading(false); // Set loading to false when data is fetched or error occurs
            }
        }

        get(); // Call the function to fetch data

        console.log("Restaurants", restaurants)

    }, [latitude, longitude]); // Dependencies: re-run when latitude or longitude changes

    const renderRestaurants = ({ item }) => {

        return (
            <RestaurantListCard navigation={navigation} item={item} />
        );
    };


    return (
        <>
            {isLoading ? (
                <Text className='text-center text-2xl text-blue-600 font-semibold'>Loading...</Text>
            ) : (
                <FlatList
                    data={restaurants}
                    renderItem={renderRestaurants}
                    keyExtractor={(item) => item.restaurant._id}
                    className="bg-gray-400"
                />
            )}
        </>
    );
};

export default NearByRestaurants;
