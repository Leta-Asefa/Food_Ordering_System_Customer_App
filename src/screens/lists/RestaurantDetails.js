import { Button, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RestaurantListCard from "./RestaurantListCard";
import { restaurants } from "../../utilities_and_constants/constants";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useEffect, useState } from "react";
import NearByRestaurants from "./NearByRestaurants";
import PopularRestaurants from "./PopularRestaurants";
import ImageViewing from 'react-native-image-viewing';
import FoodList from "./FoodList";
import DrinkList from "./DrinkList";
import { CartProvider } from "../../context_apis/CartContext";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons';


const initialLayout = { width: Dimensions.get('window').width };

const RestaurantDetails = ({ navigation, route }) => {

    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([])
    const { distance, duration } = route?.params || {};
    const [restaurant, setRestaurant] = useState(route?.params?.restaurant || {});  // Store restaurant in state


    useEffect(() => {
        const getPictures = async () => {
            console.log("use effect running", `http://localhost:4000/restaurant/${restaurant._id}/pictures`)
            const response = await axios.get(`http://localhost:4000/restaurant/${restaurant._id}/pictures`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            // Map images into the required format for ImageViewing
            const formattedImages = response.data.pictures.map(pictureUrl => ({
                uri: pictureUrl
            }));

            setImages(formattedImages);

        }

        if (restaurant._id) {
            console.log(distance,duration,"Duration ..........")
            getPictures();
        }
        // 
    }, [restaurant])

    if (!restaurant) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }


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
        { key: 'non_fasting_food', title: 'Non Fasting' },
        { key: 'fasting_food', title: 'Fasting' },
        { key: 'drink', title: 'Drink' },
        { key: 'catering', title: 'Catering' }
    ]);

    const renderScene = SceneMap({
        non_fasting_food: FoodList,
        fasting_food: FoodList,
        drink: DrinkList,
        catering: NearByRestaurants

    });



    return (
        <CartProvider>
            <View className='flex-1'>

                <Text className='text-center text-2xl mt-2 font-bold '>{restaurant.name}</Text>
                <TouchableOpacity onPress={() => openViewer(0)} className='relative'>
                    <Image
                        source={{ uri: String(restaurant.image) }}
                        className='w-full h-40 max-h-56 rounded-lg'
                        resizeMode="cover"
                    />

                </TouchableOpacity>
                <ImageViewing
                    images={images}
                    imageIndex={currentIndex}
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                    onImageIndexChange={(index) => setCurrentIndex(index)}
                    FooterComponent={({ imageIndex }) => (
                        <View className='flex flex-row justify-between p-5'>
                            <TouchableOpacity onPress={onPrevious} disabled={imageIndex === 0}>
                                <Text style={{ color: imageIndex === 0 ? '#ccc' : '#fff' }}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onNext} disabled={imageIndex === images.length - 1}>
                                <Text style={{ color: imageIndex === images.length - 1 ? '#ccc' : '#fff' }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />



                <View className=' flex flex-row justify-center items-center'>
                    <View className=' flex flex-row justify-center items-center'>
                        <Icon
                            name="access-time"  // Use the icon name here
                            size={24}
                            color="orange"
                            className="w-5 h-5"
                        />
                        <Text className='w-auto'> {duration}</Text>
                    </View>

                    <View className=' flex flex-row justify-center items-center'>
                        <Icon
                            name="star-rate"  // Use the icon name here
                            size={24}
                            color="orange"
                            className="w-5 h-5"
                        />
                        <Text className='w-auto'>Customer's Rating : {restaurant.rating}</Text>
                    </View>

                    <View className=' flex flex-row justify-center items-center'>
                        <Icon
                            name="map"  // Use the icon name here
                            size={24}
                            color="orange"
                            className="w-5 h-5"
                        />
                        <Text className='w-auto'> {distance}</Text>
                    </View>

                </View>

                {/* top tab view for (food, drinks, ) */}
                <Text className='text-center font-bold text-xl bg-gray-200 mx-2 rounded-md'>Menu</Text>
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


        </CartProvider>
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