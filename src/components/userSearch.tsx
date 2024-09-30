// userSearch.tsx
import * as queries from '../graphql/queries';

import { useEffect, useState } from 'react';
import { User } from '../API'; // Import your User type

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

export const useSearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[] | null>(null); // Allow null as a type

  const client = generateClient();

  const searchUsers = async () => {
    try {
      const response = await client.graphql({
        query: queries.listUsers, 
        variables: {
          filter: {
            username: {
              contains: searchTerm,
            },
          },
        },
      });

      // console.log("______________________________________")
      // console.log('Searching for Users');
      // console.log('Results found:', response.data.listUsers.items.length);
      // response.data.listUsers.items.forEach((user: User) => {
      //   console.log("______________________________________")
      //   console.log('User:');
      //   console.log('  - username:', user.username);
      //   console.log('  - email:', user.email);
      //   console.log('  - ID:', user.id);
      //   console.log('  - Posts:', user.posts);
      //   // ... Add other properties as needed
      // });
      // console.log("______________________________________")


      setSearchResults(response.data.listUsers.items); 
      return response.data.listUsers.items; 
    } catch (error) {
      console.error('Error searching for users:', error);
      setSearchResults([]); 
      return [];
    }
  };

  const clearSearchResults = () => {
    setSearchResults(null); // Clear the search results
  };

  return {
    searchUsers,
    searchTerm,
    setSearchTerm, 
    searchResults,
    clearSearchResults,

  }; 
};

export default useSearchUsers;