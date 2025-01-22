import { ActivityIndicator, Text, View } from "react-native";
import WebView from "react-native-webview";
import { useContext, useEffect, useState } from "react";
import { CartContext, useCartContext } from "../../context_apis/CartContext";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import axios from "axios";

const Payment = ({ navigation }) => {

  const { cart, updateCartItem } = useCartContext()
  const { authUser } = useAuthUserContext()
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [loading, setLoading] = useState(true);


  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  }

  useEffect(() => {
    async function getCheckoutUrl() {
      console.log("entered get checkouturl .... ")
      const formData = { phoneNumber: authUser.phoneNumber, amount: getTotalPrice(), firstName: authUser.username }
      const response = await axios.post(`http://localhost:4000/payment/getOrderPaymentPage`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log("URL .......", response)
      setCheckoutUrl(response.data.checkout_url)
    }

    getCheckoutUrl()
  }, [])



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
