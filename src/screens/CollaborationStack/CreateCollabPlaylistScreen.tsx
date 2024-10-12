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
  Platform
} from 'react-native';
import { dark, light, placeholder } from '../../components/colorModes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';
import { createSpotifyPlaylist } from '../../utils/spotifyPlaylistAPI';

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
      await createSpotifyPlaylist(playlistName, playlistDescription);
      Alert.alert('Success', 'Collaborative playlist created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating playlist:', error);
      Alert.alert('Error', 'Failed to create collaborative playlist. Please try again.');
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
