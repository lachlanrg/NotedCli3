import React, { useMemo, forwardRef, useCallback, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Platform, FlatList } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { dark, gray, lgray, light, modalBackground } from "../colorModes";
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
  likedBy: string[]; 
  likesCount: number; 
  _version: number;
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
  const snapPoints = useMemo(() => ['82%'], []);
  const [newComment, setNewComment] = useState('');
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    currentAuthenticatedUser();
    const fetchInitialComments = async () => {
      const fetchedComments = await fetchComments();
      setComments(fetchedComments);
    };

    if (selectedPost) { // Only fetch if a post is selected
      fetchInitialComments();
    }

    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => { setKeyboardVisible(true); }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => { setKeyboardVisible(false); }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [selectedPost]); // Fetch again if selectedPost changes

  async function currentAuthenticatedUser() {
    try {
      const user = await getCurrentUser();
      const { userId, username } = user;
      // console.log(`The User Id: ${userId}, Username: ${username}`);

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

      await client.graphql({
        query: mutations.createComment,
        variables: { input },
      });
      console.log('New Comment created successfully!:', newComment);
      setNewComment(''); 
      const fetchedComments = await fetchComments();
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const fetchComments = async () => {
    if (!selectedPost) return []; 
    try {
      const client = generateClient();
      const filter = { 
        postId: 'originalPost' in selectedPost ? undefined : { eq: selectedPost.id },
        repostId: 'originalPost' in selectedPost ? { eq: selectedPost.id } : undefined,
      };

      const response = await client.graphql({
        query: queries.listComments,
        variables: { filter: filter },
      });

      console.log('Response from listComments query:', response);

      if (response.data && response.data.listComments) {
        const sortedComments = [...response.data.listComments.items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const validatedComments = sortedComments.map(comment => ({
          id: comment.id,
          content: comment.content,
          userPostsId: comment.userPostsId,
          username: comment.username,
          likedBy: comment.likedBy || [], 
          likesCount: comment.likesCount || 0, 
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
        : [];

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
            _version: commentToUpdate._version, 
          },
        },
      });

      console.log("Response from updateComment mutation:", updatedComment);

      if (updatedComment.data && updatedComment.data.updateComment) {
        console.log("Comment updated successfully in the backend.");

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

  const renderComment = ({ item }: { item: Comment }) => {
    const isLiked = item.likedBy ? item.likedBy.includes(userInfo?.userId) : false;

    return (
      <View style={styles.commentItem}>
        <View style={styles.commentContent}>
          <Text style={styles.commentUser}>{item.username}</Text>
          <Text>{item.content}</Text>
        </View>
        <View style={styles.likeContainer}>
          <TouchableOpacity onPress={() => toggleLike(item.id)}>
            <FontAwesomeIcon
              icon={isLiked ? likedIcon : unLikedIcon}
              style={styles.heartIcon}
              color={isLiked ? 'red' : 'black'}
            />
          </TouchableOpacity>
          <Text style={styles.likesCount}>{item.likesCount > 0 ? item.likesCount : '\u00A0'}</Text>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>No comments yet</Text>
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
      backgroundStyle={{ backgroundColor: modalBackground }}

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
            ListEmptyComponent={renderEmptyList}
          />
        )}

        <View style={[styles.inputContainer, { paddingBottom: keyboardVisible ? 20 : 40 }]}>
          <BottomSheetTextInput
            style={styles.input}
            onChangeText={handleCommentChange}
            placeholder="Add a comment ..."
            placeholderTextColor={gray}
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
  },
  input: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
    borderRadius: 10,
    backgroundColor: light,
    padding: 8,
    borderColor: dark,
    borderWidth: 1,
    // height: 50,
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
    paddingRight: 26,
  },
  commentUser: {
    fontWeight: 'bold',
    paddingBottom: 2,
  },
  likeContainer: {
    alignItems: 'center',
    paddingRight: 10,
    paddingTop: 5,
  },
  heartIcon: {
    marginLeft: 'auto',
  },
  likesCount: {
    marginTop: 4,
    fontSize: 12,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 300,
  },
  emptyListText: {
    color: gray,
    fontSize: 16,
    // fontStyle: "italic"
  },
});

export default CustomBottomSheet;
