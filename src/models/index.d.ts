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
  readonly likes?: (Like | null)[] | null;
  readonly posts?: (Post | null)[] | null;
  readonly friends?: (Friendship | null)[] | null;
  readonly sentFriendRequests?: (FriendRequest | null)[] | null;
  readonly receivedFriendRequests?: (FriendRequest | null)[] | null;
  readonly comments?: (Comment | null)[] | null;
  readonly publicProfile: boolean;
  readonly reposts?: (Repost | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly likes: AsyncCollection<Like>;
  readonly posts: AsyncCollection<Post>;
  readonly friends: AsyncCollection<Friendship>;
  readonly sentFriendRequests: AsyncCollection<FriendRequest>;
  readonly receivedFriendRequests: AsyncCollection<FriendRequest>;
  readonly comments: AsyncCollection<Comment>;
  readonly publicProfile: boolean;
  readonly reposts: AsyncCollection<Repost>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
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
  readonly scTrackId?: string | null;
  readonly scTrackTitle?: string | null;
  readonly scTrackArtworkUrl?: string | null;
  readonly scTrackUserId?: string | null;
  readonly scTrackUsername?: string | null;
  readonly scTrackLikes?: number | null;
  readonly scTrackGenre?: string | null;
  readonly scTrackPermalinkUrl?: string | null;
  readonly scTrackWaveformUrl?: string | null;
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
  readonly scTrackId?: string | null;
  readonly scTrackTitle?: string | null;
  readonly scTrackArtworkUrl?: string | null;
  readonly scTrackUserId?: string | null;
  readonly scTrackUsername?: string | null;
  readonly scTrackLikes?: number | null;
  readonly scTrackGenre?: string | null;
  readonly scTrackPermalinkUrl?: string | null;
  readonly scTrackWaveformUrl?: string | null;
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
  readonly postId: string;
  readonly content: string;
  readonly likedBy?: string[] | null;
  readonly likesCount: number;
  readonly user?: User | null;
  readonly userPostsId: string;
  readonly username: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userCommentsId?: string | null;
  readonly postCommentsId?: string | null;
}

type LazyComment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Comment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly post: AsyncItem<Post | undefined>;
  readonly postId: string;
  readonly content: string;
  readonly likedBy?: string[] | null;
  readonly likesCount: number;
  readonly user: AsyncItem<User | undefined>;
  readonly userPostsId: string;
  readonly username: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userCommentsId?: string | null;
  readonly postCommentsId?: string | null;
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
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly postRepostsId?: string | null;
}

export declare type Repost = LazyLoading extends LazyLoadingDisabled ? EagerRepost : LazyRepost

export declare const Repost: (new (init: ModelInit<Repost>) => Repost) & {
  copyOf(source: Repost, mutator: (draft: MutableModel<Repost>) => MutableModel<Repost> | void): Repost;
}

type EagerLike = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Like, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user?: User | null;
  readonly postId: string;
  readonly userLikesId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLike = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Like, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly user: AsyncItem<User | undefined>;
  readonly postId: string;
  readonly userLikesId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Like = LazyLoading extends LazyLoadingDisabled ? EagerLike : LazyLike

export declare const Like: (new (init: ModelInit<Like>) => Like) & {
  copyOf(source: Like, mutator: (draft: MutableModel<Like>) => MutableModel<Like> | void): Like;
}