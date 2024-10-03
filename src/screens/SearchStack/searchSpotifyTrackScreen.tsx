// searchSpotifyTrackScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, SafeAreaView, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SearchScreenStackParamList } from '../../components/types';
import { dark, gray, light } from '../../components/colorModes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faShare } from '@fortawesome/free-solid-svg-icons';
import useSpotifyItemById from '../../spotifyConfig/getSpotifyItemById';
import { Track } from '../../spotifyConfig/itemInterface';
import { getSpotifyItemPostCount } from '../../utils/musicPostCounts';
import { formatDate } from '../../utils/dateFormatter';

type SearchSpotifyTrackScreenRouteProp = RouteProp<SearchScreenStackParamList, 'SearchSpotifyTrack'>;

type Props = {
  route: SearchSpotifyTrackScreenRouteProp;
};

const SearchSpotifyTrackScreen: React.FC<Props> = ({ route }) => {
  const { trackId } = route.params;
  const navigation = useNavigation<any>();
  const [spotifyData, setSpotifyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postCount, setPostCount] = useState<number>(0);
  const { getSpotifyTrackById } = useSpotifyItemById();

  useEffect(() => {
    const fetchData = async () => {
      if (trackId) {
        setIsLoading(true);
        try {
          let data = await getSpotifyTrackById(trackId);
          setSpotifyData(data);
          
          // Fetch post count
          const count = await getSpotifyItemPostCount(trackId, false);
          setPostCount(count);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [trackId, getSpotifyTrackById]);

  const handlePostPress = () => {
    if (spotifyData) {
      const track: Track = {
        id: spotifyData.id,
        name: spotifyData.name,
        artists: spotifyData.artists,
        album: spotifyData.album,
        duration_ms: spotifyData.duration_ms,
        external_urls: spotifyData.external_urls,
        preview_url: spotifyData.preview_url,
        popularity: spotifyData.popularity,
        type: spotifyData.type,
        explicit: spotifyData.explicit,
      };
      navigation.navigate('PostSpotifyTrack', { track });
    }
  };

  const renderTrackInfo = () => {
    if (!spotifyData) return null;

    const album = spotifyData.album || {};
    const albumImageUrl = album.images && album.images[0] ? album.images[0].url : null;

    return (
      <ScrollView style={styles.content}>
        {albumImageUrl && (
          <Image 
            source={{ uri: albumImageUrl }} 
            style={styles.albumCover}
          />
        )}
        <View style={styles.postCountContainer}>
          {postCount > 0 ? (
            <>
              <Text style={styles.postCountText}>{postCount}</Text>
              <Text style={styles.postCountLabel}>Posts</Text>
            </>
          ) : (
            <Text style={styles.firstPostText}>Be the first to Post this!</Text>
          )}
        </View>
        <Text style={styles.trackName}>{spotifyData.name || 'Unknown Track'}</Text>
        {spotifyData.artists && spotifyData.artists.length > 0 && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('SearchSpotifyArtist', { artistId: spotifyData.artists[0].id })}
          >
            <Text style={styles.artistName}>
              {spotifyData.artists.map((artist: any) => artist.name).join(', ')}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.albumName}>{album.name || 'Unknown Album'}</Text>
        <Text style={styles.text}>Release Date: {album.release_date ? formatDate(album.release_date) : 'Unknown'}</Text>
        <Text style={styles.text}>Track Number: {spotifyData.track_number || 'Unknown'}</Text>
        <Text style={styles.text}>
          Duration: {spotifyData.duration_ms ? `${Math.floor(spotifyData.duration_ms / 60000)}:${((spotifyData.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}` : 'Unknown'}
        </Text>
        <Text style={styles.text}>Popularity: {spotifyData.popularity || 'Unknown'}</Text>
        {spotifyData.external_urls && spotifyData.external_urls.spotify && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => Linking.openURL(spotifyData.external_urls.spotify)}
          >
            <Text style={styles.buttonText}>Open in Spotify</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Spotify Track Details</Text>
          <TouchableOpacity onPress={handlePostPress} style={styles.headerButton}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={light} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : 
        renderTrackInfo()
      }
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
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
    width: 70, // Set a fixed width for both buttons
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: light,
    textAlign: 'center',
  },
  postButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: light,
  },
  exploreBack: {
    color: light,
    marginLeft: 5,
    fontSize: 10,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  text: {
    color: light,
    marginBottom: 5,
  },
  albumCover: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  trackName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
    marginBottom: 10,
  },
  artistName: {
    fontSize: 18,
    color: light,
    marginBottom: 5,
  },
  albumName: {
    fontSize: 16,
    color: gray,
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: light,
    marginTop: 20,
    marginBottom: 10,
  },
  trackItem: {
    marginBottom: 10,
  },
  trackItemName: {
    fontSize: 16,
    color: light,
    fontWeight: 'bold',
  },
  trackItemArtist: {
    fontSize: 14,
    color: gray,
  },
  shareText: {
    color: light,
    fontSize: 16,
  },
  postCountContainer: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)', // Spotify green with opacity
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    minWidth: 150, // Add this to ensure consistent width
  },
  postCountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954', // Spotify green
  },
  postCountLabel: {
    fontSize: 14,
    color: light,
  },
  firstPostText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1DB954', // Spotify green
    textAlign: 'center',
  },
});

export default SearchSpotifyTrackScreen;