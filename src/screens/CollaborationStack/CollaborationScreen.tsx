import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { dark, light, lgray, spotifyGreen } from '../../components/colorModes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listSpotifyPlaylists, listFriendRequests } from '../../graphql/queries';
import { SpotifyPlaylist } from '../../API';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CreatePlaylistBottomSheetModal from '../../components/BottomSheets/CreatePlaylistBottomSheetModal';
import PlaylistBottomSheetModal from '../../components/BottomSheets/PlaylistBottomSheetModal';
import { getPlaylistDetails } from '../../utils/spotifyPlaylistAPI';

type CollaborationScreenNavigationProp = NativeStackNavigationProp<
  CollaborationStackParamList,
  'Collaboration'
>;

const CollaborationScreen: React.FC = () => {
  const navigation = useNavigation<CollaborationScreenNavigationProp>();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const createPlaylistBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const playlistBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);

  const fetchPlaylists = useCallback(async () => {
    try {
      const client = generateClient();
      const { userId } = await getCurrentUser();

      // Fetch user's playlists
      const userPlaylistsResult = await client.graphql({
        query: listSpotifyPlaylists,
        variables: { filter: { userSpotifyPlaylistsId: { eq: userId } } }
      });
      const userPlaylists = userPlaylistsResult.data.listSpotifyPlaylists.items;

      // Fetch user's friends (following)
      const friendsResult = await client.graphql({
        query: listFriendRequests,
        variables: {
          filter: {
            userSentFriendRequestsId: { eq: userId },
            status: { eq: 'Following' }
          }
        }
      });
      const friendIds = friendsResult.data.listFriendRequests.items.map((request: any) => request.userReceivedFriendRequestsId);

      // Fetch friends' playlists
      const friendsPlaylistsPromises = friendIds.map((friendId: string) =>
        client.graphql({
          query: listSpotifyPlaylists,
          variables: { filter: { userSpotifyPlaylistsId: { eq: friendId } } }
        })
      );
      const friendsPlaylistsResults = await Promise.all(friendsPlaylistsPromises);
      const friendsPlaylists = friendsPlaylistsResults.flatMap((result: any) => result.data.listSpotifyPlaylists.items);

      // Combine playlists
      const allPlaylists = [...userPlaylists, ...friendsPlaylists];

      // Fetch track counts and follower counts for all playlists
      const playlistsWithDetails = await Promise.all(
        allPlaylists.map(async (playlist) => {
          try {
            const details = await getPlaylistDetails(playlist.spotifyPlaylistId);
            return { ...playlist, tracks: details.tracks, followers: details.followers };
          } catch (error) {
            console.error(`Error fetching details for playlist ${playlist.id}:`, error);
            return playlist; // Return the original playlist if there's an error
          }
        })
      );

      setPlaylists(playlistsWithDetails);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleCreatePlaylist = useCallback(() => {
    createPlaylistBottomSheetModalRef.current?.present();
  }, []);

  const handlePlaylistPress = useCallback((playlist: SpotifyPlaylist) => {
    if (playlist.spotifyPlaylistId) {
      navigation.navigate('ViewPlaylist', { playlistId: playlist.spotifyPlaylistId });
    } else {
      console.error('Spotify Playlist ID is undefined:', playlist);
      Alert.alert('Error', 'Unable to view this playlist. Please try again later.');
    }
  }, [navigation]);

  const handlePlaylistLongPress = useCallback((playlist: SpotifyPlaylist) => {
    setSelectedPlaylist(playlist);
    playlistBottomSheetModalRef.current?.present();
  }, []);

  const renderPlaylistItem = ({ item }: { item: SpotifyPlaylist }) => (
    <TouchableOpacity 
      onPress={() => handlePlaylistPress(item)}
      onLongPress={() => handlePlaylistLongPress(item)}
      delayLongPress={500}
    >
      <View style={styles.playlistItem}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.playlistImage} />
        ) : (
          <Image 
            source={require('../../assets/collab.jpeg')} 
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
            <Text style={styles.playlistType}>{item.type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={light} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Collaborate</Text>
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          style={styles.playlistList}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No playlists found. Create one or follow users to see their playlists.</Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={light}
              colors={[light]}
            />
          }
        />
        <TouchableOpacity style={styles.plusButton} onPress={handleCreatePlaylist}>
          <FontAwesomeIcon icon={faPlus} size={24} color={dark} />
        </TouchableOpacity>
      </View>
      <CreatePlaylistBottomSheetModal ref={createPlaylistBottomSheetModalRef} navigation={navigation} />
      <PlaylistBottomSheetModal ref={playlistBottomSheetModalRef} playlist={selectedPlaylist} />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
    marginBottom: 20,
  },
  playlistList: {
    flex: 1,
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
  placeholderImage: {
    backgroundColor: lgray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: dark,
    fontSize: 24,
    fontWeight: 'bold',
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
  plusButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: spotifyGreen,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    color: lgray,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default CollaborationScreen;
