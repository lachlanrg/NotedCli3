import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import awsconfig from '../../aws-exports';
import { fetchTopSpotifyTracks, RankedTrack } from '../../components/exploreAPIs/spotifyTopTracks';
import { fetchTopTrendingItems, RankedTopTrending } from '../../components/exploreAPIs/topTrendingItems';
import { fetchTopSoundCloudTracks, RankedSoundCloudTrack } from '../../components/exploreAPIs/scTopTracks';
import { Track } from '../../spotifyConfig/itemInterface';



Amplify.configure(awsconfig);

const { width: screenWidth } = Dimensions.get('window'); // Get screen width

const ExploreScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<'Trending' | 'Spotify' | 'SoundCloud'>('Trending');
    const underlineX = useRef(new Animated.Value(0)).current; // Ref for underline position
    
    const [topSpotifyTracks, setTopSpotifyTracks] = useState<RankedTrack[]>([]);
    const [topTrendingItems, setTopTrendingItems] = useState<RankedTopTrending[]>([]);
    const [topSoundCloudTracks, setTopSoundCloudTracks] = useState<RankedSoundCloudTrack[]>([]);

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        // This useEffect runs only once on the initial render 
        // to fetch initial data if needed. 
        const fetchInitialData = async () => {
          // ... (fetch initial data for all tabs if needed)
        };
        fetchInitialData();
      }, []); 

      useFocusEffect(
        React.useCallback(() => {
          // This callback will be called every time the screen comes into focus.
          const fetchData = async () => {
            if (activeTab === 'Spotify') {
              const spotifyTracks = await fetchTopSpotifyTracks();
              setTopSpotifyTracks(spotifyTracks);
            } else if (activeTab === 'Trending') {
              const trendingItems = await fetchTopTrendingItems();
              setTopTrendingItems(trendingItems);
            } else if (activeTab === 'SoundCloud') {
                const soundcloudItems = await fetchTopSoundCloudTracks();
                setTopSoundCloudTracks(soundcloudItems);
            } 
          };
          fetchData(); // Fetch data when the screen focuses
          return () => {
            // This optional cleanup function runs when the screen goes out of focus.
            // You can use it to cancel any ongoing API requests 
            // or reset data if needed.
          };
        }, [activeTab]) // The callback runs only when 'activeTab' changes
      );

      const handleTabPress = (tab: 'Trending' | 'Spotify' | 'SoundCloud') => {
        if (tab === activeTab) {
          // Scroll to the top if the pressed tab is the currently active tab
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        } else {
          setActiveTab(tab);
    
          let toValue = 0;
          if (tab === 'Trending') {
            toValue = screenWidth * 0.07;
          } else if (tab === 'Spotify') {
            toValue = screenWidth * 0.40;
          } else if (tab === 'SoundCloud') {
            toValue = screenWidth * 0.73;
          }
    
          Animated.timing(underlineX, {
            toValue: toValue,
            duration: 250,
            useNativeDriver: false,
          }).start();
        }
      };

    // Get top tracks from spotifyTopTracks.tsc
    useEffect(() => {
        const fetchTracks = async () => {
          const tracks = await fetchTopSpotifyTracks();
          setTopSpotifyTracks(tracks);
        };
    
        fetchTracks();
      }, []);

    // Get top tracks from soundcloud
    useEffect(() => {
        const fetchSoundCloudTracks = async () => {
            const tracks = await fetchTopSoundCloudTracks();
            setTopSoundCloudTracks(tracks);
          };
          fetchSoundCloudTracks();
        }, []);

    // get top trending items
      useEffect(() => {
        const fetchTTItems = async () => {
          const items = await fetchTopTrendingItems();
          setTopTrendingItems(items);
        };
    
        fetchTTItems();
      }, []);

  return (
    <View style={styles.container}>
        <View style={styles.tabContainer}>

            <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('Trending')}>
                <View style={styles.tabTextWrapper}> 
                <Text style={[styles.tabText, activeTab === 'Trending' && styles.activeTabText]}>Trending</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('Spotify')}>
                <View style={styles.tabTextWrapper}>
                <Text style={[styles.tabText, activeTab === 'Spotify' && styles.activeTabText]}>Spotify</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('SoundCloud')}>
                <View style={styles.tabTextWrapper}>
                <Text style={[styles.tabText, activeTab === 'SoundCloud' && styles.activeTabText]}>SoundCloud</Text>
                </View>
            </TouchableOpacity>
            </View>

        {/* Animated Underline */}
        <View style={styles.underlineContainer}>
            <Animated.View
                style={[
                styles.underline,
                {
                    transform: [{ translateX: underlineX }],
                },
                ]}
            />
         </View>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.contentContainer} > 
        {activeTab === 'Spotify' && (
          <>
            <Text style={styles.sectionTitle}>Top Spotify Tracks:</Text>
            {topSpotifyTracks.map((track, index) => (
              <TouchableOpacity key={track.trackId}> 
                <View style={[styles.trackRow, index === 0 && styles.topTrackRow]}>
                {index === 0 && track.spotifyTrackImageUrl && (
                  <Image source={{ uri: track.spotifyTrackImageUrl }} style={styles.topTrackImage} />
                )}
                <View style={styles.trackInfoContainer}>
                  {index !== 0 && <Text style={styles.trackRank}>{index + 1}</Text>} 
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trackName} numberOfLines={1} ellipsizeMode="tail">
                      {track.spotifyTrackName}
                    </Text>
                    <Text style={styles.trackArtists} numberOfLines={1} ellipsizeMode="tail">
                      {track.spotifyTrackArtists}
                    </Text>
                  </View>
                  <Text style={styles.trackCount}>({track.count} posts)</Text>
                </View>
              </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {activeTab === 'SoundCloud' && (
            <>
                <Text style={styles.sectionTitle}>Top SoundCloud Tracks:</Text>
                {topSoundCloudTracks.map((track, index) => (
                <View
                    style={[
                    styles.trackRow,
                    index === 0 && styles.topTrackRow
                    ]}
                    key={track.trackId}
                >
                    {index === 0 && ( 
                        <Image source={ track.scTrackArtworkUrl 
                                        ? { uri: track.scTrackArtworkUrl } 
                                        : require('../../assets/placeholder.png')
                        }
                        style={styles.topTrackImage}
                        />
                    )}
                    <View style={styles.trackInfoContainer}>
                    {index !== 0 && <Text style={styles.trackRank}>{index + 1}</Text>}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.trackName} numberOfLines={1} ellipsizeMode="tail">
                            {track.scTrackTitle}
                        </Text>
                        <Text style={styles.trackArtists} numberOfLines={1} ellipsizeMode="tail">
                            {track.scTrackUsername}
                        </Text>
                    </View>
                    <Text style={styles.trackCount}>({track.count} posts)</Text>
                    </View>
                </View>
                ))}
            </>
        )}

        {activeTab === 'Trending' && (
            <>
                <Text style={styles.sectionTitle}>Top Trending</Text>
                {topTrendingItems.map((item, index) => (
                <View style={[ styles.trackRow, index === 0 && styles.topTrackRow ]} key={item.trackId} >
                    {index === 0 && (
                        <Image
                        source={
                          item.spotifyTrackImageUrl || 
                          item.spotifyAlbumImageUrl || 
                          item.scTrackArtworkUrl 
                            ? { 
                              uri: item.spotifyTrackImageUrl || item.spotifyAlbumImageUrl || item.scTrackArtworkUrl,
                            } 
                            : require('../../assets/placeholder.png')
                        }
                        style={styles.topTrackImage}
                      />
                    )}
                    <View style={styles.trackInfoContainer}>
                    {index !== 0 && <Text style={styles.trackRank}>{index + 1}</Text>}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.trackName} numberOfLines={1} ellipsizeMode="tail">
                        {item.spotifyTrackName ||
                            item.spotifyAlbumName ||
                            item.scTrackTitle ||
                            "Unknown Item"}
                        </Text>
                    </View>
                    <Text style={styles.trackCount}>({item.count} posts)</Text>
                    </View>
                </View>
                ))}
            </>
        )}

      </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 10,
    paddingTop: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",

},
  tabTextWrapper: { 
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#ccc',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  underlineContainer: {
    height: 2,
    backgroundColor: 'transparent',
    marginBottom: 5, 
  },
  underline: {
    height: '100%',
    width: 75, 
    backgroundColor: 'white', 
    borderRadius: 2,
    // Example: Add a slight translateX adjustment 
    // transform: [{ translateX: -50 }], 
  },
  contentContainer: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 10,
  }, 
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Adjust color as needed
  },
  trackRank: {
    color: '#ccc', 
    fontSize: 14,
    width: 20, 
    textAlign: 'right', 
    marginRight: 10, 
  },
  trackName: {
    color: '#fff',
    fontSize: 16,
  },
  trackArtists: {
    color: '#fff',
    fontSize: 12,
  },
  trackCount: {
    color: '#888', 
    fontSize: 12,
  },
  topTrackRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 15, 
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#282828', 
  },
  topTrackImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 5, 
  },
  trackInfoContainer: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
  },
});

export default ExploreScreen;