import React, { useMemo, forwardRef, useCallback, useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { dark, gray, light } from "../colorModes";
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ContentLoader, { Rect, Circle } from "react-content-loader/native"; // Import

const unLikedIcon = faHeartRegular as IconProp;
const likedIcon = faHeartSolid as IconProp;

export type Ref = BottomSheetModal;

type Comment = {
  id: string;
  content: string;
  userPostsId: string;
  username: string;
  likedBy: string[]; // Add the likedBy property with the correct type
  likesCount: number; // Make sure this is a number type
  _version: number; // Add the _version property
};

type Post = {
  id: string;
  comments: Comment[];
};

type Repost = {
  id: string;
  originalPost: Post;
};
type Props = {
  selectedPost: Post | Repost | null;
};

const CustomBottomSheet = forwardRef<Ref, Props>(({ selectedPost }, ref) => {
  const snapPoints = useMemo(() => ['80%'], []);
  const [newComment, setNewComment] = useState('');
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);


  useEffect(() => {
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
      const user = await getCurrentUser();
      const { userId, username } = user;
      console.log(`The User Id: ${userId}, Username: ${username}`);

      setUserInfo({ userId, username });
    } catch (err) {
      console.log(err);
    }
  }

  const renderBackDrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={1} disappearsOnIndex={-1} {...props} />,
    []
  );

  const handleCommentChange = (text: string) => {
    setNewComment(text);
  };

  const createComment = async () => {
    if (!newComment || !selectedPost || !userInfo) return;
    try {
      const { userId, username } = userInfo;
      const client = generateClient();

      const input = {
        postId: 'originalPost' in selectedPost ? undefined : selectedPost.id,
        repostId: 'originalPost' in selectedPost ? selectedPost.id : undefined,
        content: newComment,
        userPostsId: userId,
        username: username,
        likesCount: 0,
      };
      console.log("Trying to create comment with info:")
      console.log("Post ID:", selectedPost.id)
      console.log("Comment:", newComment)
      console.log("userPosts ID:", userId)
      console.log("Username:", username)

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
      const filter = { // Filter comments by the selected post ID or repost ID
        postId: 'originalPost' in selectedPost ? undefined : { eq: selectedPost.id },
        repostId: 'originalPost' in selectedPost ? { eq: selectedPost.id } : undefined,
      };
  
      const response = await client.graphql({
        query: queries.listComments,
        variables: { filter: filter },
      });
  
      console.log('Response from listComments query:', response);
  
      if (response.data && response.data.listComments) {
        // Sort by createdAt in descending order (most recent first)
        const sortedComments = [...response.data.listComments.items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  
        // Ensure the comments match the expected structure
        const validatedComments = sortedComments.map(comment => ({
          id: comment.id,
          content: comment.content,
          userPostsId: comment.userPostsId,
          username: comment.username,
          likedBy: comment.likedBy || [], // Ensure likedBy is an array
          likesCount: comment.likesCount || 0, // Ensure likesCount is a number
          _version: comment._version,
        }));
  
        return validatedComments;
      } else {
        console.warn('Unexpected response format from listComments query:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };
  
  

  const toggleLike = async (commentId: string) => {
    try {
      const client = generateClient();
      const commentToUpdate = comments.find((comment) => comment.id === commentId);
  
      if (!commentToUpdate) {
        console.warn("Comment not found:", commentId);
        return;
      }
  
      const isLiked = commentToUpdate.likedBy ? commentToUpdate.likedBy.includes(userInfo.userId) : false;
      let updatedLikedBy = Array.isArray(commentToUpdate.likedBy)
        ? commentToUpdate.likedBy
        : []; // Start with an empty array if null or not an array
  
      if (!isLiked) {
        updatedLikedBy = [...updatedLikedBy, userInfo.userId];
      } else {
        updatedLikedBy = updatedLikedBy.filter(id => id !== userInfo.userId);
      }
  
      const updatedLikesCount = updatedLikedBy.length;
  
      const updatedComment = await client.graphql({
        query: mutations.updateComment,
        variables: {
          input: {
            id: commentId,
            likedBy: updatedLikedBy,
            likesCount: updatedLikesCount,
            _version: commentToUpdate._version, // Important for optimistic locking
          },
        },
      });
  
      console.log("Response from updateComment mutation:", updatedComment);
  
      if (updatedComment.data && updatedComment.data.updateComment) {
        console.log("Comment updated successfully in the backend.");
  
        // Update the local state optimistically

        setComments(prevComments => prevComments.map(comment => 
          comment.id === commentId ? {
            ...updatedComment.data.updateComment,
            likedBy: updatedComment.data.updateComment.likedBy || []
          } : comment 
        ));
      } else {
        console.warn("No data returned from updateComment mutation:", updatedComment);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };


  // const handleLikePress = async (commentId: string) => {
  //   try {
  //     const { userId } = await getCurrentUser();
  //     const client = generateClient();
      
  //     if (!userInfo) {
  //       console.error("User not logged in!");
  //       return;
  //     }
  //       const commentToUpdate = comments.find((comment) => comment.id === commentId);
  //     if (!commentToUpdate) {
  //       console.error("Post not found!");
  //       return;
  //     }
  //       const isLiked = (commentToUpdate.likedBy || []).includes(userInfo?.userId || "");
  
  //       let updatedLikedBy = Array.isArray(commentToUpdate.likedBy)
  //       ? commentToUpdate.likedBy 
  //       : []; // Start with an empty array if null or not an array
  
  //     if (!isLiked) {
  //       updatedLikedBy = [...updatedLikedBy, userId]; 
  //     } else {
  //       updatedLikedBy = updatedLikedBy.filter((id: string) => id !== userId);
  //     }
  //       const updatedLikesCount = updatedLikedBy.length;
  //       const updatedPost = await client.graphql({
  //         query: mutations.updatePost, 
  //         variables: {
  //           input: {
  //             id: commentId,
  //             likedBy: updatedLikedBy,
  //             likesCount: updatedLikesCount,
  //             _version: commentToUpdate._version, // Important for optimistic locking 
  //           },
  //         },
  //       });
  //     setComments(prevComments => prevComments.map(comment => 
  //          comment.id === commentId ? {
  //           ...updatedComment.data.updateComment,
  //          likedBy: updatedComment.data.updateComment.likedBy || []
  //        } : comment 
  //      ));
  //   } catch (error) {
  //     console.error("Error updating post:", error);
  //   }
  // };


  const renderComment = ({ item }: { item: Comment }) => {
    const isLiked = item.likedBy ? item.likedBy.includes(userInfo?.userId) : false;

    return (
      <View style={styles.commentItem}>
        <View style={styles.commentContent}>
          <Text style={styles.commentUser}>{item.username}: </Text>
          <Text>{item.content}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <FontAwesomeIcon
            icon={isLiked ? likedIcon : unLikedIcon}
            style={styles.heartIcon}
            color={isLiked ? 'red' : 'black'}
          />
      </TouchableOpacity>
      </View>
    );
  };

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

        {selectedPost && (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.commentList}
          />
        )}

        <View style={styles.inputContainer}>
          <BottomSheetTextInput
            style={styles.input}
            onChangeText={handleCommentChange}
            placeholder="Add a comment ..."
            maxLength={600}
          />
          <TouchableOpacity onPress={createComment} style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 50,
  },
  input: {
    flex: 1,
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
    backgroundColor: 'blue', 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentList: {
    flexGrow: 1,
    width: '100%',
    justifyContent: "flex-start",
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentContent: {
    flex: 1, 
  },
  commentUser: {
    fontWeight: 'bold',
  },
  heartIcon: {
    marginLeft: 'auto', 
  },
});

export default CustomBottomSheet;
