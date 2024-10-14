// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, SpotifyPlaylist, Friendship, FriendRequest, Post, Comment, Repost, SpotifyRecentlyPlayedTrack, SpotifyTokens, UserDeviceToken, SeenPost, Notification, NotificationSettings, UserPlaylistTrack } = initSchema(schema);

export {
  User,
  SpotifyPlaylist,
  Friendship,
  FriendRequest,
  Post,
  Comment,
  Repost,
  SpotifyRecentlyPlayedTrack,
  SpotifyTokens,
  UserDeviceToken,
  SeenPost,
  Notification,
  NotificationSettings,
  UserPlaylistTrack
};