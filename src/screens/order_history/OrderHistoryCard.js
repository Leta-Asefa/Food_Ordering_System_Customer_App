import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ToastAndroid,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useCartContext} from '../../context_apis/CartContext';
import axios from 'axios';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';

const OrderHistoryCard = ({order, date, time, navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [longestPreparationTime, setLongestPreparationTime] = useState(0);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const {authUser} = useAuthUserContext();

  const handlePayment = async method => {
    try {
      if (method === 'payNow') {
        const formData = {
          amount: order.totalAmount,
          firstName: authUser.user.username,
          phoneNumber: authUser.user.phoneNumber,
          subAccountId: order.restaurantId.subAccountId,
          orderId: order._id,
          userId: authUser.user._id,
          restaurantId: order.restaurantId._id,
        };

        const response = await axios.post(
          `http://localhost:4000/payment/getOrderPaymentPage`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        );
        console.log(response.data);

        setModalVisible(false);
        navigation.navigate('payment', {
          checkouturl: response.data.checkout_url,
        });
      } else if (method === 'payLater') {
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = async method => {
    try {
      const response = await axios.put(
        `http://localhost:4000/order/${order._id}/status`,
        {status: 'Cancelled'},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      if (response.data.message) {
        ToastAndroid.showWithGravity(
          'Order Cancelled Successfully',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      } else {
        ToastAndroid.showWithGravity(
          "Preparing your order is started. You can't cancel.",
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      }

      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const requestRefund = () => {
    setRefundModalVisible(true);
  };

  const submitRefundRequest = async () => {
    if (!refundReason.trim()) {
      ToastAndroid.showWithGravity(
        'Refund reason is required.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      return;
    }
    try {
      const formData = {
        userId: authUser.user._id,
        restaurantId: order.restaurantId._id,
        orderId: order._id,
        amount: order.totalAmount,
        reason: refundReason,
        tx_ref: order.tx_ref || '',
        location: order.shippingAddress?.address || {},
      };
      const response = await axios.post(
        'http://localhost:4000/payment/initiateRefund',
        formData,
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        },
      );
      if (response.data.message) {
        ToastAndroid.showWithGravity(
          'Refund request submitted.',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
        setRefundModalVisible(false);
        setRefundReason('');
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Failed to request refund.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      let longestPreparationTime = 0;
      order.items.forEach(i => {
        longestPreparationTime = Math.max(
          i.item.preparationTime,
          longestPreparationTime,
        );
      });

      const response = await axios.get(
        `http://localhost:4000/restaurant/eta/${order.shippingAddress.longitude}/${order.shippingAddress.latitude}/${order.restaurantId._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      setLongestPreparationTime(
        longestPreparationTime + Number(response.data.durationValue),
      );
    };

    fetch();
  }, [modalVisible]);

  const renderItem = ({item}) => (
    <View className="flex-row justify-between py-2 px-4 bg-white shadow-md rounded-lg">
      <Text className="text-sm font-medium text-gray-700">
        {item.item.name} ({item.quantity}X)
      </Text>
      <Text className="text-sm text-gray-700 font-semibold">
        ${(item.item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <>
      {/* Order Card */}
      <View className="mb-2">
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View className="bg-gray-100 px-6 py-3 rounded-md mb-4 border border-dashed border-gray-400 shadow-sm">
            {/* Restaurant Name */}
            <View className="flex-row items-center justify-center mb-1">
              <MaterialIcons name="restaurant" size={20} color="#4B5563" />
              <Text className="ml-2 text-base font-bold text-gray-700">
                {order?.restaurantId?.name}
              </Text>
            </View>

            {/* Order ID */}
            <Text className="text-center text-[11px] text-gray-400 mb-2">
              Order ID: {order._id}
            </Text>

            {/* Separator */}
            <View className="border-t border-dashed border-gray-300 mb-2" />

            {/* Date and Time */}
            <View className="flex-row justify-between mb-4">
              <Text className="text-xs text-gray-600">Date: {date}</Text>
              <Text className="text-xs text-gray-600">Time: {time}</Text>
            </View>

            {/* Separator */}
            <View className="border-t border-dashed border-gray-300 mb-1" />

            {/* Total Amount */}
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-semibold text-gray-700">Total</Text>
              <View className="flex-row items-center space-x-1">
                <FontAwesome name="money" size={16} color="#4B5563" />
                <Text className="text-lg font-bold text-gray-800">
                  {order.totalAmount} ETB
                </Text>
              </View>
            </View>

            {/* Final Separator */}
            <View className="border-t border-dashed border-gray-300 my-2" />

            {/* Footer Note */}
            <Text className="text-center text-[10px] text-gray-400 mt-2">
              Thank you for choosing us!
            </Text>

            <Modal
              animationType="fade"
              transparent={true}
              visible={refundModalVisible}
              onRequestClose={() => setRefundModalVisible(false)}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    width: '80%',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      marginBottom: 10,
                    }}>
                    Refund Reason
                  </Text>
                  <TextInput
                    placeholder="Enter refund reason..."
                    value={refundReason}
                    onChangeText={setRefundReason}
                    multiline
                    maxLength={200}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 4,
                      padding: 8,
                      marginBottom: 12,
                      color: '#222',
                      minHeight: 60,
                    }}
                  />
                  <View
                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => setRefundModalVisible(false)}
                      style={{marginRight: 10}}>
                      <Text style={{color: '#888'}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={submitRefundRequest}
                      style={{
                        backgroundColor: 'green',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 4,
                      }}>
                      <Text style={{color: 'white'}}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableOpacity>
        {order.status === 'Processing' ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('order_tracking', {order})}>
            <Text className="bg-gray-200 text-center text-black font-semibold rounded-t-none rounded-b-md p-1.5 mb-3">
              Track Order
            </Text>
          </TouchableOpacity>
        ) : (
          ''
        )}
      </View>

      {/* Order Details Modal------------------------------------------------------------------------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View className="bg-white  max-w-md p-3 m-3 rounded-lg shadow-lg">
            {/* Order ID */}
            <Text className="text-xs text-gray-500 text-center font-bold  mb-3">
              Order ID:{' '}
              <Text className="text-gray-800 font-semibold">{order._id}</Text>
            </Text>

            {/* QR Code */}
            <View className="items-center mb-5">
              <QRCode
                value={order._id}
                size={120}
                color="black"
                backgroundColor="white"
              />
            </View>

            {/* Order Information */}
            <View className="space-y-1 mb-5">
              <Text className="text-xs text-gray-600">
                <Text className="font-semibold">Status:</Text> {order.status}
              </Text>
              <Text className="text-xs text-gray-600">
                <Text className="font-semibold">Delivery Address:</Text>{' '}
                {order.shippingAddress.address}
              </Text>
              <Text className="text-xs text-gray-600">
                <Text className="font-semibold">Timestamp:</Text> {date} {time}
              </Text>
            </View>

            {/* Separator */}
            <View className="border-t border-dashed border-gray-300 mb-4" />

            {/* Items Title */}
            <Text className="text-sm font-bold text-gray-800 mb-2">
              Items Ordered
            </Text>

            {/* Items List */}
            <FlatList
              data={order.items}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              className="h-auto max-h-44 mb-5"
              scrollEnabled
            />

            {/* Separator */}
            <View className="border-t border-dashed border-gray-300 my-4" />

            {/* Delivery & Total Info */}
            <View className="space-y-2 mb-6">
              <Text className="text-sm text-gray-700">
                <Text className="font-semibold">Estimated Delivery:</Text>{' '}
                {order.eta} min
              </Text>
              <Text className="text-sm text-gray-700">
                <Text className="font-semibold">Total Price:</Text>{' '}
                {order.totalAmount} ETB
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex flex-row justify-between px-5">
              {order.status === 'Pending' && (
                <>
                  <TouchableOpacity
                    className="bg-blue-600 px-5 py-2 rounded-md shadow-md"
                    onPress={() => handlePayment('payNow')}>
                    <Text className="text-white font-semibold text-sm">
                      Pay Now
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-gray-300 px-5 py-2 rounded-md shadow-md"
                    onPress={() => handlePayment('payLater')}>
                    <Text className="text-gray-800 font-semibold text-sm">
                      Pay Later
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {order.status === 'Processing' && (
                <>
                  <TouchableOpacity
                    className="bg-red-600 px-5 py-2 rounded-md shadow-md mr-1"
                    onPress={requestRefund}>
                    <Text className="text-white font-semibold text-sm">
                      Request Refund
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-green-600 px-5 py-2 rounded-md shadow-md ml-1"
                    onPress={() =>
                      navigation.navigate('order_tracking', {order})
                    }>
                    <Text className="text-white font-semibold text-sm">
                      Track Order
                    </Text>
                  </TouchableOpacity>
                 
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default OrderHistoryCard;
