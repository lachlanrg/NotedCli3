// searchScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Image, 
  FlatList, 
  Animated,
  TouchableWithoutFeedback, 
  SafeAreaView,
} from 'react-native';import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core'; // Import IconProp type
import { faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons';
import { dark, gray, light, error, placeholder, lgray, dgray } from '../../components/colorModes';

import { CLIENT_ID, CLIENT_SECRET } from '../../config';
import { NavigationProp } from '@react-navigation/native';

// Importing item button log functions
import { SearchScreenStackParamList } from '../../components/types';

import { useRecentSearches } from '../../components/recentSearchItems';

import { searchSCTracks } from '../../soundcloudConfig/scTrackSearch';
import { scTrack } from '../../soundcloudConfig/itemInterface';
import useSpotifySearch from '../../spotifyConfig/spotifySearchAll';
import { MenuItem } from '@aws-amplify/ui-react';
import SearchPostBottomSheetModal from '../../components/BottomSheets/SearchPostBottomSheetModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { heavyImpact, mediumImpact, selectionChange } from '../../utils/hapticFeedback';
import { Artist, Track } from '../../spotifyConfig/itemInterface';

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


  const { recentSearches, saveRecentSearch, clearRecentSearch, clearAllRecentSearches } = useRecentSearches();

  const { searchAll } = useSpotifySearch(searchInput, saveRecentSearch, setArtists, setAlbums, setTracks, setLoading);

  const sortedTracks = tracks.sort((a, b) => b.popularity - a.popularity);

  const [selectedItem, setSelectedItem] = useState<Track | scTrack | Album | null>(null);

  const bottomSheetHeight = useRef(new Animated.Value(0)).current;
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); 
  const scrollViewRef = useRef<ScrollView>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

 
// Get the Spotify Access Token, Also in the spotifySearchAll.tsx, 
// but might be useful staying here aswell as it wont need 
// the function searchAll to be called to access the accessToken

  useEffect(() => {
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
      setSoundcloudTracks([]);
      setSelectedItem(null);
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
    setSelectedItem(null);
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

const toggleSearchMode = () => {
  mediumImpact();
  setSearchMode(prevMode => (prevMode === 'spotify' ? 'soundcloud' : 'spotify')); 
  setArtists([]);
  setAlbums([]);
  setTracks([]);
  setSoundcloudTracks([]);
  setSelectedItem(null);
};

const handleSearch = async () => {
  if (searchMode === 'spotify') {
    await handleSpotifySearchAll();
  } else {
    await handleSearchSCTracks();
  }
};

const closeBottomSheet = useCallback(() => {
  bottomSheetModalRef.current?.close();
  setSelectedItem(null);
}, []);

const handlePresentModalPress = useCallback((item: Track | scTrack | Album) => {
  if (item) {
    bottomSheetModalRef.current?.present();
    setSelectedItem(item);
  }
}, []);

const handleNavigateToArtistDetail = (artistId: string) => {
  navigation.navigate('SearchSpotifyArtist', { artistId });
  console.log("Navigating to Artist Details Screen with ID:", artistId);
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
            onSubmitEditing={handleSearch}
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
              <View style={styles.recentSearchHeader}>
                <Text style={styles.recentSearchesTitle}>Recently Searched</Text>
                <TouchableOpacity onPress={clearAllRecentSearches}>
                  <Text style={styles.clearAllButton}>Clear All</Text>
                </TouchableOpacity>
              </View>
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
              onScroll={closeBottomSheet}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: {item: scTrack}) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemContainer} 
                onPress={() => handlePresentModalPress(item)}
              >
                <Image source={{ uri: item.artwork_url }} style={styles.albumImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                    <View style={styles.itemLowerDetails}>
                        <Text style={styles.itemType}>{item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">• {item.publisher_metadata.artist || 'Unknown Artist'}</Text>
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
          {artists.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Artists</Text>
              {artists.slice(0, 2).map(artist => (
                <TouchableOpacity key={artist.id} style={styles.itemContainer} onPress={() => handleNavigateToArtistDetail(artist.id)}>
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
            </View>
          )}

          {albums.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Albums</Text>
              {albums.slice(0, 5).map(album => (
                <TouchableOpacity 
                  key={album.id} 
                  style={styles.itemContainer} 
                  onPress={() => handlePresentModalPress(album)}
                >
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
            </View>
          )}

          {tracks.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Tracks</Text>
              {tracks.slice(0, 10).map(track => (
                <TouchableOpacity 
                  key={track.id} 
                  style={styles.itemContainer} 
                  onPress={() => handlePresentModalPress(track)}
                >
                  <Image
                    source={{ uri: track.album.images[0]?.url }}
                    style={styles.albumImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{track.name}</Text>
                    <View style={styles.itemLowerDetails}>
                      <Text style={styles.itemType}>
                        {track.type.charAt(0).toUpperCase() + track.type.slice(1)}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
                          • {track.artists.map(artist => artist.name).join(', ')}
                        </Text>
                      </View>
                    </View>
                    {track.explicit && (
                      <View style={styles.explicitLabelContainer}>
                        <Text style={styles.explicitLabel}>Explicit</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
      </ScrollView>

      </View>
    </TouchableWithoutFeedback>

    <SearchPostBottomSheetModal
      ref={bottomSheetModalRef}
      item={selectedItem}
      onClose={closeBottomSheet}
    />

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
    borderRadius: 18,
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
    // marginBottom: 5,
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
    // borderRadius: 8, // Abaid by Spotify policies
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
  recentSearchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: lgray,
  },
  clearAllButton: {
    color: error,
    fontWeight: 'bold',
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
  spotifyText: {
    color: light,
    fontSize: 16,
  },
  spotifySection: {
    padding: 10,
    backgroundColor: dark,
    borderRadius: 5,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: lgray,
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 5,
    fontStyle: "italic",

  },
  explicitLabelContainer: {
    backgroundColor: '#444',
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  explicitLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default SearchScreen;