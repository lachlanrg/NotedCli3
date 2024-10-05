import { generateClient } from 'aws-amplify/api';
import { listPosts } from '../graphql/queries';
import { listRepostsWithOriginalPost } from './customQueries';

const client = generateClient();

export async function fetchPosts(following: string[], userId: string | null, seenPostIds: string[]) {
  try {
    const followingPostPromises = following.map(fetchUserPosts);
    const currentUserPostPromise = fetchUserPosts(userId);
    const followingRepostPromises = following.map(fetchUserReposts);
    const currentUserRepostPromise = fetchUserReposts(userId);

    const [allPosts, ...allReposts] = await Promise.all([
      ...followingPostPromises,
      currentUserPostPromise,
      ...followingRepostPromises,
      currentUserRepostPromise,
    ]);

    const flattenedPosts = allPosts.flat().filter(post => !post._deleted);
    const flattenedReposts = allReposts.flat().filter(repost => !repost._deleted);
    const allContent = [...flattenedPosts, ...flattenedReposts];

    const sortedContent = allContent.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const unseenPosts = sortedContent.filter(item => !seenPostIds.includes(item.id));
    const seenPosts = sortedContent.filter(item => seenPostIds.includes(item.id));

    return [...unseenPosts, ...seenPosts];
  } catch (error) {
    console.error('Error fetching posts and reposts:', error);
    return [];
  }
}

async function fetchUserPosts(userId: string | null) {
  if (!userId) return [];
  const response = await client.graphql({
    query: listPosts,
    variables: {
      filter: {
        userPostsId: { eq: userId },
      },
    },
  });
  return response.data.listPosts.items;
}

async function fetchUserReposts(userId: string | null) {
  if (!userId) return [];
  const response = await client.graphql({
    query: listRepostsWithOriginalPost,
    variables: {
      filter: {
        userRepostsId: { eq: userId },
      },
    },
  });
  return response.data.listReposts.items;
}