// src/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  CreatePostTab: undefined;
  Search: undefined; // Add Search to the RootStackParamList
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

  // This is only used for the AlbumComponent.tsx
  export type Album = {
    id: string;
    name: string;
    artist: string;
    imageUrl: string;
  };
