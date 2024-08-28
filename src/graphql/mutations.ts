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
    publicProfile
    reposts {
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
    publicProfile
    reposts {
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
    publicProfile
    reposts {
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
export const createLike = /* GraphQL */ `mutation CreateLike(
  $input: CreateLikeInput!
  $condition: ModelLikeConditionInput
) {
  createLike(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLikeMutationVariables,
  APITypes.CreateLikeMutation
>;
export const updateLike = /* GraphQL */ `mutation UpdateLike(
  $input: UpdateLikeInput!
  $condition: ModelLikeConditionInput
) {
  updateLike(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLikeMutationVariables,
  APITypes.UpdateLikeMutation
>;
export const deleteLike = /* GraphQL */ `mutation DeleteLike(
  $input: DeleteLikeInput!
  $condition: ModelLikeConditionInput
) {
  deleteLike(input: $input, condition: $condition) {
    id
    user {
      id
      username
      email
      publicProfile
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLikeMutationVariables,
  APITypes.DeleteLikeMutation
>;
