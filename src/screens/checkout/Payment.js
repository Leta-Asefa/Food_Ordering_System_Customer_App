import { View } from "react-native";
import WebView from "react-native-webview";

const Payment = ({ navigation }) => {




    return (
      <View className='flex-1'>
        <WebView
        source={{ uri: 'https://chapa.co/' }}
        className='h-96 w-96'
        />
        </View>
    );
};

export default Payment;
