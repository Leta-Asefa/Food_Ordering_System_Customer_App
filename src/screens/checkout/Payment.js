import { ActivityIndicator, Text, View } from "react-native";
import WebView from "react-native-webview";
import { useContext, useEffect, useState } from "react";
import { CartContext, useCartContext } from "../../context_apis/CartContext";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import axios from "axios";

const Payment = ({ navigation,route }) => {

  const [checkoutUrl, setCheckoutUrl] = useState(route?.params?.checkouturl || null)
  const [loading, setLoading] = useState(true);


  if (!checkoutUrl) {
    console.log("Delivery address is not set yet");
    return (
        <View className="flex-1 justify-center items-center">
            <Text>Loading payment method...</Text>
        </View>
    );
}



  const handleLoadStart = () => {
    setLoading(true);  // Show loading when WebView starts loading
  };

  const handleLoadEnd = () => {
    setLoading(false);  // Hide loading when WebView finishes loading
  };

  return (
    <View className='flex-1'>
      {loading && (
        <View className='flex-1 bg-gray-200 justify-center items-center h-screen'>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      )}

      <WebView
        source={{ uri: checkoutUrl }}
        className='h-96 w-96'
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        startInLoadingState={false}  // Disable the default loading indicator from WebView

      />
    </View>
  );
};

export default Payment;
