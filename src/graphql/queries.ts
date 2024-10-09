/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const syncUsers = /* GraphQL */ `query SyncUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncUsers(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.SyncUsersQueryVariables, APITypes.SyncUsersQuery>;
export const getFriendship = /* GraphQL */ `query GetFriendship($id: ID!) {
  getFriendship(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetFriendshipQueryVariables,
  APITypes.GetFriendshipQuery
>;
export const listFriendships = /* GraphQL */ `query ListFriendships(
  $filter: ModelFriendshipFilterInput
  $limit: Int
  $nextToken: String
) {
  listFriendships(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userFriendsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFriendshipsQueryVariables,
  APITypes.ListFriendshipsQuery
>;
export const syncFriendships = /* GraphQL */ `query SyncFriendships(
  $filter: ModelFriendshipFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncFriendships(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userFriendsId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncFriendshipsQueryVariables,
  APITypes.SyncFriendshipsQuery
>;
export const getFriendRequest = /* GraphQL */ `query GetFriendRequest($id: ID!) {
  getFriendRequest(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetFriendRequestQueryVariables,
  APITypes.GetFriendRequestQuery
>;
export const listFriendRequests = /* GraphQL */ `query ListFriendRequests(
  $filter: ModelFriendRequestFilterInput
  $limit: Int
  $nextToken: String
) {
  listFriendRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFriendRequestsQueryVariables,
  APITypes.ListFriendRequestsQuery
>;
export const syncFriendRequests = /* GraphQL */ `query SyncFriendRequests(
  $filter: ModelFriendRequestFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncFriendRequests(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncFriendRequestsQueryVariables,
  APITypes.SyncFriendRequestsQuery
>;
export const getPost = /* GraphQL */ `query GetPost($id: ID!) {
  getPost(id: $id) {
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
` as GeneratedQuery<APITypes.GetPostQueryVariables, APITypes.GetPostQuery>;
export const listPosts = /* GraphQL */ `query ListPosts(
  $filter: ModelPostFilterInput
  $limit: Int
  $nextToken: String
) {
  listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.ListPostsQueryVariables, APITypes.ListPostsQuery>;
export const syncPosts = /* GraphQL */ `query SyncPosts(
  $filter: ModelPostFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncPosts(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.SyncPostsQueryVariables, APITypes.SyncPostsQuery>;
export const getComment = /* GraphQL */ `query GetComment($id: ID!) {
  getComment(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetCommentQueryVariables,
  APITypes.GetCommentQuery
>;
export const listComments = /* GraphQL */ `query ListComments(
  $filter: ModelCommentFilterInput
  $limit: Int
  $nextToken: String
) {
  listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCommentsQueryVariables,
  APITypes.ListCommentsQuery
>;
export const syncComments = /* GraphQL */ `query SyncComments(
  $filter: ModelCommentFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncComments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncCommentsQueryVariables,
  APITypes.SyncCommentsQuery
>;
export const getRepost = /* GraphQL */ `query GetRepost($id: ID!) {
  getRepost(id: $id) {
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
` as GeneratedQuery<APITypes.GetRepostQueryVariables, APITypes.GetRepostQuery>;
export const listReposts = /* GraphQL */ `query ListReposts(
  $filter: ModelRepostFilterInput
  $limit: Int
  $nextToken: String
) {
  listReposts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRepostsQueryVariables,
  APITypes.ListRepostsQuery
>;
export const syncReposts = /* GraphQL */ `query SyncReposts(
  $filter: ModelRepostFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncReposts(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncRepostsQueryVariables,
  APITypes.SyncRepostsQuery
>;
export const getSpotifyRecentlyPlayedTrack = /* GraphQL */ `query GetSpotifyRecentlyPlayedTrack($id: ID!) {
  getSpotifyRecentlyPlayedTrack(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetSpotifyRecentlyPlayedTrackQueryVariables,
  APITypes.GetSpotifyRecentlyPlayedTrackQuery
>;
export const listSpotifyRecentlyPlayedTracks = /* GraphQL */ `query ListSpotifyRecentlyPlayedTracks(
  $filter: ModelSpotifyRecentlyPlayedTrackFilterInput
  $limit: Int
  $nextToken: String
) {
  listSpotifyRecentlyPlayedTracks(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSpotifyRecentlyPlayedTracksQueryVariables,
  APITypes.ListSpotifyRecentlyPlayedTracksQuery
>;
export const syncSpotifyRecentlyPlayedTracks = /* GraphQL */ `query SyncSpotifyRecentlyPlayedTracks(
  $filter: ModelSpotifyRecentlyPlayedTrackFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncSpotifyRecentlyPlayedTracks(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncSpotifyRecentlyPlayedTracksQueryVariables,
  APITypes.SyncSpotifyRecentlyPlayedTracksQuery
>;
export const spotifyRecentlyPlayedTracksByUserSpotifyRecentlyPlayedTrackIdAndPlayedAt = /* GraphQL */ `query SpotifyRecentlyPlayedTracksByUserSpotifyRecentlyPlayedTrackIdAndPlayedAt(
  $userSpotifyRecentlyPlayedTrackId: ID!
  $playedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelSpotifyRecentlyPlayedTrackFilterInput
  $limit: Int
  $nextToken: String
) {
  spotifyRecentlyPlayedTracksByUserSpotifyRecentlyPlayedTrackIdAndPlayedAt(
    userSpotifyRecentlyPlayedTrackId: $userSpotifyRecentlyPlayedTrackId
    playedAt: $playedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SpotifyRecentlyPlayedTracksByUserSpotifyRecentlyPlayedTrackIdAndPlayedAtQueryVariables,
  APITypes.SpotifyRecentlyPlayedTracksByUserSpotifyRecentlyPlayedTrackIdAndPlayedAtQuery
>;
export const getSpotifyTokens = /* GraphQL */ `query GetSpotifyTokens($id: ID!) {
  getSpotifyTokens(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetSpotifyTokensQueryVariables,
  APITypes.GetSpotifyTokensQuery
>;
export const listSpotifyTokens = /* GraphQL */ `query ListSpotifyTokens(
  $filter: ModelSpotifyTokensFilterInput
  $limit: Int
  $nextToken: String
) {
  listSpotifyTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSpotifyTokensQueryVariables,
  APITypes.ListSpotifyTokensQuery
>;
export const syncSpotifyTokens = /* GraphQL */ `query SyncSpotifyTokens(
  $filter: ModelSpotifyTokensFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncSpotifyTokens(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncSpotifyTokensQueryVariables,
  APITypes.SyncSpotifyTokensQuery
>;
export const getUserDeviceToken = /* GraphQL */ `query GetUserDeviceToken($id: ID!) {
  getUserDeviceToken(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserDeviceTokenQueryVariables,
  APITypes.GetUserDeviceTokenQuery
>;
export const listUserDeviceTokens = /* GraphQL */ `query ListUserDeviceTokens(
  $filter: ModelUserDeviceTokenFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserDeviceTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserDeviceTokensQueryVariables,
  APITypes.ListUserDeviceTokensQuery
>;
export const syncUserDeviceTokens = /* GraphQL */ `query SyncUserDeviceTokens(
  $filter: ModelUserDeviceTokenFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncUserDeviceTokens(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncUserDeviceTokensQueryVariables,
  APITypes.SyncUserDeviceTokensQuery
>;
export const userDeviceTokensByUserId = /* GraphQL */ `query UserDeviceTokensByUserId(
  $userId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserDeviceTokenFilterInput
  $limit: Int
  $nextToken: String
) {
  userDeviceTokensByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserDeviceTokensByUserIdQueryVariables,
  APITypes.UserDeviceTokensByUserIdQuery
>;
export const getSeenPost = /* GraphQL */ `query GetSeenPost($id: ID!) {
  getSeenPost(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetSeenPostQueryVariables,
  APITypes.GetSeenPostQuery
>;
export const listSeenPosts = /* GraphQL */ `query ListSeenPosts(
  $filter: ModelSeenPostFilterInput
  $limit: Int
  $nextToken: String
) {
  listSeenPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSeenPostsQueryVariables,
  APITypes.ListSeenPostsQuery
>;
export const syncSeenPosts = /* GraphQL */ `query SyncSeenPosts(
  $filter: ModelSeenPostFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncSeenPosts(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncSeenPostsQueryVariables,
  APITypes.SyncSeenPostsQuery
>;
export const seenPostsByItemId = /* GraphQL */ `query SeenPostsByItemId(
  $itemId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSeenPostFilterInput
  $limit: Int
  $nextToken: String
) {
  seenPostsByItemId(
    itemId: $itemId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SeenPostsByItemIdQueryVariables,
  APITypes.SeenPostsByItemIdQuery
>;
export const getNotification = /* GraphQL */ `query GetNotification($id: ID!) {
  getNotification(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetNotificationQueryVariables,
  APITypes.GetNotificationQuery
>;
export const listNotifications = /* GraphQL */ `query ListNotifications(
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotificationsQueryVariables,
  APITypes.ListNotificationsQuery
>;
export const syncNotifications = /* GraphQL */ `query SyncNotifications(
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncNotifications(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncNotificationsQueryVariables,
  APITypes.SyncNotificationsQuery
>;
export const notificationsByUserIdAndCreatedAt = /* GraphQL */ `query NotificationsByUserIdAndCreatedAt(
  $userId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  notificationsByUserIdAndCreatedAt(
    userId: $userId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.NotificationsByUserIdAndCreatedAtQueryVariables,
  APITypes.NotificationsByUserIdAndCreatedAtQuery
>;
export const getNotificationSettings = /* GraphQL */ `query GetNotificationSettings($id: ID!) {
  getNotificationSettings(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetNotificationSettingsQueryVariables,
  APITypes.GetNotificationSettingsQuery
>;
export const listNotificationSettings = /* GraphQL */ `query ListNotificationSettings(
  $filter: ModelNotificationSettingsFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotificationSettings(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotificationSettingsQueryVariables,
  APITypes.ListNotificationSettingsQuery
>;
export const syncNotificationSettings = /* GraphQL */ `query SyncNotificationSettings(
  $filter: ModelNotificationSettingsFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncNotificationSettings(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncNotificationSettingsQueryVariables,
  APITypes.SyncNotificationSettingsQuery
>;
export const notificationSettingsByUserIdAndId = /* GraphQL */ `query NotificationSettingsByUserIdAndId(
  $userId: ID!
  $id: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelNotificationSettingsFilterInput
  $limit: Int
  $nextToken: String
) {
  notificationSettingsByUserIdAndId(
    userId: $userId
    id: $id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.NotificationSettingsByUserIdAndIdQueryVariables,
  APITypes.NotificationSettingsByUserIdAndIdQuery
>;
