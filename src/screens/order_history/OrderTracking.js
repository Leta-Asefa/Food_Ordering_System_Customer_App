import {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {Polyline, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useLocationContext} from '../../context_apis/Location';
import axios from 'axios';
import MapScreen from './MapScreen';
import DeliveryRatings from './DeliveryRatings';
import { useAuthUserContext } from '../../context_apis/AuthUserContext';

const OrderTracking = ({navigation, route}) => {
  const [order, setOrder] = useState(route?.params?.order || {});
  const {longitude, latitude} = useLocationContext();
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [userLocation, setUserLocation] = useState({});
  const [destination, setDestination] = useState({});
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const {authUser}=useAuthUserContext()

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading ...</Text>
      </View>
    );
  }

  useEffect(() => {
    const backAction = () => {
      navigation.replace('order_history');

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
    const getRouteCoordinates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/order/maproute/${latitude}/${longitude}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        );

        setRouteCoordinates(response.data.routeCoordinates);
        setDestination(response.data.destination);
        setUserLocation(response.data.userLocation);
      } catch (error) {
        console.log(error);
      }
    };

    getRouteCoordinates();
  }, []);

  const handleCall = async phoneNumber => {
    if (phoneNumber) {
      const phoneUrl = `tel:${phoneNumber}`;

      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Unable to open the dialer');
      }
    } else {
      Alert.alert('Error', 'No phone number provided');
    }
  };

  return (
    <View>
      <Text className="font-bold text-center text-xl">
        Status : <Text className="text-green-600 ">{order.status}</Text>
      </Text>

        <MapScreen
          key={`${order._id}_${routeCoordinates.length}`} // ensures rerender if route changes
          routeCoordinates={routeCoordinates}
          destination={destination}
          userLocation={userLocation}
        />

      <View className="rounded-lg border-t border-black">
        <View className="flex flex-row  space-x-3 px-5 py-1 mt-2">
          <View className="w-16">
            <FontAwesome name="clock-o" size={40} color="#000" />
          </View>
          <View className="px-5">
            <Text className="text-gray-500 font-semibold text-xs">
              Delivery Time
            </Text>
            <Text className="text-lg font-bold">{order.eta} Minutes</Text>
          </View>
        </View>

        <View className="flex flex-row justify-between items-center space-x-2 px-3 py-1 mx-1 mt-2 rounded-lg">
          <Image
            source={{uri: String(order.deliveryPersonId.image)}}
            className="w-16 h-16 rounded-lg"
            resizeMode="cover"
          />
          <View className="w-40">
            <Text className="font-bold">{order.deliveryPersonId.username}</Text>
            <View className="flex flex-row items-center ">
              <Ionicons name="star" size={15} color="#FFA500" />
              <Text className="text-xs">{order.deliveryPersonId.rating}</Text>
            </View>
            <Text className="text-xs">{order.deliveryPersonId.vehicle}</Text>
          </View>

          <View>
            <TouchableOpacity
              className="14"
              onPress={() => handleCall(order.deliveryPersonId.phoneNumber)}>
              <FontAwesome name="phone" size={30} color="#22c55e" />
            </TouchableOpacity>

            <TouchableOpacity
              className="14"
              onPress={() => setReviewModalVisible(true)}
              >
              <Icon name="reviews" size={30} color="orange" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="p-2 bg-gray-200 rounded-lg">
        <Text className="text-lg font-bold text-center">
          Order Id :{order._id}
        </Text>
        <View className="flex flex-row justify-center">
          <QRCode
            value={order._id}
            size={60}
            color="black"
            backgroundColor="white"
          />
        </View>
      </View>

      <Modal
            isVisible={reviewModalVisible}
            onBackdropPress={() => setReviewModalVisible(false)}
            onBackButtonPress={() => setReviewModalVisible(false)}
            avoidKeyboard={true}
            backdropOpacity={0}
            style={{margin: 0}}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                zIndex: 9999,
                elevation: 20,
              }}>
              <TouchableOpacity
                onPress={() => setReviewModalVisible(false)}
                className="bg-gray-50 flex flex-row justify-end pr-5">
                <FontAwesome name="close" size={35} color="#f00" />
              </TouchableOpacity>
              <DeliveryRatings deliveryPersonId={order.deliveryPersonId._id} userId={authUser.user._id}/>
            </View>
          </Modal>






    </View>
  );
};

export default OrderTracking;
