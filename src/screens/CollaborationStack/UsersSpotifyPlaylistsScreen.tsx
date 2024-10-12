import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { dark, light, gray, mediumgray, lgray } from '../../components/colorModes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';
import { getUserSpotifyPlaylists } from '../../utils/spotifyPlaylistAPI';

type UsersSpotifyPlaylistsScreenNavigationProp = NativeStackNavigationProp<
  CollaborationStackParamList,
  'UsersSpotifyPlaylists'
>;

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

const UsersSpotifyPlaylistsScreen: React.FC = () => {
  const navigation = useNavigation<UsersSpotifyPlaylistsScreenNavigationProp>();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const fetchedPlaylists = await getUserSpotifyPlaylists();
      setPlaylists(fetchedPlaylists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistPress = (playlistId: string) => {
    navigation.navigate('PostPlaylist', { playlistId });
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => {
    const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : undefined;

    return (
      <TouchableOpacity 
        style={styles.playlistItem} 
        onPress={() => handlePlaylistPress(item.id)}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.playlistImage}
          />
        ) : (
          <View style={[styles.playlistImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>{item.name[0]}</Text>
          </View>
        )}
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistName}>{item.name}</Text>
          <Text style={styles.trackCount}>{item.tracks.total} tracks</Text>
        </View>
      </TouchableOpacity>
    );
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

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Public Spotify Playlists</Text>
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
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
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  playlistInfo: {
    marginLeft: 15,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: light,
  },
  trackCount: {
    fontSize: 14,
    color: lgray,
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

export default UsersSpotifyPlaylistsScreen;
