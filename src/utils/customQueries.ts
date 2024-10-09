import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const listRepostsWithOriginalPost = /* GraphQL */ `query ListRepostsWithOriginalPost(
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
          scTrackGenre
          scTrackArtist
          scTrackCreatedAt
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          __typename
        }
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

export const getSpotifyItemPostAndRepostCount = /* GraphQL */ `
  query GetSpotifyItemPostAndRepostCount($spotifyAlbumId: ID, $spotifyTrackId: ID) {
    listPosts(filter: {
      or: [
        { spotifyAlbumId: { eq: $spotifyAlbumId } },
        { spotifyTrackId: { eq: $spotifyTrackId } }
      ]
    }) {
      items {
        id
        reposts {
          items {
            id
          }
        }
      }
    }
  }
`;

export const getSCTrackPostAndRepostCount = /* GraphQL */ `
  query GetSCTrackPostAndRepostCount($scTrackId: ID) {
    listPosts(filter: { scTrackId: { eq: $scTrackId } }) {
      items {
        id
        reposts {
          items {
            id
          }
        }
      }
    }
  }
`;

export const getNotificationSettingsByUserId = /* GraphQL */ `
  query GetNotificationSettingsByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationSettingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationSettingsByUserId(
      userId: $userId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;