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
    likes {
      nextToken
      startedAt
      __typename
    }
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    userPostsId
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
    content
    likes {
      nextToken
      startedAt
      __typename
    }
    user {
      id
      username
      email
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    userPostsId
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    userCommentsId
    postCommentsId
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
      content
      userPostsId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      postCommentsId
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
      content
      userPostsId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      postCommentsId
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
export const getLike = /* GraphQL */ `query GetLike($id: ID!) {
  getLike(id: $id) {
    id
    user {
      id
      username
      email
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    postId
    userLikesId
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    commentLikesId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetLikeQueryVariables, APITypes.GetLikeQuery>;
export const listLikes = /* GraphQL */ `query ListLikes(
  $filter: ModelLikeFilterInput
  $limit: Int
  $nextToken: String
) {
  listLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      postId
      userLikesId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      commentLikesId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.ListLikesQueryVariables, APITypes.ListLikesQuery>;
export const syncLikes = /* GraphQL */ `query SyncLikes(
  $filter: ModelLikeFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncLikes(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      postId
      userLikesId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      commentLikesId
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.SyncLikesQueryVariables, APITypes.SyncLikesQuery>;
