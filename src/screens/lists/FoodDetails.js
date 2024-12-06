import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";

const FoodDetails = () => {

    const food = {
        "name": "Classic Cheeseburger",
        "price": 8.99,
        "description": "A juicy beef patty topped with melted cheddar cheese, fresh lettuce, tomatoes, onions, pickles, and our special sauce, all served on a toasted sesame seed bun.",
        "image": require('../../assets/food1.jpeg'),
        "isFasting":'Yes',
        "reviews": {
            "rating": 4.5,
            "reviewCount": 120
        },
        "calories": 650,
        "nutritional_information": {
            "protein": "30g",
            "totalCarbohydrates": "45g",
            "totalFat": "30g"
        },
        "preparation_time": "15 minutes",
        "allergens_information": [
            "Gluten",
            "Dairy",
            "Eggs"
        ],
        "reviews": [
            {
                "comment": "Absolutely delicious! The best burger I've had in a long time.",
                "author": "John Doe"
            },
            {
                "comment": "Great flavor, but the bun was a bit too soggy for my taste.",
                "author": "Jane Smith"
            },
            {
                "comment": "Perfectly cooked and very satisfying. Will definitely order again.",
                "author": "Mike Johnson"
            },
            {
                "comment": "Not bad, but could use more seasoning.",
                "author": "Emily Davis"
            },
            {
                "comment": "Excellent burger with great toppings. Highly recommend!",
                "author": "Robert Brown"
            },
            {
                "comment": "Juicy and flavorful, just like a burger should be.",
                "author": "Patricia Taylor"
            },
            {
                "comment": "A bit too greasy for my taste, but still good.",
                "author": "Michael Wilson"
            },
            {
                "comment": "The cheese was perfectly melted and the patty was well-cooked.",
                "author": "Jessica Moore"
            },
            {
                "comment": "Good value for the price. Would order again.",
                "author": "William Anderson"
            },
            {
                "comment": "The burger was tasty, but the fries were cold.",
                "author": "Elizabeth Jackson"
            }
        ]
    }


    return (
        <View className='px-5 flex-1'>
            <Text className='text-center font-bold text-lg'>{food.name} ( {food.price} ETB )</Text>
            <Image source={food.image} className=' h-auto max-h-60 mx-auto rounded-md' />
            <Text className='text-center mb-2'>{food.description}</Text>

            <ScrollView>


                <Text key="a" className=''> <Text className='font-bold'>Preparaton Time : </Text>{food.preparation_time}</Text>
                <Text key="g" className=''> <Text className='font-bold'>Is it Fasting Food : </Text>{food.isFasting}</Text>
                <Text key='b' className=''><Text className='font-bold'>Allergy Information : </Text>It contains {food.allergens_information.map(allergy => allergy + " , ")}</Text>

                <Text key="c" className='font-bold text-center mt-3 underline'>Nutritional Information (per 100g)</Text>
                <Text key="d"><Text className='font-bold'>Protien : </Text>{food.nutritional_information.protein}</Text>
                <Text key="e"><Text className='font-bold'>Carbohydrate : </Text>{food.nutritional_information.totalCarbohydrates}</Text>
                <Text key='f'><Text className='font-bold'>Fat : </Text>{food.nutritional_information.totalFat}</Text>

                <Text className='font-bold text-center underline mb-1'>Customer's Comments</Text>

                {
                    food.reviews.map((review,index) => {
                        return <View key={index.toString()} className='bg-gray-200 mb-2 p-1 rounded-md'>
                            <Text className='text-center '>{review.comment}</Text>
                            <Text className='text-center text-xs font-bold'>{review.author}</Text>
                        </View>
                    })
                }


            </ScrollView>
        </View>

    );
};

export default FoodDetails;
