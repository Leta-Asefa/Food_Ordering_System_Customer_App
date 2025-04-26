import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ItemRatings = ({ itemId, userId }) => {
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
      const res = await axios.get(`http://localhost:4000/item_rating/${itemId}/all`);
      setRatings(res.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!newReview.trim() || newRating === 0){
        ToastAndroid.showWithGravity("Make sure both review and rating are filled", ToastAndroid.LONG, ToastAndroid.TOP)
      return;
    } 
    console.log("submitting review");

    try {
      setSubmitting(true);
      await axios.post(`http://localhost:4000/item_rating/${itemId}/add`, {
        userId,
        review: newReview,
        rating: newRating,
      });
      setNewReview('');
      setNewRating(0);
      fetchRatings(); // refresh after submit
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, onPress) => (
    <View className="flex-row mb-2">
      {[1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity key={i} onPress={() => onPress && onPress(i)}>
          <Icon
            name="star"
            size={24}
            color={i <= count ? '#facc15' : '#d1d5db'} // Yellow for selected stars
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
  
    <View className="mt-1 px-5">
      <Text className="font-bold text-lg mb-2">Reviews</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {ratings.length > 0 ? (
            ratings.map(r => (
              <View key={r._id} className="mr-3 bg-gray-100 p-4 rounded-lg w-64">
                {renderStars(r.rating)}
                <Text className="text-gray-800 mt-1">{r.review || 'No text review'}</Text>
                <Text className="text-xs text-gray-500 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()} • {r.user.username}
                </Text>
              </View>
            ))
          ) : (
            <View className="bg-gray-100 p-4 rounded-lg">
              <Text className="text-gray-400">No reviews yet</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Review input section */}
      <View className="border-t border-gray-300 pt-4">
        <Text className="text-lg font-semibold mb-2">Write your review</Text>

        {renderStars(newRating, index => setNewRating(index))}

        <TextInput
          className="border border-gray-300 rounded-lg p-2 mt-2"
          placeholder="Write something..."
          value={newReview}
          onChangeText={setNewReview}
          multiline
        />

        <TouchableOpacity
          onPress={submitReview}
          disabled={submitting}
          className="bg-orange-500 rounded-lg p-3 mt-4 items-center"
          >
          <Text className="text-white font-bold">
            {submitting ? 'Saving...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
          
  );
};

export default ItemRatings;
