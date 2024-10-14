import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';
import { dark, light, gray, lgray, spotifyGreen, mediumgray } from '../../components/colorModes';
import { getPlaylistById } from '../../utils/spotifyPlaylistAPI';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AddTrackPlaylistBottomSheetModal from '../../components/BottomSheets/AddTrackPlaylistBottomSheetModal';
import { generateClient } from 'aws-amplify/api';
import { getSpotifyPlaylist, listSpotifyPlaylists } from '../../graphql/queries';
import LinearGradient from 'react-native-linear-gradient';
import { Linking } from 'react-native';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const spotifyIcon: IconProp = faSpotify;

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
  const [playlistType, setPlaylistType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const addTrackBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const refreshPlaylist = useCallback(async () => {
    setIsLoading(true);
    try {
      const playlistData = await getPlaylistById(playlistId);
      setPlaylist(playlistData);

      // Fetch playlist type from our database
      const client = generateClient();
      const response = await client.graphql({
        query: listSpotifyPlaylists,
        variables: { filter: { spotifyPlaylistId: { eq: playlistId } } }
      });
      const dbPlaylist = response.data.listSpotifyPlaylists.items[0];
      if (dbPlaylist) {
        setPlaylistType(dbPlaylist.type);
      }
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

  const handleOpenInSpotify = () => {
    Linking.openURL(playlist.external_urls.spotify);
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

  const renderHeader = () => (
    <View style={styles.header}>
      {renderImage(playlist.images?.[0]?.url, styles.playlistImage, playlist.name)}
      <TouchableOpacity
        style={styles.openInSpotifyButton}
        onPress={handleOpenInSpotify}
      >
        <FontAwesomeIcon icon={spotifyIcon} size={21} color={spotifyGreen} />
        <Text style={styles.openInSpotifyText}>Open in Spotify</Text>
      </TouchableOpacity>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{playlist.name}</Text>
        <Text style={styles.playlistOwner}>By {playlist.owner.display_name}</Text>
        <Text style={styles.playlistDescription}>{playlist.description}</Text>
        <View style={styles.playlistStats}>
          <Text style={styles.statsText}>{playlist.tracks.total} tracks • {playlist.followers.total} followers</Text>
        </View>
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

  const isCollaborative = playlistType === 'COLLABORATIVE' || playlistType === 'RESTRICTED_COLLABORATIVE';

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={playlist.tracks.items}
        renderItem={renderTrackItem}
        keyExtractor={(item, index) => `${item.track.id || item.track.name}-${index}`}
        ListHeaderComponent={renderHeader}
        style={styles.trackList}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      {isCollaborative && (
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
          style={styles.overlayContainer}
        >
          <TouchableOpacity style={styles.addMusicButton} onPress={handleAddTrack}>
            <Text style={styles.addMusicButtonText}>Add Your Music</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
      {(playlistType === 'COLLABORATIVE' || playlistType === 'RESTRICTED_COLLABORATIVE') && (
        <AddTrackPlaylistBottomSheetModal 
          ref={addTrackBottomSheetModalRef}
          playlistId={playlistId}
          onTracksAdded={handleTracksAdded}
        />
      )}
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
    alignItems: 'center',
    paddingTop: 20,
  },
  playlistImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  playlistInfo: {
    alignItems: 'flex-start',
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
  },
  playlistOwner: {
    fontSize: 16,
    color: lgray,
  },
  playlistDescription: {
    fontSize: 14,
    color: lgray,
    marginTop: 5,
  },
  playlistStats: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
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
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 110, // Adjust height as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMusicButton: {
    backgroundColor: spotifyGreen,
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginTop: 30,
  },
  addMusicButtonText: {
    color: dark,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  openInSpotifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: spotifyGreen,
    // borderWidth: 0.6,
    borderColor: lgray,
    padding: 10,
    borderRadius: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  openInSpotifyText: {
    color: light,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default ViewPlaylistScreen;
