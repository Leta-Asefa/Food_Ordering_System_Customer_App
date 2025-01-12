import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, View,Platform, PermissionsAndroid } from 'react-native'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import NearByRestaurants from './NearByRestaurants';
import PopularRestaurants from './PopularRestaurants';
import { foodList } from '../../utilities_and_constants/constants';
import PromotionListCard from './PromotionListCard';
import FoodListCard from './HomeFoodListCard';
import RestaurantDetails from './RestaurantDetails';
import HomeFoodListCard from './HomeFoodListCard';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';


const initialLayout = { width: Dimensions.get('window').width };




export default function Restaurants({ navigation }) {

    const [index, setIndex] = useState(0);
    const [promotionList, setPromotionList] = useState([])
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [routes] = useState([
        { key: 'nearby', title: 'Nearby' },
        { key: 'popular', title: 'Popular' },
        { key: 'favourite', title: 'Favorites' }
    ]);

    const [address, setAddress] = useState('');

    useEffect(() => {
      let watchId = null;
  
      const getLocation = async () => {
        watchId = Geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
  
            // Call HERE Maps Reverse Geocoding API
            const apiKey = 'vNw_RmL_TFApW6kTtIGUNItPw1CCdjoA-l0Qn_1Crtk';
            const response = await axios.get(
              `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${apiKey}`
            );

            console.log(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${apiKey}`)
  
            if (response.data.items.length > 0) {
              const address = response.data.items[0].address.label;
              setAddress(address);
            }
          },
          (error) => {
            console.error(error);
          },
          { enableHighAccuracy: true, distanceFilter: 10 }
        );
      };
  
      getLocation();
  
      return () => {
        if (watchId !== null) {
          Geolocation.clearWatch(watchId);
        }
      };
    }, []);


    useEffect(() => {
        // Sync authUser to async storage whenever it changes
        const loadUser = async () => {
            console.log("running use effect ")
            const response = await axios.get(`http://localhost:4000/promotion/get`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });


            console.log(response)
            setPromotionList(response.data)

        }


        loadUser()
    }, [])

    const renderScene = ({ route }) => {
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


    const renderPromotionItems = ({ item }) => (
        <PromotionListCard promotion={item} navigation={navigation} />
    );

    const renderFoodItems = ({ item }) => (
        <HomeFoodListCard food={item} navigation={navigation} />
    );


    const handleTextInputChange = (value) => {
        console.log(value)
    }


    return (
        <View className='flex-1 bg-white'>
            {/* display the customer's current locatoin */}
            <View className='flex flex-row px-10 items-start justify-center space-x-2 bg-orange-600 h-auto'>
                <Image source={require('../../assets/location.jpeg')} className='w-5 h-5 rounded-xl' />
                <Text className='text-white'>{address} {location? `(${location.latitude.toFixed(2)} , ${location.longitude.toFixed(2)})`:"null location"}</Text>
            </View>

            {/* Header -> search bar */}

            <View className='flex flex-row justify-center px-5 py-1'>
                <TextInput placeholder='search restaurants, food ...' className='w-full rounded-lg text-black px-3 border-gray-300  border-b-2 ' placeholderTextColor={"#888"} onChangeText={(value) => handleTextInputChange(value)} />

            </View>

            {/* Promotion Banner (Discounts ...) Restarurants*/}
            <View className='bg-white'>
                <FlatList
                    data={promotionList}
                    renderItem={renderPromotionItems}
                    keyExtractor={item => item._id}
                    horizontal
                    className=''
                />
            </View>
            {/* Our own foods specially burgures */}

            <View className='bg-white'>
                <Text className='text-right text-xs pr-2'>scroll to left</Text>
                <FlatList
                    data={foodList}
                    renderItem={renderFoodItems}
                    keyExtractor={item => item.id}
                    horizontal
                    className=''
                />
            </View>

            {/*Restaurant filter tap options ( nearby , popular, new ) */}


            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={() => setIndex(index)}
                initialLayout={initialLayout}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={styles.indicator}
                        style={styles.tabBar}
                        labelStyle={styles.label}
                        activeColor='#000'
                        inactiveColor='#666'


                    />
                )}
            />




        </View>
    )

}













const styles = StyleSheet.create({

    tabBar: {
        backgroundColor: '#eee',
        borderRadius: 5,
        marginHorizontal: 10,

    },
    indicator: {
        backgroundColor: '#555',

    },
    label: {
        color: '#fff',
        fontWeight: 'bold',

    },
});