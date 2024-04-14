import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Album } from './types'; // Assuming you have a type for your album object

interface AlbumComponentProps {
  album: Album; // Assuming Album is the type for your album object
}

const AlbumComponent: React.FC<AlbumComponentProps> = ({ album }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: album.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{album.name}</Text>
      <Text style={styles.artist}>{album.artist}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#888',
  },
});

export default AlbumComponent;
