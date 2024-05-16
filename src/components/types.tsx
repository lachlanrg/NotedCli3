// src/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Album } from "../screens/searchScreen"

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  CreatePostTab: undefined;
  // Search: undefined;
  Search: { screen: string }; 
  // SearchScreenStack: { screen: string }; 
  // SearchScreenStack: {
  //   AlbumDetail: undefined;
  // };
  // AlbumDetail: undefined;
  // Album: undefined;

  // AlbumDetailsStack: { screen: string; params: { album: Album } }; // Update the Main type
};

export type SearchScreenStackParamList = {
  Search: undefined;
  AlbumDetail: { albumId: string }; // Define any parameters the AlbumDetail screen might need
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type SearchScreenStackScreenProps<Screen extends keyof SearchScreenStackParamList> =
  NativeStackScreenProps<SearchScreenStackParamList, Screen>;
