import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ActivityIndicator, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';
import { dark, light, gray, lgray, spotifyGreen, placeholder, error, mediumgray } from '../../components/colorModes';
import { getPlaylistById } from '../../utils/spotifyPlaylistAPI';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createSpotifyPlaylist } from '../../graphql/mutations';
import CustomError from '../../errorHandling/CustomError';

type PostPlaylistScreenRouteProp = RouteProp<CollaborationStackParamList, 'PostPlaylist'>;

type PostPlaylistScreenNavigationProp = NativeStackNavigationProp<
  CollaborationStackParamList,
  'PostPlaylist'
>;

type Props = {
  route: PostPlaylistScreenRouteProp;
  navigation: PostPlaylistScreenNavigationProp;
};

const PostPlaylistScreen: React.FC<Props> = ({ route, navigation }) => {
  const { playlistId } = route.params;
  const [playlist, setPlaylist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postText, setPostText] = useState('');

  useEffect(() => {
    fetchPlaylistDetails();
  }, []);

  const fetchPlaylistDetails = async () => {
    try {
      const playlistData = await getPlaylistById(playlistId);
      setPlaylist(playlistData);
    } catch (error) {
      console.error('Error fetching playlist details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaylistType = (playlist: any): 'PUBLIC' | 'COLLABORATIVE' | 'PRIVATE' => {
    if (playlist.collaborative) return 'COLLABORATIVE';
    if (playlist.public) return 'PUBLIC';
    return 'PRIVATE';
  };

  const handlePlaylistPost = async () => {
    try {
      const client = generateClient();
      const { userId, username } = await getCurrentUser();
    
      const PlaylistDetails = {
        name: playlist.name,
        description: playlist.description,
        userSpotifyPlaylistsId: userId,
        type: getPlaylistType(playlist),
        spotifyPlaylistId: playlist.id,
        username: username,
        spotifyUserId: playlist.owner.id,
        spotifyExternalUrl: playlist.external_urls.spotify,
        imageUrl: playlist.images[0]?.url,
        tracks: playlist.tracks.total,
        followers: playlist.followers.total,
        likedBy: [],
        likesCount: 0,
      };

      const result = await client.graphql({
        query: createSpotifyPlaylist,
        variables: { input: PlaylistDetails }
      });

      console.log('New Playlist created successfully!', result.data.createSpotifyPlaylist);
      navigation.navigate('Collaboration');
    } catch (error) {
      console.error('Error creating playlist:', error);
      if (error instanceof CustomError) {
        // Handle custom error
      } else {
        // Handle other errors
      }
    }
  };

  const renderPlaylistImage = () => {
    if (playlist.images && playlist.images.length > 0 && playlist.images[0].url) {
      return (
        <Image
          source={{ uri: playlist.images[0].url }}
          style={styles.playlistImage}
        />
      );
    } else {
      return (
        <View style={[styles.playlistImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{playlist.name[0]}</Text>
        </View>
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={light} />
        </View>
      </SafeAreaView>
    );
  }

  if (!playlist) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <Text style={styles.errorText}>Failed to load playlist</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Spotify Playlist</Text>
          <TouchableOpacity onPress={handlePlaylistPost} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.playlistInfoContainer}>
            {renderPlaylistImage()}
            <View style={styles.playlistDetails}>
              <Text style={styles.playlistTitle} numberOfLines={2}>{playlist.name}</Text>
              <Text style={styles.playlistOwner} numberOfLines={1}>By {playlist.owner.display_name}</Text>
              <Text style={styles.playlistStats} numberOfLines={1}>
                {playlist.tracks.total} tracks • {playlist.followers.total} followers
              </Text>
              <View style={styles.playlistTypeContainer}>
                <Text style={styles.playlistType}>{getPlaylistType(playlist)}</Text>
              </View>
            </View>
          </View>

          <TextInput
            style={styles.postInput}
            placeholder="Write something about this playlist..."
            placeholderTextColor={placeholder}
            multiline={true}
            value={postText}
            onChangeText={setPostText}
            maxLength={600}
          />
        </ScrollView>
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
    borderBottomColor: mediumgray,
  },
  closeButton: {
    padding: 5,
  },
  cancelText: {
    color: error,
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
    color: spotifyGreen,
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  playlistInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playlistImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  playlistDetails: {
    flex: 1,
    marginLeft: 15,
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
    marginBottom: 5,
  },
  playlistOwner: {
    fontSize: 16,
    color: lgray,
  },
  playlistStats: {
    fontSize: 14,
    color: lgray,
    marginTop: 5,
  },
  postInput: {
    flex: 1,
    color: light,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: light,
    textAlign: 'center',
    marginTop: 20,
  },
  playlistTypeContainer: {
    marginTop: 5,
    backgroundColor: spotifyGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  playlistType: {
    color: dark,
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholderImage: {
    backgroundColor: gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: light,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PostPlaylistScreen;
