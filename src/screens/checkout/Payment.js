import { Text, View } from "react-native";
import WebView from "react-native-webview";
import { useContext } from "react";

const Payment = ({ navigation }) => {



  return (
    <View className='flex-1'>
      <Text>{user.data.name} to</Text>
      <WebView
        source={{ uri: 'https://chapa.co/' }}
        className='h-96 w-96'
      />
    </View>
  );
};

export default Payment;
