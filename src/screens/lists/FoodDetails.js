import {useState} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ItemRatings from './ItemRatings';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';

const FoodDetails = ({food}) => {
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const {authUser} = useAuthUserContext();
  console.log('food structure d', food);

  return (
    <ScrollView>
      <View className="px-5 py-4 flex-1 bg-white">
        {/* Title */}
        <Text className="text-center font-bold text-xl text-gray-800 mb-0">
          {food.name} ({food.price} ETB)
        </Text>
        <View className='flex flex-row items-center justify-start w-20 mx-auto mb-4'>
          <Text className='text-left w-10 font-bold'>{String(food.rating).slice(0, 4)}</Text>
          <Icon
            name="star-rate" // Use the icon name here
            size={24}
            color="orange"
            className="w-6 h-5"
          />
        </View>

        {/* Image */}
        <Image
          source={{uri: String(food.image)}}
          className="w-full h-48 rounded-2xl mb-4"
          resizeMode="cover"
        />

        {/* Description */}
        <Text className="text-center text-gray-600 mb-6">
          {food.description}
        </Text>

        {/* Preparation Time */}
        <View className="flex-row items-center mb-3">
          <Icon name="timer" size={20} color="#6B7280" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-semibold">Preparation Time: </Text>
            {food.preparationTime} min
          </Text>
        </View>

        {/* Fasting Food */}
        <View className="flex-row items-center mb-3">
          <Icon name="fastfood" size={20} color="#6B7280" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-semibold">Fasting Food: </Text>
            {food.isFasting ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Allergy Information */}
        <View className="flex-row items-start mb-5">
          <Icon name="report-problem" size={20} color="#EF4444" />
          <Text className="ml-2 text-gray-700">
            <Text className="font-semibold">Allergy Info: </Text>
            It contains {food.allergensInformation.join(', ')}
          </Text>
        </View>

        {/* Nutritional Information Title */}
        <Text className="text-center font-bold text-lg text-gray-800 mb-3 underline">
          Nutritional Information (per 100g)
        </Text>

        {/* Nutrition Stats */}
        <View className="space-y-2">
          <View className="flex-row items-center">
            <Icon name="fitness-center" size={20} color="#10B981" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-semibold">Protein: </Text>
              {food.nutritionalInformation.protein}g
            </Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="local-pizza" size={20} color="#F59E0B" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-semibold">Carbohydrates: </Text>
              {food.nutritionalInformation.totalCarbohydrates}g
            </Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="opacity" size={20} color="#3B82F6" />
            <Text className="ml-2 text-gray-700">
              <Text className="font-semibold">Fat: </Text>
              {food.nutritionalInformation.totalFat}g
            </Text>
          </View>
        </View>
      </View>
      <ItemRatings itemId={food._id} userId={authUser.user._id} />
    </ScrollView>
  );
};

export default FoodDetails;
