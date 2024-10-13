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
} from 'react-native';
import { dark, light, placeholder } from '../../components/colorModes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';
import { createSpotifyPlaylist, updatePlaylistImage } from '../../utils/spotifyPlaylistAPI';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createSpotifyPlaylist as createSpotifyPlaylistMutation } from '../../graphql/mutations';
import imageAssets from '../../assets/imageAssets.json';


type CreateCollabPlaylistScreenNavigationProp = NativeStackNavigationProp<
  CollaborationStackParamList,
  'CreateCollabPlaylist'
>;

const CreateCollabPlaylistScreen: React.FC = () => {
  const navigation = useNavigation<CreateCollabPlaylistScreenNavigationProp>();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const handleCreatePlaylist = async () => {
    try {
      const newPlaylist = await createSpotifyPlaylist(playlistName, playlistDescription);
      const createdPlaylist = await createSpotifyPlaylistInGraphQL(newPlaylist);
      
      if (createdPlaylist && createdPlaylist.spotifyPlaylistId) {
        await updatePlaylistCoverImage(createdPlaylist.spotifyPlaylistId);
        Alert.alert('Success', 'Collaborative playlist created successfully!');
        navigation.goBack();
      } else {
        throw new Error('Failed to get spotifyPlaylistId from created playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      Alert.alert('Error', 'Failed to create collaborative playlist. Please try again.');
    }
  };

  const createSpotifyPlaylistInGraphQL = async (playlist: any) => {
    try {
      const client = generateClient();
      const { userId, username } = await getCurrentUser();

      const playlistDetails = {
        name: playlist.name,
        description: playlist.description,
        userSpotifyPlaylistsId: userId,
        type: playlist.public ? 'PUBLIC' : (playlist.collaborative ? 'COLLABORATIVE' : 'PRIVATE'),
        spotifyPlaylistId: playlist.id,
        username: username,
        spotifyUserId: playlist.owner.id,
        spotifyExternalUrl: playlist.external_urls.spotify,
        imageUrl: playlist.images[0]?.url,
        tracks: playlist.tracks.total,
        followers: playlist.followers.total,
        likedBy: [],
        likesCount: 0,
      };

      const result = await client.graphql({
        query: createSpotifyPlaylistMutation,
        variables: { input: playlistDetails }
      });

      console.log('Playlist created in GraphQL:', result.data.createSpotifyPlaylist);
      return result.data.createSpotifyPlaylist;
    } catch (error) {
      console.error('Error creating playlist in GraphQL:', error);
      throw error;
    }
  };

  const updatePlaylistCoverImage = async (spotifyPlaylistId: string) => {
    try {
      console.log('Updating playlist cover image for playlist ID:', spotifyPlaylistId);
      console.log('Image data length:', imageAssets.collabImageBase64.length);
      await updatePlaylistImage(spotifyPlaylistId, imageAssets.collabImageBase64);
      console.log('Playlist cover image updated successfully');
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

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
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
          <TouchableOpacity style={styles.button} onPress={handleCreatePlaylist}>
            <Text style={styles.buttonText}>Create Playlist</Text>
          </TouchableOpacity>
        </View>
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
  button: {
    backgroundColor: light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateCollabPlaylistScreen;
