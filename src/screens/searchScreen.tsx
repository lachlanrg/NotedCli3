// SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardEvent, Text, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import { CLIENT_ID, CLIENT_SECRET } from '../config';
import { getImageSource } from '../utils/image-utils'; 

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RouteProp, ParamListBase } from '@react-navigation/native'; 
import { RootStackParamList } from "../components/types"

// Importing item button log functions
import { logArtistInfo } from '../utils/itemButtonLog'
import { logAlbumInfo } from '../utils/itemButtonLog'
import { logTrackInfo } from '../utils/itemButtonLog'



// Exporting types to be used in other files
export interface Album {
  id: string;
  name: string;
  album_type: string;
  images: { url: string }[]; 
  release_date: string;
  artists: { name: string }[];
}

export interface AlbumOnly {
  name: string;
  id: string;
  type: string;
  artists: { name: string }[];
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  images: { url: string }[];
  external_urls: { spotify: string };
  href: string;
  uri: string;
}
export interface Artist {
  name: string;
  id: string;
  type: string;
  images: { url: string }[];
  popularity: number; 
}

export interface Track {
  name: string, 
  id: string, 
  type: string, 
  album: { name: string, images: { url: string }[] }, 
  artists: { name: string }[],
  popularity: number; 
  preview_url: string,
}

interface SearchResult {
  type: string;
  name: string;
  id: string;
  images: { url: string }[];  
  release_date: string;
  artist: string;
  album?: {
    images: { url: string }[];
  };
}

type SearchScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'Search'>;
};

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  // const [albums, setAlbums] = useState<{ id: string, name: string, images: string }[]>([]); // Explicitly define the type of albums state
  const [albumsOnly, setAlbumsOnly] = useState<AlbumOnly[]>([]); // Used with interface Album
  const [searchData, setSearchData] = useState<SearchResult[]>([]);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]); 
  const [tracks, setTracks] = useState<Track[]>([]);

  // const [newData, setNewData] = useState<Track[]>([]);

  const sortedTracks = tracks.sort((a, b) => b.popularity - a.popularity); // This will take the searched tracks, and sort them by popularity

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
    console.log("Access Token: ", accessToken)
  }, [])


  // async function newSearch() {
  //   console.log("Searching input: " + searchInput);

  //   var searchParameters = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + accessToken,
  //     }
  //   }

  //   try {
     
  //     var response = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist,album,track&limit=20', searchParameters);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch search results');
  //     }
  //     var newSearchData = await response.json();
      
  //     setNewData(newSearchData)
  //     console.log(newSearchData)

  //   } catch (error) {
  //     console.error('Error searching:', error);
  //   }
  // }

  
  
  // async function newSearch() {
  //   console.log("Searching input: " + searchInput);

  //   var searchParameters = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + accessToken,
  //     }
  //   }

  //   try {
     
  //     var response = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist,album,track&limit=20', searchParameters);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch search results');
  //     }
  //     var newSearchData = await response.json();
      
  //     setNewData(newSearchData)
  //     console.log(newSearchData)

  //   } catch (error) {
  //     console.error('Error searching:', error);
  //   }
  // }

  
