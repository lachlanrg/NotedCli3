// src/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Album } from '../screens/searchScreen'

export type HomeStackParamList = {
  Home: undefined;
  // Add parameters for additional Home screens
};

export type SearchScreenStackParamList = {
  Search: undefined;
  AlbumDetail: { album: Album }; // Define the album parameter
  // Add parameters for additional Search screens 
};

export type CreatePostStackParamList = {
  CreatePost: undefined;
  // Add parameters for additional Create Post screens 
};

export type ProfileStackParamList = {
  Profile: undefined;
  // Add parameters for additional Profile screens 
};

