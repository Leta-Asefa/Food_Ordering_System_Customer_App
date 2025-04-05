import React, { createContext, useEffect, useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { messaging ,app} from "./firebaseConfig";
import axios from "axios";
import { useAuthUserContext } from "./AuthUserContext";
import notifee from '@notifee/react-native';
// Create Context
export const FCMContext = createContext();

export const FCMProvider = ({ children }) => {
  const [fcmToken, setFcmToken] = useState(null);
  const { authUser } = useAuthUserContext();

  useEffect(() => {
    (async () => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    })();
  }, []);
  

  // Request notification permission for Android 13+
  const requestPermission = async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Get FCM Token
  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken(); // Ensure using getApp()
      if (token) {
        setFcmToken(token);

        // Send token to your backend
        await axios.post("http://localhost:4000/fcm/save", {
          userId: authUser?.user?._id,
          fcmToken: token,
        });
      } else {
        console.log("Failed to get FCM token.");
      }
    } catch (error) {
      console.log("Error getting FCM token:", error);
    }
  };

  // Handle incoming notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground Message:", remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher', // Ensure this icon exists in your resources
        },
      });
      
    });

    return unsubscribe;
  }, []);



  //for background and quit state
  useEffect(() => {
    // Handle notifications received while the app is in the background or quit state
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Background Message:", remoteMessage);
    });
  
    // Handle notification tap when the app was in the background
    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("User tapped notification (background):", remoteMessage);
      Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);

    });
  
    // Handle notification tap when the app was completely closed (quit state)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification caused app to open (quit state):", remoteMessage);
          Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
        }
      });
  
    return unsubscribeOnNotificationOpened;
  }, []);
  

  useEffect(() => {
    (async () => {
      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        await getFCMToken();
      } else {
        console.log("Notification permission denied.");
      }
    })();
  }, [authUser]);

  return <FCMContext.Provider value={{ fcmToken }}>{children}</FCMContext.Provider>;
};
