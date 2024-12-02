import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";

const MenuFoodListCard = ({ food }) => {



    return (
        <TouchableOpacity className='bg-gray-200 mx-2' >
            <View className=' h-auto flex flex-row justify-between items-center bg-gray-50 mx-2 my-1 rounded-lg'>
                <Image source={food.image} resizeMode="center" className='w-14 h-14 flex-none ' />
                <View className='flex-grow pl-4'>
                    <Text className='text-xs font-bold '>{food.name}</Text>
                    <Text className='text-xs'>{food.price}</Text>
                </View>
                <TouchableOpacity>
                    <Text className=' bg-red-600 text-white px-2 py-1 rounded-md font-bold'>Add To Cart</Text>
                </TouchableOpacity>

            </View>

        </TouchableOpacity>

    );
};

export default MenuFoodListCard;
