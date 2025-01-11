import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

const PromotionListCard = ({ promotion }) => {



    return (
        <TouchableOpacity className='w-80  my-2 mx-5 bg-white'>
            <ImageBackground source={{ uri: String(promotion.image) }}
                className='h-32 w-full'>
                <View className=' h-32 flex flex-col justify-between'>
                    <Text className='bg-white bg-opacity-25 text-red-600 text-xs text-center font-bold w-80 mx-auto'>{promotion.title}</Text>
                    <Text className='text-center text-xs bg-white bg-opacity-25 text-red-600 text-ellipsis'>{promotion.description} ({promotion.restaurantId.name})</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
//
    );

};

export default PromotionListCard;
