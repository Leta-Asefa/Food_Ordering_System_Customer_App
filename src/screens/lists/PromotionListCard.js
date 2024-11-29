import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

const PromotionListCard = ({ promotion }) => {



    return (
        <TouchableOpacity className='w-80 rounded-lg m-2 border-2 border-black'>
            <ImageBackground source={promotion.imageUrl} className='h-32 w-80'>
                <View className=' h-32 flex flex-col justify-between'>
                    <Text className='bg-white text-red-600 text-lg text-center font-bold rounded-lg  w-80 mx-auto'>{promotion.title}</Text>
                    <Text className='text-center text-2xl text-red-600'>{promotion.retaurantName}</Text>
                    <Text className='text-center text-xs bg-white text-red-600'>{promotion.description}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>

    );
};

export default PromotionListCard;
