import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import { useLocationContext } from '../../context_apis/Location';
import axios from 'axios';

const PromotionListCard = ({navigation,promotion}) => {

    const {longitude,latitude}=useLocationContext()

     const handlePromotionPress = async item => {
        console.log(item);
   
        try {
          const response = await axios.get(
            `http://localhost:4000/restaurant/eta/${longitude}/${latitude}/${item.restaurantId._id}`,
          );
    
          if (response?.data) {
         
            navigation.navigate('restaurant_detail', {
              restaurant: response.data.restaurant,
              distance: response.data.distance,
              duration: response.data.duration,
              itemId: '',
            });
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };


  return (
    <TouchableOpacity onPress={() => handlePromotionPress(promotion)} className='ml-3'>
    <View className="w-[350px] my-3 mx-auto bg-white rounded-2xl overflow-hidden shadow-md">
      <ImageBackground
        source={{ uri: String(promotion.image) }}
        className="h-32 w-full"
        imageStyle={{ borderRadius: 16 }}
      >
        <View className="h-full w-full flex justify-between p-3 bg-black/20 rounded-2xl">
          <View className="bg-orange-500/80 px-2 py-1 rounded-full self-start">
            <Text className="text-white text-xs font-bold">
              {promotion.title}
            </Text>
          </View>
  
          <View className="bg-white/70 px-3 py-2 rounded-lg">
            <Text className="text-gray-900 text-xs font-semibold text-center" numberOfLines={2}>
              {promotion.description} ({promotion.restaurantId.name})
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  </TouchableOpacity>
  
  );
};

export default PromotionListCard;
