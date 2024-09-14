import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Linking, ActivityIndicator, FlatList } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { ExploreStackParamList } from '../../components/types';
import { light, dark, gray } from '../../components/colorModes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import useSpotifyItemById from '../../spotifyConfig/getSpotifyItemById';
import { Track } from '../../spotifyConfig/itemInterface';

type ExplorePostScreenRouteProp = RouteProp<ExploreStackParamList, 'ExplorePost'>;

interface ExplorePostScreenProps {
  route: ExplorePostScreenRouteProp;
}

const ExplorePostScreen: React.FC<ExplorePostScreenProps> = ({ route }) => {
  const { id, type } = route.params;
  const navigation = useNavigation<any>();
  const [spotifyData, setSpotifyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getSpotifyTrackById, getSpotifyAlbumById } = useSpotifyItemById();

  useEffect(() => {
    const fetchData = async () => {
      if (type && id) {
        setIsLoading(true);
        try {
          let data = null;
          switch (type) {
            case 'spotifyTrack':
              data = await getSpotifyTrackById(id);
            //   console.log("Simplified Spotify Track: ", JSON.stringify(data, null, 2));
              break;
            case 'spotifyAlbum':
              data = await getSpotifyAlbumById(id);
              console.log("Spotify Album: ", JSON.stringify(data, null, 2));
              break;
            case 'scTrack':
              // data = await mockScTrackFunction(id);
              break;
          }
          setSpotifyData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id, type, getSpotifyTrackById, getSpotifyAlbumById]);

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
        <Text style={styles.trackName}>{spotifyData.name || 'Unknown Track'}</Text>
        <Text style={styles.artistName}>
          {spotifyData.artists ? spotifyData.artists.map((artist: any) => artist.name).join(', ') : 'Unknown Artist'}
        </Text>
        <Text style={styles.albumName}>{album.name || 'Unknown Album'}</Text>
        <Text style={styles.text}>Release Date: {album.release_date || 'Unknown'}</Text>
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
        <Text style={styles.trackName}>{spotifyData.name || 'Unknown Album'}</Text>
        <Text style={styles.artistName}>
          {spotifyData.artists ? spotifyData.artists.map((artist: any) => artist.name).join(', ') : 'Unknown Artist'}
        </Text>
        <Text style={styles.text}>Release Date: {spotifyData.release_date || 'Unknown'}</Text>
        <Text style={styles.text}>Total Tracks: {spotifyData.total_tracks || 'Unknown'}</Text>
        <Text style={styles.text}>Album Type: {spotifyData.album_type || 'Unknown'}</Text>
        <Text style={styles.text}>Popularity: {spotifyData.popularity || 'Unknown'}</Text>
        <Text style={styles.text}>Label: {spotifyData.label || 'Unknown'}</Text>
        {spotifyData.genres && spotifyData.genres.length > 0 && (
          <Text style={styles.text}>Genres: {spotifyData.genres.join(', ')}</Text>
        )}
        <Text style={styles.sectionTitle}>Tracks:</Text>
        <FlatList
          data={spotifyData.tracks?.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.trackItem}>
              <Text style={styles.trackItemName}>{item.name}</Text>
              <Text style={styles.trackItemArtist}>{item.artists.map((artist: any) => artist.name).join(', ')}</Text>
            </View>
          )}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
            {/* <Text style={styles.exploreBack}>Explore</Text> */}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{type === 'spotifyTrack' ? 'Track Details' : 'Album Details'}</Text>
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
});

export default ExplorePostScreen;