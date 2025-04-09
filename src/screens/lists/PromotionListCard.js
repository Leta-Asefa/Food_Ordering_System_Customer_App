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
    <TouchableOpacity onPress={()=>handlePromotionPress(promotion)}>
      <View className='w-[350px]  my-2 mx-2 bg-white rounded-lg overflow-hidden'>
        <ImageBackground
          source={{uri: String(promotion.image)}}
          className="h-32 w-full rounded-lg">
          <View className=" h-32 flex flex-col justify-between">
            <Text className="text-white  bg-opacity-25 bg-orange-500 text-xs text-center font-bold w-[350px] mx-auto">
              {promotion.title}
            </Text>
            <Text className="text-center text-xs bg-orange-500 font-semibold bg-opacity-25 text-white text-ellipsis">
              {promotion.description} ({promotion.restaurantId.name})
            </Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default PromotionListCard;
