import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly posts?: (Post | null)[] | null;
  readonly friends?: (Friendship | null)[] | null;
  readonly sentFriendRequests?: (FriendRequest | null)[] | null;
  readonly receivedFriendRequests?: (FriendRequest | null)[] | null;
  readonly comments?: (Comment | null)[] | null;
  readonly publicProfile?: boolean | null;
  readonly reposts?: (Repost | null)[] | null;
  readonly spotifyRecentlyPlayedTrack?: (SpotifyRecentlyPlayedTrack | null)[] | null;
  readonly recentlyPlayedDisabled?: boolean | null;
  readonly spotifyTokens?: (SpotifyTokens | null)[] | null;
  readonly spotifyUri?: string | null;
  readonly spotifyImage?: string | null;
  readonly soundCloudUri?: string | null;
  readonly userDeviceTokens?: (UserDeviceToken | null)[] | null;
  readonly notificationSettings?: NotificationSettings | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userNotificationSettingsId?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly posts: AsyncCollection<Post>;
  readonly friends: AsyncCollection<Friendship>;
  readonly sentFriendRequests: AsyncCollection<FriendRequest>;
  readonly receivedFriendRequests: AsyncCollection<FriendRequest>;
  readonly comments: AsyncCollection<Comment>;
  readonly publicProfile?: boolean | null;
  readonly reposts: AsyncCollection<Repost>;
  readonly spotifyRecentlyPlayedTrack: AsyncCollection<SpotifyRecentlyPlayedTrack>;
  readonly recentlyPlayedDisabled?: boolean | null;
  readonly spotifyTokens: AsyncCollection<SpotifyTokens>;
  readonly spotifyUri?: string | null;
  readonly spotifyImage?: string | null;
  readonly soundCloudUri?: string | null;
  readonly userDeviceTokens: AsyncCollection<UserDeviceToken>;
  readonly notificationSettings: AsyncItem<NotificationSettings | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userNotificationSettingsId?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerFriendship = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Friendship, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user?: User | null;
  readonly friend?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userFriendsId?: string | null;
}

type LazyFriendship = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Friendship, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user: AsyncItem<User | undefined>;
  readonly friend: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userFriendsId?: string | null;
}

export declare type Friendship = LazyLoading extends LazyLoadingDisabled ? EagerFriendship : LazyFriendship

export declare const Friendship: (new (init: ModelInit<Friendship>) => Friendship) & {
  copyOf(source: Friendship, mutator: (draft: MutableModel<Friendship>) => MutableModel<Friendship> | void): Friendship;
}

type EagerFriendRequest = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FriendRequest, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sender: User;
  readonly recipient: User;
  readonly status: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userSentFriendRequestsId?: string | null;
  readonly userReceivedFriendRequestsId?: string | null;
}

type LazyFriendRequest = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FriendRequest, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sender: AsyncItem<User>;
  readonly recipient: AsyncItem<User>;
  readonly status: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userSentFriendRequestsId?: string | null;
  readonly userReceivedFriendRequestsId?: string | null;
}

export declare type FriendRequest = LazyLoading extends LazyLoadingDisabled ? EagerFriendRequest : LazyFriendRequest

export declare const FriendRequest: (new (init: ModelInit<FriendRequest>) => FriendRequest) & {
  copyOf(source: FriendRequest, mutator: (draft: MutableModel<FriendRequest>) => MutableModel<FriendRequest> | void): FriendRequest;
}

