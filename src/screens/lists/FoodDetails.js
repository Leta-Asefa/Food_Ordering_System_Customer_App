import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";

const FoodDetails = ({food}) => {

   


    return (
        <View className='px-5 flex-1'>
            <Text className='text-center font-bold text-lg'>{food.name} ( {food.price} ETB )</Text>
            <Image
                    source={{ uri: String(food.image) }}
                    className='w-full h-40 rounded-lg'
                    resizeMode="cover"
                />
            <Text className='text-center mb-2'>{food.description}</Text>

            <ScrollView>


                <Text key="a" className=''> <Text className='font-bold'>Preparaton Time : </Text>{food.preparationTime}</Text>
                <Text key="g" className=''> <Text className='font-bold'>Is it Fasting Food : </Text>{food.isFasting?'Yes':"No"}</Text>
                <Text key='b' className=''><Text className='font-bold'>Allergy Information : </Text>It contains {food.allergensInformation.map(allergy => allergy + " , ")}</Text>

                <Text key="c" className='font-bold text-center mt-3 underline'>Nutritional Information (per 100g)</Text>
                <Text key="d"><Text className='font-bold'>Protien : </Text>{food.nutritionalInformation.protein}g</Text>
                <Text key="e"><Text className='font-bold'>Carbohydrate : </Text>{food.nutritionalInformation.totalCarbohydrates}g</Text>
                <Text key='f'><Text className='font-bold'>Fat : </Text>{food.nutritionalInformation.totalFat}g</Text>

                <Text className='font-bold text-center underline mb-1'>Customer's Comments</Text>

                {
                    food.review.map((review,index) => {
                        return <View key={index.toString()} className='bg-gray-200 mb-2 p-1 rounded-md'>
                            <Text className='text-center '>{review.review}</Text>
                            <Text className='text-center text-xs font-bold'>{review.user.username}</Text>
                        </View>
                    })
                }


            </ScrollView>
        </View>

    );
};

export default FoodDetails;
