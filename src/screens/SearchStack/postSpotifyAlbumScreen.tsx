import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { SearchScreenStackParamList } from '../../components/types';
import { dark, light, placeholder, lgray, error } from '../../components/colorModes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createPost } from '../../graphql/mutations';
import CustomError from '../../errorHandling/CustomError';

type PostSpotifyAlbumScreenProps = NativeStackScreenProps<SearchScreenStackParamList, 'PostSpotifyAlbum'>;

const PostSpotifyAlbumScreen: React.FC<PostSpotifyAlbumScreenProps> = ({ route, navigation }) => {
  const { album } = route.params;
  const [postText, setPostText] = useState('');

  const handleAlbumPost = async () => {
    try {
      const client = generateClient();
      const { userId, username } = await getCurrentUser();
    
      const PostDetails = {
        body: postText,
        userPostsId: userId,
        username: username,
        spotifyAlbumId: album.id,
        spotifyAlbumName: album.name, 
        spotifyAlbumReleaseDate: album.release_date,
        spotifyAlbumArtists: album.artists.map(artist => artist.name).join(', '),
        spotifyAlbumTotalTracks: album.total_tracks,
        spotifyAlbumImageUrl: album.images[0]?.url,
        spotifyAlbumExternalUrl: album.external_urls.spotify,
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
          <Text style={styles.headerTitle}>Share Spotify Album</Text>
          <TouchableOpacity onPress={handleAlbumPost} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.albumInfoContainer}>
            <Image source={{ uri: album.images[0]?.url }} style={styles.albumImage} />
            <View style={styles.albumDetails}>
              <Text style={styles.albumTitle} numberOfLines={2}>{album.name}</Text>
              <Text style={styles.albumArtist} numberOfLines={1}>{album.artists.map(artist => artist.name).join(', ')}</Text>
              <Text style={styles.albumReleaseDate} numberOfLines={1}>
                {new Date(album.release_date).getMonth() + 1}-{new Date(album.release_date).getFullYear()}  •  {album.total_tracks} tracks
              </Text>
            </View>
          </View>

          <TextInput
            style={styles.postInput}
            placeholder="Write something about this album..."
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
  albumInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  albumImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  albumDetails: {
    flex: 1,
    marginLeft: 15,
  },
  albumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
    marginBottom: 5,
  },
  albumArtist: {
    fontSize: 16,
    color: lgray,
  },
  albumReleaseDate: {
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

export default PostSpotifyAlbumScreen;