type EagerPost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Post, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly body?: string | null;
  readonly comments?: (Comment | null)[] | null;
  readonly user?: User | null;
  readonly userPostsId: string;
  readonly username: string;
  readonly likedBy?: string[] | null;
  readonly likesCount: number;
  readonly reposts?: (Repost | null)[] | null;
  readonly spotifyAlbumId?: string | null;
  readonly spotifyAlbumName?: string | null;
  readonly spotifyAlbumType?: string | null;
  readonly spotifyAlbumImageUrl?: string | null;
  readonly spotifyAlbumReleaseDate?: string | null;
  readonly spotifyAlbumArtists?: string | null;
  readonly spotifyAlbumTotalTracks?: string | null;
  readonly spotifyAlbumExternalUrl?: string | null;
  readonly spotifyTrackId?: string | null;
  readonly spotifyTrackName?: string | null;
  readonly spotifyTrackAlbumName?: string | null;
  readonly spotifyTrackImageUrl?: string | null;
  readonly spotifyTrackArtists?: string | null;
  readonly spotifyTrackPreviewUrl?: string | null;
  readonly spotifyTrackExternalUrl?: string | null;
  readonly spotifyTrackReleaseDate?: string | null;
  readonly spotifyTrackDurationMs?: number | null;
  readonly spotifyTrackExplicit?: boolean | null;
  readonly scTrackId?: string | null;
  readonly scTrackTitle?: string | null;
  readonly scTrackArtworkUrl?: string | null;
  readonly scTrackUserId?: string | null;
  readonly scTrackUsername?: string | null;
  readonly scTrackLikes?: number | null;
  readonly scTrackArtist?: string | null;
  readonly scTrackGenre?: string | null;
  readonly scTrackPermalinkUrl?: string | null;
  readonly scTrackWaveformUrl?: string | null;
  readonly scTrackCreatedAt?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Post, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly body?: string | null;
  readonly comments: AsyncCollection<Comment>;
  readonly user: AsyncItem<User | undefined>;
  readonly userPostsId: string;
  readonly username: string;
  readonly likedBy?: string[] | null;
  readonly likesCount: number;
  readonly reposts: AsyncCollection<Repost>;
  readonly spotifyAlbumId?: string | null;
  readonly spotifyAlbumName?: string | null;
  readonly spotifyAlbumType?: string | null;
  readonly spotifyAlbumImageUrl?: string | null;
  readonly spotifyAlbumReleaseDate?: string | null;
  readonly spotifyAlbumArtists?: string | null;
  readonly spotifyAlbumTotalTracks?: string | null;
  readonly spotifyAlbumExternalUrl?: string | null;
  readonly spotifyTrackId?: string | null;
  readonly spotifyTrackName?: string | null;
  readonly spotifyTrackAlbumName?: string | null;
  readonly spotifyTrackImageUrl?: string | null;
  readonly spotifyTrackArtists?: string | null;
  readonly spotifyTrackPreviewUrl?: string | null;
  readonly spotifyTrackExternalUrl?: string | null;
  readonly spotifyTrackReleaseDate?: string | null;
  readonly spotifyTrackDurationMs?: number | null;
  readonly spotifyTrackExplicit?: boolean | null;
  readonly scTrackId?: string | null;
  readonly scTrackTitle?: string | null;
  readonly scTrackArtworkUrl?: string | null;
  readonly scTrackUserId?: string | null;
  readonly scTrackUsername?: string | null;
  readonly scTrackLikes?: number | null;
  readonly scTrackArtist?: string | null;
  readonly scTrackGenre?: string | null;
  readonly scTrackPermalinkUrl?: string | null;
  readonly scTrackWaveformUrl?: string | null;
  readonly scTrackCreatedAt?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Post = LazyLoading extends LazyLoadingDisabled ? EagerPost : LazyPost

export declare const Post: (new (init: ModelInit<Post>) => Post) & {
  copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}

type EagerComment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Comment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly post?: Post | null;
  readonly postId?: string | null;
  readonly repost?: Repost | null;
  readonly repostId?: string | null;
  readonly content: string;
  readonly likedBy?: string[] | null;
  readonly likesCount: number;
  readonly user?: User | null;
  readonly userPostsId: string;
  readonly username: string;
  readonly parentComment?: Comment | null;
  readonly parentCommentId?: string | null;
  readonly replies?: (Comment | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userCommentsId?: string | null;
  readonly postCommentsId?: string | null;
  readonly repostCommentsId?: string | null;
  readonly commentRepliesId?: string | null;
}

