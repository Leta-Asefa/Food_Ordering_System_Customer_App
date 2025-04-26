import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  InteractionManager,
  Image,
} from 'react-native';
import MapView, {Polyline, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSocketContext} from '../../context_apis/SocketContext';
import Ionicons from 'react-native-vector-icons/Ionicons';


const {width, height} = Dimensions.get('window');

const MapScreen = ({routeCoordinates, userLocation, destination}) => {
  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(userLocation);
  const socket = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.on('current_location', ({current_location}) => {
        if (
          current_location &&
          typeof current_location.latitude === 'number' &&
          typeof current_location.longitude === 'number'
        ) {
          setCurrentLocation(current_location);
          console.log('Socket -> Current location:', current_location);
        } else {
          console.warn(
            'Invalid location received from socket:',
            current_location,
          );
        }
      });

      return () => socket.off('current_location');
    }
  }, [socket]);

  useEffect(() => {
    if (polylineRef.current && routeCoordinates.length > 1) {
      polylineRef.current.setNativeProps({coordinates: routeCoordinates});
    }
  }, [routeCoordinates]);

  useEffect(() => {
    if (
      mapRef.current &&
      Array.isArray(routeCoordinates) &&
      routeCoordinates.length > 1
    ) {
      setTimeout(() => {
        mapRef.current.fitToCoordinates(routeCoordinates, {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          },
          animated: true,
        });
      }, 1000); // delay gives map time to layout
    }
  }, [JSON.stringify(routeCoordinates)]);

  return (
    <View className="h-[360px] w-full">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        className="w-full h-full"
        showsUserLocation>
        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            ref={polylineRef}
            key={`polyline_${routeCoordinates.length}`} // Force re-render
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}

        {/* User Location Marker */}
        {userLocation?.latitude && userLocation?.longitude && (
          <Marker coordinate={userLocation} title="You are here" />
        )}

        {currentLocation?.latitude && currentLocation?.longitude ? (
          <Marker coordinate={currentLocation} title="Delivery Vehicle">
            <Ionicons name="car" size={25} color="#f00" />
          </Marker>
        ) : (
          <Marker coordinate={userLocation} title="Waiting to move">
            <Ionicons name="car" size={20} color="gray" />
          </Marker>
        )}

        {/* Destination Marker */}
        {destination?.latitude && destination?.longitude && (
          <Marker coordinate={destination} title="You are here" />
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;
