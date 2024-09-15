import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking, TouchableOpacity, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SearchScreenStackParamList } from '../../components/types';
import { light, dark, gray, lgray } from '../../components/colorModes';
import useSpotifyItemById from '../../spotifyConfig/getSpotifyItemById';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faMusic } from '@fortawesome/free-solid-svg-icons';

type SearchSpotifyArtistScreenRouteProp = RouteProp<SearchScreenStackParamList, 'SearchSpotifyArtist'>;

type Props = {
  route: SearchSpotifyArtistScreenRouteProp;
};

const SearchSpotifyArtistScreen: React.FC<Props> = ({ route }) => {
  const { artistId } = route.params;
  const navigation = useNavigation<any>();
  const { getSpotifyArtistById, getSpotifyArtistTopTracks, getSpotifyArtistAlbumsById } = useSpotifyItemById();
  const [artist, setArtist] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (artistId) {
        setIsLoading(true);
        try {
          const [artistData, tracksData, albumsData] = await Promise.all([
            getSpotifyArtistById(artistId),
            getSpotifyArtistTopTracks(artistId),
            getSpotifyArtistAlbumsById(artistId)
          ]);
          setArtist(artistData);
          setTopTracks(tracksData?.slice(0, 5) || []); // Limit to 5 tracks
          setAlbums(albumsData || []);
        } catch (error) {
          console.error('Error fetching artist data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchArtistData();
  }, [artistId, getSpotifyArtistById, getSpotifyArtistTopTracks, getSpotifyArtistAlbumsById]);

  const renderTrackItem = (track: any) => (
    <TouchableOpacity 
      key={track.id}  // Add this line to provide a unique key
      style={styles.trackItem} 
      onPress={() => navigation.navigate('SearchSpotifyTrack', { trackId: track.id })}
    >
      <FontAwesomeIcon icon={faMusic} size={16} color={light} style={styles.trackIcon} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1} ellipsizeMode="tail">{track.name}</Text>
        <Text style={styles.trackArtists} numberOfLines={1} ellipsizeMode="tail">{track.artists.map((a: any) => a.name).join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAlbumItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.albumItem}
      onPress={() => navigation.navigate('SearchSpotifyAlbum', { albumId: item.id })}
    >
      <Image source={{ uri: item.images[0]?.url }} style={styles.albumImage} />
      <Text style={styles.albumName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
      <Text style={styles.albumInfo}>{item.release_date.split('-')[0]} • {item.total_tracks} tracks</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={light} />
        <Text style={styles.loadingText}>Loading artist data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faChevronLeft} size={20} color={light} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Artist</Text>
          <View style={styles.headerButton} />
        </View>
        
        {artist && (
          <View style={styles.artistInfoContainer}>
            <Image source={{ uri: artist.images[0]?.url }} style={styles.artistImage} />
            <Text style={styles.artistName}>{artist.name}</Text>
            <Text style={styles.followers}>{artist.followers.toLocaleString()} followers</Text>
            <Text style={styles.followers}>Popularity: {artist.popularity || 'N/A'}</Text>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => Linking.openURL(artist.external_urls.spotify)}
            >
              <Text style={styles.buttonText}>Open in Spotify</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Top Tracks</Text>
        <View style={styles.trackListContainer}>
          {topTracks.map((track) => renderTrackItem(track))}
        </View>

        <Text style={styles.sectionTitle}>Albums</Text>
        <FlatList
          data={albums}
          renderItem={renderAlbumItem}
          keyExtractor={(item) => item.id}
          horizontal
          style={styles.albumList}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
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
    paddingHorizontal: 10,
    backgroundColor: dark,
    borderBottomWidth: 2,
    borderBottomColor: gray,
    paddingBottom: 10,
  },
  headerButton: {
    padding: 10,
    width: 70,
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  artistImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 100,
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: light,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: dark,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: light,
    marginTop: 10,
  },
  artistInfoContainer: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingRight: 20,
  },
  listHeader: {
    marginBottom: 10,
  },
  topTracksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: light,
    marginTop: 20,
    opacity: 0.8,
  },
  trackListContainer: {
    paddingHorizontal: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  trackIcon: {
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    color: light,
    fontWeight: 'bold',
  },
  trackArtists: {
    fontSize: 14,
    color: light,
    opacity: 0.7,
  },
  emptyText: {
    color: light,
    textAlign: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: light,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  albumList: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  albumItem: {
    marginRight: 10,
    width: 150,
  },
  albumImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  albumName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    color: light,
  },
  albumInfo: {
    fontSize: 12,
    color: lgray,
  },
  followers: {
    fontSize: 14,
    color: light,
    marginBottom: 10,
  },
});

export default SearchSpotifyArtistScreen;

