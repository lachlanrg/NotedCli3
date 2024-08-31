import { useEffect, useState } from 'react';
import { Artist, Album, Track } from './itemInterface';
import { CLIENT_ID, CLIENT_SECRET } from '../config';


export const useSpotifySearch = (
    searchInput: string,
    saveRecentSearch: (input: string) => void,
    setArtists: React.Dispatch<React.SetStateAction<Artist[]>>,
    setAlbums: React.Dispatch<React.SetStateAction<Album[]>>,
    setTracks: React.Dispatch<React.SetStateAction<Track[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>

  ) => {  const [accessToken, setAccessToken] = useState('');

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
  }, [])

  const searchAll = async () => {
    saveRecentSearch(searchInput);
    // setLoading(true);

      console.log("Spotify Search input: " + searchInput);

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

        // Update state with search results
        setArtists(searchData.artists.items);
        setAlbums(searchData.albums.items);
        setTracks(searchData.tracks.items);

        } catch (error) {
            console.error('Error searching:', error);
        } 
        // finally {
        //     setLoading(false);
        // }
    }

    return { searchAll };

};

export default useSpotifySearch;