// Search all function to search for album, tracks and artists off the input
    
    async function searchAll() {
      console.log("Searching input: " + searchInput);

      var searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        }
      }

      try {
        var response = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist,album,track', searchParameters);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        var searchData = await response.json();

        console.log(" ")
        console.log(" ")
        console.log("******************************************************************************")
        console.log("*                                                                            *")
        console.log("*                         S E A R C H  R E S U L T S                         *")
        console.log("*                                                                            *")
        console.log("******************************************************************************")


        // Display artists
        console.log(" ")
        console.log("******************************* A R T I S T S ********************************")
        console.log(" ")
        searchData.artists.items.slice(0, 2).forEach((artist: Artist) => {
          console.log("Name:", artist.name);
          console.log("ID:", artist.id);
          console.log("Type:", artist.type);
          console.log("Images:", artist.images?.[0]?.url || 'No image available');
          console.log("Popularity:", artist.popularity);

          console.log("--------------------------------------------");
        });
        console.log(" ")

        // Display albums
        console.log(" ")
        console.log("********************************* A L B U M S ********************************")
        console.log(" ")
        searchData.artists.items.slice(0, 5).forEach((album: Album) => {
          console.log("Name:", album.name);
          console.log("ID:", album.id);
          console.log("Type:", album.album_type);
          console.log("Images:", album.images[0]?.url || 'No image available');
          console.log("--------------------------------------------");
        });
        console.log(" ")

        // Display search results for tracks
        if (searchData.tracks) {
          console.log(" ")
          console.log("******************************** T R A C K S *********************************")
          console.log(" ")
          searchData.tracks.items.slice(0, 20).forEach((track: Track) => {

            console.log("Name:", track.name);
            console.log("ID:", track.id);
            console.log("Type:", track.type);
            console.log("Artists:", track.artists.map(artist => artist.name).join(', '));
            console.log("Album:", track.album.name);
            console.log("Images:", track.album.images[0]?.url || 'No image available');
            console.log("Popularity:", track.popularity);
            console.log("Preview URL:", track.preview_url);


            console.log("--------------------------------------------");
          });
          console.log(" ")
        }


        console.log("*******************************     E N D     *******************************")
        console.log(" ")

        // Update state with search results
        setArtists(searchData.artists.items);
        setAlbums(searchData.albums.items);
        setTracks(searchData.tracks.items);

      } catch (error) {
        console.error('Error searching:', error);
      }
    }

  // searchAlbum takes the artist id to display the artists albums
  async function searchAlbum() {
    console.log("Searching input: " + searchInput);
  
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      }
    }
  
    try {
      // Get request using search to get Artist Id
      var artistIDResponse = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters);
      if (!artistIDResponse.ok) {
        throw new Error('Failed to fetch artist ID');
      }
      var artistIDData = await artistIDResponse.json();
      var artistID = artistIDData.artists.items[0].id;
  
      console.log("Artist ID: " + artistID);
  
      // Fetch albums for the artist
      var albumsResponse = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums?include_groups=album&market=us&limit=50', searchParameters);
      if (!albumsResponse.ok) {
        throw new Error('Failed to fetch albums');
      }
      var albumsData = await albumsResponse.json();

      console.log(" ")
      console.log("************************* A L B U M S *************************")
      albumsData.items.forEach((album: AlbumOnly) => {
        // console.log(album);
        console.log(" ")

        console.log("Name:", album.name);
        console.log("ID:", album.id);
        console.log("Type:", album.type);
        console.log("Artists:", album.artists);
        console.log("Release Date:", album.release_date);
        console.log("Release Date Precision:", album.release_date_precision);
        console.log("Total Tracks:", album.total_tracks);
        console.log("Images:", album.images[0].url);
        console.log("Albumn Spotify:", album.external_urls.spotify);
        console.log("Albumn HREF:", album.href);
        console.log("URI", album.uri);
        console.log(" ")

        console.log("--------------------------------------------")
        // Add more properties as needed
      });
      console.log(" ")

      console.log("************************* E N D *************************")
      console.log(" ")

      // console.log(albumsData);
      setAlbumsOnly(albumsData.items);
    } catch (error) {
      console.error('Error searching:', error);
    }
  }
  
  
  const handleSearch = () => {
    // Handle search functionality
    console.log('Searching for: ', searchInput);
    // You can add code here to perform the search
    // For example, using AWS services like Amplif
    // You can also add validation logic here
  };

  const handleClearSearch = () => {
    setSearchInput('');
    // setArtists([]);
    // setAlbums([]);
    // setTracks([]);
  };

  // This useEffect renders results as the user is typing, although not accurate when 'lil' as it chooses an artist

