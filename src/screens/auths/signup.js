import React, {useState, useEffect, useRef} from 'react';
import {
  ImageBackground,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  Pressable,
  Animated,
  ToastAndroid,
} from 'react-native';
import backgroud from '../../assets/background.jpg';
import axios from 'axios';
import Modal from 'react-native-modal';
import {useAuthUserContext} from '../../context_apis/AuthUserContext';

export default function Signup({navigation}) {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [otp, setOtp] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const {setAuthUser} = useAuthUserContext();
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [timer, setTimer] = useState(30);
  const intervalRef = useRef(null);
  const scaleAnimations = Array(6)
    .fill(0)
    .map(() => useRef(new Animated.Value(1)).current);

  const handleSendOtp = async () => {
    // Phone number validation
    if (!phone) {
      ToastAndroid.showWithGravity(
        'Please enter your phone number.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );

      return;
    }
    if (!/^([97])\d{8}$/.test(phone)) {
      ToastAndroid.showWithGravity(
        'Phone number must start with 9 or 7 and be 9 digits long.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      return;
    }
    // Username validation
    if (!username.trim()) {
      ToastAndroid.showWithGravity(
        'Username cannot be empty.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      return;
    }
    // Password validation
    if (password.length < 8) {
      ToastAndroid.showWithGravity(
        'Password must be at least 8 characters long.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      return;
    }
    if (password !== confirmPassword) {
      ToastAndroid.showWithGravity(
        'Passwords do not match. Please check again.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      return;
    }
    console.log('sending otp to +251', phone);
    try {
      await axios.post(
        'http://localhost:4000/twilio/sendOtp',
        {
          phoneNumber: `+251${phone}`,
        },
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        },
      );
      setModalVisible(true);
      startTimer();
    } catch (error) {
      console.log(error.response?.data || error);
      ToastAndroid.showWithGravity(
        'Failed to send OTP. Please try again.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  const handleVerifyOtpAndSignup = async () => {
    if (otp.length !== 6) {
      ToastAndroid.showWithGravity(
        'Please enter a valid 6-digit OTP.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.showWithGravity(
        'Passwords do not match. Please check again.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:4000/twilio/verifyOtp',
        {
          phoneNumber: `+251${phone}`,
          otp: otp,
        },
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        },
      );

      console.log('twilio response', res.data);

      // After OTP verified, signup user
      const formData = {username, phoneNumber: phone, password};
      const response = await axios.post(
        'http://localhost:4000/user/signup',
        formData,
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        },
      );
      console.log(response.data);

      if (response.data.error) {
        Alert.alert('Error', response.data.error);
        return;
      }
      
      console.log(response.data);
      ToastAndroid.showWithGravity(
        'Account created successfully!',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      setPhone('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      setModalVisible(false);
      if (response.data.user?._id) {
        setAuthUser(response.data);
        navigation.navigate('bottomTabs');
      }
    } catch (error) {
      console.log(error.response?.data || error);
      Alert.alert('Error', 'Invalid OTP or signup failed.');
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp('');
      await axios.post(
        'http://localhost:4000/twilio/sendOtp',
        {
          phoneNumber: `+251${phone}`,
        },
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        },
      );
      startTimer();
      ToastAndroid.showWithGravity(
        'OTP resent successfully!',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    } catch (error) {
      console.log(error.response?.data || error);
      ToastAndroid.showWithGravity(
        'Failed to resend OTP. Please try again.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  const startTimer = () => {
    setTimer(120);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = text => {
    if (text.length <= 6) {
      setOtp(text);
      animateBox(text.length - 1);
    }
  };

  const animateBox = index => {
    if (index >= 0 && index < 6) {
      Animated.sequence([
        Animated.timing(scaleAnimations[index], {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimations[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={backgroud} className="w-full h-full">
        <View className="flex-1 flex-col items-center justify-between">
          <Text className="text-black font-bold text-2xl text-center mt-5">
            Welcome To <Text className="text-orange-500"> Let's Eat </Text>{' '}
            Delivery
          </Text>

          <View className="bg-white opacity-90 w-full rounded-t-3xl">
            <View className="p-5 pb-0">
              <Text className="text-orange-500 text-xl font-bold text-center">
                Sign up
              </Text>

              <Text className="mt-2 mb-1 text-orange-500 text-xs font-bold">
                Phone Number
              </Text>
              <TextInput
                className={`rounded-md ${
                  isPhoneFocused ? 'border-orange-600' : 'border-orange-300'
                } border-b-2 text-black px-3 py-1.5`}
                placeholder="E.g 912345678"
                placeholderTextColor="#b1b5bb"
                keyboardType="phone-pad"
                value={phone}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
                maxLength={9}
                onChangeText={setPhone}
              />

              <Text className="mt-2 mb-1 text-orange-500 font-bold text-xs">
                Username
              </Text>
              <TextInput
                className={`rounded-md ${
                  isUsernameFocused ? 'border-orange-600' : 'border-orange-300'
                } border-b-2 text-black px-3 py-1.5`}
                placeholder="Username"
                placeholderTextColor="#b1b5bb"
                value={username}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                onChangeText={setUsername}
              />

              <Text className="mt-2 mb-1 text-orange-500 font-bold  text-xs">
                Password
              </Text>
              <TextInput
                className={`rounded-md ${
                  isPasswordFocused ? 'border-orange-600' : 'border-orange-300'
                } border-b-2 text-black  px-3 py-1.5`}
                placeholder="Password"
                placeholderTextColor="#b1b5bb"
                secureTextEntry
                value={password}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChangeText={setPassword}
              />

              <Text className="mt-2 mb-1 text-orange-500 font-bold text-xs">
                Confirm Password
              </Text>
              <TextInput
                className={`rounded-md ${
                  isConfirmPasswordFocused
                    ? 'border-orange-600'
                    : 'border-orange-300'
                } border-b-2 text-black  px-3 py-1.5`}
                placeholder="Confirm Password"
                placeholderTextColor="#b1b5bb"
                secureTextEntry
                value={confirmPassword}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                className="w-40 mx-auto bg-orange-500 my-2 rounded-lg p-1"
                onPress={handleSendOtp}>
                <Text className="text-center text-white text-2xl font-bold">
                  Send SMS
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text className="text-orange-950 underline text-center mb-8">
                  Already have an account ? Login Screen
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* OTP Modal */}
          <Modal isVisible={isModalVisible}>
            <View className="bg-white rounded-2xl p-5 items-center">
              <Text className="text-2xl font-bold text-orange-500 mb-4">
                Verify OTP
              </Text>

              <View className="flex-row justify-center space-x-2 mb-5">
                {Array(6)
                  .fill()
                  .map((_, index) => (
                    <Animated.View
                      key={index}
                      style={{transform: [{scale: scaleAnimations[index]}]}}
                      className="w-10 h-12 border-2 border-orange-400 rounded-md items-center justify-center">
                      <Text className="text-xl font-bold">
                        {otp[index] || ''}
                      </Text>
                    </Animated.View>
                  ))}
              </View>

              <TextInput
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                value={otp}
                onChangeText={handleOtpChange}
                className="absolute opacity-0"
              />

              <TouchableOpacity
                className="bg-green-500 px-5 py-2 rounded-lg mb-2"
                onPress={handleVerifyOtpAndSignup}>
                <Text className="text-white text-lg font-bold">Confirm</Text>
              </TouchableOpacity>

              {timer > 0 ? (
                <Text className="text-gray-500 mt-2">Resend in {timer}s</Text>
              ) : (
                <Pressable onPress={handleResendOtp}>
                  <Text className="text-blue-500 underline mt-2">
                    Resend OTP
                  </Text>
                </Pressable>
              )}

              <Pressable onPress={() => setModalVisible(false)}>
                <Text className="text-gray-500 underline mt-2">Cancel</Text>
              </Pressable>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
