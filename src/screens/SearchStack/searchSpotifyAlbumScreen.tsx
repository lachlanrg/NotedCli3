// searchSpotifyAlbumScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, Linking, SafeAreaView, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SearchScreenStackParamList } from '../../components/types';
import { light, dark, gray, lgray } from '../../components/colorModes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faShare } from '@fortawesome/free-solid-svg-icons';
import { Album } from '../../spotifyConfig/itemInterface';
import useSpotifyItemById from '../../spotifyConfig/getSpotifyItemById';
import { getSpotifyItemPostCount } from '../../utils/musicPostCounts';

type SearchSpotifyAlbumScreenRouteProp = RouteProp<SearchScreenStackParamList, 'SearchSpotifyAlbum'>;

type Props = {
  route: SearchSpotifyAlbumScreenRouteProp;
};

const SearchSpotifyAlbumScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { albumId } = route.params;
  const [spotifyData, setSpotifyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postCount, setPostCount] = useState<number>(0);
  const { getSpotifyAlbumById } = useSpotifyItemById();

  useEffect(() => {
    const fetchData = async () => {
      if (albumId) {
        setIsLoading(true);
        try {
          let data = await getSpotifyAlbumById(albumId);
          setSpotifyData(data);
          
          // Fetch post count
          const count = await getSpotifyItemPostCount(albumId, true);
          setPostCount(count);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [albumId, getSpotifyAlbumById]);

  const handlePostPress = () => {
    if (spotifyData) {
      const album: Album = {
        id: spotifyData.id,
        name: spotifyData.name,
        artists: spotifyData.artists,
        images: spotifyData.images,
        release_date: spotifyData.release_date,
        total_tracks: spotifyData.total_tracks,
        external_urls: spotifyData.external_urls.spotify,
        album_type: spotifyData.album_type,
      };
      navigation.navigate('PostSpotifyAlbum', { album });
    }
  };

  const renderAlbumInfo = () => {
    if (!spotifyData) return null;

    const albumImageUrl = spotifyData.images && spotifyData.images[0] ? spotifyData.images[0].url : null;

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
        <Text style={styles.trackName}>{spotifyData.name || 'Unknown Album'}</Text>
        {spotifyData.artists && spotifyData.artists.length > 0 && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('SearchSpotifyArtist', { artistId: spotifyData.artists[0].id })}
          >
            <Text style={styles.artistName}>
              {spotifyData.artists.map((artist: any) => artist.name).join(', ')}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.text}>Release Date: {spotifyData.release_date || 'Unknown'}</Text>
        <Text style={styles.text}>Total Tracks: {spotifyData.total_tracks || 'Unknown'}</Text>
        {/* <Text style={styles.text}>Album Type: {spotifyData.album_type || 'Unknown'}</Text> */}
        <Text style={styles.text}>Popularity: {spotifyData.popularity || 'Unknown'}</Text>
        <Text style={styles.text}>Label: {spotifyData.label || 'Unknown'}</Text>
        {spotifyData.genres && spotifyData.genres.length > 0 && (
          <Text style={styles.text}>Genres: {spotifyData.genres.join(', ')}</Text>
        )}
        {spotifyData.external_urls && spotifyData.external_urls.spotify && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => Linking.openURL(spotifyData.external_urls.spotify)}
          >
            <Text style={styles.buttonText}>Open in Spotify</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.sectionTitle}>Tracks</Text>
        <FlatList
          data={spotifyData.tracks?.items}
          keyExtractor={(item) => item.id}
          style={styles.trackList}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={styles.trackItem}
              onPress={() => navigation.navigate('SearchSpotifyTrack', { trackId: item.id })}
            >
              <Text style={styles.trackItemNumber}>{index + 1}</Text>
              <View style={styles.trackItemContent}>
                <Text style={styles.trackItemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={styles.trackItemArtist} numberOfLines={1} ellipsizeMode="tail">{item.artists.map((artist: any) => artist.name).join(', ')}</Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
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
          <Text style={styles.headerTitle}>Spotify Album Details</Text>
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
          renderAlbumInfo()
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
  shareText: {
    color: light,
    fontSize: 16,
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
    backgroundColor: dark, // or your background color
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  trackList: {
    marginBottom: 40,
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
    backgroundColor: '#1DB954', // Spotify green
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
    fontSize: 22,
    fontWeight: 'bold',
    color: light,
    marginTop: 30,
    marginBottom: 15,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  trackItemNumber: {
    width: 30,
    fontSize: 16,
    color: light,
    textAlign: 'center',
  },
  trackItemContent: {
    flex: 1,
    marginLeft: 10,
  },
  trackItemName: {
    fontSize: 16,
    color: light,
    fontWeight: '500',
    marginBottom: 4,
  },
  trackItemArtist: {
    fontSize: 14,
    color: lgray,
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

export default SearchSpotifyAlbumScreen;
