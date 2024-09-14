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
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    friend {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    recipient {
      id
      username
      email
      publicProfile
      recentlyPlayedDisabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
    scTrackId
    scTrackTitle
    scTrackArtworkUrl
    scTrackUserId
    scTrackUsername
    scTrackLikes
    scTrackGenre
    scTrackPermalinkUrl
    scTrackWaveformUrl
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
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
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
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
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
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    userPostsId
    username
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    postCommentsId
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      postCommentsId
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      postCommentsId
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
      scTrackId
      scTrackTitle
      scTrackArtworkUrl
      scTrackUserId
      scTrackUsername
      scTrackLikes
      scTrackGenre
      scTrackPermalinkUrl
      scTrackWaveformUrl
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
