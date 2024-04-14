// SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardEvent, Text, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import { CLIENT_ID, CLIENT_SECRET } from '../config';

interface Album {
  id: string;
  name: string;
  images: { url: string }[];  // Define images as an array of objects with a url property
  release_date: string;
  // Add other properties as needed
}

const SearchScreen = () => {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  // const [albums, setAlbums] = useState<{ id: string, name: string, images: string }[]>([]); // Explicitly define the type of albums state
  const [albums, setAlbums] = useState<Album[]>([]); // Used with interface Album



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

  async function searchAlbum() {
    console.log("Searching input: " + searchInput);
  
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken, // Fixed typo in 'Authorization'
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
      albumsData.items.forEach((album) => {
        // console.log(album);
        console.log(" ")

        console.log("Name:", album.name);
        console.log("ID:", album.id);
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
      setAlbums(albumsData.items);
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
    setAlbums([]); // Clear the albums state

  };

  // This useEffect renders results as the user is typing, although not accurate when 'lil' as it chooses an artist
//   useEffect(() => {
//   if (searchInput !== '') {
//     search();
//   } else {
//     setAlbums([]);
//   }
// }, [searchInput]);

//This useEffect sets results = null when input = null
useEffect(() => {
  if (searchInput === '') {
    setAlbums([]);
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
              searchAlbum();
            }
          }}
          onSubmitEditing={searchAlbum} // Adds return keystroke on mac to enter/search
        />
        {searchInput.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
            <FontAwesomeIcon icon={faTimes} size={20} color="#888" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={searchAlbum}>
          <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Display search results */}
      <ScrollView>
        {albums.map(album => (
          <View key={album.id} style={styles.albumContainer}>
          <Image
            source={{ uri: album.images[0].url }}
            style={styles.albumImage}
          />
          <View style={styles.albumDetails}>
            <Text style={styles.albumName}>{album.name}</Text>
            <Text style={styles.albumYear}>{new Date(album.release_date).getFullYear()}</Text>
          </View>
        </View>

        ))}
      </ScrollView>
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  albumImage: {
    width: 60, // Adjust the width as needed
    height: 60, // Adjust the height as needed
    borderRadius: 8,
    marginRight: 10,
  },
  albumDetails: {
    flex: 1,
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
});

export default SearchScreen;
