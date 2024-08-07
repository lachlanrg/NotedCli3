// src/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Album } from '../screens/SearchStack/searchScreen'
import { User } from '../models';
import { Track } from '../spotifyConfig/itemInterface';
import { scTrack } from '../soundcloudConfig/itemInterface';

export type HomeStackParamList = {
  Home: undefined;
  CreatePostTab: undefined
};

export type SearchScreenStackParamList = {
  Search: undefined;
  AlbumDetail: { album: Album }; 
  PostSpotifyTrack: { track: Track };
  PostSpotifyAlbum: { album: Album };
  PostSCTrack: { sctrack: scTrack };
};

export type CreatePostStackParamList = {
  CreatePost: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  UserSearch: undefined;
  UserSearchProfile: { userId: string };
  Notifications: undefined;
};

