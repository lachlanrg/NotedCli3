import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SearchScreenStackParamList } from '../components/types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; 
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'; // Import specific icon 
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CLIENT_ID, CLIENT_SECRET } from '../config';
import { Track } from '../spotifyConfig/itemInterface';

type AlbumDetailsScreenProps = NativeStackScreenProps<SearchScreenStackParamList, 'AlbumDetail'>;

const AlbumDetailsScreen: React.FC<AlbumDetailsScreenProps> = ({ route, navigation }) => {
  const { album } = route.params;
  const [tracks, setTracks] = useState<Track[]>([]);
  const [accessToken, setAccessToken] = useState('');

  const logTrack = (track: Track) => {
    console.log(" ")
    console.log("=================  T R A C K - I N F O ================")
    console.log("Name:", track.name);
    console.log("ID:", track.id);
    console.log("Type:", track.type);
    console.log("Artists:", track.artists.map(artist => artist.name).join(', '));
    console.log("Popularity:", track.popularity);
    console.log("=======================================================")
    console.log(" ")

    // Add any other track details you want to log
  };

  useEffect(() => {
    // Fetch access token
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    };
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token));
  }, []);

  useEffect(() => {
    if (accessToken) {
      // Fetch album tracks
      fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(data => setTracks(data.items));
    }
  }, [accessToken]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Image source={{ uri: album.images[0]?.url }} style={styles.albumImage} />
      <Text style={styles.artistNames}>{album.artists.map(artist => artist.name).join(', ')}</Text>
      <Text style={styles.releaseDate}>{new Date(album.release_date).getFullYear()}</Text>
    </View>
  );

  const renderItem = ({ item }: {item: Track}) => (
    <TouchableOpacity key={item.id} style={styles.itemContainer} onPress={() => logTrack(item)}>
      <Text style={styles.trackName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faChevronLeft} size={18} color="black" />
        </TouchableOpacity>
        <View style={styles.albumNameContainer}>
          <Text style={styles.albumName} numberOfLines={1} ellipsizeMode="tail">{album.name}</Text>
        </View>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollViewContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    // not sure if needed
  },
  albumNameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  albumName: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  scrollViewContainer: {
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
  },
  albumImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  artistNames: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  releaseDate: {
    fontSize: 16,
    marginBottom: 20,
  },
  trackName: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
});

export default AlbumDetailsScreen;