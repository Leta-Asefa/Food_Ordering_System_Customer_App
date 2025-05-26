import {useEffect, useState} from 'react';
import {
    Alert,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLocationContext} from '../../context_apis/Location';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';
const icons = {
  home: 'home',
  office: 'briefcase',
  university: 'school',
  family: 'account-group',
  school: 'school',
  park: 'tree',
};

const DeliveryAddress = ({navigation}) => {
  const {latitude, longitude, address} = useLocationContext();
  const [deliveryaddress, setDeliveryAddress] = useState({
    address,
    latitude,
    longitude,
  });
  const [query, setQuery] = useState(address);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_KEY =process.env.HERE_MAPS_API_KEY ||'vNw_RmL_TFApW6kTtIGUNItPw1CCdjoA-l0Qn_1Crtk';
  const BASE_URL = 'https://geocode.search.hereapi.com/v1/geocode';
  const {authUser} = useAuthUserContext();

  const handleSearch = async text => {
    setQuery(text);
console.log("Text ",text);
    if (text.trim().length === 0) {
      setSuggestions([]);
      setDeliveryAddress(null)
      return;
    }

    setLoading(true);

    
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: text,
                apiKey: API_KEY,
            },
        });
        
      setSuggestions(response.data.items);
      
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = item => {
    setQuery(item.title);
    setSuggestions([]);
    setDeliveryAddress({
      address: item.title,
      longitude: item.position.lng,
      latitude: item.position.lat,
      postalCode: item.address.postalCode,
      country: item.address.countryName,
      city: item.address.city,
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleSelectAddress(item)}>
      <View className="px-12 py-1  bg-gray-100 mx-5 mt-0.5 rounded-md">
        <Text>{item.title}</Text>
        <Text>{item.address.city} </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     
    <View className="flex-1 p-5">
      <Text className="text-center my-5 font-bold text-xl">
        Add Your Delivery Address
      </Text>

      <View className="flex-row items-center justify-center">
        <View className="w-10 h-10 flex-row items-center justify-center">
          <Entypo name="location" size={27} color="#444" />
        </View>

        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder="location name ..."
          placeholderTextColor={'#aaa'}
          className="h-10 border border-gray-500  pl-2 flex-1 rounded-lg"
        />
      </View>

      {loading && (
        <Text className="pl-12 pt-1 text-orange-500">Loading...</Text>
      )}
     

      <View className="flex-wrap flex-row justify-between mt-24">
        {authUser?.user?.commonDeliveryLocations.map(location => {
          const isSelected = location.name === deliveryaddress?.name;

          return (
            <TouchableOpacity
              key={location?._id}
              onPress={() => {
                setDeliveryAddress(location);
                setQuery(location.address);
              }}
              className={`items-center gap-1 w-1/3 mb-4 rounded-lg ${
                isSelected ? 'bg-gray-300' : 'bg-gray-200'
              }`}>

              <Icon name={icons[location.name]} size={30} color={`${isSelected? 'orange':''}`}/>

              <Text className="text-sm mt-1 font-medium">{location.name}</Text>
              <Text className="text-xs text-gray-500" numberOfLines={2}>
                {location.address}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={suggestions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        className="absolute top-32 left-0 right-0 bg-white z-50 shadow-lg mt-2"
      />

      <TouchableOpacity
        onPress={() =>{
            if(deliveryaddress?.address)
            navigation.navigate('confirmorder', {deliveryaddress})
        else 
            Alert.alert("Please select a delivery address","search for a location or select from the common locations")
    }
}>
        <Text className="bg-orange-500 p-2 font-bold text-center text-xl rounded-lg text-white w-44 mx-auto ">
          Continue
        </Text>
      </TouchableOpacity>
    </View>

    </TouchableWithoutFeedback>
  );
};

export default DeliveryAddress;
