import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native"; // Added Text import for loading message
import RestaurantListCard from "./RestaurantListCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocationContext } from "../../context_apis/Location";
import Spinner from "react-native-spinkit";

const NearByRestaurants = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const { latitude, longitude } = useLocationContext();
    const [isLoading, setIsLoading] = useState(true);


    async function getRestaurants() {
        try {
            setIsLoading(true)
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

    useEffect(() => {
        getRestaurants();
    }, [latitude, longitude]); // Dependencies: re-run when latitude or longitude changes or when the user moves

    const renderRestaurants = ({ item }) => {
        return (
            <RestaurantListCard navigation={navigation} item={item} />
        );
    };


    return (
        <>
            {isLoading ? (
                <View className="flex-1 justify-center items-center bg-gray-100">
                    <Spinner
                        isVisible={true}
                        size={100}
                        type={'Wave'} // Choose from a variety of spinner types
                        color="#000"
                    />
                    <Text className="mt-4 text-lg font-semibold text-gray-700">
                        Fetching Restaurants...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={restaurants}
                    renderItem={renderRestaurants}
                    keyExtractor={(item) => item.restaurant._id}
                    className="bg-gray-white"
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={getRestaurants} // Trigger refresh
                            colors={['#ff0000']} // Android: Spinner color
                            tintColor="#ff0000"  // iOS: Spinner color
                            title="Refreshing..." // iOS: Text below spinner
                            titleColor="#ff0000"
                        />
                    }

                />
            )}

          
        </>
    );
};

export default NearByRestaurants;
