import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";

const HomeFoodListCard = ({ food }) => {



    return (
        <TouchableOpacity className='w-20 h-auto flex-1  items-center bg-gray-50' >
            <View>
                <Image source={food.image} resizeMode="center" className='w-16 h-16' />
                <Text className='text-center text-xs font-bold '>{food.name}</Text>
                <Text className='text-center text-xs'>{food.price}</Text>
            </View>

        </TouchableOpacity>

    );
};

export default HomeFoodListCard;