type LazyComment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Comment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly post: AsyncItem<Post | undefined>;
  readonly postId?: string | null;
  readonly repost: AsyncItem<Repost | undefined>;
  readonly repostId?: string | null;
  readonly content: string;
  readonly likedBy?: string[] | null;
  readonly likesCount: number;
  readonly user: AsyncItem<User | undefined>;
  readonly userPostsId: string;
  readonly username: string;
  readonly parentComment: AsyncItem<Comment | undefined>;
  readonly parentCommentId?: string | null;
  readonly replies: AsyncCollection<Comment>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userCommentsId?: string | null;
  readonly postCommentsId?: string | null;
  readonly repostCommentsId?: string | null;
  readonly commentRepliesId?: string | null;
}

export declare type Comment = LazyLoading extends LazyLoadingDisabled ? EagerComment : LazyComment

export declare const Comment: (new (init: ModelInit<Comment>) => Comment) & {
  copyOf(source: Comment, mutator: (draft: MutableModel<Comment>) => MutableModel<Comment> | void): Comment;
}

type EagerRepost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Repost, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly body?: string | null;
  readonly originalPost?: Post | null;
  readonly user?: User | null;
  readonly userRepostsId: string;
  readonly userOriginalPostId: string;
  readonly username: string;
  readonly comments?: (Comment | null)[] | null;
  readonly likedBy?: string[] | null;
  readonly likesCount: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly postRepostsId?: string | null;
}

type LazyRepost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Repost, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly body?: string | null;
  readonly originalPost: AsyncItem<Post | undefined>;
  readonly user: AsyncItem<User | undefined>;
  readonly userRepostsId: string;
  readonly userOriginalPostId: string;
  readonly username: string;
  readonly comments: AsyncCollection<Comment>;
  readonly likedBy?: string[] | null;
  readonly likesCount: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly postRepostsId?: string | null;
}

export declare type Repost = LazyLoading extends LazyLoadingDisabled ? EagerRepost : LazyRepost

export declare const Repost: (new (init: ModelInit<Repost>) => Repost) & {
  copyOf(source: Repost, mutator: (draft: MutableModel<Repost>) => MutableModel<Repost> | void): Repost;
}

type EagerSpotifyRecentlyPlayedTrack = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SpotifyRecentlyPlayedTrack, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user?: User | null;
  readonly userSpotifyRecentlyPlayedTrackId?: string | null;
  readonly spotifyId?: string | null;
  readonly trackId: string;
  readonly trackName: string;
  readonly artistName: string;
  readonly albumName?: string | null;
  readonly albumImageUrl?: string | null;
  readonly playedAt: string;
  readonly spotifyUri?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySpotifyRecentlyPlayedTrack = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SpotifyRecentlyPlayedTrack, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user: AsyncItem<User | undefined>;
  readonly userSpotifyRecentlyPlayedTrackId?: string | null;
  readonly spotifyId?: string | null;
  readonly trackId: string;
  readonly trackName: string;
  readonly artistName: string;
  readonly albumName?: string | null;
  readonly albumImageUrl?: string | null;
  readonly playedAt: string;
  readonly spotifyUri?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type SpotifyRecentlyPlayedTrack = LazyLoading extends LazyLoadingDisabled ? EagerSpotifyRecentlyPlayedTrack : LazySpotifyRecentlyPlayedTrack

export declare const SpotifyRecentlyPlayedTrack: (new (init: ModelInit<SpotifyRecentlyPlayedTrack>) => SpotifyRecentlyPlayedTrack) & {
  copyOf(source: SpotifyRecentlyPlayedTrack, mutator: (draft: MutableModel<SpotifyRecentlyPlayedTrack>) => MutableModel<SpotifyRecentlyPlayedTrack> | void): SpotifyRecentlyPlayedTrack;
}

type EagerSpotifyTokens = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SpotifyTokens, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user?: User | null;
  readonly userId: string;
  readonly spotifyUserId: string;
  readonly spotifyAccessToken: string;
  readonly spotifyRefreshToken: string;
  readonly tokenExpiration: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userSpotifyTokensId?: string | null;
}

