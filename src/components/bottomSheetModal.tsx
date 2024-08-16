import React, { useMemo, forwardRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { dark, gray, light } from "./colorModes";
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const unLikedIcon = faHeartRegular as IconProp;
const likedIcon = faHeartSolid as IconProp;

export type Ref = BottomSheetModal;

type Comment = {
  id: string;
  content: string;
  userPostsId: string;
};

type Props = {
  selectedPost: {
    id: string;
    comments: Comment[];
  } | null;
};

const CustomBottomSheet = forwardRef<Ref, Props>(({ selectedPost }, ref) => {
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const [newComment, setNewComment] = useState(''); 
  const [userInfo, setUserId] = React.useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  

  React.useEffect(() => {
    currentAuthenticatedUser();
    const fetchInitialComments = async () => {
      const fetchedComments = await fetchComments();
      setComments(fetchedComments);
    };
  
    if (selectedPost) { // Only fetch if a post is selected
      fetchInitialComments(); 
    } 
  }, [selectedPost]); // Fetch again if selectedPost changes

  async function currentAuthenticatedUser() {
    try {
      const { userId  } = await getCurrentUser();
      console.log(`The User Id: ${userId}`);
  
      setUserId({ userId });
    } catch (err) {
      console.log(err);
    }
  }

  const renderBackDrop = useCallback (
    (props: any) => <BottomSheetBackdrop appearsOnIndex={1} disappearsOnIndex={-1} {...props} />,
    []
  );

  const handleCommentChange = (text: string) => {
    setNewComment(text);
  };

  const createComment = async () => {
    if (!newComment || !selectedPost) return;
    try {
      const { userId } = await getCurrentUser();
      const client = generateClient();

      const input = {
        postId: selectedPost.id,
        content: newComment,
        userPostsId: userId, 
        likesCount: 0,
      };
      console.log("Trying to create comment with info:")
      console.log("Post ID:", selectedPost.id)
      console.log("Comment:", newComment)
      console.log("userPosts ID:", userId)

      // Use API.graphql directly for consistency with your post creation 
      await client.graphql({
        query: mutations.createComment,
        variables: { input },
      });
      console.log('New Comment created successfully!:', newComment);
      // Update the local state with the new comment  
      setNewComment(''); // Clear the input field
      const fetchedComments = await fetchComments(); 
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const fetchComments = async () => {
    if (!selectedPost) return []; // Don't fetch if no post is selected
  
    try {
      const client = generateClient();
      const filter = { // Filter comments by the selected post ID
        postId: {
          eq: selectedPost.id 
        }
      };
  
      const response = await client.graphql({
        query: queries.listComments, 
        variables: { filter: filter }, 
      });
  
      if (response.data && response.data.listComments) {
      // Sort by createdAt in descending order (most recent first)
      const sortedComments = [...response.data.listComments.items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ); 
      return sortedComments;
    } else {
      console.warn('Unexpected response format from listComments query:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      {/* <Text style={styles.commentUser}>{item.userPostsId}: </Text> */}
      <Text>{item.content}</Text>
      <FontAwesomeIcon icon={unLikedIcon} style={styles.heartIcon} />
    </View>
  );


  return (
    <BottomSheetModal
      ref={ref}
      index={0} 
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackDrop}
      keyboardBehavior="extend"
      // handleIndicatorStyle={{ backgroundColor: 'white '}}
      >
      <View style={styles.contentContainer}>
        {/* <Text style={styles.containerHeadline}>Comments</Text> */}

        <View style={styles.inputContainer}> 
          <BottomSheetTextInput
            style={styles.input} 
            onChangeText={handleCommentChange} 
            placeholder="Add a comment ..."
          />
          <TouchableOpacity onPress={createComment} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        {selectedPost && ( 
          <FlatList
            data={comments} 
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.commentList}
          />
        )}
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  containerHeadline: {
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18, // Use horizontal padding
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 16, // Add margin below input container
  },
  input: {
    flex: 1, // Input takes up available space
    marginRight: 8, 
    fontSize: 14,
    lineHeight: 20,
    borderRadius: 10,
    backgroundColor: light,
    padding: 8,
    borderColor: dark,
    borderWidth: 1,
  },
  postButton: {
    backgroundColor: 'blue', // Example - customize as needed
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentList: {
    flexGrow: 1, // Allow the comment list to grow to take up available space
    width: '100%', 
    justifyContent: "flex-start",
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center', // Align items to the same baseline
    justifyContent: 'space-between', // Position content and icon
    marginBottom: 8,
    padding: 8,
    marginRight: 20,
    marginLeft: 10,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  heartIcon: {
    fontSize: 16, // Adjust icon size as needed
    color: 'gray',  // Default icon color
    justifyContent: "flex-end",
  },
});

export default CustomBottomSheet

