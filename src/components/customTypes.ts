// Custom types as seen in API.ts etc, which are exported to screens to create posts etc

export interface CustomCreatePostInput {
    id?: string | null;
    body: string;
    _version?: number | null;
    userPostsId?: string | null;
    username?: string | null;
  }

  
export interface CustomPost {
  __typename: "Post",
  id: string,
  body: string,
  likes?: ModelLikeConnection | null,
  comments?: ModelCommentConnection | null,
  user?: { id: string, username: string } | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  userPostsId?: string | null,
}