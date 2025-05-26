import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import {useEffect, useState} from 'react';
import ImageViewing from 'react-native-image-viewing';
import FoodList from './FoodList';
import DrinkList from './DrinkList';
import {useCartContext} from '../../context_apis/CartContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MenuFoodListCard from './MenuFoodListCard';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';
import {useRestaurantsListContext} from '../../context_apis/RestaurantsList';
import RestaurantRatings from './RestaurantRatings';

const initialLayout = {width: Dimensions.get('window').width};

const RestaurantDetails = ({navigation, route}) => {
  const [index, setIndex] = useState(0);
  const {authUser, setAuthUser} = useAuthUserContext();
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [menu, setMenu] = useState([]);
  const [restaurant, setRestaurant] = useState(route?.params?.restaurant); // Store restaurant in state
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const {clearCart,cart} = useCartContext();
  useEffect(() => {
    clearCart();
  }, []);
  if (!restaurant) {
    console.log('Delivery address is not set yet');
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading Restaurant...</Text>
      </View>
    );
  }
  const [isFavorite, setIsFavorite] = useState(
    authUser.user.favouriteRestaurants.includes(restaurant._id),
  );
  const {duration, distance} = route?.params; //guess what would happen if you take this line above the if(!restaurant) conidition :)

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('restaurants');
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup when component unmounts
  }, []);

  useEffect(() => {
    const getPictures = async () => {
      const response = await axios.get(
        `http://localhost:4000/restaurant/${restaurant._id}/pictures`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      // Map images into the required format for ImageViewing
      const formattedImages = response.data.pictures.map(pictureUrl => ({
        uri: pictureUrl,
      }));

      setImages(formattedImages);
    };

    const getMenu = async () => {
      const response = await axios.get(
        `http://localhost:4000/item/${restaurant._id}/menu`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      // console.log("Menu ------------------", response)
      setMenu(response.data);
    };

    if (restaurant._id) {
      getPictures();
      getMenu();
    }
    //
  }, [restaurant]);

  const openViewer = index => {
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
    {key: 'non_fasting', title: 'Non Fasting'},
    {key: 'fasting', title: 'Fasting'},
    {key: 'drink', title: 'Drink'},
    {key: 'catering', title: 'Catering'},
  ]);

  const renderScene = ({route}) => {
    console.log(route.key);
    switch (route.key) {
      case 'fasting':
        return <FoodList item={menu.fasting} navigation={navigation} />;
      case 'non_fasting':
        return <FoodList item={menu.nonfasting} navigation={navigation} />;
      case 'drink':
        return <DrinkList item={menu.drink} navigation={navigation} />;
      case 'catering':
        return <FoodList item={menu.catering} navigation={navigation} />;
      default:
        return null;
    }
  };

  const handleAddFavorite = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/user/favourite_restaurant/${authUser.user._id}/${restaurant._id}`,
      );

      if (!response?.data?.message) {
        // if message="error " doesn't exist
        setIsFavorite(response.data.isFavorite);
        const newFavoriteList = response.data.isFavorite
          ? [...authUser.user.favouriteRestaurants, restaurant._id.toString()]
          : authUser.user.favouriteRestaurants.filter(
              id => id !== restaurant._id.toString(),
            );

        console.log('new fav list ', newFavoriteList);
        setAuthUser({
          ...authUser,
          user: {...authUser.user, favouriteRestaurants: newFavoriteList},
        });
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  return (
    <View className="flex-1">
      <View className="flex flex-row justify-between items-center px-2">
        <TouchableOpacity
          onPress={() => setReviewModalVisible(true)}
          className="mr-2">
          <Icon
            name="comment" // Use the icon name here
            size={24}
            color="orange"
            className="w-5 h-5 ml-2"
          />
        </TouchableOpacity>
        <Text className="text-center text-2xl mt-2 font-bold">
          {restaurant.name}{' '}
        </Text>
        <TouchableOpacity onPress={handleAddFavorite}>
          <Icon
            name={`${isFavorite ? 'favorite' : 'favorite-outline'}`} // Use the icon name here
            size={24}
            color="orange"
            className="w-5 h-5 ml-2"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => openViewer(0)} className="relative">
        <Image
          source={{uri: String(restaurant.image)}}
          className="w-full h-40 max-h-56 rounded-lg"
          resizeMode="cover"
        />
      </TouchableOpacity>
      <ImageViewing
        images={images}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onImageIndexChange={index => setCurrentIndex(index)}
        FooterComponent={({imageIndex}) => (
          <View className="flex flex-row justify-between p-5">
            <TouchableOpacity onPress={onPrevious} disabled={imageIndex === 0}>
              <Text style={{color: imageIndex === 0 ? '#ccc' : '#fff'}}>
                Previous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onNext}
              disabled={imageIndex === images.length - 1}>
              <Text
                style={{
                  color: imageIndex === images.length - 1 ? '#ccc' : '#fff',
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View className=" flex flex-row justify-between items-center px-2 py-1">
        <View className=" flex flex-row justify-center items-center">
          <Icon
            name="access-time" // Use the icon name here
            size={24}
            color="green"
            className="w-5 h-5"
          />
          <Text className="w-auto text-xs"> {duration}</Text>
        </View>

        <View className=" flex flex-row justify-center items-center">
          <Icon
            name="star-rate" // Use the icon name here
            size={24}
            color="orange"
            className="w-5 h-5"
          />
          <Text className="w-auto text-xs">
            Customer's Rating : {String(restaurant.rating).slice(0, 4)}
          </Text>
        </View>

        <View className=" flex flex-row justify-center items-center">
          <Icon
            name="map" // Use the icon name here
            size={24}
            color="blue"
            className="w-5 h-5"
          />
          <Text className="w-auto text-xs"> {distance}</Text>
        </View>
      </View>

      {/* top tab view for (food, drinks, ) */}
      <View>
        <Text className="text-center font-bold text-xl bg-gray-200 mx-2 rounded-md">
          Menu
        </Text>
      </View>

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

      {/* Modal */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        onRequestClose={() => setReviewModalVisible(false)}>
        <View className="flex-1 bg-white">
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setReviewModalVisible(false)}
            className="absolute top-4 right-4 z-10 bg-gray-200 p-2 rounded-full">
            <Text className="text-black font-bold">X</Text>
          </TouchableOpacity>

          {/* RestaurantRatings Component */}
          <RestaurantRatings
            restaurantId={restaurant._id}
            userId={authUser.user._id}
          />
        </View>
      </Modal>

      <TouchableOpacity
        className="bg-red-500 rounded-full flex-row items-center p-2 justify-center absolute right-5 bottom-5"
        onPress={() => cart.length===0? Alert.alert('Empty Cart !',"Dear Customer, You don't  select any item"): navigation.navigate('cart')}>
        <Icon name="shopping-cart-checkout" size={20} color="white" />
        {/* <Text className="text-white font-bold ml-2">
    Checkout
  </Text> */}
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantDetails;

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
