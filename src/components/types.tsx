// src/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Album } from '../screens/searchScreen'
import { User } from '../models';

export type HomeStackParamList = {
  Home: undefined;
  CreatePostTab: undefined
};

export type SearchScreenStackParamList = {
  Search: undefined;
  AlbumDetail: { album: Album }; 
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

