// SearchScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardEvent, 
  Text, 
  ScrollView, 
  Image, 
  FlatList, 
  ActivityIndicator,
  Animated,
  Easing,
  TouchableWithoutFeedback, 
  PanResponder, // Import PanResponder
  SafeAreaView,
} from 'react-native';import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core'; // Import IconProp type
import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { dark, gray, light, error, placeholder, lgray, dgray } from '../../components/colorModes';

import { CLIENT_ID, CLIENT_SECRET } from '../../config';
import { getImageSource } from '../../utils/image-utils'; 

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RouteProp, ParamListBase } from '@react-navigation/native'; 

// Importing item button log functions
import { logArtistInfo } from '../../utils/itemButtonLog'
import { logAlbumInfo } from '../../utils/itemButtonLog'
import { logTrackInfo } from '../../utils/itemButtonLog'
import { SearchScreenStackParamList } from '../../components/types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecentSearches } from '../../components/recentSearchItems';

import { Artist, Track } from '../../spotifyConfig/itemInterface';
import { searchSCTracks } from '../../soundcloudConfig/scTrackSearch';
import { scTrack } from '../../soundcloudConfig/itemInterface';
import useSpotifySearch from '../../spotifyConfig/spotifySearchAll';
import { MenuItem } from '@aws-amplify/ui-react';

//Apparently including this is the only way for it to work in the albumDetailsScreen
export interface Album {
  id: string;
  name: string;
  album_type: string;
  images: { url: string }[]; 
  release_date: string;
  artists: { name: string }[];
  total_tracks: string;
  external_urls: {spotify: string };
}

type SearchScreenProps = {
  navigation: NavigationProp<SearchScreenStackParamList>;
};

// Cast icons to IconProp
const spotifyIcon = faSpotify as IconProp;
const soundcloudIcon = faSoundcloud as IconProp;

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [searchMode, setSearchMode] = useState<'spotify' | 'soundcloud'>('spotify'); 
  const [offset, setOffset] = useState<number>(0);
  const [totalTracks, setTotalTracks] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]); 
  const [tracks, setTracks] = useState<Track[]>([]);
  const [soundcloudTracks, setSoundcloudTracks] = useState<scTrack[]>([]);


  const { recentSearches, saveRecentSearch, clearRecentSearch } = useRecentSearches();

  const { searchAll } = useSpotifySearch(searchInput, saveRecentSearch, setArtists, setAlbums, setTracks, setLoading);

  const sortedTracks = tracks.sort((a, b) => b.popularity - a.popularity);

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedSCTrack, setSelectedSCTrack] = useState<scTrack | null>(null);

  const bottomSheetHeight = useRef(new Animated.Value(0)).current;
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); 
  const scrollViewRef = useRef<ScrollView>(null);
 
// Get the Spotify Access Token, Also in the spotifySearchAll.tsx, 
// but might be useful staying here aswell as it wont need 
// the function searchAll to be called to access the accessToken

  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
  fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
    console.log('\n')
    console.log("Spotify Access Token: ", accessToken)
    console.log('\n')
  }, [])

  useEffect(() => {
    if (searchInput === '') {
      setArtists([]);
      setAlbums([]);
      setTracks([]);
      toggleBottomSheet(null);
      toggleSCBottomSheet(null);
    }
  }, [searchInput]);

  const handleClearSearch = () => {
    setSearchInput('');
    // setArtists([]);
    // setAlbums([]);
    // setTracks([]);
  };

  // This useEffect renders results as the user is typing, although not accurate when 'lil' as it chooses an artist

//   useEffect(() => {
//   if (searchInput !== '') {
//     handleSearch();
//   } else {
//     setArtists([]);
//     setAlbums([]);
//     setTracks([]);
//     setSoundcloudTracks([]);
//   }
// }, [searchInput]);

//This useEffect sets results = null when input = null
useEffect(() => {
  // if (searchInput === '') {
    setArtists([]);
    setAlbums([]);
    setTracks([]);
    setSoundcloudTracks([]);
    toggleBottomSheet(null);
    toggleSCBottomSheet(null);
  // }
}, [searchInput]);

