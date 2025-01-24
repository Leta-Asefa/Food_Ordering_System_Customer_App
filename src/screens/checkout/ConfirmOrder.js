import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useAuthUserContext } from "../../context_apis/AuthUserContext";
import { CartContext, useCartContext } from "../../context_apis/CartContext";
import { useLocationContext } from "../../context_apis/Location";

const ConfirmOrder = ({ navigation, route }) => {
    const [deliveryaddress, setDeliveryAddress] = useState(route?.params?.deliveryaddress || {});
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [orderResponse, setOrderResponse] = useState(null); // State to handle API response or errors

    const { authUser } = useAuthUserContext();
    const { cart,selectedRestaurant } = useCartContext()
    const { longitude, latitude, address } = useLocationContext();


    if (!deliveryaddress) {
        console.log("Delivery address is not set yet");
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading delivery address...</Text>
            </View>
        );
    }

    useEffect(() => {
        if (!deliveryaddress || !cart || cart.length === 0) {
            console.log("Delivery address or cart is missing");
            return;
        }

        const registerAnOrder = async () => {
            setIsLoading(true); // Start loading
            const cartItems = cart.map((i) => ({
                item: i.item._id,
                quantity: i.quantity,
            }));

            const formData = {
                items: cartItems,
                shippingAddress: deliveryaddress,
                userId: authUser.user._id,
                restaurantId:selectedRestaurant.restaurant._id
            };
            console.log("Form data to be sent ",formData)

            try {
                console.log("Registering an order with formData: ", formData);
                const response = await axios.post(`http://localhost:4000/order/add`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log("Order Confirmation Response >>>> ", response.data);
                setOrderResponse(response.data); // Handle response
            } catch (error) {
                console.error("Error placing order: ", error.response || error.message);
                setOrderResponse({ error: error.response?.data || "Failed to place order" });
            } finally {
                setIsLoading(false); // Stop loading
            }
        };


        registerAnOrder();

    }, [deliveryaddress]);

    return (
        <View className="flex-1 justify-center items-center">
        <Text> order confirmation</Text>
        </View>
    );
};

export default ConfirmOrder;
