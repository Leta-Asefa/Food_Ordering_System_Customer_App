import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';

const locations = [
  {id: 'home', name: 'Home', icon: 'home'},
  {id: 'office', name: 'Office', icon: 'briefcase'},
  {id: 'university', name: 'University', icon: 'school'},
  {id: 'family', name: 'Family House', icon: 'account-group'},
  {id: 'school', name: 'School', icon: 'school'},
  {id: 'park', name: 'Park', icon: 'tree'},
];

const HERE_API_KEY =
  process.env.HERE_MAPS_API_KEY ||
  'vNw_RmL_TFApW6kTtIGUNItPw1CCdjoA-l0Qn_1Crtk';

const CommonDeliveryLocations = () => {
  const [editing, setEditing] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null); // Track selected icon
  const mapRef = useRef(null);
  const {authUser} = useAuthUserContext();

  useEffect(() => {
    const reversedData = authUser.user.commonDeliveryLocations.reduce((acc, item) => {
      acc[item.name.toLowerCase()] = {
        address: item.address,
        city: item.city,
        country: item.country,
        latitude: item.latitude,
        longitude: item.longitude,
        postalCode: item.postalCode,
      };
      return acc;
    }, {});
    setSelectedLocations(reversedData);
  }, []);

  // 🔹 Handle Search Input
  const handleSearch = async query => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
          query,
        )}&apiKey=${HERE_API_KEY}`,
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  // 🔹 Handle Location Selection
  const handleSelectLocation = async (id, location) => {
    if (!id) {
      Alert.alert('Error', 'Please select a location type first!');
      return;
    }

    let commonDeliveryLocation = {};

    // Handle API response format
    if (location.position) {
      commonDeliveryLocation = {
        latitude: location.position.lat,
        longitude: location.position.lng,
        address: location.address.label || '',
        city: location.address.city || '',
        country: location.address.countryName || '',
        postalCode: location.address.postalCode || '',
      };
    } else if (location.latitude && location.longitude) {
      lat = location.latitude;
      lng = location.longitude;

      try {
        const response = await fetch(
          `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apiKey=${HERE_API_KEY}`,
        );
        const data = await response.json();
        const item = data.items[0]; // First result

        if (item) {
          commonDeliveryLocation = {
            address: item.address.label,
            longitude: item.position.lng,
            latitude: item.position.lat,
            postalCode: item.address.postalCode || '',
            country: item.address.countryName || '',
            city: item.address.city || '',
          };
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        Alert.alert('Error', 'Could not fetch address details.');
        return;
      }

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        Alert.alert('Invalid Location', 'Could not fetch valid coordinates.');
        return;
      }
    }

    setSelectedLocations(prev => ({
      ...prev,
      [id]: commonDeliveryLocation,
    }));

    setSearchQuery('');
    setSearchResults([]);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // 🔹 Send Data to Backend
  const handleUpdate = async () => {
    const transformedData = Object.keys(selectedLocations).map(key => {
      return {
        name: key,
        latitude: selectedLocations[key].latitude,
        longitude: selectedLocations[key].longitude,
        address: selectedLocations[key].address,
        city: selectedLocations[key].city,
        country: selectedLocations[key].country,
        postalCode: selectedLocations[key].postalCode,
      };
    });

    console.log('Transforment ', transformedData);

    try {
      const response = await axios.put(
        `http://localhost:4000/user/${authUser.user._id}`,
        {
          commonDeliveryLocations: transformedData,
        },
      );
      if (response.data.message) {
        Alert.alert('Success', 'Locations updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating locations:', error);
      Alert.alert('Error', 'Failed to update locations. Try again.');
    }
  };

  return (
    <View className="p-4 bg-white rounded-lg shadow">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Text className="mr-2 text-gray-600">Enable Editing</Text>
          <Switch value={editing} onValueChange={setEditing} />
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        className="w-full px-2 border border-gray-300 rounded-lg mb-2"
        placeholder="Search location..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Search Results List */}
      {searchResults.length > 0 && (
        <ScrollView className="border border-gray-300 rounded-lg max-h-40 mb-2">
          {searchResults.map((item, index) => (
            <TouchableOpacity
              key={item.title + index}
              className="p-2 border-b border-gray-300"
              onPress={() => handleSelectLocation(selectedLocationId, item)}>
              <Text className="text-gray-700">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Map Section */}
      <MapView
        ref={mapRef}
        className="w-full h-52 rounded-lg mb-4"
        provider="google"
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={event => {
          if (editing && selectedLocationId) {
            handleSelectLocation(
              selectedLocationId,
              event.nativeEvent.coordinate,
            );
          }
        }}>
        {Object.entries(selectedLocations).map(([key, location]) => (
          <Marker
            key={key}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={key}
          />
        ))}
      </MapView>

      {/* Location Icons */}
      <View className="flex-wrap flex-row justify-between">
        {locations.map(loc => {
          const location = selectedLocations[loc.id];
          const isSelected = selectedLocationId === loc.id;
          return (
            <TouchableOpacity
              key={loc.id}
              onPress={() => {
                setEditing(true);
                setSelectedLocationId(loc.id);
              }}
              className={`items-center w-1/3 mb-4 rounded-lg ${
                isSelected ? 'bg-gray-200' : 'bg-transparent'
              }`}>
              <Icon
                name={loc.icon}
                size={30}
                color={location ? 'orange' : 'gray'}
              />
              <Text className="text-sm mt-1 font-medium">{loc.name}</Text>
              <Text className="text-xs text-gray-500" numberOfLines={2}>
                {location ? `${location.address}` : 'Add'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Update Button */}
      {editing && (
        <TouchableOpacity
          onPress={handleUpdate}
          className="bg-blue-500 py-2 rounded-lg mt-4">
          <Text className="text-white text-center font-semibold">Update</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommonDeliveryLocations;