const handleRecentSearchPress = (query: string) => {
  setSearchInput(query);
  // searchAll();
};

const handleSearchSCTracks = async () => {
  const searchResults = await searchSCTracks(searchInput, saveRecentSearch, offset);
  setSoundcloudTracks(searchResults);
};

// const loadMoreTracks = async () => {
//   if (soundcloudTracks.length < totalTracks) {
//       const newTracks = await searchSCTracks(searchInput, saveRecentSearch, offset + 4);
//       setSoundcloudTracks([...soundcloudTracks, ...newTracks]);
//       setOffset(offset + 4);
//   }
// };
// useEffect(() => {
//   const fetchData = async () => {
//       const newTracks = await searchSCTracks(searchInput, saveRecentSearch, offset);
//       setSoundcloudTracks(newTracks);
//       setTotalTracks(newTracks.length); // Assuming newTracks contains the total count
//   };

//   fetchData();
// }, []);

const handleSpotifySearchAll = async () => {
  await searchAll();
};

const handleNavigateToAlbumDetail = (album: Album) => {
  navigation.navigate('AlbumDetail', { album });
  console.log("Navigating to Album Details Screen with:", album.name,", ", album.id)
};

const navigateToPostScreen = (track: Track) => {
  navigation.navigate('PostSpotifyTrack', { track }); 
  console.log("Navigating to Post with:", track.name,", ", track.id)
  closeBottomSheet();
};

const navigateToSCPostScreen = (sctrack: scTrack) => {
  navigation.navigate('PostSCTrack', { sctrack }); 
  console.log("Navigating to SC Post with:", sctrack.title,", ", sctrack.id)
  closeSCBottomSheet();
};

const toggleSearchMode = () => {
  setSearchMode(prevMode => (prevMode === 'spotify' ? 'soundcloud' : 'spotify')); 
  setArtists([]);
  setAlbums([]);
  setTracks([]);
  setSoundcloudTracks([]);
  toggleBottomSheet(null);
  toggleSCBottomSheet(null);
};

const handleSearch = async () => {
  if (searchMode === 'spotify') {
    await handleSpotifySearchAll();
  } else {
    await handleSearchSCTracks();
  }
};

const BOTTOM_SHEET_HEIGHT = 150; // Desired height of the open bottom sheet

const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      const newHeight = Math.max(0, BOTTOM_SHEET_HEIGHT - gesture.dy);
      bottomSheetHeight.setValue(newHeight);
    },
    onPanResponderRelease: (event, gesture) => {
      // Velocity-based closing for a more natural feel
      const velocity = gesture.vy; 
      if (velocity > 0.5 || (gesture.dy > 50 && isBottomSheetOpen)) {
        closeBottomSheet();
      } else {
        openBottomSheet();
      }
    },
  })
).current;

const openBottomSheet = () => {
  Animated.spring(bottomSheetHeight, {
    toValue: BOTTOM_SHEET_HEIGHT,
    useNativeDriver: false, 
    bounciness: 8, 
  }).start(() => setIsBottomSheetOpen(true)); 
};

const closeBottomSheet = () => {
  Animated.timing(bottomSheetHeight, {
    toValue: 0,
    duration: 200,
    easing: Easing.inOut(Easing.ease), 
    useNativeDriver: false,
  }).start(() => {
    setIsBottomSheetOpen(false);
    setSelectedTrack(null); 
  });
};

const toggleBottomSheet = (track: Track | null ) => {
  setSelectedTrack(track);

  if (!isBottomSheetOpen) {
    openBottomSheet();
  } else {
    closeBottomSheet();
  }
};


// // Bottom sheet menu for spotofy tracks
// const toggleBottomSheet = (track: Track | null) => {
//   setSelectedTrack(track);

//   Animated.timing(bottomSheetHeight, {
//     toValue: track ? 150 : 0, 
//     duration: 200, 
//     easing: Easing.inOut(Easing.ease),
//     useNativeDriver: false, 
//   }).start(() => {
//     setIsBottomSheetOpen(track !== null); 
//   });
// };

// const closeBottomSheet = () => {
//   toggleBottomSheet(null); 
// };


