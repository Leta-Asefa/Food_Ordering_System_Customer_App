import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native'; // Added Text import for loading message
import RestaurantListCard from './RestaurantListCard';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocationContext} from '../../context_apis/Location';
import {useRestaurantsListContext} from '../../context_apis/RestaurantsList';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';

const FavoriteRestaurants = ({navigation}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {authUser} = useAuthUserContext();
  const {latitude,longitude}=useLocationContext()
  const {favouriteRestaurants, setFavouriteRestaurants} =  useRestaurantsListContext();

  async function getRestaurants() {
    try {
      setIsLoading(true);
    
      const response = await axios.post(
        `http://localhost:4000/restaurant/favorite/${latitude}/${longitude}`,
        {restaurantsIdList: authUser.user.favouriteRestaurants},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      if (response?.data?.restaurants) {
        setRestaurants(response.data.restaurants);
        setFavouriteRestaurants(response.data.restaurants);
      } 

 

    } catch (error) {
      console.error('Error fetching favorite restaurants: ', error);
    } finally {
      setIsLoading(false); // Set loading to false when data is fetched or error occurs
    }
  }

  useEffect(() => {
    getRestaurants();
  }, []); // Dependencies: re-run when latitude or longitude changes or when the user moves

  const renderRestaurants = ({item}) => {
    return <RestaurantListCard navigation={navigation} item={item} />;
  };

  return (
    <>
      {isLoading ? (
        <View className="flex-1 justify-center items-center bg-gray-100">
          <Text className="mt-4 text-lg font-semibold text-gray-700">
            Fetching Favorite Restaurants...
          </Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurants}
          keyExtractor={item => item.restaurant._id}
          className="bg-gray-white"
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={getRestaurants} // Trigger refresh
              colors={['#ff0000']} // Android: Spinner color
              tintColor="#ff0000" // iOS: Spinner color
              title="Refreshing..." // iOS: Text below spinner
              titleColor="#ff0000"
            />
          }
        />
      )}
    </>
  );
};

export default FavoriteRestaurants;
