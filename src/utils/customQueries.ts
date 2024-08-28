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
  