// Bottom sheet menu for SC tracks
const toggleSCBottomSheet = (sctrack: scTrack | null) => {
  setSelectedSCTrack(sctrack);

  Animated.timing(bottomSheetHeight, {
    toValue: sctrack ? 150 : 0, 
    duration: 200, 
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: false, 
  }).start(() => {
    setIsBottomSheetOpen(sctrack !== null); 
  });
};

const closeSCBottomSheet = () => {
  toggleSCBottomSheet(null); 
};


  return (
    <SafeAreaView style={styles.safeAreaContainer}> 

    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={closeBottomSheet}>
        <View style={{ flex: 1 }}> 

        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput} 
            placeholder="Search..."
            value={searchInput}
            onChangeText={setSearchInput}
            autoCapitalize="none"   
            autoCorrect={false}  
            placeholderTextColor={placeholder}
            onKeyPress={(event) => {
              if (event.nativeEvent.key === 'Enter' || event.nativeEvent.key === 'Return') {
                handleSearch();
              }
            }}
            onSubmitEditing={handleSearch} // Adds return keystroke on mac to enter/search,
          />
          {searchInput !== '' && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setSearchInput('')}>
              <FontAwesomeIcon icon={faTimes} size={14} style={styles.clearButtonIcon} />
            </TouchableOpacity>
          )}
          </View>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleSearchMode}>
          {/* <FontAwesomeIcon
              icon={searchMode === 'spotify' ? spotifyIcon : soundcloudIcon}
              size={40}
              style={{ color: searchMode === 'spotify' ? '#14CF19' : '#28399A' }}
            />      */}
            <FontAwesomeIcon
              icon={searchMode === 'spotify' ? spotifyIcon : soundcloudIcon}
              size={40}
              style={{ color: searchMode === 'spotify' ? light : light }}
            />      
          </TouchableOpacity>
        </View>

          {searchInput === '' && recentSearches.length > 0 && (
            <ScrollView style={styles.recentSearchesContainer}>
              <Text style={styles.recentSearchesTitle}>Recently Searched</Text>
              {recentSearches.map((search, index) => (
              <View key={index} style={styles.recentSearchItemContainer}>
                <TouchableOpacity style={styles.recentSearchItemText} onPress={() => handleRecentSearchPress(search)}>
                  <Text style={styles.recentSearchItem}>{search}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recentSearchItemClearButton} onPress={() => clearRecentSearch(search)}>
                  <FontAwesomeIcon icon={faTimes} size={12} color={error} />
                </TouchableOpacity>
            </View>
              ))}
            </ScrollView>
          )}

          <FlatList
              data={soundcloudTracks}
              onScroll={closeSCBottomSheet}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: {item: scTrack}) => (
              <TouchableOpacity key={item.id} style={styles.itemContainer} onPress={() => toggleSCBottomSheet(item)} >
                <Image source={{ uri: item.artwork_url }} style={styles.albumImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                    <View style={styles.itemLowerDetails}>
                        <Text style={styles.itemType}>{item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">• {item.user_id}</Text>
                          </View>
                    </View>
                </View>
              </TouchableOpacity>
               )}
              keyExtractor={(item ) => item.id.toString()}
              // onEndReached={loadMoreTracks}
              // onEndReachedThreshold={0.1}
          />


      {/* <ScrollView>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <> */}
        <ScrollView 
          ref={scrollViewRef} onScrollBeginDrag={closeBottomSheet} showsVerticalScrollIndicator={false}
          >
          {artists.slice(0, 2).map(artist => (
            <TouchableOpacity key={artist.id} style={styles.itemContainer} onPress={() => logArtistInfo(artist)}>
              <Image
                source={{ uri: artist.images[0]?.url }}
                style={styles.albumImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{artist.name}</Text>
                <View style={styles.itemLowerDetails}>
                  <Text style={styles.itemType}>{artist.type.charAt(0).toUpperCase() + artist.type.slice(1)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {albums.slice(0, 5).map(album => (
            <TouchableOpacity key={album.id} style={styles.itemContainer} onPress={() => handleNavigateToAlbumDetail(album)}>
              <Image
                source={{ uri: album.images[0]?.url }}
                style={styles.albumImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{album.name}</Text>
                <View style={styles.itemLowerDetails}>
                  <Text style={styles.itemType}>{album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">• {album.artists.map(artist => artist.name).join(', ')}
                    </Text>
                  </View>
                  {/* <Text style={styles.albumYear}>{new Date(album.release_date).getFullYear()}</Text> */}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {tracks.slice(0, 10).map(track => (
            <TouchableOpacity key={track.id} style={styles.itemContainer} onPress={() => toggleBottomSheet(track)}>
              <Image
              source={{ uri: track.album.images[0]?.url }}
              style={styles.albumImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{track.name}</Text>
                <View style={styles.itemLowerDetails}>
                <Text style={styles.itemType}>{track.type === 'track' ? 'Song' : track.type.charAt(0).toUpperCase() + track.type.slice(1)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">• {track.artists.map(artist => artist.name).join(', ')}
                    </Text>
                  </View>
                </View>
              </View>
          </TouchableOpacity>
          ))}
      </ScrollView>

      </View>
    </TouchableWithoutFeedback>

    <Animated.View 
        style={[styles.bottomSheet, { height: bottomSheetHeight }]}
        {...panResponder.panHandlers} // Apply PanResponder to Animated.View
      > 
        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
          {
          selectedTrack && (
            <View style={styles.bottomSheetContent}>
              <TouchableOpacity onPress={closeBottomSheet} style={styles.pullBar} />
              <Text style={styles.bottomSheetTitle} numberOfLines={1} ellipsizeMode="tail">{selectedTrack.name}</Text>

              <TouchableOpacity 
                  style={styles.postButton}
                  onPress={() => selectedTrack && navigateToPostScreen(selectedTrack)}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
          )}
          {
          selectedSCTrack && (
            <View style={styles.bottomSheetContent}>
              <TouchableOpacity onPress={closeSCBottomSheet} style={styles.pullBar} />
              <Text style={styles.bottomSheetTitle} numberOfLines={1} ellipsizeMode="tail">{selectedSCTrack.title}</Text>

              <TouchableOpacity 
                  style={styles.postButton}
                  onPress={() => selectedSCTrack && navigateToSCPostScreen(selectedSCTrack)}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
          )}

        </TouchableOpacity>
      </Animated.View>

    </View>
    </SafeAreaView>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 0,
    backgroundColor: dark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lgray,
    borderRadius: 12,
    paddingHorizontal: 10,
    width: '80%',
    marginRight: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    marginRight: 10,
    color: light,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
  },
  clearButton: {
    padding: 10,
  },
  clearButtonIcon: {
    color: light,
  },
  albumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: dgray,
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
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: dark,
    borderRadius: 8,
    marginBottom: 10,
    // shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: light,
  },
  itemType: {
    fontSize: 12,
    color: '#888',
    marginRight: 5, 
  },
  itemDetails: {
    overflow: 'hidden',
    flex: 1, 
  },
  allImage: {
    width: 60, 
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  albumImage: {
    width: 60, 
    height: 60, 
    borderRadius: 8,
    marginRight: 10,
  },
  albumName: {
    fontSize: 16, 
    fontWeight: 'bold',
    marginBottom: 5,
  },
  albumYear: {
    fontSize: 12, 
    color: '#888',
  },
  itemLowerDetails: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  artist: {
    fontSize: 12,
    color: '#888',
  },
  recentSearchesContainer: {
    marginBottom: 20,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: lgray,
  },
  recentSearchItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentSearchItemText: {
    flex: 1,
  },
  recentSearchItem: {
    fontSize: 14,
    color: dgray,
    paddingVertical: 6,
  },
  recentSearchItemClearButton: {
    paddingLeft: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    backgroundColor: 'gray',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2, 
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 

  },
  bottomSheetContent: {
    padding: 10,
    flex: 1, 
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  pullBar: {
    width: 40,
    height: 6,
    backgroundColor: 'lightgray', 
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#1DB954', // Example Spotify green color
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark, // or your background color
  },
});

export default SearchScreen;