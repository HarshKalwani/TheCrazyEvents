import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

type FormValues = {
  name: string;
  email: string;
  password: string;
  location: string;
  isAdult: boolean;
  captcha: boolean;
};

const SignupScreen = () => {
  const { control, handleSubmit, watch, formState } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      location: 'Jodhpur India ',
      isAdult: false,
      captcha: false,
    },
    mode: 'onChange',
  });
  const { errors, isValid } = formState;
  const password = watch('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pwdBars = useMemo(() => {
    const len = password.length;
    const threshold = [3, 6, 8, 10];
    return threshold.map(t => len >= t);
  }, [password]);

  return (
    <SafeAreaView className="flex-1 bg-[#fbfbfb]">
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-pink-400 items-center justify-center mb-3">
              <Text className="text-white font-bold text-xl">C</Text>
            </View>
            <Text className="text-3xl font-extrabold text-gray-900">
              Finish Signing up
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Your name
            </Text>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="bg-white rounded-xl border-gray-300 border px-4 py-1">
                  <TextInput
                    placeholder="Enter name"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    className="text-base text-gray-900"
                    placeholderTextColor={'#9CA3AF'}
                  />
                </View>
              )}
            />
            {errors?.name ? (
              <Text className="text-xs text-red-600 mt-2">
                {errors.name.message}
              </Text>
            ) : (
              <Text className="text-sm text-gray-500 mt-2">
                Your name will be public from Meetup Profile
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Your Email
            </Text>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'email is required',
                pattern: {
                  value: /^\S+@\S+\.\S=$/,
                  message: 'Enter a valid email',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="bg-white rounded-xl border-gray-300 border px-4 py-1">
                  <TextInput
                    placeholder="example@email.com"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    className="text-base text-gray-900"
                    placeholderTextColor={'#9CA3AF'}
                    keyboardType="email-address"
                  />
                </View>
              )}
            />
            {errors?.email ? (
              <Text className="text-xs text-red-600 mt-2">
                {errors.email.message}
              </Text>
            ) : (
              <Text className="text-sm text-gray-500 mt-2">
                Use your email to send you updates and to verify your account
              </Text>
            )}
          </View>

          <View className="mb-2">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is Required',
                minLength: {
                  value: 8,
                  message: 'Password must be atleast 8 characters',
                },
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View>
                  <View className="bg-white rounded-xl border border-gray-200 px-4 py-1 flex-row items-center">
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="text-base text-gray-900 flex-1"
                      placeholderTextColor={'#9CA3AF'}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity>
                      <Ionicons
                        name={showPassword ? 'eye' : 'eye-off-outline'}
                        size={20}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors?.password && (
                    <Text className="text-xs text-red-600 mt-2">
                      {errors.password.message}
                    </Text>
                  )}
                  <View className="flex-row items-center justify-between my-3 gap-1 w-full">
                    {pwdBars.map((filled, i) => (
                      <View
                        key={i}
                        className={`h-2 rounded-full flex-1 ${filled ? 'bg-green-600' : 'bg-gray-200'}`}
                      />
                    ))}
                  </View>
                </View>
              )}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Location
            </Text>
            <Controller
              name="location"
              control={control}
              rules={{ required: 'location is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex-row items-center bg-white rounded-xl border-gray-300 border px-4 py-1">
                  <Text className="mr-1">
                    <Ionicons name="location-sharp" size={20} />
                  </Text>
                  <TextInput
                    placeholder=""
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    className="text-base text-gray-900"
                    placeholderTextColor={'#9CA3AF'}
                  />
                </View>
              )}
            />
            {errors?.location ? (
              <Text className="text-xs text-red-600 mt-2">
                {errors.location.message}
              </Text>
            ) : (
              <Text className="text-sm text-gray-500 mt-2">
                We'll use your location to show Meetup events near you.
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Controller
              control={control}
              name="isAdult"
              rules={{
                validate: v => v == true || 'You must be 18 years of old',
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  {/* <TouchableOpacity 
                    onPress={() => onChange(!value)}
                    className={`w-6 h-6 rounded-sm mr-3 items-center justify-center border ${value ? "bg-teal-600" : ""}`}
                  >
                    {value ? <Text className='text-white'></Text> : null}
                  </TouchableOpacity> */}
                  <BouncyCheckbox
                    size={25}
                    fillColor="#f472b6"
                    unFillColor="#FFFFFF"
                    text="I am 18 years of age or older"
                    innerIconStyle={{ borderWidth: 2 }}
                    textStyle={{
                      fontFamily: 'JosefinSans-Regular',
                      textDecorationLine: 'none',
                    }}
                    onPress={() => onChange(!value)}
                  />
                </>
              )}
            />
            <View>
              {errors?.isAdult && (
                <Text className="text-sm text-red-600 mt-1">
                  {errors?.isAdult.message}
                </Text>
              )}
            </View>
          </View>

          <View className="mb-6">
            <Controller
              control={control}
              name="captcha"
              rules={{
                validate: v => v == true || 'Please Confirm the reCaptcha',
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    onPress={() => onChange(!value)}
                    className="rounded-md border border-gray-300 p-3 bg-white"
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-6 h-6 mr-3 border ${value ? 'bg-teal-600 border-teal-600' : 'border-gray-300'}`}
                      />
                      <Text className="text-base">I'm not a robot </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            />
            {errors?.captcha && (
              <Text className="text-sm text-red-600 mt-2">
                {errors?.captcha?.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className={`py-4 rounded-full mb-4 items-center ${isValid ? 'bg-gray-900' : 'bg-gray-200'}`}
          >
            <Text
              className={`text-lg font-semibold ${isValid ? 'text-white' : 'text-gray-500'}`}
            >
              Sign Up{' '}
            </Text>
          </TouchableOpacity>
          {errorMsg && (
            <Text className="text-red-600 text-center mb-4">{errorMsg}</Text>
          )}

          <Text className="text-center text-sm text-gray-900 mb-10">
            By signing up, you agree to{' '}
            <Text className="text-indigo-600 font-medium">
              Terms of service
            </Text>
            ,{' '}
            <Text className="text-indigo-600 font-medium">Privacy Policy</Text>,
            and{' '}
            <Text className="text-indigo-600 font-medium">Cookie Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({});
