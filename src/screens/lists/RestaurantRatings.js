import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RestaurantRatings = ({restaurantId, userId}) => {
  const [ratings, setRatings] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:4000/restaurant_rating/${restaurantId}/all`,
      );
      console.log('rating structure ', res.data);
      setRatings(res.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!newReview.trim() || newRating === 0) {
      ToastAndroid.showWithGravity(
        'Make sure both review and rating are filled',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(
        `http://localhost:4000/restaurant_rating/${restaurantId}/add`,
        {
          userId,
          review: newReview,
          rating: newRating,
        },
      );
      setNewReview('');
      setNewRating(0);
      fetchRatings(); // Refresh ratings
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, onPress) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map(i => (
          <TouchableOpacity key={i} onPress={() => onPress && onPress(i)}>
            <Icon
              name="star"
              size={24}
              color={i <= count ? '#facc15' : '#d1d5db'} // ✅ Correct color prop
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 p-4 bg-white">
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView className="flex-1 mb-4">
          {ratings.length > 0 ? (
            ratings.map(r => (
              <View key={r._id} className="border-b border-gray-200 pb-3 mb-3">
                {renderStars(r.rating)}
                {r?.review ? (
                  <Text className="mt-1 text-gray-700">{r.review}</Text>
                ) : (
                  <Text className="mt-1 text-gray-400 italic">
                    No review text
                  </Text>
                )}
                <View className=" mt-1 flex flex-row items-center justify-between space-x-5">
                  <Image
                    source={r?.user?.image ? { uri: String(r.user.image) } : require('../../assets/default_profile_pic.png')}
                    resizeMode="center"
                    className="w-10 h-10 rounded-full"
                    />
                  <View >
                    <Text className="text-xs text-gray-400 mt-1">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </Text>
                    <Text className="text-xs text-gray-400 ">
                      ( {r?.user?.username} )
                    </Text>
                    </View>
                </View>
                
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-400 mt-4">
              No ratings yet
            </Text>
          )}
        </ScrollView>
      )}

      {/* Review Input */}
      <View className="border-t border-gray-200 pt-4">
        <Text className="text-lg font-semibold mb-2">Write a Review</Text>
        {renderStars(newRating, index => setNewRating(index))}
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mt-2 mb-4 text-black"
          placeholder="Write your review..."
          value={newReview}
          onChangeText={setNewReview}
          multiline
        />
        <TouchableOpacity
          className="bg-orange-500 rounded-lg p-3 items-center"
          onPress={submitReview}
          disabled={submitting}>
          <Text className="text-white font-bold">
            {submitting ? 'Saving...' : 'Save Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RestaurantRatings;
