import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { dark, light, placeholder, lgray, spotifyGreen } from '../../components/colorModes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';
import { createSpotifyPlaylist, updatePlaylistImage } from '../../utils/spotifyPlaylistAPI';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createSpotifyPlaylist as createSpotifyPlaylistMutation } from '../../graphql/mutations';
import imageAssets from '../../assets/imageAssets.json';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Add this array of genres
const genres = [
  'Pop', 'Hip-Hop', 'R&B', 'Rap', 'House', 'Electronic', 
  'Dance', 'Indie', 'Alternative', 'Country', 'Jazz', 'Classical', 
  'Rock', 'Metal', 'Blues', 'Reggae', 'Folk'
];

const MAX_GENRES = 3;

type CreateCollabPlaylistScreenNavigationProp = NativeStackNavigationProp<
  CollaborationStackParamList,
  'CreateCollabPlaylist'
>;

const CreateCollabPlaylistScreen: React.FC = () => {
  const navigation = useNavigation<CreateCollabPlaylistScreenNavigationProp>();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [trackLimit, setTrackLimit] = useState<string>("5");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenres, setShowGenres] = useState(false);

  const handleCreatePlaylist = async () => {
    try {
      const playlistType = trackLimit === "unlimited" ? 'COLLABORATIVE' : 'RESTRICTED_COLLABORATIVE';
      const newPlaylist = await createSpotifyPlaylist(playlistName, playlistDescription, playlistType);
      const createdPlaylist = await createSpotifyPlaylistInGraphQL(newPlaylist, playlistType);
      
      if (createdPlaylist && createdPlaylist.spotifyPlaylistId) {
        await updatePlaylistCoverImage(createdPlaylist.spotifyPlaylistId);
        Alert.alert('Success', 'Collab playlist created successfully!');
        navigation.goBack();
      } else {
        throw new Error('Failed to get spotifyPlaylistId from created playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      Alert.alert('Error', 'Failed to create collaborative playlist. Please try again.');
    }
  };

  const createSpotifyPlaylistInGraphQL = async (playlist: any, playlistType: 'COLLABORATIVE' | 'RESTRICTED_COLLABORATIVE') => {
    try {
      const client = generateClient();
      const { userId, username } = await getCurrentUser();

      const playlistDetails = {
        name: playlist.name,
        description: playlist.description,
        userSpotifyPlaylistsId: userId,
        type: playlistType,
        spotifyPlaylistId: playlist.id,
        username: username,
        spotifyUserId: playlist.owner.id,
        spotifyExternalUrl: playlist.external_urls.spotify,
        imageUrl: playlist.images[0]?.url,
        tracks: playlist.tracks.total,
        followers: playlist.followers.total,
        likedBy: [],
        likesCount: 0,
        trackLimitPerUser: trackLimit,
        genres: selectedGenres,
      };

      const result = await client.graphql({
        query: createSpotifyPlaylistMutation,
        variables: { input: playlistDetails }
      });

      return result.data.createSpotifyPlaylist;
    } catch (error) {
      console.error('Error creating playlist in GraphQL:', error);
      throw error;
    }
  };

  const updatePlaylistCoverImage = async (spotifyPlaylistId: string) => {
    try {
      // console.log('Updating playlist cover image for playlist ID:', spotifyPlaylistId);
      // console.log('Image data length:', imageAssets.collabImageBase64.length);
      await updatePlaylistImage(spotifyPlaylistId, imageAssets.collabImageBase64);
      // console.log('Playlist cover image updated successfully');
    } catch (error) {
      console.error('Error updating playlist cover image:', error);
      if (error instanceof Error) {
        Alert.alert('Error', `Failed to update playlist image: ${error.message}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred while updating the playlist image');
      }
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const toggleGenreSelection = () => {
    setShowGenres(!showGenres);
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prevGenres => {
      if (prevGenres.includes(genre)) {
        // If the genre is already selected, remove it
        return prevGenres.filter(g => g !== genre);
      } else if (prevGenres.length < MAX_GENRES) {
        // If the genre is not selected and we haven't reached the limit, add it
        return [...prevGenres, genre];
      } else {
        // If we've reached the limit, show an alert and don't change the selection
        Alert.alert('Genre Limit Reached', `You can only select up to ${MAX_GENRES} genres.`);
        return prevGenres;
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Create Collaborative Playlist</Text>
          <TextInput
            style={styles.input}
            placeholder="Playlist Name"
            placeholderTextColor={placeholder}
            value={playlistName}
            onChangeText={setPlaylistName}
            returnKeyType="done"
            onSubmitEditing={dismissKeyboard}
          />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Playlist Description"
            placeholderTextColor={placeholder}
            value={playlistDescription}
            onChangeText={setPlaylistDescription}
            multiline
            returnKeyType="done"
            onSubmitEditing={dismissKeyboard}
          />
          <Text style={styles.label}>Set track per user limit</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={trackLimit}
              onValueChange={(itemValue) => setTrackLimit(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="5 tracks" value="5" />
              <Picker.Item label="10 tracks" value="10" />
              <Picker.Item label="20 tracks" value="20" />
              <Picker.Item label="Unlimited" value="unlimited" />
            </Picker>
          </View>
          <View style={styles.infoContainer}>
            <FontAwesomeIcon icon={faInfoCircle} size={16} color={spotifyGreen} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Numerical limit creates a public playlist, not modifiable via Spotify App, unlimited creates a Collaborative playlist allowing full control by friends.
            </Text>
          </View>
          
          <TouchableOpacity style={styles.genreButton} onPress={toggleGenreSelection}>
            <Text style={styles.genreButtonText}>
              {showGenres ? 'Hide Genres' : 'Select Genres'}
            </Text>
            {/* <Text style={styles.genreCount}>
              {selectedGenres.length}/{MAX_GENRES}
            </Text> */}
            <FontAwesomeIcon 
              icon={showGenres ? faChevronUp : faChevronDown} 
              size={16} 
              color={light} 
            />
          </TouchableOpacity>
          
          {showGenres && (
            <View style={styles.genreContainer}>
              {genres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreBubble,
                    selectedGenres.includes(genre) && styles.selectedGenreBubble,
                    selectedGenres.length >= MAX_GENRES && !selectedGenres.includes(genre) && styles.disabledGenreBubble
                  ]}
                  onPress={() => toggleGenre(genre)}
                  disabled={selectedGenres.length >= MAX_GENRES && !selectedGenres.includes(genre)}
                >
                  <Text style={[
                    styles.genreText,
                    selectedGenres.includes(genre) && styles.selectedGenreText,
                    selectedGenres.length >= MAX_GENRES && !selectedGenres.includes(genre) && styles.disabledGenreText
                  ]}>
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <TouchableOpacity style={styles.button} onPress={handleCreatePlaylist}>
            <Text style={styles.buttonText}>Create Playlist</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: light,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    color: light,
    // marginBottom: 5,
  },
  pickerContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    // marginBottom: 15,
  },
  picker: {
    color: light,
  },
  pickerItem: {
    color: light,
  },
  button: {
    backgroundColor: light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonText: {
    color: dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: lgray,
    lineHeight: 16,
  },
  genreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  genreButtonText: {
    color: light,
    fontSize: 16,
  },
  genreCount: {
    color: lgray,
    fontSize: 14,
    marginRight: 10,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedGenreBubble: {
    backgroundColor: spotifyGreen,
  },
  disabledGenreBubble: {
    opacity: 0.5,
  },
  genreText: {
    color: light,
    fontSize: 14,
  },
  selectedGenreText: {
    color: dark,
  },
  disabledGenreText: {
    color: lgray,
  },
});

export default CreateCollabPlaylistScreen;
