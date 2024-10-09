/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
    id
    username
    email
    posts {
      nextToken
      startedAt
      __typename
    }
    friends {
      nextToken
      startedAt
      __typename
    }
    sentFriendRequests {
      nextToken
      startedAt
      __typename
    }
    receivedFriendRequests {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    publicProfile
    reposts {
      nextToken
      startedAt
      __typename
    }
    spotifyRecentlyPlayedTrack {
      nextToken
      startedAt
      __typename
    }
    recentlyPlayedDisabled
    spotifyTokens {
      nextToken
      startedAt
      __typename
    }
    spotifyUri
    spotifyImage
    soundCloudUri
    userDeviceTokens {
      nextToken
      startedAt
      __typename
    }
    notificationSettings {
      id
      userId
      likeEnabled
      commentEnabled
      followRequestEnabled
      repostEnabled
      commentLikeEnabled
      approvalEnabled
      inAppEnabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userNotificationSettingsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
    id
    username
    email
    posts {
      nextToken
      startedAt
      __typename
    }
    friends {
      nextToken
      startedAt
      __typename
    }
    sentFriendRequests {
      nextToken
      startedAt
      __typename
    }
    receivedFriendRequests {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    publicProfile
    reposts {
      nextToken
      startedAt
      __typename
    }
    spotifyRecentlyPlayedTrack {
      nextToken
      startedAt
      __typename
    }
    recentlyPlayedDisabled
    spotifyTokens {
      nextToken
      startedAt
      __typename
    }
    spotifyUri
    spotifyImage
    soundCloudUri
    userDeviceTokens {
      nextToken
      startedAt
      __typename
    }
    notificationSettings {
      id
      userId
      likeEnabled
      commentEnabled
      followRequestEnabled
      repostEnabled
      commentLikeEnabled
      approvalEnabled
      inAppEnabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userNotificationSettingsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
    id
    username
    email
    posts {
      nextToken
      startedAt
      __typename
    }
    friends {
      nextToken
      startedAt
      __typename
    }
    sentFriendRequests {
      nextToken
      startedAt
      __typename
    }
    receivedFriendRequests {
      nextToken
      startedAt
      __typename
    }
    comments {
      nextToken
      startedAt
      __typename
    }
    publicProfile
    reposts {
      nextToken
      startedAt
      __typename
    }
    spotifyRecentlyPlayedTrack {
      nextToken
      startedAt
      __typename
    }
    recentlyPlayedDisabled
    spotifyTokens {
      nextToken
      startedAt
      __typename
    }
    spotifyUri
    spotifyImage
    soundCloudUri
    userDeviceTokens {
      nextToken
      startedAt
      __typename
    }
    notificationSettings {
      id
      userId
      likeEnabled
      commentEnabled
      followRequestEnabled
      repostEnabled
      commentLikeEnabled
      approvalEnabled
      inAppEnabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userNotificationSettingsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createFriendship = /* GraphQL */ `mutation CreateFriendship(
  $input: CreateFriendshipInput!
  $condition: ModelFriendshipConditionInput
) {
  createFriendship(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    friend {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userFriendsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateFriendshipMutationVariables,
  APITypes.CreateFriendshipMutation
>;
export const updateFriendship = /* GraphQL */ `mutation UpdateFriendship(
  $input: UpdateFriendshipInput!
  $condition: ModelFriendshipConditionInput
) {
  updateFriendship(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    friend {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userFriendsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFriendshipMutationVariables,
  APITypes.UpdateFriendshipMutation
>;
export const deleteFriendship = /* GraphQL */ `mutation DeleteFriendship(
  $input: DeleteFriendshipInput!
  $condition: ModelFriendshipConditionInput
) {
  deleteFriendship(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    friend {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userFriendsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteFriendshipMutationVariables,
  APITypes.DeleteFriendshipMutation
>;
export const createFriendRequest = /* GraphQL */ `mutation CreateFriendRequest(
  $input: CreateFriendRequestInput!
  $condition: ModelFriendRequestConditionInput
) {
  createFriendRequest(input: $input, condition: $condition) {
    id
    sender {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    recipient {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    status
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userSentFriendRequestsId
    userReceivedFriendRequestsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateFriendRequestMutationVariables,
  APITypes.CreateFriendRequestMutation
>;
export const updateFriendRequest = /* GraphQL */ `mutation UpdateFriendRequest(
  $input: UpdateFriendRequestInput!
  $condition: ModelFriendRequestConditionInput
) {
  updateFriendRequest(input: $input, condition: $condition) {
    id
    sender {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    recipient {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    status
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userSentFriendRequestsId
    userReceivedFriendRequestsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFriendRequestMutationVariables,
  APITypes.UpdateFriendRequestMutation
>;
export const deleteFriendRequest = /* GraphQL */ `mutation DeleteFriendRequest(
  $input: DeleteFriendRequestInput!
  $condition: ModelFriendRequestConditionInput
) {
  deleteFriendRequest(input: $input, condition: $condition) {
    id
    sender {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    recipient {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    status
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userSentFriendRequestsId
    userReceivedFriendRequestsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteFriendRequestMutationVariables,
  APITypes.DeleteFriendRequestMutation
>;
export const createPost = /* GraphQL */ `mutation CreatePost(
  $input: CreatePostInput!
  $condition: ModelPostConditionInput
) {
  createPost(input: $input, condition: $condition) {
    id
    body
    comments {
      nextToken
      startedAt
      __typename
    }
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userPostsId
    username
    likedBy
    likesCount
    reposts {
      nextToken
      startedAt
      __typename
    }
    spotifyAlbumId
    spotifyAlbumName
    spotifyAlbumType
    spotifyAlbumImageUrl
    spotifyAlbumReleaseDate
    spotifyAlbumArtists
    spotifyAlbumTotalTracks
    spotifyAlbumExternalUrl
    spotifyTrackId
    spotifyTrackName
    spotifyTrackAlbumName
    spotifyTrackImageUrl
    spotifyTrackArtists
    spotifyTrackPreviewUrl
    spotifyTrackExternalUrl
    spotifyTrackReleaseDate
    spotifyTrackDurationMs
    spotifyTrackExplicit
    scTrackId
    scTrackTitle
    scTrackArtworkUrl
    scTrackUserId
    scTrackUsername
    scTrackLikes
    scTrackArtist
    scTrackGenre
    scTrackPermalinkUrl
    scTrackWaveformUrl
    scTrackCreatedAt
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePostMutationVariables,
  APITypes.CreatePostMutation
>;
export const updatePost = /* GraphQL */ `mutation UpdatePost(
  $input: UpdatePostInput!
  $condition: ModelPostConditionInput
) {
  updatePost(input: $input, condition: $condition) {
    id
    body
    comments {
      nextToken
      startedAt
      __typename
    }
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userPostsId
    username
    likedBy
    likesCount
    reposts {
      nextToken
      startedAt
      __typename
    }
    spotifyAlbumId
    spotifyAlbumName
    spotifyAlbumType
    spotifyAlbumImageUrl
    spotifyAlbumReleaseDate
    spotifyAlbumArtists
    spotifyAlbumTotalTracks
    spotifyAlbumExternalUrl
    spotifyTrackId
    spotifyTrackName
    spotifyTrackAlbumName
    spotifyTrackImageUrl
    spotifyTrackArtists
    spotifyTrackPreviewUrl
    spotifyTrackExternalUrl
    spotifyTrackReleaseDate
    spotifyTrackDurationMs
    spotifyTrackExplicit
    scTrackId
    scTrackTitle
    scTrackArtworkUrl
    scTrackUserId
    scTrackUsername
    scTrackLikes
    scTrackArtist
    scTrackGenre
    scTrackPermalinkUrl
    scTrackWaveformUrl
    scTrackCreatedAt
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePostMutationVariables,
  APITypes.UpdatePostMutation
>;
export const deletePost = /* GraphQL */ `mutation DeletePost(
  $input: DeletePostInput!
  $condition: ModelPostConditionInput
) {
  deletePost(input: $input, condition: $condition) {
    id
    body
    comments {
      nextToken
      startedAt
      __typename
    }
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userPostsId
    username
    likedBy
    likesCount
    reposts {
      nextToken
      startedAt
      __typename
    }
    spotifyAlbumId
    spotifyAlbumName
    spotifyAlbumType
    spotifyAlbumImageUrl
    spotifyAlbumReleaseDate
    spotifyAlbumArtists
    spotifyAlbumTotalTracks
    spotifyAlbumExternalUrl
    spotifyTrackId
    spotifyTrackName
    spotifyTrackAlbumName
    spotifyTrackImageUrl
    spotifyTrackArtists
    spotifyTrackPreviewUrl
    spotifyTrackExternalUrl
    spotifyTrackReleaseDate
    spotifyTrackDurationMs
    spotifyTrackExplicit
    scTrackId
    scTrackTitle
    scTrackArtworkUrl
    scTrackUserId
    scTrackUsername
    scTrackLikes
    scTrackArtist
    scTrackGenre
    scTrackPermalinkUrl
    scTrackWaveformUrl
    scTrackCreatedAt
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePostMutationVariables,
  APITypes.DeletePostMutation
>;
export const createComment = /* GraphQL */ `mutation CreateComment(
  $input: CreateCommentInput!
  $condition: ModelCommentConditionInput
) {
  createComment(input: $input, condition: $condition) {
    id
    post {
      id
      body
      userPostsId
      username
      likedBy
      likesCount
      spotifyAlbumId
      spotifyAlbumName
      spotifyAlbumType
      spotifyAlbumImageUrl
      spotifyAlbumReleaseDate
      spotifyAlbumArtists
      spotifyAlbumTotalTracks
      spotifyAlbumExternalUrl
      spotifyTrackId
      spotifyTrackName
      spotifyTrackAlbumName
      spotifyTrackImageUrl
      spotifyTrackArtists
      spotifyTrackPreviewUrl
      spotifyTrackExternalUrl
      spotifyTrackReleaseDate
      spotifyTrackDurationMs
      spotifyTrackExplicit
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackArtist
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
      scTrackCreatedAt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    postId
    repost {
      id
      body
      userRepostsId
      userOriginalPostId
      username
      likedBy
      likesCount
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postRepostsId
      __typename
    }
    repostId
    content
    likedBy
    likesCount
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userPostsId
    username
    parentComment {
      id
      postId
      repostId
      content
      likedBy
      likesCount
      userPostsId
      username
      parentCommentId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      postCommentsId
      commentRepliesId
      repostCommentsId
      __typename
    }
    parentCommentId
    replies {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    postCommentsId
    commentRepliesId
    repostCommentsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCommentMutationVariables,
  APITypes.CreateCommentMutation
>;
export const updateComment = /* GraphQL */ `mutation UpdateComment(
  $input: UpdateCommentInput!
  $condition: ModelCommentConditionInput
) {
  updateComment(input: $input, condition: $condition) {
    id
    post {
      id
      body
      userPostsId
      username
      likedBy
      likesCount
      spotifyAlbumId
      spotifyAlbumName
      spotifyAlbumType
      spotifyAlbumImageUrl
      spotifyAlbumReleaseDate
      spotifyAlbumArtists
      spotifyAlbumTotalTracks
      spotifyAlbumExternalUrl
      spotifyTrackId
      spotifyTrackName
      spotifyTrackAlbumName
      spotifyTrackImageUrl
      spotifyTrackArtists
      spotifyTrackPreviewUrl
      spotifyTrackExternalUrl
      spotifyTrackReleaseDate
      spotifyTrackDurationMs
      spotifyTrackExplicit
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackArtist
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
      scTrackCreatedAt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    postId
    repost {
      id
      body
      userRepostsId
      userOriginalPostId
      username
      likedBy
      likesCount
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postRepostsId
      __typename
    }
    repostId
    content
    likedBy
    likesCount
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userPostsId
    username
    parentComment {
      id
      postId
      repostId
      content
      likedBy
      likesCount
      userPostsId
      username
      parentCommentId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      postCommentsId
      commentRepliesId
      repostCommentsId
      __typename
    }
    parentCommentId
    replies {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    postCommentsId
    commentRepliesId
    repostCommentsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCommentMutationVariables,
  APITypes.UpdateCommentMutation
>;
export const deleteComment = /* GraphQL */ `mutation DeleteComment(
  $input: DeleteCommentInput!
  $condition: ModelCommentConditionInput
) {
  deleteComment(input: $input, condition: $condition) {
    id
    post {
      id
      body
      userPostsId
      username
      likedBy
      likesCount
      spotifyAlbumId
      spotifyAlbumName
      spotifyAlbumType
      spotifyAlbumImageUrl
      spotifyAlbumReleaseDate
      spotifyAlbumArtists
      spotifyAlbumTotalTracks
      spotifyAlbumExternalUrl
      spotifyTrackId
      spotifyTrackName
      spotifyTrackAlbumName
      spotifyTrackImageUrl
      spotifyTrackArtists
      spotifyTrackPreviewUrl
      spotifyTrackExternalUrl
      spotifyTrackReleaseDate
      spotifyTrackDurationMs
      spotifyTrackExplicit
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackArtist
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
      scTrackCreatedAt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    postId
    repost {
      id
      body
      userRepostsId
      userOriginalPostId
      username
      likedBy
      likesCount
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      postRepostsId
      __typename
    }
    repostId
    content
    likedBy
    likesCount
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userPostsId
    username
    parentComment {
      id
      postId
      repostId
      content
      likedBy
      likesCount
      userPostsId
      username
      parentCommentId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      postCommentsId
      commentRepliesId
      repostCommentsId
      __typename
    }
    parentCommentId
    replies {
      nextToken
      startedAt
      __typename
    }
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    postCommentsId
    commentRepliesId
    repostCommentsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCommentMutationVariables,
  APITypes.DeleteCommentMutation
>;
export const createRepost = /* GraphQL */ `mutation CreateRepost(
  $input: CreateRepostInput!
  $condition: ModelRepostConditionInput
) {
  createRepost(input: $input, condition: $condition) {
    id
    body
    originalPost {
      id
      body
      userPostsId
      username
      likedBy
      likesCount
      spotifyAlbumId
      spotifyAlbumName
      spotifyAlbumType
      spotifyAlbumImageUrl
      spotifyAlbumReleaseDate
      spotifyAlbumArtists
      spotifyAlbumTotalTracks
      spotifyAlbumExternalUrl
      spotifyTrackId
      spotifyTrackName
      spotifyTrackAlbumName
      spotifyTrackImageUrl
      spotifyTrackArtists
      spotifyTrackPreviewUrl
      spotifyTrackExternalUrl
      spotifyTrackReleaseDate
      spotifyTrackDurationMs
      spotifyTrackExplicit
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackArtist
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
      scTrackCreatedAt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userRepostsId
    userOriginalPostId
    username
    comments {
      nextToken
      startedAt
      __typename
    }
    likedBy
    likesCount
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    postRepostsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateRepostMutationVariables,
  APITypes.CreateRepostMutation
>;
export const updateRepost = /* GraphQL */ `mutation UpdateRepost(
  $input: UpdateRepostInput!
  $condition: ModelRepostConditionInput
) {
  updateRepost(input: $input, condition: $condition) {
    id
    body
    originalPost {
      id
      body
      userPostsId
      username
      likedBy
      likesCount
      spotifyAlbumId
      spotifyAlbumName
      spotifyAlbumType
      spotifyAlbumImageUrl
      spotifyAlbumReleaseDate
      spotifyAlbumArtists
      spotifyAlbumTotalTracks
      spotifyAlbumExternalUrl
      spotifyTrackId
      spotifyTrackName
      spotifyTrackAlbumName
      spotifyTrackImageUrl
      spotifyTrackArtists
      spotifyTrackPreviewUrl
      spotifyTrackExternalUrl
      spotifyTrackReleaseDate
      spotifyTrackDurationMs
      spotifyTrackExplicit
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackArtist
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
      scTrackCreatedAt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userRepostsId
    userOriginalPostId
    username
    comments {
      nextToken
      startedAt
      __typename
    }
    likedBy
    likesCount
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    postRepostsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateRepostMutationVariables,
  APITypes.UpdateRepostMutation
>;
export const deleteRepost = /* GraphQL */ `mutation DeleteRepost(
  $input: DeleteRepostInput!
  $condition: ModelRepostConditionInput
) {
  deleteRepost(input: $input, condition: $condition) {
    id
    body
    originalPost {
      id
      body
      userPostsId
      username
      likedBy
      likesCount
      spotifyAlbumId
      spotifyAlbumName
      spotifyAlbumType
      spotifyAlbumImageUrl
      spotifyAlbumReleaseDate
      spotifyAlbumArtists
      spotifyAlbumTotalTracks
      spotifyAlbumExternalUrl
      spotifyTrackId
      spotifyTrackName
      spotifyTrackAlbumName
      spotifyTrackImageUrl
      spotifyTrackArtists
      spotifyTrackPreviewUrl
      spotifyTrackExternalUrl
      spotifyTrackReleaseDate
      spotifyTrackDurationMs
      spotifyTrackExplicit
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackArtist
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
      scTrackCreatedAt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userRepostsId
    userOriginalPostId
    username
    comments {
      nextToken
      startedAt
      __typename
    }
    likedBy
    likesCount
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    postRepostsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteRepostMutationVariables,
  APITypes.DeleteRepostMutation
>;
export const createSpotifyRecentlyPlayedTrack = /* GraphQL */ `mutation CreateSpotifyRecentlyPlayedTrack(
  $input: CreateSpotifyRecentlyPlayedTrackInput!
  $condition: ModelSpotifyRecentlyPlayedTrackConditionInput
) {
  createSpotifyRecentlyPlayedTrack(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userSpotifyRecentlyPlayedTrackId
    spotifyId
    trackId
    trackName
    artistName
    albumName
    albumImageUrl
    playedAt
    spotifyUri
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSpotifyRecentlyPlayedTrackMutationVariables,
  APITypes.CreateSpotifyRecentlyPlayedTrackMutation
>;
export const updateSpotifyRecentlyPlayedTrack = /* GraphQL */ `mutation UpdateSpotifyRecentlyPlayedTrack(
  $input: UpdateSpotifyRecentlyPlayedTrackInput!
  $condition: ModelSpotifyRecentlyPlayedTrackConditionInput
) {
  updateSpotifyRecentlyPlayedTrack(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userSpotifyRecentlyPlayedTrackId
    spotifyId
    trackId
    trackName
    artistName
    albumName
    albumImageUrl
    playedAt
    spotifyUri
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSpotifyRecentlyPlayedTrackMutationVariables,
  APITypes.UpdateSpotifyRecentlyPlayedTrackMutation
>;
export const deleteSpotifyRecentlyPlayedTrack = /* GraphQL */ `mutation DeleteSpotifyRecentlyPlayedTrack(
  $input: DeleteSpotifyRecentlyPlayedTrackInput!
  $condition: ModelSpotifyRecentlyPlayedTrackConditionInput
) {
  deleteSpotifyRecentlyPlayedTrack(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userSpotifyRecentlyPlayedTrackId
    spotifyId
    trackId
    trackName
    artistName
    albumName
    albumImageUrl
    playedAt
    spotifyUri
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSpotifyRecentlyPlayedTrackMutationVariables,
  APITypes.DeleteSpotifyRecentlyPlayedTrackMutation
>;
export const createSpotifyTokens = /* GraphQL */ `mutation CreateSpotifyTokens(
  $input: CreateSpotifyTokensInput!
  $condition: ModelSpotifyTokensConditionInput
) {
  createSpotifyTokens(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userId
    spotifyUserId
    spotifyAccessToken
    spotifyRefreshToken
    tokenExpiration
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userSpotifyTokensId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSpotifyTokensMutationVariables,
  APITypes.CreateSpotifyTokensMutation
>;
export const updateSpotifyTokens = /* GraphQL */ `mutation UpdateSpotifyTokens(
  $input: UpdateSpotifyTokensInput!
  $condition: ModelSpotifyTokensConditionInput
) {
  updateSpotifyTokens(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userId
    spotifyUserId
    spotifyAccessToken
    spotifyRefreshToken
    tokenExpiration
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userSpotifyTokensId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSpotifyTokensMutationVariables,
  APITypes.UpdateSpotifyTokensMutation
>;
export const deleteSpotifyTokens = /* GraphQL */ `mutation DeleteSpotifyTokens(
  $input: DeleteSpotifyTokensInput!
  $condition: ModelSpotifyTokensConditionInput
) {
  deleteSpotifyTokens(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userId
    spotifyUserId
    spotifyAccessToken
    spotifyRefreshToken
    tokenExpiration
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userSpotifyTokensId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSpotifyTokensMutationVariables,
  APITypes.DeleteSpotifyTokensMutation
>;
export const createUserDeviceToken = /* GraphQL */ `mutation CreateUserDeviceToken(
  $input: CreateUserDeviceTokenInput!
  $condition: ModelUserDeviceTokenConditionInput
) {
  createUserDeviceToken(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userId
    deviceTokens
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userUserDeviceTokensId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserDeviceTokenMutationVariables,
  APITypes.CreateUserDeviceTokenMutation
>;
export const updateUserDeviceToken = /* GraphQL */ `mutation UpdateUserDeviceToken(
  $input: UpdateUserDeviceTokenInput!
  $condition: ModelUserDeviceTokenConditionInput
) {
  updateUserDeviceToken(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userId
    deviceTokens
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userUserDeviceTokensId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserDeviceTokenMutationVariables,
  APITypes.UpdateUserDeviceTokenMutation
>;
export const deleteUserDeviceToken = /* GraphQL */ `mutation DeleteUserDeviceToken(
  $input: DeleteUserDeviceTokenInput!
  $condition: ModelUserDeviceTokenConditionInput
) {
  deleteUserDeviceToken(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    userId
    deviceTokens
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userUserDeviceTokensId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserDeviceTokenMutationVariables,
  APITypes.DeleteUserDeviceTokenMutation
>;
export const createSeenPost = /* GraphQL */ `mutation CreateSeenPost(
  $input: CreateSeenPostInput!
  $condition: ModelSeenPostConditionInput
) {
  createSeenPost(input: $input, condition: $condition) {
    id
    itemId
    userIds
    itemType
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSeenPostMutationVariables,
  APITypes.CreateSeenPostMutation
>;
export const updateSeenPost = /* GraphQL */ `mutation UpdateSeenPost(
  $input: UpdateSeenPostInput!
  $condition: ModelSeenPostConditionInput
) {
  updateSeenPost(input: $input, condition: $condition) {
    id
    itemId
    userIds
    itemType
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSeenPostMutationVariables,
  APITypes.UpdateSeenPostMutation
>;
export const deleteSeenPost = /* GraphQL */ `mutation DeleteSeenPost(
  $input: DeleteSeenPostInput!
  $condition: ModelSeenPostConditionInput
) {
  deleteSeenPost(input: $input, condition: $condition) {
    id
    itemId
    userIds
    itemType
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSeenPostMutationVariables,
  APITypes.DeleteSeenPostMutation
>;
export const createNotification = /* GraphQL */ `mutation CreateNotification(
  $input: CreateNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  createNotification(input: $input, condition: $condition) {
    id
    type
    userId
    actorId
    targetId
    read
    message
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateNotificationMutationVariables,
  APITypes.CreateNotificationMutation
>;
export const updateNotification = /* GraphQL */ `mutation UpdateNotification(
  $input: UpdateNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  updateNotification(input: $input, condition: $condition) {
    id
    type
    userId
    actorId
    targetId
    read
    message
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateNotificationMutationVariables,
  APITypes.UpdateNotificationMutation
>;
export const deleteNotification = /* GraphQL */ `mutation DeleteNotification(
  $input: DeleteNotificationInput!
  $condition: ModelNotificationConditionInput
) {
  deleteNotification(input: $input, condition: $condition) {
    id
    type
    userId
    actorId
    targetId
    read
    message
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteNotificationMutationVariables,
  APITypes.DeleteNotificationMutation
>;
export const createNotificationSettings = /* GraphQL */ `mutation CreateNotificationSettings(
  $input: CreateNotificationSettingsInput!
  $condition: ModelNotificationSettingsConditionInput
) {
  createNotificationSettings(input: $input, condition: $condition) {
    id
    userId
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    likeEnabled
    commentEnabled
    followRequestEnabled
    repostEnabled
    commentLikeEnabled
    approvalEnabled
    inAppEnabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateNotificationSettingsMutationVariables,
  APITypes.CreateNotificationSettingsMutation
>;
export const updateNotificationSettings = /* GraphQL */ `mutation UpdateNotificationSettings(
  $input: UpdateNotificationSettingsInput!
  $condition: ModelNotificationSettingsConditionInput
) {
  updateNotificationSettings(input: $input, condition: $condition) {
    id
    userId
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    likeEnabled
    commentEnabled
    followRequestEnabled
    repostEnabled
    commentLikeEnabled
    approvalEnabled
    inAppEnabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateNotificationSettingsMutationVariables,
  APITypes.UpdateNotificationSettingsMutation
>;
export const deleteNotificationSettings = /* GraphQL */ `mutation DeleteNotificationSettings(
  $input: DeleteNotificationSettingsInput!
  $condition: ModelNotificationSettingsConditionInput
) {
  deleteNotificationSettings(input: $input, condition: $condition) {
    id
    userId
    user {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      spotifyUri
      spotifyImage
      soundCloudUri
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userNotificationSettingsId
      __typename
    }
    likeEnabled
    commentEnabled
    followRequestEnabled
    repostEnabled
    commentLikeEnabled
    approvalEnabled
    inAppEnabled
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteNotificationSettingsMutationVariables,
  APITypes.DeleteNotificationSettingsMutation
>;
