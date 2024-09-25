import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, SafeAreaView, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SearchScreenStackParamList } from '../../components/types';
import { light, dark, gray, lgray } from '../../components/colorModes';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faShare } from '@fortawesome/free-solid-svg-icons';
import { scTrack } from '../../soundcloudConfig/itemInterface';
import useSCTrackById from '../../soundcloudConfig/getSCTrackById';
import { getSCTrackPostCount } from '../../utils/musicPostCounts';

type SearchSCTrackScreenRouteProp = RouteProp<SearchScreenStackParamList, 'SearchSCTrack'>;

type Props = {
  route: SearchSCTrackScreenRouteProp;
};

const SearchSCTrackScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { trackId } = route.params;
  const [scData, setSCData] = useState<scTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postCount, setPostCount] = useState<number>(0);
  const { getSCTrackById } = useSCTrackById();

  useEffect(() => {
    const fetchData = async () => {
      if (trackId) {
        setIsLoading(true);
        try {
          let data = await getSCTrackById(trackId);
          setSCData(data);
          
          // Fetch post count
          const count = await getSCTrackPostCount(trackId);
          setPostCount(count);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [trackId, getSCTrackById]);

  const handlePostPress = () => {
    if (scData) {
      navigation.navigate('PostSCTrack', { sctrack: scData });
    }
  };

  const renderTrackInfo = () => {
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
        <Text style={styles.trackName}>{scData.title || 'Unknown Track'}</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('SearchSCUser', { userId: scData.user_id })}
        >
          <Text style={styles.artistName}>{scData.user?.username || 'Unknown Artist'}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Genre: {scData.genre || 'Unknown'}</Text>
        <Text style={styles.text}>Release Date: {new Date(scData.release_date).toLocaleDateString()}</Text>
        <Text style={styles.text}>Likes: {scData.likes_count}</Text>
        <Text style={styles.text}>Plays: {scData.playback_count}</Text>
        {scData.permalink_url && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => Linking.openURL(scData.permalink_url)}
          >
            <Text style={styles.buttonText}>Open in SoundCloud</Text>
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
          <Text style={styles.headerTitle}>SoundCloud Track Details</Text>
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
    backgroundColor: dark,
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
  shareText: {
    color: light,
    fontSize: 16,
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
  trackCover: {
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
  button: {
    backgroundColor: '#ff5500', // SoundCloud orange
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
  postCountContainer: {
    backgroundColor: 'rgba(255, 85, 0, 0.1)', // SoundCloud orange with opacity
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
    color: '#ff5500', // SoundCloud orange
  },
  postCountLabel: {
    fontSize: 14,
    color: light,
  },
  firstPostText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5500', // SoundCloud orange
    textAlign: 'center',
  },
});

export default SearchSCTrackScreen;