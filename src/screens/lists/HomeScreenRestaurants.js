import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import NearByRestaurants from './NearByRestaurants';
import PopularRestaurants from './PopularRestaurants';
import {foodList, restaurants} from '../../utilities_and_constants/constants';
import PromotionListCard from './PromotionListCard';
import RestaurantDetails from './RestaurantDetails';
import HomeFoodListCard from './HomeFoodListCard';
import axios from 'axios';
import {useLocationContext} from '../../context_apis/Location';
import {useCartContext} from '../../context_apis/CartContext';

const initialLayout = {width: Dimensions.get('window').width};

export default function Restaurants({navigation}) {
  const [index, setIndex] = useState(0);
  const [promotionList, setPromotionList] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const {longitude, latitude} = useLocationContext();
  const {setSelectedRestaurant} = useCartContext();
  const [routes] = useState([
    {key: 'nearby', title: 'Nearby'},
    {key: 'popular', title: 'Popular'},
    {key: 'favourite', title: 'Favorites'},
  ]);

  // Hide search results when keyboard is dismissed (including back button press)
  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // setShowSearchResults(false); // Hide search results when keyboard is dismissed
    });

    return () => keyboardHideListener.remove(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('login');
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup when component unmounts
  }, []);

  useEffect(() => {
    // Sync authUser to async storage whenever it changes
    const loadUser = async () => {
      const response = await axios.get(`http://localhost:4000/promotion/get`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setPromotionList(response.data);
    };

    loadUser();
  }, []);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'nearby':
        return <NearByRestaurants navigation={navigation} />;
      case 'popular':
        return <PopularRestaurants navigation={navigation} />;
      case 'favourite':
        return <RestaurantDetails navigation={navigation} />;
      default:
        return null;
    }
  };

  const renderPromotionItems = ({item}) => (
    <PromotionListCard promotion={item} navigation={navigation} />
  );

  const renderFoodItems = ({item}) => (
    <HomeFoodListCard food={item} navigation={navigation} />
  );

  const fetchSearchResults = async query => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/restaurant/search/${query}`,
      );

      if (response?.data?.result) {
        setSearchResults(response.data.result);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  const handleTextInputChange = value => {
    fetchSearchResults(value);
  };

  const handleSearchResultPress = async item => {
    let id = null;
    id = item.price ? item.restaurantId : item._id;

    try {
      const response = await axios.get(
        `http://localhost:4000/restaurant/eta/${longitude}/${latitude}/${id}`,
      );

      if (response?.data) {
        console.log(response.data);
        setSearchResults([]);
        console.log('navigating...', response.data);

        setSelectedRestaurant({restaurant: response.data.restaurant,durationValue:response.data.durationValue});
        navigation.navigate('restaurant_detail', {
          restaurant: response.data.restaurant,
          distance: response.data.distance,
          duration: response.data.duration,
          itemId: item.price ? item._id : '',
        });
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  const renderSearchResults = ({item}) => (
    <TouchableOpacity
      className="bg-gray-100 rounded-lg  mt-1"
      onPress={() => handleSearchResultPress(item)}>
      <View className="flex flex-row gap-3 items-center py-1">
        <Image
          source={{uri: String(item.image)}}
          className="w-12 h-12 rounded-lg"
          resizeMode="cover"
        />
        <View className="">
          <Text className="text-black font-bold">{item.name}</Text>
          <Text className="text-gray-800 text-xs">{item?.description}</Text>
          <Text className="text-gray-800 text-xs">{item?.cuisine}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // Keyboard.dismiss();
        // setShowSearchResults(false);
      }}>
      <View className="flex-1 bg-white">
        {/* Header -> search bar */}

        <View className="flex flex-row justify-center px-5 py-1">
          <TextInput
            placeholder="search restaurants, food ..."
            className="w-full rounded-lg text-black px-3 border-gray-800  border-b "
            placeholderTextColor={'#888'}
            onChangeText={value => handleTextInputChange(value)}
            onFocus={() => setShowSearchResults(true)}
          />
        </View>

        {/* Search Results Overlay */}
        {showSearchResults && (
          <View className="absolute top-12 left-2 right-2 bg-gray-100 shadow-lg rounded-lg z-10 p-3">
            <FlatList
              data={searchResults}
              renderItem={renderSearchResults}
              keyExtractor={item => item._id}
            />
          </View>
        )}

        {/* Promotion Banner (Discounts ...) Restarurants*/}
        <View className="bg-white">
          <FlatList
            data={promotionList}
            renderItem={renderPromotionItems}
            keyExtractor={item => item._id}
            horizontal
            className=""
          />
        </View>
        {/* Our own foods specially burgures */}

        <View className="bg-white">
          <Text className="text-right text-xs pr-2">scroll to left</Text>
          <FlatList
            data={foodList}
            renderItem={renderFoodItems}
            keyExtractor={item => item.id}
            horizontal
            className=""
          />
        </View>

        {/*Restaurant filter tap options ( nearby , popular, new ) */}

        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={() => setIndex(index)}
          initialLayout={initialLayout}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={styles.indicator}
              style={styles.tabBar}
              labelStyle={styles.label}
              activeColor="#000"
              inactiveColor="#666"
            />
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 10,
    elevation: 10,
  },
  indicator: {
    backgroundColor: '#555',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
