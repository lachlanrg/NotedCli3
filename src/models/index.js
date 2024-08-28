// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Friendship, FriendRequest, Post, Comment, Repost, Like } = initSchema(schema);

export {
  User,
  Friendship,
  FriendRequest,
  Post,
  Comment,
  Repost,
  Like
};