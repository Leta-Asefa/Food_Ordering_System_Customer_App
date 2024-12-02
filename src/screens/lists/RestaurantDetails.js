import { Button, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { restaurants } from "../../utilities_and_constants/constants";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useState } from "react";
import NearByRestaurants from "./NearByRestaurants";
import PopularRestaurants from "./PopularRestaurants";
import ImageViewing from 'react-native-image-viewing';

const initialLayout = { width: Dimensions.get('window').width };

const RestaurantDetails = () => {

    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [require('../../assets/reslog1.jpeg'), require('../../assets/reslog2.png'), require('../../assets/reslog3.jpeg'), require('../../assets/reslog4.jpeg')]



    const openViewer = (index) => {
        setCurrentIndex(index);
        setVisible(true);
    };

    const onNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const onPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const [routes] = useState([
        { key: 'nearby', title: 'Food' },
        { key: 'popular', title: 'Drink' },
        { key: 'catering', title: 'Catering' }
    ]);

    const renderScene = SceneMap({
        nearby: NearByRestaurants,
        popular: PopularRestaurants,
        catering: NearByRestaurants

    });

  

    return (
        <View className='flex-1'>

            <Text className='text-center text-2xl mt-2 font-bold '>Restaurant Name</Text>
         <TouchableOpacity onPress={()=> openViewer(0)}>
            <Image source={images[2]} className='w-full h-auto'/>
            <Text className='text-xs text-right'>More Images . . .</Text>
         </TouchableOpacity>
            <ImageViewing
                images={images}
                imageIndex={currentIndex}
                visible={visible}
                onRequestClose={() => setVisible(false)}
                onImageIndexChange={(index) => setCurrentIndex(index)}
                FooterComponent={({ imageIndex }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                        <TouchableOpacity onPress={onPrevious} disabled={imageIndex === 0}>
                            <Text style={{ color: imageIndex === 0 ? '#ccc' : '#fff' }}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onNext} disabled={imageIndex === images.length - 1}>
                            <Text style={{ color: imageIndex === images.length - 1 ? '#ccc' : '#fff' }}>Next</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />



            <View className=' flex flex-row justify-center'>
                <Image source={require('../../assets/rating.png')} className='w-5 h-5' />
                <Text className='w-40'>Customer's Review : 4.5</Text>
            </View>

            {/* top tab view for (food, drinks, ) */}

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



export default RestaurantDetails









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