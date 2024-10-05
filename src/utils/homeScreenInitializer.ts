import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { listSeenPosts, listFriendRequests } from '../graphql/queries';
import { fetchPosts } from './postFetcher';

const client = generateClient();

export interface HomeScreenData {
  userInfo: { userId: string } | null;
  currentUserId: string | null;
  seenPostIds: string[];
  following: string[];
  posts: any[];
}

export async function initializeHomeScreenData(): Promise<HomeScreenData> {
  const userInfo = await currentAuthenticatedUser();
  const currentUserId = userInfo?.userId || null;
  const seenPostIds = await fetchSeenPosts(currentUserId);
  const following = await fetchFollowing(currentUserId);
  const posts = await fetchPosts(following, currentUserId, seenPostIds);

  return {
    userInfo,
    currentUserId,
    seenPostIds,
    following,
    posts,
  };
}

async function currentAuthenticatedUser() {
  try {
    const { userId } = await getCurrentUser();
    return { userId };
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function fetchSeenPosts(userId: string | null) {
  if (!userId) return [];
  try {
    const response = await client.graphql({
      query: listSeenPosts,
      variables: { filter: { userIds: { contains: userId } } },
    });
    return response.data.listSeenPosts.items.map((seenPost: any) => seenPost.itemId);
  } catch (error) {
    console.error("Error fetching seen posts:", error);
    return [];
  }
}

async function fetchFollowing(userId: string | null) {
  if (!userId) return [];
  try {
    const response = await client.graphql({
      query: listFriendRequests,
      variables: {
        filter: {
          userSentFriendRequestsId: { eq: userId },
          status: { eq: 'Following' } 
        },
      },
    });
    return response.data.listFriendRequests.items.map((request: any) => request.userReceivedFriendRequestsId);
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
  }
}