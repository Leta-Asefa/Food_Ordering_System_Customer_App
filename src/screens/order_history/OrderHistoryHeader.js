import { TouchableOpacity, Text, View } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const OrderHistoryHeader = ({ handleHeaderPress, status }) => {



  return (
    <View className='flex-row flex-wrap justify-center items-center gap-1 mb-5'>

      <TouchableOpacity className={`bg-gray-300 rounded-t-md flex-row items-center px-2 
                   ${status === 'pending' ? 'border-b-2 border-gray-900' : ''}`}
        onPress={() => handleHeaderPress('pending')}>
        <MaterialIcons
          name="pending"
          size={13}
          color={'#000'} />
        <Text className='p-1 text-center text-xs  w-auto  text-black flex-row items-center font-semibold'>Pending</Text>
      </TouchableOpacity>

      <TouchableOpacity className={`bg-gray-300 rounded-t-md flex-row items-center px-2
                   ${status === 'processing' ? 'border-b-2 border-gray-900' : ''}`}
        onPress={()=>handleHeaderPress('processing')}>
        <MaterialCommunityIcons
          name="chef-hat"
          size={13}
          color={'#000'} />
        <Text className='p-1 text-center text-xs  w-auto  text-black flex-row items-center font-semibold'>Active</Text>
      </TouchableOpacity>

      <TouchableOpacity className={`bg-gray-300 rounded-t-md flex-row items-center px-2
                   ${status === 'delivered' ? 'border-b-2 border-gray-900' : ''}`}
        onPress={()=>handleHeaderPress('delivered')}>
        <MaterialCommunityIcons
          name="truck-delivery"
          size={13}
          color={'#000'} />
        <Text className='p-1 text-center text-xs  w-auto  text-black flex-row items-center font-semibold'>Delivered</Text>
      </TouchableOpacity>

      <TouchableOpacity className={`bg-gray-300 rounded-t-md flex-row items-center px-2
                   ${status === 'refunded' ? 'border-b-2 border-gray-900' : ''}`}
        onPress={()=>handleHeaderPress('refunded')}>
        <MaterialCommunityIcons
          name="cancel"
          size={13}
          color={'#000'} />
        <Text className='p-1 text-center text-xs  w-auto  text-black flex-row items-center font-semibold'>Refunded</Text>
      </TouchableOpacity>


    </View>

  );
};

export default OrderHistoryHeader;
