import React, { useState, useRef } from "react";
import { View, Text, Switch, TouchableOpacity, TextInput, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const locations = [
    { id: "home", name: "Home", icon: "home" },
    { id: "office", name: "Office", icon: "briefcase" },
    { id: "university", name: "University", icon: "school" },
    { id: "family", name: "Family House", icon: "account-group" },
    { id: "school", name: "School", icon: "school" },
    { id: "park", name: "Park", icon: "tree" },
];

const HERE_API_KEY = process.env.HERE_MAPS_API_KEY || 'vNw_RmL_TFApW6kTtIGUNItPw1CCdjoA-l0Qn_1Crtk';

const CommonDeliveryLocations = () => {
    const [editing, setEditing] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState(null); // 🔹 Track selected icon
    const mapRef = useRef(null);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&apiKey=${HERE_API_KEY}`);
            const data = await response.json();
            setSearchResults(data.items || []);
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };
    const handleSelectLocation = (id, location) => {
        if (!id) {
            console.error("No location ID selected.");
            return;
        }

        let lat, lng;

        // Handle both API response and map press event
        if (location.position) {
            lat = location.position.lat;
            lng = location.position.lng;
        } else if (location.latitude && location.longitude) {
            lat = location.latitude;
            lng = location.longitude;
        }

        if (typeof lat !== 'number' || typeof lng !== 'number') {
            console.error("Invalid latitude or longitude:", lat, lng);
            return;
        }

        setSelectedLocations((prev) => ({
            ...prev,
            [id]: { latitude: lat, longitude: lng },
        }));

        setSearchQuery("");
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

    const handleUpdate = () => {
        console.log("Updated Locations:", selectedLocations);
        alert("Locations Updated!");
    };

    return (
        <View className="p-1 bg-white rounded-lg shadow">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                    <Text className="mr-2 text-gray-600">Enable Editing</Text>
                    <Switch value={editing} onValueChange={setEditing} />
                </View>
            </View>

            {/* Search Bar */}
            <TextInput
                className="w-full px-2 border border-gray-300 rounded-lg mb-1"
                placeholder="Search location..."
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {/* Search Results List */}
            {searchResults.length > 0 && (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="p-2 border-b border-gray-300"
                            onPress={() => handleSelectLocation(selectedLocationId, item)}
                        >
                            <Text className="text-gray-700">{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    disableScrollViewPanResponder={true}
                />
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
                onPress={(event) => {
                    if (editing && selectedLocationId) {
                        handleSelectLocation(selectedLocationId, event.nativeEvent.coordinate);
                    }
                }}
            >
                {Object.entries(selectedLocations).map(([key, location]) => {
                    // 🔹 Validate coordinate data
                    if (location && typeof location.latitude === 'number' && typeof location.longitude === 'number') {
                        return (
                            <Marker
                                key={key}
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                }}
                                title={key}
                            />
                        );
                    }
                    return null; // 🔹 Skip rendering if coordinate is invalid
                })}
            </MapView>
            {/* Location Icons */}
            <View className="flex-wrap flex-row justify-between">
                {locations.map((loc) => {
                    const location = selectedLocations[loc.id];
                    const isSelected = selectedLocationId === loc.id; // 🔹 Check if icon is selected
                    return (
                        <TouchableOpacity
                            key={loc.id}
                            onPress={() => {
                                setEditing(true);
                                setSelectedLocationId(loc.id); // 🔹 Set selected icon
                            }}
                            className={`items-center w-1/3 mb-4 p-2 rounded-lg ${isSelected ? "bg-gray-200" : "bg-transparent" // 🔹 Change background color if selected
                                }`}
                        >
                            <Icon name={loc.icon} size={30} color={location ? "blue" : "gray"} />
                            <Text className="text-sm mt-1 font-medium">{loc.name}</Text>
                            <Text className="text-xs text-gray-500">
                                {location && location.latitude && location.longitude
                                    ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
                                    : "Add"}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Update Button */}
            {editing && (
                <TouchableOpacity
                    onPress={handleUpdate}
                    className="bg-blue-500 py-2 rounded-lg mt-4"
                >
                    <Text className="text-white text-center font-semibold">Update</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default CommonDeliveryLocations;