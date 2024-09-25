import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { SearchScreenStackParamList } from '../../components/types';
import { dark, light, gray, placeholder, lgray, dgray, error } from '../../components/colorModes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { scTrack } from '../../soundcloudConfig/itemInterface';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createPost } from '../../graphql/mutations';
import CustomError from '../../errorHandling/CustomError';

type PostSCTrackScreenProps = NativeStackScreenProps<SearchScreenStackParamList, 'PostSCTrack'>;

const PostSCTrackScreen: React.FC<PostSCTrackScreenProps> = ({ route, navigation }) => {
  const { sctrack } = route.params;
  const [postText, setPostText] = useState('');

  const handleSCTrackPost = async () => {
    try {
      const client = generateClient();
      const { userId, username } = await getCurrentUser();

      const PostDetails = {
        body: postText,
        userPostsId: userId,
        username: username,
        scTrackTitle: sctrack?.title || 'Unknown Title', 
        scTrackId: sctrack?.id || '',
        scTrackUserId: sctrack?.user_id || '',
        scTrackArtworkUrl: sctrack?.artwork_url || '',
        scTrackPermalinkUrl: sctrack?.permalink_url || '',
        scTrackWaveformUrl: sctrack?.waveform_url || '',
        scTrackArtist: sctrack?.publisher_metadata?.artist || 'Unknown Artist',
        scTrackGenre: sctrack?.genre || 'Unknown Genre',
        likesCount: 0,
      };

      await client.graphql({
        query: createPost,
        variables: { input: PostDetails },
      });
      console.log('New SC Post created successfully!');
      setPostText('');
      navigation.goBack();
    } catch (error) {
      if (error instanceof CustomError) {
        console.error('Custom error:', error.message, error.code, error.stack);
      } else if (error instanceof Error) {
        console.error('Error:', error.message, error.stack);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const trackImageUrl = sctrack?.artwork_url ? sctrack.artwork_url.replace('-large', '-t500x500') : null;

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share SoundCloud Track</Text>
          <TouchableOpacity onPress={handleSCTrackPost} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.trackInfoContainer}>
            {trackImageUrl && <Image source={{ uri: trackImageUrl }} style={styles.trackImage} />}
            <View style={styles.trackDetails}>
              <Text style={styles.trackTitle} numberOfLines={2}>{sctrack?.title || 'Unknown Title'}</Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {sctrack?.publisher_metadata?.artist || 'Unknown Artist'}
              </Text>
              <Text style={styles.trackReleaseDate} numberOfLines={1}>
                {sctrack?.release_date ? new Date(sctrack.release_date).toLocaleDateString() : 'Unknown Date'}
              </Text>
            </View>
          </View>

          <TextInput
            style={styles.postInput}
            placeholder="Write something about this track..."
            placeholderTextColor={placeholder}
            multiline={true}
            value={postText}
            onChangeText={setPostText}
            maxLength={600}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: lgray,
  },
  closeButton: {
    padding: 5,
  },
  cancelText: {
    color: error, // Using the error color
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
  },
  postButton: {
    padding: 5,
  },
  postButtonText: {
    color: '#ff7700', // SoundCloud orange
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  trackInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  trackImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  trackDetails: {
    flex: 1,
    marginLeft: 15,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
    marginBottom: 5,
  },
  trackArtist: {
    fontSize: 16,
    color: lgray,
    marginBottom: 5,
  },
  trackReleaseDate: {
    fontSize: 16,
    color: lgray,
  },
  postInput: {
    flex: 1,
    color: light,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default PostSCTrackScreen;