/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  username: string,
  email: string,
  _version?: number | null,
};

export type ModelUserConditionInput = {
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type User = {
  __typename: "User",
  id: string,
  username: string,
  email: string,
  likes?: ModelLikeConnection | null,
  posts?: ModelPostConnection | null,
  friends?: ModelFriendshipConnection | null,
  sentFriendRequests?: ModelFriendRequestConnection | null,
  receivedFriendRequests?: ModelFriendRequestConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelLikeConnection = {
  __typename: "ModelLikeConnection",
  items:  Array<Like | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type Like = {
  __typename: "Like",
  id: string,
  post?: Post | null,
  user?: User | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  userLikesId?: string | null,
  postLikesId?: string | null,
  commentLikesId?: string | null,
};

export type Post = {
  __typename: "Post",
  id: string,
  body?: string | null,
  likes?: ModelLikeConnection | null,
  comments?: ModelCommentConnection | null,
  user?: User | null,
  userPostsId: string,
  spotifyAlbumId?: string | null,
  spotifyAlbumName?: string | null,
  spotifyAlbumType?: string | null,
  spotifyAlbumImageUrl?: string | null,
  spotifyAlbumReleaseDate?: string | null,
  spotifyAlbumArtists?: string | null,
  spotifyAlbumTotalTracks?: string | null,
  spotifyAlbumExternalUrl?: string | null,
  spotifyTrackId?: string | null,
  spotifyTrackName?: string | null,
  spotifyTrackAlbumName?: string | null,
  spotifyTrackImageUrl?: string | null,
  spotifyTrackArtists?: string | null,
  spotifyTrackPreviewUrl?: string | null,
  spotifyTrackExternalUrl?: string | null,
  scTrackId?: string | null,
  scTrackTitle?: string | null,
  scTrackArtworkUrl?: string | null,
  scTrackUserId?: string | null,
  scTrackUsername?: string | null,
  scTrackLikes?: number | null,
  scTrackGenre?: string | null,
  scTrackPermalinkUrl?: string | null,
  scTrackWaveformUrl?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelCommentConnection = {
  __typename: "ModelCommentConnection",
  items:  Array<Comment | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type Comment = {
  __typename: "Comment",
  id: string,
  post?: Post | null,
  content: string,
  likes?: ModelLikeConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  postCommentsId?: string | null,
};

export type ModelPostConnection = {
  __typename: "ModelPostConnection",
  items:  Array<Post | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelFriendshipConnection = {
  __typename: "ModelFriendshipConnection",
  items:  Array<Friendship | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type Friendship = {
  __typename: "Friendship",
  id: string,
  user?: User | null,
  friend?: User | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  userFriendsId?: string | null,
};

export type ModelFriendRequestConnection = {
  __typename: "ModelFriendRequestConnection",
  items:  Array<FriendRequest | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type FriendRequest = {
  __typename: "FriendRequest",
  id: string,
  sender: User,
  recipient: User,
  status: string,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  userSentFriendRequestsId?: string | null,
  userReceivedFriendRequestsId?: string | null,
};

export type UpdateUserInput = {
  id: string,
  username?: string | null,
  email?: string | null,
  _version?: number | null,
};

export type DeleteUserInput = {
  id: string,
  _version?: number | null,
};

export type CreateFriendshipInput = {
  id?: string | null,
  _version?: number | null,
  userFriendsId?: string | null,
};

export type ModelFriendshipConditionInput = {
  and?: Array< ModelFriendshipConditionInput | null > | null,
  or?: Array< ModelFriendshipConditionInput | null > | null,
  not?: ModelFriendshipConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userFriendsId?: ModelIDInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateFriendshipInput = {
  id: string,
  _version?: number | null,
  userFriendsId?: string | null,
};

export type DeleteFriendshipInput = {
  id: string,
  _version?: number | null,
};

export type CreateFriendRequestInput = {
  id?: string | null,
  status: string,
  _version?: number | null,
  userSentFriendRequestsId?: string | null,
  userReceivedFriendRequestsId?: string | null,
};

export type ModelFriendRequestConditionInput = {
  status?: ModelStringInput | null,
  and?: Array< ModelFriendRequestConditionInput | null > | null,
  or?: Array< ModelFriendRequestConditionInput | null > | null,
  not?: ModelFriendRequestConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userSentFriendRequestsId?: ModelIDInput | null,
  userReceivedFriendRequestsId?: ModelIDInput | null,
};

export type UpdateFriendRequestInput = {
  id: string,
  status?: string | null,
  _version?: number | null,
  userSentFriendRequestsId?: string | null,
  userReceivedFriendRequestsId?: string | null,
};

export type DeleteFriendRequestInput = {
  id: string,
  _version?: number | null,
};

export type CreatePostInput = {
  id?: string | null,
  body?: string | null,
  userPostsId: string,
  spotifyAlbumId?: string | null,
  spotifyAlbumName?: string | null,
  spotifyAlbumType?: string | null,
  spotifyAlbumImageUrl?: string | null,
  spotifyAlbumReleaseDate?: string | null,
  spotifyAlbumArtists?: string | null,
  spotifyAlbumTotalTracks?: string | null,
  spotifyAlbumExternalUrl?: string | null,
  spotifyTrackId?: string | null,
  spotifyTrackName?: string | null,
  spotifyTrackAlbumName?: string | null,
  spotifyTrackImageUrl?: string | null,
  spotifyTrackArtists?: string | null,
  spotifyTrackPreviewUrl?: string | null,
  spotifyTrackExternalUrl?: string | null,
  scTrackId?: string | null,
  scTrackTitle?: string | null,
  scTrackArtworkUrl?: string | null,
  scTrackUserId?: string | null,
  scTrackUsername?: string | null,
  scTrackLikes?: number | null,
  scTrackGenre?: string | null,
  scTrackPermalinkUrl?: string | null,
  scTrackWaveformUrl?: string | null,
  _version?: number | null,
};

export type ModelPostConditionInput = {
  body?: ModelStringInput | null,
  userPostsId?: ModelStringInput | null,
  spotifyAlbumId?: ModelIDInput | null,
  spotifyAlbumName?: ModelStringInput | null,
  spotifyAlbumType?: ModelStringInput | null,
  spotifyAlbumImageUrl?: ModelStringInput | null,
  spotifyAlbumReleaseDate?: ModelStringInput | null,
  spotifyAlbumArtists?: ModelStringInput | null,
  spotifyAlbumTotalTracks?: ModelStringInput | null,
  spotifyAlbumExternalUrl?: ModelStringInput | null,
  spotifyTrackId?: ModelIDInput | null,
  spotifyTrackName?: ModelStringInput | null,
  spotifyTrackAlbumName?: ModelStringInput | null,
  spotifyTrackImageUrl?: ModelStringInput | null,
  spotifyTrackArtists?: ModelStringInput | null,
  spotifyTrackPreviewUrl?: ModelStringInput | null,
  spotifyTrackExternalUrl?: ModelStringInput | null,
  scTrackId?: ModelIDInput | null,
  scTrackTitle?: ModelStringInput | null,
  scTrackArtworkUrl?: ModelStringInput | null,
  scTrackUserId?: ModelIDInput | null,
  scTrackUsername?: ModelStringInput | null,
  scTrackLikes?: ModelIntInput | null,
  scTrackGenre?: ModelStringInput | null,
  scTrackPermalinkUrl?: ModelStringInput | null,
  scTrackWaveformUrl?: ModelStringInput | null,
  and?: Array< ModelPostConditionInput | null > | null,
  or?: Array< ModelPostConditionInput | null > | null,
  not?: ModelPostConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdatePostInput = {
  id: string,
  body?: string | null,
  userPostsId?: string | null,
  spotifyAlbumId?: string | null,
  spotifyAlbumName?: string | null,
  spotifyAlbumType?: string | null,
  spotifyAlbumImageUrl?: string | null,
  spotifyAlbumReleaseDate?: string | null,
  spotifyAlbumArtists?: string | null,
  spotifyAlbumTotalTracks?: string | null,
  spotifyAlbumExternalUrl?: string | null,
  spotifyTrackId?: string | null,
  spotifyTrackName?: string | null,
  spotifyTrackAlbumName?: string | null,
  spotifyTrackImageUrl?: string | null,
  spotifyTrackArtists?: string | null,
  spotifyTrackPreviewUrl?: string | null,
  spotifyTrackExternalUrl?: string | null,
  scTrackId?: string | null,
  scTrackTitle?: string | null,
  scTrackArtworkUrl?: string | null,
  scTrackUserId?: string | null,
  scTrackUsername?: string | null,
  scTrackLikes?: number | null,
  scTrackGenre?: string | null,
  scTrackPermalinkUrl?: string | null,
  scTrackWaveformUrl?: string | null,
  _version?: number | null,
};

export type DeletePostInput = {
  id: string,
  _version?: number | null,
};

export type CreateCommentInput = {
  id?: string | null,
  content: string,
  _version?: number | null,
  postCommentsId?: string | null,
};

export type ModelCommentConditionInput = {
  content?: ModelStringInput | null,
  and?: Array< ModelCommentConditionInput | null > | null,
  or?: Array< ModelCommentConditionInput | null > | null,
  not?: ModelCommentConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  postCommentsId?: ModelIDInput | null,
};

export type UpdateCommentInput = {
  id: string,
  content?: string | null,
  _version?: number | null,
  postCommentsId?: string | null,
};

export type DeleteCommentInput = {
  id: string,
  _version?: number | null,
};

export type CreateLikeInput = {
  id?: string | null,
  _version?: number | null,
  userLikesId?: string | null,
  postLikesId?: string | null,
  commentLikesId?: string | null,
};

export type ModelLikeConditionInput = {
  and?: Array< ModelLikeConditionInput | null > | null,
  or?: Array< ModelLikeConditionInput | null > | null,
  not?: ModelLikeConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userLikesId?: ModelIDInput | null,
  postLikesId?: ModelIDInput | null,
  commentLikesId?: ModelIDInput | null,
};

export type UpdateLikeInput = {
  id: string,
  _version?: number | null,
  userLikesId?: string | null,
  postLikesId?: string | null,
  commentLikesId?: string | null,
};

export type DeleteLikeInput = {
  id: string,
  _version?: number | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelFriendshipFilterInput = {
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFriendshipFilterInput | null > | null,
  or?: Array< ModelFriendshipFilterInput | null > | null,
  not?: ModelFriendshipFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  userFriendsId?: ModelIDInput | null,
};

export type ModelFriendRequestFilterInput = {
  id?: ModelIDInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFriendRequestFilterInput | null > | null,
  or?: Array< ModelFriendRequestFilterInput | null > | null,
  not?: ModelFriendRequestFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  userSentFriendRequestsId?: ModelIDInput | null,
  userReceivedFriendRequestsId?: ModelIDInput | null,
};

export type ModelPostFilterInput = {
  id?: ModelIDInput | null,
  body?: ModelStringInput | null,
  userPostsId?: ModelStringInput | null,
  spotifyAlbumId?: ModelIDInput | null,
  spotifyAlbumName?: ModelStringInput | null,
  spotifyAlbumType?: ModelStringInput | null,
  spotifyAlbumImageUrl?: ModelStringInput | null,
  spotifyAlbumReleaseDate?: ModelStringInput | null,
  spotifyAlbumArtists?: ModelStringInput | null,
  spotifyAlbumTotalTracks?: ModelStringInput | null,
  spotifyAlbumExternalUrl?: ModelStringInput | null,
  spotifyTrackId?: ModelIDInput | null,
  spotifyTrackName?: ModelStringInput | null,
  spotifyTrackAlbumName?: ModelStringInput | null,
  spotifyTrackImageUrl?: ModelStringInput | null,
  spotifyTrackArtists?: ModelStringInput | null,
  spotifyTrackPreviewUrl?: ModelStringInput | null,
  spotifyTrackExternalUrl?: ModelStringInput | null,
  scTrackId?: ModelIDInput | null,
  scTrackTitle?: ModelStringInput | null,
  scTrackArtworkUrl?: ModelStringInput | null,
  scTrackUserId?: ModelIDInput | null,
  scTrackUsername?: ModelStringInput | null,
  scTrackLikes?: ModelIntInput | null,
  scTrackGenre?: ModelStringInput | null,
  scTrackPermalinkUrl?: ModelStringInput | null,
  scTrackWaveformUrl?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPostFilterInput | null > | null,
  or?: Array< ModelPostFilterInput | null > | null,
  not?: ModelPostFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelCommentFilterInput = {
  id?: ModelIDInput | null,
  content?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelCommentFilterInput | null > | null,
  or?: Array< ModelCommentFilterInput | null > | null,
  not?: ModelCommentFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  postCommentsId?: ModelIDInput | null,
};

export type ModelLikeFilterInput = {
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelLikeFilterInput | null > | null,
  or?: Array< ModelLikeFilterInput | null > | null,
  not?: ModelLikeFilterInput | null,
  _deleted?: ModelBooleanInput | null,
  userLikesId?: ModelIDInput | null,
  postLikesId?: ModelIDInput | null,
  commentLikesId?: ModelIDInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  username?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  userLikesId?: ModelSubscriptionIDInput | null,
  userPostsId?: ModelSubscriptionIDInput | null,
  userFriendsId?: ModelSubscriptionIDInput | null,
  userSentFriendRequestsId?: ModelSubscriptionIDInput | null,
  userReceivedFriendRequestsId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFriendshipFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFriendshipFilterInput | null > | null,
  or?: Array< ModelSubscriptionFriendshipFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionFriendRequestFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  status?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFriendRequestFilterInput | null > | null,
  or?: Array< ModelSubscriptionFriendRequestFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionPostFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  body?: ModelSubscriptionStringInput | null,
  userPostsId?: ModelSubscriptionStringInput | null,
  spotifyAlbumId?: ModelSubscriptionIDInput | null,
  spotifyAlbumName?: ModelSubscriptionStringInput | null,
  spotifyAlbumType?: ModelSubscriptionStringInput | null,
  spotifyAlbumImageUrl?: ModelSubscriptionStringInput | null,
  spotifyAlbumReleaseDate?: ModelSubscriptionStringInput | null,
  spotifyAlbumArtists?: ModelSubscriptionStringInput | null,
  spotifyAlbumTotalTracks?: ModelSubscriptionStringInput | null,
  spotifyAlbumExternalUrl?: ModelSubscriptionStringInput | null,
  spotifyTrackId?: ModelSubscriptionIDInput | null,
  spotifyTrackName?: ModelSubscriptionStringInput | null,
  spotifyTrackAlbumName?: ModelSubscriptionStringInput | null,
  spotifyTrackImageUrl?: ModelSubscriptionStringInput | null,
  spotifyTrackArtists?: ModelSubscriptionStringInput | null,
  spotifyTrackPreviewUrl?: ModelSubscriptionStringInput | null,
  spotifyTrackExternalUrl?: ModelSubscriptionStringInput | null,
  scTrackId?: ModelSubscriptionIDInput | null,
  scTrackTitle?: ModelSubscriptionStringInput | null,
  scTrackArtworkUrl?: ModelSubscriptionStringInput | null,
  scTrackUserId?: ModelSubscriptionIDInput | null,
  scTrackUsername?: ModelSubscriptionStringInput | null,
  scTrackLikes?: ModelSubscriptionIntInput | null,
  scTrackGenre?: ModelSubscriptionStringInput | null,
  scTrackPermalinkUrl?: ModelSubscriptionStringInput | null,
  scTrackWaveformUrl?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPostFilterInput | null > | null,
  or?: Array< ModelSubscriptionPostFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  postLikesId?: ModelSubscriptionIDInput | null,
  postCommentsId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionCommentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  content?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCommentFilterInput | null > | null,
  or?: Array< ModelSubscriptionCommentFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
  commentLikesId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionLikeFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLikeFilterInput | null > | null,
  or?: Array< ModelSubscriptionLikeFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    friends?:  {
      __typename: "ModelFriendshipConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    sentFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    receivedFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    friends?:  {
      __typename: "ModelFriendshipConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    sentFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    receivedFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    friends?:  {
      __typename: "ModelFriendshipConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    sentFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    receivedFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateFriendshipMutationVariables = {
  input: CreateFriendshipInput,
  condition?: ModelFriendshipConditionInput | null,
};

export type CreateFriendshipMutation = {
  createFriendship?:  {
    __typename: "Friendship",
    id: string,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    friend?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userFriendsId?: string | null,
  } | null,
};

export type UpdateFriendshipMutationVariables = {
  input: UpdateFriendshipInput,
  condition?: ModelFriendshipConditionInput | null,
};

export type UpdateFriendshipMutation = {
  updateFriendship?:  {
    __typename: "Friendship",
    id: string,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    friend?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userFriendsId?: string | null,
  } | null,
};

export type DeleteFriendshipMutationVariables = {
  input: DeleteFriendshipInput,
  condition?: ModelFriendshipConditionInput | null,
};

export type DeleteFriendshipMutation = {
  deleteFriendship?:  {
    __typename: "Friendship",
    id: string,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    friend?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userFriendsId?: string | null,
  } | null,
};

export type CreateFriendRequestMutationVariables = {
  input: CreateFriendRequestInput,
  condition?: ModelFriendRequestConditionInput | null,
};

export type CreateFriendRequestMutation = {
  createFriendRequest?:  {
    __typename: "FriendRequest",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    recipient:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    status: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userSentFriendRequestsId?: string | null,
    userReceivedFriendRequestsId?: string | null,
  } | null,
};

export type UpdateFriendRequestMutationVariables = {
  input: UpdateFriendRequestInput,
  condition?: ModelFriendRequestConditionInput | null,
};

export type UpdateFriendRequestMutation = {
  updateFriendRequest?:  {
    __typename: "FriendRequest",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    recipient:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    status: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userSentFriendRequestsId?: string | null,
    userReceivedFriendRequestsId?: string | null,
  } | null,
};

export type DeleteFriendRequestMutationVariables = {
  input: DeleteFriendRequestInput,
  condition?: ModelFriendRequestConditionInput | null,
};

export type DeleteFriendRequestMutation = {
  deleteFriendRequest?:  {
    __typename: "FriendRequest",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    recipient:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    status: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userSentFriendRequestsId?: string | null,
    userReceivedFriendRequestsId?: string | null,
  } | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type CreatePostMutation = {
  createPost?:  {
    __typename: "Post",
    id: string,
    body?: string | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    userPostsId: string,
    spotifyAlbumId?: string | null,
    spotifyAlbumName?: string | null,
    spotifyAlbumType?: string | null,
    spotifyAlbumImageUrl?: string | null,
    spotifyAlbumReleaseDate?: string | null,
    spotifyAlbumArtists?: string | null,
    spotifyAlbumTotalTracks?: string | null,
    spotifyAlbumExternalUrl?: string | null,
    spotifyTrackId?: string | null,
    spotifyTrackName?: string | null,
    spotifyTrackAlbumName?: string | null,
    spotifyTrackImageUrl?: string | null,
    spotifyTrackArtists?: string | null,
    spotifyTrackPreviewUrl?: string | null,
    spotifyTrackExternalUrl?: string | null,
    scTrackId?: string | null,
    scTrackTitle?: string | null,
    scTrackArtworkUrl?: string | null,
    scTrackUserId?: string | null,
    scTrackUsername?: string | null,
    scTrackLikes?: number | null,
    scTrackGenre?: string | null,
    scTrackPermalinkUrl?: string | null,
    scTrackWaveformUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdatePostMutationVariables = {
  input: UpdatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type UpdatePostMutation = {
  updatePost?:  {
    __typename: "Post",
    id: string,
    body?: string | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    userPostsId: string,
    spotifyAlbumId?: string | null,
    spotifyAlbumName?: string | null,
    spotifyAlbumType?: string | null,
    spotifyAlbumImageUrl?: string | null,
    spotifyAlbumReleaseDate?: string | null,
    spotifyAlbumArtists?: string | null,
    spotifyAlbumTotalTracks?: string | null,
    spotifyAlbumExternalUrl?: string | null,
    spotifyTrackId?: string | null,
    spotifyTrackName?: string | null,
    spotifyTrackAlbumName?: string | null,
    spotifyTrackImageUrl?: string | null,
    spotifyTrackArtists?: string | null,
    spotifyTrackPreviewUrl?: string | null,
    spotifyTrackExternalUrl?: string | null,
    scTrackId?: string | null,
    scTrackTitle?: string | null,
    scTrackArtworkUrl?: string | null,
    scTrackUserId?: string | null,
    scTrackUsername?: string | null,
    scTrackLikes?: number | null,
    scTrackGenre?: string | null,
    scTrackPermalinkUrl?: string | null,
    scTrackWaveformUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeletePostMutationVariables = {
  input: DeletePostInput,
  condition?: ModelPostConditionInput | null,
};

export type DeletePostMutation = {
  deletePost?:  {
    __typename: "Post",
    id: string,
    body?: string | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    userPostsId: string,
    spotifyAlbumId?: string | null,
    spotifyAlbumName?: string | null,
    spotifyAlbumType?: string | null,
    spotifyAlbumImageUrl?: string | null,
    spotifyAlbumReleaseDate?: string | null,
    spotifyAlbumArtists?: string | null,
    spotifyAlbumTotalTracks?: string | null,
    spotifyAlbumExternalUrl?: string | null,
    spotifyTrackId?: string | null,
    spotifyTrackName?: string | null,
    spotifyTrackAlbumName?: string | null,
    spotifyTrackImageUrl?: string | null,
    spotifyTrackArtists?: string | null,
    spotifyTrackPreviewUrl?: string | null,
    spotifyTrackExternalUrl?: string | null,
    scTrackId?: string | null,
    scTrackTitle?: string | null,
    scTrackArtworkUrl?: string | null,
    scTrackUserId?: string | null,
    scTrackUsername?: string | null,
    scTrackLikes?: number | null,
    scTrackGenre?: string | null,
    scTrackPermalinkUrl?: string | null,
    scTrackWaveformUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateCommentMutationVariables = {
  input: CreateCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type CreateCommentMutation = {
  createComment?:  {
    __typename: "Comment",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    content: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsId?: string | null,
  } | null,
};

export type UpdateCommentMutationVariables = {
  input: UpdateCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type UpdateCommentMutation = {
  updateComment?:  {
    __typename: "Comment",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    content: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsId?: string | null,
  } | null,
};

export type DeleteCommentMutationVariables = {
  input: DeleteCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type DeleteCommentMutation = {
  deleteComment?:  {
    __typename: "Comment",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    content: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsId?: string | null,
  } | null,
};

export type CreateLikeMutationVariables = {
  input: CreateLikeInput,
  condition?: ModelLikeConditionInput | null,
};

export type CreateLikeMutation = {
  createLike?:  {
    __typename: "Like",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userLikesId?: string | null,
    postLikesId?: string | null,
    commentLikesId?: string | null,
  } | null,
};

export type UpdateLikeMutationVariables = {
  input: UpdateLikeInput,
  condition?: ModelLikeConditionInput | null,
};

export type UpdateLikeMutation = {
  updateLike?:  {
    __typename: "Like",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userLikesId?: string | null,
    postLikesId?: string | null,
    commentLikesId?: string | null,
  } | null,
};

export type DeleteLikeMutationVariables = {
  input: DeleteLikeInput,
  condition?: ModelLikeConditionInput | null,
};

export type DeleteLikeMutation = {
  deleteLike?:  {
    __typename: "Like",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userLikesId?: string | null,
    postLikesId?: string | null,
    commentLikesId?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    friends?:  {
      __typename: "ModelFriendshipConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    sentFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    receivedFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUsersQuery = {
  syncUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetFriendshipQueryVariables = {
  id: string,
};

export type GetFriendshipQuery = {
  getFriendship?:  {
    __typename: "Friendship",
    id: string,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    friend?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userFriendsId?: string | null,
  } | null,
};

export type ListFriendshipsQueryVariables = {
  filter?: ModelFriendshipFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFriendshipsQuery = {
  listFriendships?:  {
    __typename: "ModelFriendshipConnection",
    items:  Array< {
      __typename: "Friendship",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userFriendsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncFriendshipsQueryVariables = {
  filter?: ModelFriendshipFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncFriendshipsQuery = {
  syncFriendships?:  {
    __typename: "ModelFriendshipConnection",
    items:  Array< {
      __typename: "Friendship",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userFriendsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetFriendRequestQueryVariables = {
  id: string,
};

export type GetFriendRequestQuery = {
  getFriendRequest?:  {
    __typename: "FriendRequest",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    recipient:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    status: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userSentFriendRequestsId?: string | null,
    userReceivedFriendRequestsId?: string | null,
  } | null,
};

export type ListFriendRequestsQueryVariables = {
  filter?: ModelFriendRequestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFriendRequestsQuery = {
  listFriendRequests?:  {
    __typename: "ModelFriendRequestConnection",
    items:  Array< {
      __typename: "FriendRequest",
      id: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userSentFriendRequestsId?: string | null,
      userReceivedFriendRequestsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncFriendRequestsQueryVariables = {
  filter?: ModelFriendRequestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncFriendRequestsQuery = {
  syncFriendRequests?:  {
    __typename: "ModelFriendRequestConnection",
    items:  Array< {
      __typename: "FriendRequest",
      id: string,
      status: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userSentFriendRequestsId?: string | null,
      userReceivedFriendRequestsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetPostQueryVariables = {
  id: string,
};

export type GetPostQuery = {
  getPost?:  {
    __typename: "Post",
    id: string,
    body?: string | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    userPostsId: string,
    spotifyAlbumId?: string | null,
    spotifyAlbumName?: string | null,
    spotifyAlbumType?: string | null,
    spotifyAlbumImageUrl?: string | null,
    spotifyAlbumReleaseDate?: string | null,
    spotifyAlbumArtists?: string | null,
    spotifyAlbumTotalTracks?: string | null,
    spotifyAlbumExternalUrl?: string | null,
    spotifyTrackId?: string | null,
    spotifyTrackName?: string | null,
    spotifyTrackAlbumName?: string | null,
    spotifyTrackImageUrl?: string | null,
    spotifyTrackArtists?: string | null,
    spotifyTrackPreviewUrl?: string | null,
    spotifyTrackExternalUrl?: string | null,
    scTrackId?: string | null,
    scTrackTitle?: string | null,
    scTrackArtworkUrl?: string | null,
    scTrackUserId?: string | null,
    scTrackUsername?: string | null,
    scTrackLikes?: number | null,
    scTrackGenre?: string | null,
    scTrackPermalinkUrl?: string | null,
    scTrackWaveformUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsQuery = {
  listPosts?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncPostsQuery = {
  syncPosts?:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetCommentQueryVariables = {
  id: string,
};

export type GetCommentQuery = {
  getComment?:  {
    __typename: "Comment",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    content: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsId?: string | null,
  } | null,
};

export type ListCommentsQueryVariables = {
  filter?: ModelCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCommentsQuery = {
  listComments?:  {
    __typename: "ModelCommentConnection",
    items:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postCommentsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncCommentsQueryVariables = {
  filter?: ModelCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncCommentsQuery = {
  syncComments?:  {
    __typename: "ModelCommentConnection",
    items:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      postCommentsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetLikeQueryVariables = {
  id: string,
};

export type GetLikeQuery = {
  getLike?:  {
    __typename: "Like",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userLikesId?: string | null,
    postLikesId?: string | null,
    commentLikesId?: string | null,
  } | null,
};

export type ListLikesQueryVariables = {
  filter?: ModelLikeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLikesQuery = {
  listLikes?:  {
    __typename: "ModelLikeConnection",
    items:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userLikesId?: string | null,
      postLikesId?: string | null,
      commentLikesId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncLikesQueryVariables = {
  filter?: ModelLikeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncLikesQuery = {
  syncLikes?:  {
    __typename: "ModelLikeConnection",
    items:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userLikesId?: string | null,
      postLikesId?: string | null,
      commentLikesId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    friends?:  {
      __typename: "ModelFriendshipConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    sentFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    receivedFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    friends?:  {
      __typename: "ModelFriendshipConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    sentFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    receivedFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    username: string,
    email: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    posts?:  {
      __typename: "ModelPostConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    friends?:  {
      __typename: "ModelFriendshipConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    sentFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    receivedFriendRequests?:  {
      __typename: "ModelFriendRequestConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateFriendshipSubscriptionVariables = {
  filter?: ModelSubscriptionFriendshipFilterInput | null,
};

export type OnCreateFriendshipSubscription = {
  onCreateFriendship?:  {
    __typename: "Friendship",
    id: string,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    friend?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userFriendsId?: string | null,
  } | null,
};

export type OnUpdateFriendshipSubscriptionVariables = {
  filter?: ModelSubscriptionFriendshipFilterInput | null,
};

export type OnUpdateFriendshipSubscription = {
  onUpdateFriendship?:  {
    __typename: "Friendship",
    id: string,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    friend?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userFriendsId?: string | null,
  } | null,
};

export type OnDeleteFriendshipSubscriptionVariables = {
  filter?: ModelSubscriptionFriendshipFilterInput | null,
};

export type OnDeleteFriendshipSubscription = {
  onDeleteFriendship?:  {
    __typename: "Friendship",
    id: string,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    friend?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userFriendsId?: string | null,
  } | null,
};

export type OnCreateFriendRequestSubscriptionVariables = {
  filter?: ModelSubscriptionFriendRequestFilterInput | null,
};

export type OnCreateFriendRequestSubscription = {
  onCreateFriendRequest?:  {
    __typename: "FriendRequest",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    recipient:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    status: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userSentFriendRequestsId?: string | null,
    userReceivedFriendRequestsId?: string | null,
  } | null,
};

export type OnUpdateFriendRequestSubscriptionVariables = {
  filter?: ModelSubscriptionFriendRequestFilterInput | null,
};

export type OnUpdateFriendRequestSubscription = {
  onUpdateFriendRequest?:  {
    __typename: "FriendRequest",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    recipient:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    status: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userSentFriendRequestsId?: string | null,
    userReceivedFriendRequestsId?: string | null,
  } | null,
};

export type OnDeleteFriendRequestSubscriptionVariables = {
  filter?: ModelSubscriptionFriendRequestFilterInput | null,
};

export type OnDeleteFriendRequestSubscription = {
  onDeleteFriendRequest?:  {
    __typename: "FriendRequest",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    recipient:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    status: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userSentFriendRequestsId?: string | null,
    userReceivedFriendRequestsId?: string | null,
  } | null,
};

export type OnCreatePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
};

export type OnCreatePostSubscription = {
  onCreatePost?:  {
    __typename: "Post",
    id: string,
    body?: string | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    userPostsId: string,
    spotifyAlbumId?: string | null,
    spotifyAlbumName?: string | null,
    spotifyAlbumType?: string | null,
    spotifyAlbumImageUrl?: string | null,
    spotifyAlbumReleaseDate?: string | null,
    spotifyAlbumArtists?: string | null,
    spotifyAlbumTotalTracks?: string | null,
    spotifyAlbumExternalUrl?: string | null,
    spotifyTrackId?: string | null,
    spotifyTrackName?: string | null,
    spotifyTrackAlbumName?: string | null,
    spotifyTrackImageUrl?: string | null,
    spotifyTrackArtists?: string | null,
    spotifyTrackPreviewUrl?: string | null,
    spotifyTrackExternalUrl?: string | null,
    scTrackId?: string | null,
    scTrackTitle?: string | null,
    scTrackArtworkUrl?: string | null,
    scTrackUserId?: string | null,
    scTrackUsername?: string | null,
    scTrackLikes?: number | null,
    scTrackGenre?: string | null,
    scTrackPermalinkUrl?: string | null,
    scTrackWaveformUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdatePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
};

export type OnUpdatePostSubscription = {
  onUpdatePost?:  {
    __typename: "Post",
    id: string,
    body?: string | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    userPostsId: string,
    spotifyAlbumId?: string | null,
    spotifyAlbumName?: string | null,
    spotifyAlbumType?: string | null,
    spotifyAlbumImageUrl?: string | null,
    spotifyAlbumReleaseDate?: string | null,
    spotifyAlbumArtists?: string | null,
    spotifyAlbumTotalTracks?: string | null,
    spotifyAlbumExternalUrl?: string | null,
    spotifyTrackId?: string | null,
    spotifyTrackName?: string | null,
    spotifyTrackAlbumName?: string | null,
    spotifyTrackImageUrl?: string | null,
    spotifyTrackArtists?: string | null,
    spotifyTrackPreviewUrl?: string | null,
    spotifyTrackExternalUrl?: string | null,
    scTrackId?: string | null,
    scTrackTitle?: string | null,
    scTrackArtworkUrl?: string | null,
    scTrackUserId?: string | null,
    scTrackUsername?: string | null,
    scTrackLikes?: number | null,
    scTrackGenre?: string | null,
    scTrackPermalinkUrl?: string | null,
    scTrackWaveformUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeletePostSubscriptionVariables = {
  filter?: ModelSubscriptionPostFilterInput | null,
};

export type OnDeletePostSubscription = {
  onDeletePost?:  {
    __typename: "Post",
    id: string,
    body?: string | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    comments?:  {
      __typename: "ModelCommentConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    userPostsId: string,
    spotifyAlbumId?: string | null,
    spotifyAlbumName?: string | null,
    spotifyAlbumType?: string | null,
    spotifyAlbumImageUrl?: string | null,
    spotifyAlbumReleaseDate?: string | null,
    spotifyAlbumArtists?: string | null,
    spotifyAlbumTotalTracks?: string | null,
    spotifyAlbumExternalUrl?: string | null,
    spotifyTrackId?: string | null,
    spotifyTrackName?: string | null,
    spotifyTrackAlbumName?: string | null,
    spotifyTrackImageUrl?: string | null,
    spotifyTrackArtists?: string | null,
    spotifyTrackPreviewUrl?: string | null,
    spotifyTrackExternalUrl?: string | null,
    scTrackId?: string | null,
    scTrackTitle?: string | null,
    scTrackArtworkUrl?: string | null,
    scTrackUserId?: string | null,
    scTrackUsername?: string | null,
    scTrackLikes?: number | null,
    scTrackGenre?: string | null,
    scTrackPermalinkUrl?: string | null,
    scTrackWaveformUrl?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
};

export type OnCreateCommentSubscription = {
  onCreateComment?:  {
    __typename: "Comment",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    content: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsId?: string | null,
  } | null,
};

export type OnUpdateCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
};

export type OnUpdateCommentSubscription = {
  onUpdateComment?:  {
    __typename: "Comment",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    content: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsId?: string | null,
  } | null,
};

export type OnDeleteCommentSubscriptionVariables = {
  filter?: ModelSubscriptionCommentFilterInput | null,
};

export type OnDeleteCommentSubscription = {
  onDeleteComment?:  {
    __typename: "Comment",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    content: string,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    postCommentsId?: string | null,
  } | null,
};

export type OnCreateLikeSubscriptionVariables = {
  filter?: ModelSubscriptionLikeFilterInput | null,
};

export type OnCreateLikeSubscription = {
  onCreateLike?:  {
    __typename: "Like",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userLikesId?: string | null,
    postLikesId?: string | null,
    commentLikesId?: string | null,
  } | null,
};

export type OnUpdateLikeSubscriptionVariables = {
  filter?: ModelSubscriptionLikeFilterInput | null,
};

export type OnUpdateLikeSubscription = {
  onUpdateLike?:  {
    __typename: "Like",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userLikesId?: string | null,
    postLikesId?: string | null,
    commentLikesId?: string | null,
  } | null,
};

export type OnDeleteLikeSubscriptionVariables = {
  filter?: ModelSubscriptionLikeFilterInput | null,
};

export type OnDeleteLikeSubscription = {
  onDeleteLike?:  {
    __typename: "Like",
    id: string,
    post?:  {
      __typename: "Post",
      id: string,
      body?: string | null,
      userPostsId: string,
      spotifyAlbumId?: string | null,
      spotifyAlbumName?: string | null,
      spotifyAlbumType?: string | null,
      spotifyAlbumImageUrl?: string | null,
      spotifyAlbumReleaseDate?: string | null,
      spotifyAlbumArtists?: string | null,
      spotifyAlbumTotalTracks?: string | null,
      spotifyAlbumExternalUrl?: string | null,
      spotifyTrackId?: string | null,
      spotifyTrackName?: string | null,
      spotifyTrackAlbumName?: string | null,
      spotifyTrackImageUrl?: string | null,
      spotifyTrackArtists?: string | null,
      spotifyTrackPreviewUrl?: string | null,
      spotifyTrackExternalUrl?: string | null,
      scTrackId?: string | null,
      scTrackTitle?: string | null,
      scTrackArtworkUrl?: string | null,
      scTrackUserId?: string | null,
      scTrackUsername?: string | null,
      scTrackLikes?: number | null,
      scTrackGenre?: string | null,
      scTrackPermalinkUrl?: string | null,
      scTrackWaveformUrl?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      username: string,
      email: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userLikesId?: string | null,
    postLikesId?: string | null,
    commentLikesId?: string | null,
  } | null,
};
