import { FlatList, ScrollView } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocationContext } from "../../context_apis/Location";




const NearByRestaurants = ({ navigation }) => {

    const [restaurants, setRestaurants] = useState([])
    const { latitude, longitude } = useLocationContext()

    useEffect(() => {
        async function get() {
            const response = await axios.get(`http://localhost:4000/restaurant/all/near/${longitude}/${latitude}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            console.log(response.data)
            setRestaurants(response.data)

        }

        get()


    }, [])

    const renderRestaurants = ({ item }) => (
        <RestaurantListCard restaurant={item.restaurant} distance={item.distance} duration={item.duration} navigation={navigation} />
    );


    return (

        <FlatList
            data={restaurants}
            renderItem={renderRestaurants}
            keyExtractor={(item) => item.restaurant._id}
            className='bg-gray-400'
        />
    );
};

export default NearByRestaurants;
