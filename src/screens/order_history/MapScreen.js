import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const defaultRouteCoordinates = [
  { latitude: 37.7749, longitude: -122.4194 }, // Point 1 (San Francisco)
  { latitude: 37.7849, longitude: -122.4294 }, // Point 2
  { latitude: 37.7949, longitude: -122.4394 }, // Point 3
];

const defaultUserLocation = { latitude: 37.7749, longitude: -122.4194 }; // Default user location
const defaultDestination = { latitude: 37.7949, longitude: -122.4394 }; // Default destination

const MapScreen = ({ 
  routeCoordinates = defaultRouteCoordinates, 
  userLocation = defaultUserLocation, 
  destination = defaultDestination 
}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={userLocation} title="My Location" />
        <Marker coordinate={destination} title="Destination" />
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="blue" />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
