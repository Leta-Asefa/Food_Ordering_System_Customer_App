import { useState } from "react";
import { FlatList, Image, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { useLocationContext } from "../../context_apis/Location";
import axios from "axios";
import Entypo from 'react-native-vector-icons/Entypo'
const DeliveryAddress = ({ navigation }) => {

    const { address } = useLocationContext()
    const [deliveryaddress, setDeliveryAddress] = useState('')
    const [query, setQuery] = useState(address+ " ( current location )");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_KEY = process.env.HERE_MAPS_API_KEY || 'vNw_RmL_TFApW6kTtIGUNItPw1CCdjoA-l0Qn_1Crtk';
    const BASE_URL = 'https://geocode.search.hereapi.com/v1/geocode';


    const handleSearch = async (text) => {
        setQuery(text);

        if (text.trim().length === 0) {
            setSuggestions([]);
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

    const handleSelectAddress = (item) => {
        setQuery(item.title)
        setSuggestions([])
        setDeliveryAddress({
            address:item.title ,
            longitude: item.position.lng,
            latitude: item.position.lat,
            postalCode: item.address.postalCode,
            country: item.address.countryName,
            city:item.address.city

        })
    }


    const renderItem = ({ item }) => (
    
        <TouchableOpacity onPress={() => handleSelectAddress(item)}>
            <View className="px-12 py-1 border-b border-gray-200 bg-gray-100">
                <Text>{item.title}</Text>
                <Text>{item.address.city} </Text>
            </View>
        </TouchableOpacity>
    );

    return (

        <View className='flex-1 p-5'>

            <Text className='text-center my-5 font-bold text-xl'>Add Your Delivery Address</Text>


            <View className='flex-row items-center justify-center'>
                <View className='w-10 h-10 flex-row items-center justify-center'>
                    <Entypo name="location" size={27} color="#444" />
                </View>

                <TextInput
                    value={query}
                    onChangeText={handleSearch}
                    placeholder="location name ..."
                    placeholderTextColor={"#aaa"}
                    className="h-10 border border-gray-500  pl-2 flex-1 rounded-lg"
                />
            </View>

            {loading && <Text className='pl-12 pt-1 text-orange-500'>Loading...</Text>}
            <FlatList
                data={suggestions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

            <TouchableOpacity onPress={()=> navigation.navigate('confirmorder',{deliveryaddress})}>
                <Text className='bg-green-500 text-center text-xl rounded-lg text-white w-44 mx-auto '>
                    Continue
                </Text>
            </TouchableOpacity>
        </View>


    );
};

export default DeliveryAddress;
