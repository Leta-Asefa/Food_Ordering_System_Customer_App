import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { useLocationContext } from "../../context_apis/Location";
import axios from "axios";

const HomeFoodListCard = ({ food,navigation }) => {

    const {longitude,latitude}=useLocationContext()

    const handleItemPress = async item => {
     
        try {
          const response = await axios.get(
            `http://localhost:4000/restaurant/eta/${longitude}/${latitude}/${item.restaurantId}`,
          );
    
          if (response?.data) {
            navigation.navigate('restaurant_detail', {
              restaurant: response.data.restaurant,
              distance: response.data.distance,
              duration: response.data.duration,
              itemId: item._id,
            });
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
    


    return (
        <TouchableOpacity onPress={()=> handleItemPress(food)}  className='w-20 h-auto flex-1  items-center bg-gray-50' >
            <View>
                <Image source={{ uri: String(food.image) }} resizeMode="center" className='w-16 h-16' />
                <Text className='text-center text-xs font-bold '>{food.name}</Text>
                <Text className='text-center text-xs'>{food.price}</Text>
            </View>

        </TouchableOpacity>

    );
};

export default HomeFoodListCard;
