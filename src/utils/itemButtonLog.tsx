// ./src/utils/itemButtonLog
import { Album } from "../screens/searchScreen"
import { Artist } from "../screens/searchScreen"
import { Track } from "../screens/searchScreen"

// Function to log track information
// Exporting function to be imported to Search Screen

export const logTrackInfo = (track: Track) => {
    console.log(" ")
    console.log("=================  T R A C K - I N F O ================")
    console.log("Name:", track.name);
    console.log("ID:", track.id);
    console.log("Type:", track.type);
    console.log("Artists:", track.artists.map(artist => artist.name).join(', '));
    console.log("Album:", track.album.name);
    console.log("Images:", track.album.images[0]?.url || 'No image available');
    console.log("Popularity:", track.popularity);
    console.log("=======================================================")
    console.log(" ")

    // Add any other track details you want to log
  };
  
  // Function to log album information
export const logAlbumInfo = (album: Album) => {
    console.log(" ")
    console.log("=================  A L B U M - I N F O ================")
    console.log("Name:", album.name);
    console.log("ID:", album.id);
    console.log("Type:", album.album_type);
    console.log("Images:", album.images[0]?.url || 'No image available');
    console.log("=======================================================")
    console.log(" ")

    // Add any other album details you want to log
  };
  
  // Function to log artist information
export const logArtistInfo = (artist: Artist) => {
    console.log(" ")
    console.log("================  A R T I S T - I N F O ===============")
    console.log("Name:", artist.name);
    console.log("ID:", artist.id);
    console.log("Type:", artist.type);
    console.log("Images:", artist.images?.[0]?.url || 'No image available');
    console.log("Popularity:", artist.popularity);
    console.log("=======================================================")
    console.log(" ")

    // Add any other artist details you want to log
  };
  