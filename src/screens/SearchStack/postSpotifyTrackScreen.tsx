import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { SearchScreenStackParamList } from '../../components/types';
import { dark, light, placeholder, lgray, error } from '../../components/colorModes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createPost } from '../../graphql/mutations';
import CustomError from '../../errorHandling/CustomError';
import { formatDate } from '../../utils/dateFormatter';

type PostSpotifyTrackScreenProps = NativeStackScreenProps<SearchScreenStackParamList, 'PostSpotifyTrack'>;

const PostSpotifyTrackScreen: React.FC<PostSpotifyTrackScreenProps> = ({ route, navigation }) => {
  const { track } = route.params;
  const [postText, setPostText] = useState('');

  const handleTrackPost = async () => {
    try {
      const client = generateClient();
      const { userId, username } = await getCurrentUser();
    
      const PostDetails = {
        body: postText,
        userPostsId: userId,
        username: username,
        spotifyTrackName: track.name, 
        spotifyTrackArtists: track.artists.map(artist => artist.name).join(', '), 
        spotifyTrackId: track.id,
        spotifyTrackAlbumName: track.album.name,
        spotifyTrackImageUrl: track.album.images[0]?.url,
        spotifyTrackPreviewUrl: track.preview_url,
        spotifyTrackExternalUrl: track.external_urls.spotify,
        spotifyTrackReleaseDate: track.album.release_date,
        spotifyTrackDurationMs: track.duration_ms,
        spotifyTrackExplicit: track.explicit,
        likesCount: 0,
      };

      await client.graphql({
        query: createPost,
        variables: { input: PostDetails },
      });
      console.log('New Post created successfully!');
      setPostText('');
      navigation.goBack()
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

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Spotify Track</Text>
          <TouchableOpacity onPress={handleTrackPost} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.trackInfoContainer}>
            <Image source={{ uri: track.album.images[0]?.url }} style={styles.trackImage} />
            <View style={styles.trackDetails}>
              <Text style={styles.trackTitle} numberOfLines={2}>
                {track.name}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>{track.artists.map(artist => artist.name).join(', ')}</Text>
              <Text style={styles.trackAlbum} numberOfLines={1}>
                {track.album.name}  •  {formatDate(track.album.release_date)}
              </Text>
              {track.explicit && (
                <View style={styles.explicitLabelContainer}>
                  <Text style={styles.explicitLabel}>Explicit</Text>
                </View>
              )}
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
    color: '#1DB954', // Spotify green
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
  },
  trackAlbum: {
    fontSize: 16,
    color: lgray,
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
  explicitLabelContainer: {
    backgroundColor: '#444',
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  explicitLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default PostSpotifyTrackScreen;