//   useEffect(() => {
//   if (searchInput !== '') {
//     searchAll();
//   } else {
//     setArtists([]);
//     setAlbums([]);
//     setTracks([]);
//   }
// }, [searchInput]);

//This useEffect sets results = null when input = null
useEffect(() => {
  if (searchInput === '') {
    setAlbumsOnly([]);
    setArtists([]);
    setAlbums([]);
    setTracks([]);
  }
}, [searchInput]);


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchInput}
          onChangeText={setSearchInput}
          //Add Enter key to perform search on keyboard
          onKeyPress={(event) => {
            if (event.nativeEvent.key === 'Enter' || event.nativeEvent.key === 'Return') {
              // searchAlbum();
              searchAll();

            }
          }}
          // onSubmitEditing={searchAlbum} // Adds return keystroke on mac to enter/search, 
          onSubmitEditing={searchAll} // Adds return keystroke on mac to enter/search,

        />
        {searchInput.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#888" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={searchAll}>
          <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Display search results */}
      {/* <ScrollView>
        {albums.map(album => (
          <View key={album.id} style={styles.albumContainer}>
          <Image
            source={{ uri: album.images[0].url }}
            style={styles.albumImage}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.albumName}>{album.name}</Text>
            <Text style={styles.albumYear}>{new Date(album.release_date).getFullYear()}</Text>
          </View>
        </View>
        ))}
      </ScrollView> */}
      
      {/* Display search results for artists */}
      
      <ScrollView>
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
      {/* Display search results for albums */}
      {albums.slice(0, 5).map(album => (
        <TouchableOpacity key={album.id} style={styles.itemContainer} onPress={() => logAlbumInfo(album)}>
          <Image
            source={{ uri: album.images[0]?.url }}
            style={styles.albumImage}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{album.name}</Text>
            <View style={styles.itemLowerDetails}>
              <Text style={styles.itemType}>{album.album_type.charAt(0).toUpperCase() + album.album_type.slice(1)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.artist}>• {album.artists.map(artist => artist.name).join(', ')}
                </Text>
              </View>
              {/* <Text style={styles.albumYear}>{new Date(album.release_date).getFullYear()}</Text> */}
            </View>
          </View>
        </TouchableOpacity>
      ))}
      {/* Display search results for tracks */}
      {/* {sortedTracks.slice(0, 10).map(track => ( */}
      {tracks.slice(0, 10).map(track => (
        <TouchableOpacity key={track.id} style={styles.itemContainer} onPress={() => logTrackInfo(track)}>
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
              {/* <Text style={styles.albumYear}>{new Date(album.release_date).getFullYear()}</Text> */}
            </View>
          </View>
       </TouchableOpacity>
      ))}
    </ScrollView>
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
  },
  clearButton: {
    padding: 10,
  },
  albumContainer: {
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
  },
  itemName: {
    fontSize: 16, // Adjust the font size as needed
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemType: {
    fontSize: 12, // Adjust the font size as needed
    color: '#888',
    marginRight: 5, // Add some space between itemType and albumYear
  },
  itemDetails: {
    overflow: 'hidden',
    flex: 1, // Allows ellipse at end of long word thats in that direct view
  },
  allImage: {
    width: 60, // Adjust the width as needed
    height: 60, // Adjust the height as needed
    borderRadius: 8,
    marginRight: 10,
  },
  albumImage: {
    width: 60, // Adjust the width as needed
    height: 60, // Adjust the height as needed
    borderRadius: 8,
    marginRight: 10,
  },
  albumName: {
    fontSize: 16, // Adjust the font size as needed
    fontWeight: 'bold',
    marginBottom: 5,
  },
  albumYear: {
    fontSize: 12, // Adjust the font size as needed
    color: '#888',
  },
  itemLowerDetails: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Align items vertically
  },
  artist: {
    fontSize: 12,
    color: '#888',
  },
});

export default SearchScreen;