import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { dark, light } from '../../components/colorModes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CollaborationStackParamList } from '../../components/types';

type CollaborationScreenNavigationProp = NativeStackNavigationProp<
  CollaborationStackParamList,
  'Collaboration'
>;

const CollaborationScreen: React.FC = () => {
  const navigation = useNavigation<CollaborationScreenNavigationProp>();

  const handleCreateCollabPlaylist = () => {
    navigation.navigate('CreateCollabPlaylist');
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Collaboration</Text>
        <TouchableOpacity style={styles.button} onPress={handleCreateCollabPlaylist}>
          <Text style={styles.buttonText}>Create Collaborative Playlist</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: light,
    marginBottom: 20,
  },
  button: {
    backgroundColor: light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CollaborationScreen;
