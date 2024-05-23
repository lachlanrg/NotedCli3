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

        // console.log(" ")
        // console.log(" ")
        // console.log("******************************************************************************")
        // console.log("*                                                                            *")
        // console.log("*                         S E A R C H  R E S U L T S                         *")
        // console.log("*                                                                            *")
        // console.log("******************************************************************************")


        // // Display artists
        // console.log(" ")
        // console.log("******************************* A R T I S T S ********************************")
        // console.log(" ")
        // searchData.artists.items.slice(0, 2).forEach((artist: Artist) => {
        //   console.log("Name:", artist.name);
        //   console.log("ID:", artist.id);
        //   console.log("Type:", artist.type);
        //   console.log("Images:", artist.images?.[0]?.url || 'No image available');
        //   console.log("Popularity:", artist.popularity);

        //   console.log("--------------------------------------------");
        // });
        // console.log(" ")

        // // Display albums
        // console.log(" ")
        // console.log("********************************* A L B U M S ********************************")
        // console.log(" ")
        // searchData.artists.items.slice(0, 5).forEach((album: Album) => {
        //   console.log("Name:", album.name);
        //   console.log("ID:", album.id);
        //   console.log("Type:", album.album_type);
        //   console.log("Images:", album.images[0]?.url || 'No image available');
        //   console.log("--------------------------------------------");
        // });
        // console.log(" ")

        // // Display search results for tracks
        // if (searchData.tracks) {
        //   console.log(" ")
        //   console.log("******************************** T R A C K S *********************************")
        //   console.log(" ")
        //   searchData.tracks.items.slice(0, 20).forEach((track: Track) => {

        //     console.log("Name:", track.name);
        //     console.log("ID:", track.id);
        //     console.log("Type:", track.type);
        //     console.log("Artists:", track.artists.map(artist => artist.name).join(', '));
        //     console.log("Album:", track.album.name);
        //     console.log("Images:", track.album.images[0]?.url || 'No image available');
        //     console.log("Popularity:", track.popularity);
        //     console.log("Preview URL:", track.preview_url);


        //     console.log("--------------------------------------------");
        //   });
        //   console.log(" ")
        // }


        // console.log("*******************************     E N D     *******************************")
        // console.log(" ")

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

