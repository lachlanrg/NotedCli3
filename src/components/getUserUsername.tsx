// utils/userUtils.js (or any other suitable filename)

import { getUser } from '../graphql/queries'; // Adjust the import path if necessary
import { generateClient } from 'aws-amplify/api';

export const fetchUsernameById = async (userId: string): Promise<string | null> => {
    try {
      const client = generateClient(); 
  
      const response = await client.graphql({
        query: getUser, 
        variables: { id: userId },
      });
  
      // Assuming the response structure is consistent with your getUser query
      if (response.data && response.data.getUser) { 
        return response.data.getUser.username;
      } else {
        console.warn('User not found or invalid response structure for userId:', userId);
        return null;
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  };
  