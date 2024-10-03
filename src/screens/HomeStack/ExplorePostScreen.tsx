// ExplorePostScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Linking, ActivityIndicator, FlatList } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../../components/types';
import { light, dark, gray, lgray, soundcloudOrange, spotifyGreen } from '../../components/colorModes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import useSpotifyItemById from '../../spotifyConfig/getSpotifyItemById';
import { Track } from '../../spotifyConfig/itemInterface';
import useSCTrackById from '../../soundcloudConfig/getSCTrackById';
import { scTrack } from '../../soundcloudConfig/itemInterface';
import { getSCTrackPostCount, getSpotifyItemPostCount } from '../../utils/musicPostCounts';
import { formatDate } from '../../utils/dateFormatter';

type ExplorePostScreenRouteProp = RouteProp<HomeStackParamList, 'ExplorePost'>;

interface ExplorePostScreenProps {
  route: ExplorePostScreenRouteProp;
}

const ExplorePostScreen: React.FC<ExplorePostScreenProps> = ({ route }) => {
  const { id, type } = route.params;
  const navigation = useNavigation<any>();
  const [spotifyData, setSpotifyData] = useState<any>(null);
  const [scData, setSCData] = useState<scTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postCount, setPostCount] = useState<number>(0);
  const { getSpotifyTrackById, getSpotifyAlbumById } = useSpotifyItemById();
  const { getSCTrackById } = useSCTrackById();

  useEffect(() => {
    const fetchData = async () => {
      if (type && id) {
        setIsLoading(true);
        try {
          let data = null;
          let count = 0;
          switch (type) {
            case 'spotifyTrack':
              data = await getSpotifyTrackById(id);
              count = await getSpotifyItemPostCount(id, false);
              setSpotifyData(data);
              break;
            case 'spotifyAlbum':
              data = await getSpotifyAlbumById(id);
              count = await getSpotifyItemPostCount(id, true);
              setSpotifyData(data);
              break;
            case 'scTrack':
              data = await getSCTrackById(id);
              count = await getSCTrackPostCount(id);
              setSCData(data);
              break;
          }
          setPostCount(count);
          // console.log('Fetched data:', data); // Debug log
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id, type, getSpotifyTrackById, getSpotifyAlbumById, getSCTrackById]);

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
        <Text style={styles.artistName}>
          {spotifyData.artists ? spotifyData.artists.map((artist: any) => artist.name).join(', ') : 'Unknown Artist'}
        </Text>
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
        <Text style={styles.artistName}>
          {spotifyData.artists ? spotifyData.artists.map((artist: any) => artist.name).join(', ') : 'Unknown Artist'}
        </Text>
        <Text style={styles.text}>Release Date: {spotifyData.release_date ? formatDate(spotifyData.release_date) : 'Unknown'}</Text>
        <Text style={styles.text}>Total Tracks: {spotifyData.total_tracks || 'Unknown'}</Text>
        <Text style={styles.text}>Album Type: {spotifyData.album_type || 'Unknown'}</Text>
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
            <View style={styles.trackItem}>
              <Text style={styles.trackItemNumber}>{index + 1}</Text>
              <View style={styles.trackItemContent}>
                <Text style={styles.trackItemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={styles.trackItemArtist} numberOfLines={1} ellipsizeMode="tail">{item.artists.map((artist: any) => artist.name).join(', ')}</Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      </ScrollView>
    );
  };

  const renderSCTrackInfo = () => {
    // console.log('Rendering SC Track Info, scData:', scData); // Debug log
    if (!scData) return null;

    const trackImageUrl = scData.artwork_url ? scData.artwork_url.replace('-large', '-t500x500') : null;

    return (
      <ScrollView style={styles.content}>
        {trackImageUrl && (
          <Image 
            source={{ uri: trackImageUrl }} 
            style={styles.trackCover}
          />
        )}
        <View style={styles.postCountContainerSC}>
          {postCount > 0 ? (
            <>
              <Text style={styles.postCountTextSC}>{postCount}</Text>
              <Text style={styles.postCountLabelSC}>Posts</Text>
            </>
          ) : (
            <Text style={styles.firstPostTextSC}>Be the first to Post this!</Text>
          )}
        </View>
        <Text style={styles.trackName}>{scData.title || 'Unknown Track'}</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('SearchSCUser', { userId: scData.user_id })}
        >
          <Text style={styles.artistName}>{scData.user?.username || 'Unknown Artist'}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Genre: {scData.genre || 'Unknown'}</Text>
        <Text style={styles.text}>Release Date: {new Date(scData.created_at).toLocaleDateString()}</Text>
        <Text style={styles.text}>Likes: {scData.likes_count}</Text>
        <Text style={styles.text}>Plays: {scData.playback_count}</Text>
        {scData.permalink_url && (
          <TouchableOpacity 
            style={styles.buttonSC}
            onPress={() => Linking.openURL(scData.permalink_url)}
          >
            <Text style={styles.buttonTextSC}>Open in SoundCloud</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {type === 'spotifyTrack' ? 'Track Details' : 
             type === 'spotifyAlbum' ? 'Album Details' : 
             type === 'scTrack' ? 'SoundCloud Track Details' : ''}
          </Text>
        </View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={light} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : type === 'spotifyTrack' ? (
          renderTrackInfo()
        ) : type === 'spotifyAlbum' ? (
          renderAlbumInfo()
        ) : type === 'scTrack' ? (
          renderSCTrackInfo()
        ) : (
          <View style={styles.content}>
            <Text style={styles.text}>ID: {id}</Text>
            <Text style={styles.text}>Type: {type}</Text>
          </View>
        )}
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
    paddingHorizontal: 10,
    backgroundColor: dark,
    borderBottomWidth: 2,
    borderBottomColor: gray,
    paddingBottom: 10,
    },
    backButton: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: light,
        textAlign: 'center',
        marginRight: 34, // To center the title with the back button
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
    trackList: {
      marginBottom: 40,
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
    trackCover: {
      width: 200,
      height: 200,
      alignSelf: 'center',
      marginBottom: 20,
    },
    postCountContainer: {
      backgroundColor: 'rgba(29, 185, 84, 0.1)', // Spotify green with opacity
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 20,
      minWidth: 150,
    },
    postCountText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: spotifyGreen, // Spotify green
    },
    postCountLabel: {
      fontSize: 14,
      color: light,
    },
    firstPostText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: spotifyGreen, // Spotify green
      textAlign: 'center',
    },
    postCountContainerSC: {
      backgroundColor: 'rgba(255, 85, 0, 0.1)', // SoundCloud orange with opacity
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 20,
      minWidth: 150,
    },
    postCountTextSC: {
      fontSize: 24,
      fontWeight: 'bold',
      color: soundcloudOrange, // SoundCloud orange
    },
    postCountLabelSC: {
      fontSize: 14,
      color: light,
    },
    firstPostTextSC: {
      fontSize: 16,
      fontWeight: 'bold',
      color: soundcloudOrange, // SoundCloud orange
      textAlign: 'center',
    },
    buttonSC: {
      backgroundColor: soundcloudOrange, // SoundCloud orange
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonTextSC: {
      color: light,
      fontWeight: 'bold',
    },
});

export default ExplorePostScreen;