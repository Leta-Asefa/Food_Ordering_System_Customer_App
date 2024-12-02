import React, { useState } from 'react'
import { Dimensions, FlatList, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import NearByRestaurants from './NearByRestaurants';
import PopularRestaurants from './PopularRestaurants';
import { foodList, promotionList } from '../../utilities_and_constants/constants';
import PromotionListCard from './PromotionListCard';
import FoodListCard from './HomeFoodListCard';
import RestaurantDetails from './RestaurantDetails';
import HomeFoodListCard from './HomeFoodListCard';


const initialLayout = { width: Dimensions.get('window').width };




export default function Restaurants({ navigation }) {

    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'nearby', title: 'Nearby' },
        { key: 'popular', title: 'Popular' },
        {key:'favourite',title:'Favorites'}
    ]);

    const renderScene = SceneMap({
        nearby: NearByRestaurants,
        popular: PopularRestaurants,
        favourite:RestaurantDetails

    });

    const renderPromotionItems = ({ item }) => (
        <PromotionListCard promotion={item} navigation={navigation}/>
    );

    const renderFoodItems = ({ item }) => (
        <HomeFoodListCard food={item} navigation={navigation}/>
    );


    return (
        <View className='flex-1'>
            {/* Header -> search bar */}

            <View className='flex flex-row justify-center p-1'>
                <TextInput placeholder='search restaurants, food ...' className='w-60 bg-white rounded-lg' />
                <TouchableOpacity>
                    <Text className='text-xl'>Search</Text>
                </TouchableOpacity>
            </View>

            {/* Promotion Banner (Discounts ...) Restarurants */}
            <View className='bg-gray-300'>
                <FlatList
                    data={promotionList}
                    renderItem={renderPromotionItems}
                    keyExtractor={item => item.id}
                    horizontal
                    className=''
                />
            </View>
            {/* Our own foods specially burgures */}

            <View className='bg-gray-50'>
                <Text className='text-right text-xs pr-2'>scroll to left</Text>
                <FlatList
                    data={foodList}
                    renderItem={renderFoodItems}
                    keyExtractor={item => item.id}
                    horizontal
                    className=''
                />
            </View>

            {/*Restaurant filter tap options ( nearby , popular, new )  */}


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