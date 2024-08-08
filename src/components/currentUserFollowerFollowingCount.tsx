import { getCurrentUser } from '@aws-amplify/auth';
import { listFriendRequests } from '../graphql/queries';
import awsmobile from '../aws-exports';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';


Amplify.configure(awsmobile);
const client = generateClient();

interface FriendRequest {
  id: string;
  status: 'Pending' | 'Following' | 'Cancelled';
  userSentFriendRequestsId: string;
  userReceivedFriendRequestsId: string;
}

export async function getFollowCounts(): Promise<{ following: number; followers: number }> {
    try {
      const { userId } = await getCurrentUser();
  
      const response: any = await client.graphql({ 
        query: listFriendRequests 
      });
  
      const friendRequests: FriendRequest[] = response.data.listFriendRequests.items;
  
      let following = 0;
      let followers = 0;
  
      friendRequests.forEach((request) => {
        if (request.userSentFriendRequestsId === userId && request.status === 'Following') {
          following++;
        }
        if (request.userReceivedFriendRequestsId === userId && request.status === 'Following') {
          followers++;
        }
      });
  
      return { following, followers };
    } catch (error) {
      console.error('Error fetching follow counts:', error);
      return { following: 0, followers: 0 };
    }
  }
