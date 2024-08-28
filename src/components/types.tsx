// src/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Album } from '../screens/SearchStack/searchScreen'
import { User } from '../models';
import { Track } from '../spotifyConfig/itemInterface';
import { scTrack } from '../soundcloudConfig/itemInterface';
import { Post } from '../API';
import { RankedTrack } from './exploreAPIs/spotifyTopTracks';
import { RankedSoundCloudTrack } from './exploreAPIs/scTopTracks';
import { RankedTopTrending } from './exploreAPIs/topTrendingItems';

export type HomeStackParamList = {
  Home: undefined;
  HomeUserProfile: { userId: string }; 
  CreatePostTab: undefined
  PostRepost: {post: Post};
  RepostOriginalPost: {post: Post};
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
  ResetPassword: undefined;
};

export type ExploreStackParamList ={
  Explore: undefined;
  ItemDetailsExplore: undefined;
};

