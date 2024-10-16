/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
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
    spotifyPlaylists {
      nextToken
      startedAt
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
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
    spotifyPlaylists {
      nextToken
      startedAt
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
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
    spotifyPlaylists {
      nextToken
      startedAt
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreateSpotifyPlaylist = /* GraphQL */ `subscription OnCreateSpotifyPlaylist(
  $filter: ModelSubscriptionSpotifyPlaylistFilterInput
) {
  onCreateSpotifyPlaylist(filter: $filter) {
    id
    name
    description
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
    userSpotifyPlaylistsId
    username
    type
    spotifyPlaylistId
    spotifyUserId
    spotifyExternalUrl
    imageUrl
    tracks
    followers
    likedBy
    likesCount
    comments {
      nextToken
      startedAt
      __typename
    }
    trackLimitPerUser
    userTracks {
      nextToken
      startedAt
      __typename
    }
    genres
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateSpotifyPlaylistSubscriptionVariables,
  APITypes.OnCreateSpotifyPlaylistSubscription
>;
export const onUpdateSpotifyPlaylist = /* GraphQL */ `subscription OnUpdateSpotifyPlaylist(
  $filter: ModelSubscriptionSpotifyPlaylistFilterInput
) {
  onUpdateSpotifyPlaylist(filter: $filter) {
    id
    name
    description
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
    userSpotifyPlaylistsId
    username
    type
    spotifyPlaylistId
    spotifyUserId
    spotifyExternalUrl
    imageUrl
    tracks
    followers
    likedBy
    likesCount
    comments {
      nextToken
      startedAt
      __typename
    }
    trackLimitPerUser
    userTracks {
      nextToken
      startedAt
      __typename
    }
    genres
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateSpotifyPlaylistSubscriptionVariables,
  APITypes.OnUpdateSpotifyPlaylistSubscription
>;
export const onDeleteSpotifyPlaylist = /* GraphQL */ `subscription OnDeleteSpotifyPlaylist(
  $filter: ModelSubscriptionSpotifyPlaylistFilterInput
) {
  onDeleteSpotifyPlaylist(filter: $filter) {
    id
    name
    description
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
    userSpotifyPlaylistsId
    username
    type
    spotifyPlaylistId
    spotifyUserId
    spotifyExternalUrl
    imageUrl
    tracks
    followers
    likedBy
    likesCount
    comments {
      nextToken
      startedAt
      __typename
    }
    trackLimitPerUser
    userTracks {
      nextToken
      startedAt
      __typename
    }
    genres
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteSpotifyPlaylistSubscriptionVariables,
  APITypes.OnDeleteSpotifyPlaylistSubscription
>;
export const onCreateFriendship = /* GraphQL */ `subscription OnCreateFriendship(
  $filter: ModelSubscriptionFriendshipFilterInput
) {
  onCreateFriendship(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateFriendshipSubscriptionVariables,
  APITypes.OnCreateFriendshipSubscription
>;
export const onUpdateFriendship = /* GraphQL */ `subscription OnUpdateFriendship(
  $filter: ModelSubscriptionFriendshipFilterInput
) {
  onUpdateFriendship(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateFriendshipSubscriptionVariables,
  APITypes.OnUpdateFriendshipSubscription
>;
export const onDeleteFriendship = /* GraphQL */ `subscription OnDeleteFriendship(
  $filter: ModelSubscriptionFriendshipFilterInput
) {
  onDeleteFriendship(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteFriendshipSubscriptionVariables,
  APITypes.OnDeleteFriendshipSubscription
>;
export const onCreateFriendRequest = /* GraphQL */ `subscription OnCreateFriendRequest(
  $filter: ModelSubscriptionFriendRequestFilterInput
) {
  onCreateFriendRequest(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateFriendRequestSubscriptionVariables,
  APITypes.OnCreateFriendRequestSubscription
>;
export const onUpdateFriendRequest = /* GraphQL */ `subscription OnUpdateFriendRequest(
  $filter: ModelSubscriptionFriendRequestFilterInput
) {
  onUpdateFriendRequest(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateFriendRequestSubscriptionVariables,
  APITypes.OnUpdateFriendRequestSubscription
>;
export const onDeleteFriendRequest = /* GraphQL */ `subscription OnDeleteFriendRequest(
  $filter: ModelSubscriptionFriendRequestFilterInput
) {
  onDeleteFriendRequest(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteFriendRequestSubscriptionVariables,
  APITypes.OnDeleteFriendRequestSubscription
>;
export const onCreatePost = /* GraphQL */ `subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
  onCreatePost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePostSubscriptionVariables,
  APITypes.OnCreatePostSubscription
>;
export const onUpdatePost = /* GraphQL */ `subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
  onUpdatePost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePostSubscriptionVariables,
  APITypes.OnUpdatePostSubscription
>;
export const onDeletePost = /* GraphQL */ `subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
  onDeletePost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePostSubscriptionVariables,
  APITypes.OnDeletePostSubscription
>;
export const onCreateComment = /* GraphQL */ `subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
  onCreateComment(filter: $filter) {
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
    spotifyPlaylist {
      id
      name
      description
      userSpotifyPlaylistsId
      username
      type
      spotifyPlaylistId
      spotifyUserId
      spotifyExternalUrl
      imageUrl
      tracks
      followers
      likedBy
      likesCount
      trackLimitPerUser
      genres
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    spotifyPlaylistId
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
      spotifyPlaylistId
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
      spotifyPlaylistCommentsId
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
    spotifyPlaylistCommentsId
    postCommentsId
    commentRepliesId
    repostCommentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCommentSubscriptionVariables,
  APITypes.OnCreateCommentSubscription
>;
export const onUpdateComment = /* GraphQL */ `subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
  onUpdateComment(filter: $filter) {
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
    spotifyPlaylist {
      id
      name
      description
      userSpotifyPlaylistsId
      username
      type
      spotifyPlaylistId
      spotifyUserId
      spotifyExternalUrl
      imageUrl
      tracks
      followers
      likedBy
      likesCount
      trackLimitPerUser
      genres
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    spotifyPlaylistId
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
      spotifyPlaylistId
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
      spotifyPlaylistCommentsId
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
    spotifyPlaylistCommentsId
    postCommentsId
    commentRepliesId
    repostCommentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCommentSubscriptionVariables,
  APITypes.OnUpdateCommentSubscription
>;
export const onDeleteComment = /* GraphQL */ `subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
  onDeleteComment(filter: $filter) {
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
    spotifyPlaylist {
      id
      name
      description
      userSpotifyPlaylistsId
      username
      type
      spotifyPlaylistId
      spotifyUserId
      spotifyExternalUrl
      imageUrl
      tracks
      followers
      likedBy
      likesCount
      trackLimitPerUser
      genres
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    spotifyPlaylistId
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
      spotifyPlaylistId
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
      spotifyPlaylistCommentsId
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
    spotifyPlaylistCommentsId
    postCommentsId
    commentRepliesId
    repostCommentsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCommentSubscriptionVariables,
  APITypes.OnDeleteCommentSubscription
>;
export const onCreateRepost = /* GraphQL */ `subscription OnCreateRepost($filter: ModelSubscriptionRepostFilterInput) {
  onCreateRepost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateRepostSubscriptionVariables,
  APITypes.OnCreateRepostSubscription
>;
export const onUpdateRepost = /* GraphQL */ `subscription OnUpdateRepost($filter: ModelSubscriptionRepostFilterInput) {
  onUpdateRepost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateRepostSubscriptionVariables,
  APITypes.OnUpdateRepostSubscription
>;
export const onDeleteRepost = /* GraphQL */ `subscription OnDeleteRepost($filter: ModelSubscriptionRepostFilterInput) {
  onDeleteRepost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteRepostSubscriptionVariables,
  APITypes.OnDeleteRepostSubscription
>;
export const onCreateSpotifyRecentlyPlayedTrack = /* GraphQL */ `subscription OnCreateSpotifyRecentlyPlayedTrack(
  $filter: ModelSubscriptionSpotifyRecentlyPlayedTrackFilterInput
) {
  onCreateSpotifyRecentlyPlayedTrack(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSpotifyRecentlyPlayedTrackSubscriptionVariables,
  APITypes.OnCreateSpotifyRecentlyPlayedTrackSubscription
>;
export const onUpdateSpotifyRecentlyPlayedTrack = /* GraphQL */ `subscription OnUpdateSpotifyRecentlyPlayedTrack(
  $filter: ModelSubscriptionSpotifyRecentlyPlayedTrackFilterInput
) {
  onUpdateSpotifyRecentlyPlayedTrack(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSpotifyRecentlyPlayedTrackSubscriptionVariables,
  APITypes.OnUpdateSpotifyRecentlyPlayedTrackSubscription
>;
export const onDeleteSpotifyRecentlyPlayedTrack = /* GraphQL */ `subscription OnDeleteSpotifyRecentlyPlayedTrack(
  $filter: ModelSubscriptionSpotifyRecentlyPlayedTrackFilterInput
) {
  onDeleteSpotifyRecentlyPlayedTrack(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSpotifyRecentlyPlayedTrackSubscriptionVariables,
  APITypes.OnDeleteSpotifyRecentlyPlayedTrackSubscription
>;
export const onCreateSpotifyTokens = /* GraphQL */ `subscription OnCreateSpotifyTokens(
  $filter: ModelSubscriptionSpotifyTokensFilterInput
) {
  onCreateSpotifyTokens(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSpotifyTokensSubscriptionVariables,
  APITypes.OnCreateSpotifyTokensSubscription
>;
export const onUpdateSpotifyTokens = /* GraphQL */ `subscription OnUpdateSpotifyTokens(
  $filter: ModelSubscriptionSpotifyTokensFilterInput
) {
  onUpdateSpotifyTokens(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSpotifyTokensSubscriptionVariables,
  APITypes.OnUpdateSpotifyTokensSubscription
>;
export const onDeleteSpotifyTokens = /* GraphQL */ `subscription OnDeleteSpotifyTokens(
  $filter: ModelSubscriptionSpotifyTokensFilterInput
) {
  onDeleteSpotifyTokens(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSpotifyTokensSubscriptionVariables,
  APITypes.OnDeleteSpotifyTokensSubscription
>;
export const onCreateUserDeviceToken = /* GraphQL */ `subscription OnCreateUserDeviceToken(
  $filter: ModelSubscriptionUserDeviceTokenFilterInput
) {
  onCreateUserDeviceToken(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserDeviceTokenSubscriptionVariables,
  APITypes.OnCreateUserDeviceTokenSubscription
>;
export const onUpdateUserDeviceToken = /* GraphQL */ `subscription OnUpdateUserDeviceToken(
  $filter: ModelSubscriptionUserDeviceTokenFilterInput
) {
  onUpdateUserDeviceToken(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserDeviceTokenSubscriptionVariables,
  APITypes.OnUpdateUserDeviceTokenSubscription
>;
export const onDeleteUserDeviceToken = /* GraphQL */ `subscription OnDeleteUserDeviceToken(
  $filter: ModelSubscriptionUserDeviceTokenFilterInput
) {
  onDeleteUserDeviceToken(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserDeviceTokenSubscriptionVariables,
  APITypes.OnDeleteUserDeviceTokenSubscription
>;
export const onCreateSeenPost = /* GraphQL */ `subscription OnCreateSeenPost($filter: ModelSubscriptionSeenPostFilterInput) {
  onCreateSeenPost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSeenPostSubscriptionVariables,
  APITypes.OnCreateSeenPostSubscription
>;
export const onUpdateSeenPost = /* GraphQL */ `subscription OnUpdateSeenPost($filter: ModelSubscriptionSeenPostFilterInput) {
  onUpdateSeenPost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSeenPostSubscriptionVariables,
  APITypes.OnUpdateSeenPostSubscription
>;
export const onDeleteSeenPost = /* GraphQL */ `subscription OnDeleteSeenPost($filter: ModelSubscriptionSeenPostFilterInput) {
  onDeleteSeenPost(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSeenPostSubscriptionVariables,
  APITypes.OnDeleteSeenPostSubscription
>;
export const onCreateNotification = /* GraphQL */ `subscription OnCreateNotification(
  $filter: ModelSubscriptionNotificationFilterInput
) {
  onCreateNotification(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateNotificationSubscriptionVariables,
  APITypes.OnCreateNotificationSubscription
>;
export const onUpdateNotification = /* GraphQL */ `subscription OnUpdateNotification(
  $filter: ModelSubscriptionNotificationFilterInput
) {
  onUpdateNotification(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateNotificationSubscriptionVariables,
  APITypes.OnUpdateNotificationSubscription
>;
export const onDeleteNotification = /* GraphQL */ `subscription OnDeleteNotification(
  $filter: ModelSubscriptionNotificationFilterInput
) {
  onDeleteNotification(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteNotificationSubscriptionVariables,
  APITypes.OnDeleteNotificationSubscription
>;
export const onCreateNotificationSettings = /* GraphQL */ `subscription OnCreateNotificationSettings(
  $filter: ModelSubscriptionNotificationSettingsFilterInput
) {
  onCreateNotificationSettings(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateNotificationSettingsSubscriptionVariables,
  APITypes.OnCreateNotificationSettingsSubscription
>;
export const onUpdateNotificationSettings = /* GraphQL */ `subscription OnUpdateNotificationSettings(
  $filter: ModelSubscriptionNotificationSettingsFilterInput
) {
  onUpdateNotificationSettings(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateNotificationSettingsSubscriptionVariables,
  APITypes.OnUpdateNotificationSettingsSubscription
>;
export const onDeleteNotificationSettings = /* GraphQL */ `subscription OnDeleteNotificationSettings(
  $filter: ModelSubscriptionNotificationSettingsFilterInput
) {
  onDeleteNotificationSettings(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteNotificationSettingsSubscriptionVariables,
  APITypes.OnDeleteNotificationSettingsSubscription
>;
export const onCreateUserPlaylistTrack = /* GraphQL */ `subscription OnCreateUserPlaylistTrack(
  $filter: ModelSubscriptionUserPlaylistTrackFilterInput
) {
  onCreateUserPlaylistTrack(filter: $filter) {
    id
    userId
    playlistId
    trackCount
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    spotifyPlaylistUserTracksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserPlaylistTrackSubscriptionVariables,
  APITypes.OnCreateUserPlaylistTrackSubscription
>;
export const onUpdateUserPlaylistTrack = /* GraphQL */ `subscription OnUpdateUserPlaylistTrack(
  $filter: ModelSubscriptionUserPlaylistTrackFilterInput
) {
  onUpdateUserPlaylistTrack(filter: $filter) {
    id
    userId
    playlistId
    trackCount
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    spotifyPlaylistUserTracksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserPlaylistTrackSubscriptionVariables,
  APITypes.OnUpdateUserPlaylistTrackSubscription
>;
export const onDeleteUserPlaylistTrack = /* GraphQL */ `subscription OnDeleteUserPlaylistTrack(
  $filter: ModelSubscriptionUserPlaylistTrackFilterInput
) {
  onDeleteUserPlaylistTrack(filter: $filter) {
    id
    userId
    playlistId
    trackCount
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    spotifyPlaylistUserTracksId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserPlaylistTrackSubscriptionVariables,
  APITypes.OnDeleteUserPlaylistTrackSubscription
>;
