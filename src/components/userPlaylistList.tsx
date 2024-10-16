import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { listSpotifyPlaylists } from '../graphql/queries';
import { SpotifyPlaylist } from '../API';
import { dark, light, lgray, spotifyGreen, gray, mediumgray, dgray } from './colorModes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { getPlaylistDetails } from '../utils/spotifyPlaylistAPI';

type UserPlaylistListProps = {
  userId: string;
  onPlaylistsCountUpdate?: (count: number) => void;
  onPlaylistPress?: (playlist: SpotifyPlaylist) => void;
  onPlaylistLongPress?: (playlist: SpotifyPlaylist) => void;
};

const UserPlaylistList: React.FC<UserPlaylistListProps> = ({ 
  userId, 
  onPlaylistsCountUpdate,
  onPlaylistPress,
  onPlaylistLongPress
}) => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const fetchPlaylists = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const client = generateClient();
      const playlistsResponse = await client.graphql({
        query: listSpotifyPlaylists,
        variables: { filter: { userSpotifyPlaylistsId: { eq: userId } } }
      });

      const userPlaylists = playlistsResponse.data.listSpotifyPlaylists.items;

      // Fetch track counts and follower counts for all playlists
      const playlistsWithDetails = await Promise.all(
        userPlaylists.map(async (playlist: SpotifyPlaylist) => {
          try {
            const details = await getPlaylistDetails(playlist.spotifyPlaylistId);
            return { ...playlist, tracks: details.tracks, followers: details.followers };
          } catch (error) {
            console.error(`Error fetching details for playlist ${playlist.id}:`, error);
            return playlist;
          }
        })
      );

      // Sort playlists by creation date
      playlistsWithDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setPlaylists(prevPlaylists => {
        const newPlaylists = playlistsWithDetails;
        if (onPlaylistsCountUpdate && newPlaylists.length !== prevPlaylists.length) {
          onPlaylistsCountUpdate(newPlaylists.length);
        }
        return newPlaylists;
      });
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, onPlaylistsCountUpdate]);

  useEffect(() => {
    if (userId) {
      fetchPlaylists();
    }
  }, [userId, fetchPlaylists]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handlePlaylistPress = useCallback((playlist: SpotifyPlaylist) => {
    if (onPlaylistPress) {
      onPlaylistPress(playlist);
    } else if (playlist.spotifyPlaylistId) {
      navigation.navigate('ProfileViewPlaylist', { playlistId: playlist.spotifyPlaylistId });
    } else {
      console.error('Spotify Playlist ID is undefined:', playlist);
    }
  }, [onPlaylistPress]);

  const handlePlaylistLongPress = useCallback((playlist: SpotifyPlaylist) => {
    if (onPlaylistLongPress) {
      onPlaylistLongPress(playlist);
    }
  }, [onPlaylistLongPress]);

  const renderPlaylistItem = (item: SpotifyPlaylist) => {
    const displayType = (type: string) => {
      switch (type) {
        case 'COLLABORATIVE':
          return 'COLLAB';
        case 'RESTRICTED_COLLABORATIVE':
          return 'LIMITED COLLAB';
        default:
          return 'PUBLIC';
      }
    };

    const displayLimit = (limit: string | null | undefined) => {
      return limit === 'unlimited' ? 'No Limit' : `${limit}`;
    };

    return (
      <TouchableOpacity 
        key={item.id}
        onPress={() => handlePlaylistPress(item)}
        onLongPress={() => handlePlaylistLongPress(item)}
        activeOpacity={1}
      >
        <View style={styles.playlistItem}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.playlistImage} />
          ) : (
            <Image 
              source={require('../assets/collab.jpeg')} 
              style={styles.playlistImage} 
            />
          )}
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName}>{item.name}</Text>
            <Text style={styles.playlistUsername}>By {item.username}</Text>
            <Text style={styles.playlistDetails}>
              {item.tracks} tracks • {item.followers} followers
            </Text>
            <View style={styles.playlistTypeContainer}>
              <View style={styles.playlistType}>
                <Text style={styles.playlistTypeText}>{displayType(item.type)}</Text>
                {item.type === 'RESTRICTED_COLLABORATIVE' && (
                  <Text style={styles.playlistLimit}>({displayLimit(item.trackLimitPerUser)})</Text>
                )}
              </View>
            </View>
            <View style={styles.genreContainer}>
              {item.genres && item.genres.map((genre, index) => (
                <View key={index} style={styles.genreBubble}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && playlists.length === 0) {
    return null;
  }

  if (playlists.length === 0 && !isLoading) {
    return (
      <View style={styles.noPlaylistsContainer}>
        <Text style={styles.noPlaylistsText}>No playlists created yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {playlists.map(renderPlaylistItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: dark,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  playlistImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  playlistInfo: {
    marginLeft: 15,
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: light,
    marginBottom: 2,
  },
  playlistUsername: {
    fontSize: 14,
    color: lgray,
    marginBottom: 2,
  },
  playlistDetails: {
    fontSize: 14,
    color: lgray,
    marginBottom: 5,
  },
  playlistTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 5,
  },
  playlistType: {
    backgroundColor: spotifyGreen,
    color: dark,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 5,
    flexDirection: 'row',

  },
  playlistTypeText: {
    color: dark,
    fontSize: 12,
    fontWeight: 'bold',
  },
  playlistLimit: {
    color: gray,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  noPlaylistsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100,
  },
  noPlaylistsText: {
    fontSize: 16,
    color: lgray,
    textAlign: 'center',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  genreBubble: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
    borderWidth: 1,
    borderColor: lgray,
  },
  genreText: {
    color: light,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default UserPlaylistList;
