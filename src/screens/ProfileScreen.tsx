import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../store/useAuthStore';
import Icons from 'react-native-vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { fetchProfile, updateProfile } from '../api/apiClient';

const displayAvatar =
  'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';
const predefinedLookingTo = [
  'Practice Hobbies',
  'Socialize',
  'Make Friends',
  'professionally Network',
];

const predefinedInterest = [
  'Social',
  'Painting',
  'Lifestyle',
  'Social Networking',
  'Theater',
];

const predefinedAboutMe = [
  'Recent Graduate',
  'Student',
  'New In Town',
  'New Empty Nester',
  'Newly Retired',
  'New Parent',
  'Career Change',
];

const Tag = ({
  text,
  selected,
  onPress,
  dashed,
}: {
  text: string;
  selected: boolean;
  onPress: () => void;
  dashed: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`rounded-lg px-3 py-2 mr-2 mb-3 border ${selected ? 'bg-teal-100 border-teal-500' : dashed ? 'border-2 border-dashed border-gray-300 bg-transparent' : 'bg-gray-100 border-gray-300'}`}
  >
    <Text className={`text-sm ${selected ? 'text-teal-700' : 'text-gray-700'}`}>
      {text} {selected ? '✓' : dashed ? '+' : ''}
    </Text>
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { user, updateUser } = useAuthStore();
  const [selectedLookingTo, setSelectedLookingTo] = useState<string[]>(
    user?.lookingTo || [],
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || [],
  );
  const [selectedAboutMe, setSelectedAboutMe] = useState<string[]>(
    user?.aboutMe || [],
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [bio, setBio] = useState('');
  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (!editing) return;
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['profie'],
    queryFn: fetchProfile,
  });
  console.log('profile', profileData);

  useEffect(() => {
    if (profileData) {
      updateUser(profileData);
      setBio(profileData?.bio || '');
      setSelectedLookingTo(profileData?.lookingTo || []);
      setSelectedAboutMe(profileData?.aboutMe || []);
      setSelectedInterests(profileData?.interests || []);
    }
  }, [profileData]);

  const handleSave = async () => {
    try {
      const updatedData = {
        bio,
        lookingTo: selectedLookingTo,
        aboutMe: selectedAboutMe,
        interests: selectedInterests,
      };
      const updatedUser = await updateProfile(updatedData);
      updateUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Update failed', error);
      Alert.alert('Save Failed, please try again');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full bg-gray-200 relative h-72">
          {displayAvatar ? (
            <Image
              className="w-full h-full"
              resizeMode="cover"
              source={{ uri: displayAvatar }}
            />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Icon name="image" size={60} color="#9CA4AF" />
              <Text className="text-gray-500 mt-2">No Profile Image</Text>
            </View>
          )}
          <View className="absolute top-5 left-4 right-4 flex-row justify-between z-20">
            <TouchableOpacity className="w-9 h-9 rounded-full bg-black/30 items-center justify-center">
              <Icon name="x" size={20} color={'#fff'} />
            </TouchableOpacity>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setEditing(!editing)}
                className="w-9 h-9 rounded-full bg-black/30 items-center justify-center"
              >
                <Icon name="edit-2" size={18} color={'#fff'} />
              </TouchableOpacity>
              <TouchableOpacity className="w-9 h-9 rounded-full bg-black/30 items-center justify-center">
                <Icon name="settings-outline" size={18} color={'#fff'} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="absolute bottom-4 right-4 bg-teal-600 rounded-full p-4">
            <Icon name="camera" size={22} color={'#fff'} />
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-6 ">
          <Text className="text-3xl font-extrabold text-gray-900">
            {user?.name || 'Username'}
          </Text>
          <Text className="text-base text-gray-900 mt-1">
            {user?.email || 'Email'}
          </Text>
          <View className="flex-row items-center mt-2 ">
            <Icons
              name="location-sharp"
              className=""
              size={18}
              color={'#6B7280'}
            />
            <Text>{user?.location || 'Jodhpur'}</Text>
          </View>

          <View className="bg-white rounded-xl mt-8 shadow-md ">
            <View className="flex-row py-4 border-b border-gray-100">
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  {user?.groupsCount || '0'}
                </Text>
                <Text>Groups</Text>
              </View>

              <View className="w-px bg-gray-200 h-10 self-center" />
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  {user?.groupsCount || '0'}
                </Text>
                <Text>Interests</Text>
              </View>
              <View className="w-px bg-gray-200 h-10 self-center" />
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  {user?.groupsCount || '0'}
                </Text>
                <Text>RSVP</Text>
              </View>
            </View>

            <View className="p-4">
              <View className="bg-pink-50 border-pink-200 rounded-lg p-4">
                <Text className="font-bold text-lg text-gray-900 mb-1">
                  Meetups +
                </Text>
                <Text className="text-gray-600 mb-3">
                  The Best of meetup for people seeking friendship. free for 7
                  days
                </Text>
                <TouchableOpacity className="bg-pink-600 rounded-md py-3 items-center">
                  <Text className="text-white font-semibold">
                    Try Meetup for free
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-2xl font-extrabold text-gray-900 mb-2">
            I am looking to
          </Text>
          <Text className="text-gray-500 mb-4">Select why your on meetup</Text>

          <FlatList
            data={predefinedLookingTo}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Tag
                text={item}
                selected={selectedLookingTo.includes(item)}
                onPress={() =>
                  toggleSelection(item, selectedLookingTo, setSelectedLookingTo)
                }
                dashed={!editing}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'flex-start' }}
            scrollEnabled={false}
          />
        </View>

        <View className="px-5 mt-6">
          <Text className="text-2xl font-extrabold text-gray-900 mb-2">
            Interests{' '}
            <Text className="text-gray-400 text-base">
              {selectedInterests.length}
            </Text>
          </Text>

          <FlatList
            data={predefinedInterest}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Tag
                text={item}
                selected={selectedInterests.includes(item)}
                onPress={() =>
                  toggleSelection(item, selectedInterests, setSelectedInterests)
                }
                dashed={!editing}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'flex-start' }}
            scrollEnabled={false}
          />
        </View>

        <View className="px-5 mt-6 mb-2">
          <Text className="text-2xl font-extrabold text-gray-900 mb-2">
            About me
          </Text>
          <Text className="text-gray-500 mb-4">Select what represents you</Text>

          <FlatList
            data={predefinedAboutMe}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Tag
                text={item}
                selected={selectedAboutMe.includes(item)}
                onPress={() =>
                  toggleSelection(item, selectedAboutMe, setSelectedAboutMe)
                }
                dashed={!editing}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'flex-start' }}
            scrollEnabled={false}
          />

          <Text className="text-gray-500 mt-4 mb-3 ">
            Introduce yourself to others on meetup. This can be short and simple
          </Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            editable={editing}
            className="border border-gray-300 rounded-lg p-4 text-gray-700"
            placeholder="Add your bio"
          ></TextInput>
        </View>
        {editing && (
          <TouchableOpacity
            className="mx-5 mt-8 bg-teal-600 rounded-lg items-center py-4"
            onPress={handleSave}
          >
            <Text className="text-white font-bold text-lg">Save Profile</Text>
          </TouchableOpacity>
        )}

        <View className="mt-8 px-5">
          <Text className="text-2xl font-extrabold text-gray-900 mb-4">
            Organiser
          </Text>
          <Pressable className="flex-row items-center bg-gray-50 rounded-xl p-4  mb-6">
            <View className="w-12 h-12 rounded-lg bg-gray-200 items-center  justify-center mr-4">
              <Text className="text-2xl text-gray-500">+</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Start a new group
              </Text>
              <Text className="text-gray-500">Organise your own events</Text>
            </View>
            <Icon name="chevron-right" size={20} color={'#9CA3AF'} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
