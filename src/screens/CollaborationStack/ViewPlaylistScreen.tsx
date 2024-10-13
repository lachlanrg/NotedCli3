import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';
import { dark, light, gray, lgray, spotifyGreen } from '../../components/colorModes';
import { getPlaylistById } from '../../utils/spotifyPlaylistAPI';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AddTrackPlaylistBottomSheetModal from '../../components/BottomSheets/AddTrackPlaylistBottomSheetModal';


type ViewPlaylistScreenRouteProp = RouteProp<CollaborationStackParamList, 'ViewPlaylist'>;

type ViewPlaylistScreenNavigationProp = NativeStackNavigationProp<
  CollaborationStackParamList,
  'ViewPlaylist'
>;

type Props = {
  route: ViewPlaylistScreenRouteProp;
  navigation: ViewPlaylistScreenNavigationProp;
};

const ViewPlaylistScreen: React.FC<Props> = ({ route }) => {
  const { playlistId } = route.params;
  const [playlist, setPlaylist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addTrackBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const refreshPlaylist = useCallback(async () => {
    setIsLoading(true);
    try {
      const playlistData = await getPlaylistById(playlistId);
      setPlaylist(playlistData);
    } catch (error) {
      console.error('Error refreshing playlist details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    refreshPlaylist();
  }, [refreshPlaylist]);

  const handleAddTrack = () => {
    addTrackBottomSheetModalRef.current?.present();
  };

  const handleTracksAdded = () => {
    refreshPlaylist();
  };

  const renderImage = (imageUrl: string | undefined | null, style: any, placeholderText: string) => {
    if (imageUrl) {
      return <Image source={{ uri: imageUrl }} style={style} />;
    } else {
      return (
        <View style={[style, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{placeholderText[0].toUpperCase()}</Text>
        </View>
      );
    }
  };

  const renderTrackItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.trackItem}>
      <Text style={styles.trackNumber}>{index + 1}</Text>
      {renderImage(item.track.album.images?.[0]?.url, styles.trackImage, item.track.name)}
      <View style={styles.trackInfo}>
        <Text style={styles.trackName}>{item.track.name}</Text>
        <Text style={styles.artistName}>{item.track.artists.map((artist: any) => artist.name).join(', ')}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={light} />
      </SafeAreaView>
    );
  }

  if (!playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Failed to load playlist</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {renderImage(playlist.images?.[0]?.url, styles.playlistImage, playlist.name)}
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistName}>{playlist.name}</Text>
          <Text style={styles.playlistOwner}>By {playlist.owner.display_name}</Text>
          <Text style={styles.playlistDescription}>{playlist.description}</Text>
          <View style={styles.playlistStats}>
            <Text style={styles.statsText}>{playlist.tracks.total} tracks</Text>
            <Text style={styles.statsText}>{playlist.followers.total} followers</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.addMusicButton} onPress={handleAddTrack}>
        <Text style={styles.addMusicButtonText}>Add Your Music</Text>
      </TouchableOpacity>
      <FlatList
        data={playlist.tracks.items}
        renderItem={renderTrackItem}
        keyExtractor={(item, index) => `${item.track.id || item.track.name}-${index}`}
        style={styles.trackList}
      />
      <AddTrackPlaylistBottomSheetModal 
        ref={addTrackBottomSheetModalRef}
        playlistId={playlistId}
        onTracksAdded={handleTracksAdded}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
  },
  playlistImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 20,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
  },
  playlistOwner: {
    fontSize: 16,
    color: lgray,
    marginTop: 5,
  },
  playlistDescription: {
    fontSize: 14,
    color: lgray,
    marginTop: 10,
  },
  playlistStats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statsText: {
    fontSize: 14,
    color: lgray,
    marginRight: 10,
  },
  trackList: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  trackNumber: {
    width: 30,
    fontSize: 14,
    color: lgray,
    textAlign: 'center',
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 10,
  },
  trackInfo: {
    marginLeft: 10,
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    color: light,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    color: lgray,
  },
  errorText: {
    fontSize: 18,
    color: light,
    textAlign: 'center',
    marginTop: 20,
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
  addMusicButton: {
    backgroundColor: spotifyGreen,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  addMusicButtonText: {
    color: dark,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ViewPlaylistScreen;
