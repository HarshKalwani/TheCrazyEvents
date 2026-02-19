import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons"
import { AuthRoutes } from '../navigation/Routes';

type LoginValues = {
  email: string;
  password: string;
}

const LogoUrl = "https://static.vecteezy.com/system/resources/thumbnails/020/120/648/small/crazy-text-effect-lettering-design-vector.jpg"

const LoginScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, formState } = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange"
  });
  const { errors, isValid } = formState;
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS == "ios" ? "padding" : "height"}>
        <ScrollView className='flex-1' contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 14,
          paddingBottom: 36,
        }}>
          <TouchableOpacity className='w-9 h-9 rounded-full items-center justify-center mb-3'>
            <Ionicons name='arrow-back-outline' size={20} color={"#111827"} />
          </TouchableOpacity>
          <View className='items-center mb-6'>
            <Image source={{ uri: LogoUrl }} className='w-64 h-24 mb-3' resizeMode='contain' />
          </View>

          <TouchableOpacity className='rounded-xl border border-gray-200 py-3 mb-3 bg-white active:opacity-90'>
            <View className='flex-row items-center justify-center'>
              <View className='mr-3'>
                <Ionicons name='logo-apple' size={20} />
              </View>
              <Text className='font-medium text-base text-gray-800'>Sign in with Apple</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className='rounded-xl border border-gray-200 py-3 mb-3 bg-blue-500 active:opacity-90'>
            <View className='flex-row items-center justify-center'>
              <View className='mr-3'>
                <Ionicons name='logo-google' size={20} color={'#ffffff'} />
              </View>
              <Text>Sign in with Google</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className='rounded-xl border border-gray-200 py-3 mb-3 bg-white active:opacity-90'>
            <View className='flex-row items-center justify-center'>
              <View className='mr-3'>
                <Ionicons name='logo-facebook' size={20} color={'#1877F2'} />
              </View>
              <Text className='font-medium text-base text-gray-800'>Sign in with Facebook</Text>
            </View>
          </TouchableOpacity>

          <Text className='text-center text-gray-400 my-3 font-medium'>OR </Text>

          <View className='mb-3'>
            <Controller
              control={control}
              name='email'
              rules={{
                required: "Email is Required",
                pattern: {
                  value: /^\S+@\S+\.\S=$/,
                  message: "Enter a valid email"
                }
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View>
                  <View className='bg-white rounded-xl border border-gray-200 px-4 py-1'>
                    <TextInput
                      placeholder='email'
                      value={value}
                      onChangeText={onChange}
                      className='text-base text-gray-900'
                      placeholderTextColor={"#9CA3AF"}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  </View>
                  {errors?.email && (
                    <Text className='text-xs text-red-600 mt-2'>{errors.email.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <View className='mb-2'>
            <Controller
              control={control}
              name='password'
              rules={{
                required: "Password is Required",
                minLength: {
                  value: 8,
                  message: "Password must be atleast 8 characters"
                }
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View>
                  <View className='bg-white rounded-xl border border-gray-200 px-4 py-1 flex-row items-center'>
                    <TextInput
                      placeholder='password'
                      value={value}
                      onChangeText={onChange}
                      className='text-base text-gray-900 flex-1'
                      placeholderTextColor={"#9CA3AF"}
                      secureTextEntry={!showPassword}
                      autoCapitalize='none'
                    />
                    <TouchableOpacity>
                      <Ionicons name={showPassword ? 'eye' : 'eye-off-outline'} size={20} onPress={() => setShowPassword(!showPassword)} />
                    </TouchableOpacity>
                  </View>
                  {errors?.password && (
                    <Text className='text-xs text-red-600 mt-2'>{errors.password.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <TouchableOpacity className='my-4 items-end' onPress={() => navigation.navigate(AuthRoutes?.ForgotPassword)}>
            <Text className='text-teal-600 font-semibold'>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className={`py-4 rounded-full mb-4 items-center ${isValid ? "bg-gray-900" : "bg-gray-200"}`}>
            <Text className={`text-lg font-semibold ${isValid ? "text-white" : "text-gray-500"}`}>Log In </Text>
          </TouchableOpacity>
          {errorMsg && (
            <Text className='text-red-600 text-center mb-4'>{errorMsg}</Text>
          )}

          <View className='items-center mb-6 '>
            <Text className='text-gray-600'>Dont have an Account ? <Text onPress={() => navigation.navigate(AuthRoutes.SignUp)} className='text-teal-600 font-medium'>Sign Up</Text></Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})