type LazySpotifyTokens = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SpotifyTokens, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user: AsyncItem<User | undefined>;
  readonly userId: string;
  readonly spotifyUserId: string;
  readonly spotifyAccessToken: string;
  readonly spotifyRefreshToken: string;
  readonly tokenExpiration: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userSpotifyTokensId?: string | null;
}

export declare type SpotifyTokens = LazyLoading extends LazyLoadingDisabled ? EagerSpotifyTokens : LazySpotifyTokens

export declare const SpotifyTokens: (new (init: ModelInit<SpotifyTokens>) => SpotifyTokens) & {
  copyOf(source: SpotifyTokens, mutator: (draft: MutableModel<SpotifyTokens>) => MutableModel<SpotifyTokens> | void): SpotifyTokens;
}

type EagerUserDeviceToken = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserDeviceToken, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user?: User | null;
  readonly userId: string;
  readonly deviceTokens: (string | null)[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userUserDeviceTokensId?: string | null;
}

type LazyUserDeviceToken = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserDeviceToken, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user: AsyncItem<User | undefined>;
  readonly userId: string;
  readonly deviceTokens: (string | null)[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userUserDeviceTokensId?: string | null;
}

export declare type UserDeviceToken = LazyLoading extends LazyLoadingDisabled ? EagerUserDeviceToken : LazyUserDeviceToken

export declare const UserDeviceToken: (new (init: ModelInit<UserDeviceToken>) => UserDeviceToken) & {
  copyOf(source: UserDeviceToken, mutator: (draft: MutableModel<UserDeviceToken>) => MutableModel<UserDeviceToken> | void): UserDeviceToken;
}

type EagerSeenPost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SeenPost, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly itemId: string;
  readonly userIds: string[];
  readonly itemType: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySeenPost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SeenPost, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly itemId: string;
  readonly userIds: string[];
  readonly itemType: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type SeenPost = LazyLoading extends LazyLoadingDisabled ? EagerSeenPost : LazySeenPost

export declare const SeenPost: (new (init: ModelInit<SeenPost>) => SeenPost) & {
  copyOf(source: SeenPost, mutator: (draft: MutableModel<SeenPost>) => MutableModel<SeenPost> | void): SeenPost;
}

type EagerNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly type: string;
  readonly userId: string;
  readonly actorId: string;
  readonly targetId?: string | null;
  readonly read: boolean;
  readonly message?: string | null;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

type LazyNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly type: string;
  readonly userId: string;
  readonly actorId: string;
  readonly targetId?: string | null;
  readonly read: boolean;
  readonly message?: string | null;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

export declare type Notification = LazyLoading extends LazyLoadingDisabled ? EagerNotification : LazyNotification

export declare const Notification: (new (init: ModelInit<Notification>) => Notification) & {
  copyOf(source: Notification, mutator: (draft: MutableModel<Notification>) => MutableModel<Notification> | void): Notification;
}

type EagerNotificationSettings = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<NotificationSettings, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly user?: User | null;
  readonly likeEnabled: boolean;
  readonly commentEnabled: boolean;
  readonly followRequestEnabled: boolean;
  readonly repostEnabled: boolean;
  readonly commentLikeEnabled: boolean;
  readonly approvalEnabled: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyNotificationSettings = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<NotificationSettings, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly user: AsyncItem<User | undefined>;
  readonly likeEnabled: boolean;
  readonly commentEnabled: boolean;
  readonly followRequestEnabled: boolean;
  readonly repostEnabled: boolean;
  readonly commentLikeEnabled: boolean;
  readonly approvalEnabled: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type NotificationSettings = LazyLoading extends LazyLoadingDisabled ? EagerNotificationSettings : LazyNotificationSettings

export declare const NotificationSettings: (new (init: ModelInit<NotificationSettings>) => NotificationSettings) & {
  copyOf(source: NotificationSettings, mutator: (draft: MutableModel<NotificationSettings>) => MutableModel<NotificationSettings> | void): NotificationSettings;
}