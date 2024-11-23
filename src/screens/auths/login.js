import React, { useState } from 'react'
import { Text, View, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Alert, ToastAndroid } from 'react-native'
import validationSchema from '../../validations/login'
import api from '../../utilities_and_constants/axiosInstance'

const header = 'text-center text-3xl font-bold mt-14 text-primary'
const image = 'w-40 h-40 mx-auto rounded-full my-3'
const textinput = 'bg-gray-300 w-72 mx-auto rounded-lg text-black p-3 mt-3'
const button = 'w-36 text-xl text-center text-white bg-primary rounded-lg px-3 py-1 mt-3 mx-auto'
const footer = 'text-orange-950 underline text-center mt-5'

export default function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState([])

  const validateInputs = async (inputs) => {
    try {

      await validationSchema.validate(inputs);
      setError('');
      return true;
    } catch (err) {
      if (err.name === 'ValidationError') {
        setError(err.message);
      }
      return false;
    }
  };


  const handleSubmit = async () => {
    const isValid = await validateInputs({ username, password })
    if (isValid) {
   //   const response=await api.post('/login',{username,password})
   //  do the login here
    }
    else {
      ToastAndroid.showWithGravity(error, ToastAndroid.LONG, ToastAndroid.TOP)
    }
  }





  return (

    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

      <View className='bg-gray-200 h-full'>
        <Text className={header}>Welcom To Zen Audio Books Store</Text>
       
        <Image source={require('../../assets/login.jpg')} className={image} />

        <TextInput
          placeholder="username"
          placeholderTextColor={'#bfbfbf'}
          className={textinput}
          onChangeText={(username) => setUsername(username)}
        />

        <TextInput
          placeholder="password"
          placeholderTextColor={'#afafaf'}
          className={textinput}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity
          onPress={handleSubmit}>
          <Text className={button}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text className={footer}>create new account ?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text className={footer}>forgot password ?</Text>
        </TouchableOpacity>


        <Text className={footer}>all rights are reserved 2024 G.C </Text>

      </View>

    </TouchableWithoutFeedback>

  )
}
