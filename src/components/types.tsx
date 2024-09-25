// src/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Album } from '../screens/SearchStack/searchScreen'
import { User } from '../models';
import { scTrack } from '../soundcloudConfig/itemInterface';
import { Post } from '../API';
import { Track } from '../spotifyConfig/itemInterface';

export type HomeStackParamList = {
  Home: undefined;
  HomeUserProfile: { userId: string }; 
  PostRepost: {post: Post};
  RepostOriginalPost: {post: Post};
  FollowList: { userId: string; initialTab: 'following' | 'followers' };
  Profile: undefined
  ExplorePost: { id: string, type: string };
};

export type SearchScreenStackParamList = {
  Search: undefined;
  AlbumDetail: { album: Album }; 
  PostSpotifyTrack: { track: Track };
  PostSpotifyAlbum: { album: Album };
  PostSCTrack: { sctrack: scTrack };
  SearchSpotifyAlbum: { albumId: string };
  SearchSpotifyTrack: { trackId: string };
  SearchSpotifyArtist: { artistId: string };
  SearchSCTrack: { trackId: string };
  SearchSCUser: { userId: string }; // Add this if not already present
};

export type ProfileStackParamList = {
  Profile: undefined;
  UserSearch: undefined;
  UserSearchProfile: { userId: string };
  Notifications: undefined;
  ResetPassword: undefined;
  GeneralSettings: undefined;
  AccountSettings: undefined;
  NotificationsSettings: undefined;
  SpotifyAccountSettings: undefined;
  AccessibilitySettings: undefined;
  PrivacySettings: undefined;
  FollowList: { userId: string; initialTab: 'following' | 'followers' };
};

export type ExploreStackParamList = {
  Explore: undefined;
  ItemDetailsExplore: undefined;
};
