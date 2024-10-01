import React, { useMemo, forwardRef, useCallback, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Platform, FlatList, KeyboardAvoidingView, TextInput, Modal, findNodeHandle, UIManager, Dimensions } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { dark, gray, lgray, light, mediumgray, placeholder, error } from "../colorModes";
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid, faReply, faChevronDown, faChevronUp, faFlag, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { mediumImpact } from "../../utils/hapticFeedback";
import { deleteComment } from '../../graphql/mutations';

const unLikedIcon = faHeartRegular as IconProp;
const likedIcon = faHeartSolid as IconProp;

export type Ref = BottomSheetModal;

type Comment = {
  id: string;
  content: string;
  userPostsId: string;
  username: string;
  likedBy: string[] | null;
  likesCount: number;
  _version: number;
  replies?: Comment[];
  parentComment?: Comment | null;
  parentCommentId?: string | null;
  postId?: string | null;
  repostId?: string | null;
  __typename?: string;
  createdAt?: string;
  post?: {
    __typename: "Post";
    id: string;
    body?: string | null;
    userPostsId: string;
    username: string;
    likedBy?: string[] | null;
  } | null;
  repost?: {
    __typename: "Repost";
    id: string;
  } | null;
  user?: {
    __typename: "User";
    id: string;
    username: string;
  } | null;
  repostCommentsId?: string | null;
  _deleted?: boolean | null; // Update this line
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
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [longPressedComment, setLongPressedComment] = useState<Comment | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

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
        likedBy: [],
        parentCommentId: replyingTo ? replyingTo.id : undefined,
      };

      const response = await client.graphql({
        query: mutations.createComment,
        variables: { input },
      });

      if (response.data && response.data.createComment) {
        const newCommentData: Comment = {
          ...response.data.createComment,
          replies: [],
          likedBy: response.data.createComment.likedBy || [],
          parentComment: replyingTo || null,
          parentCommentId: replyingTo ? replyingTo.id : null,
        };

        setComments(prevComments => {
          if (replyingTo) {
            // If it's a reply, find the parent comment and add the reply to its replies array
            return prevComments.map(comment => {
              if (comment.id === replyingTo.id) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newCommentData],
                };
              }
              return comment;
            });
          } else {
            // If it's a top-level comment, add it to the beginning of the array
            return [newCommentData, ...prevComments];
          }
        });
      }

      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setNewComment('');
    }
  };

  const fetchComments = async () => {
    if (!selectedPost) return []; 
    try {
      const client = generateClient();
      const filter = { 
        postId: 'originalPost' in selectedPost ? undefined : { eq: selectedPost.id },
        repostId: 'originalPost' in selectedPost ? { eq: selectedPost.id } : undefined,
        _deleted: { ne: true }, // Add this line to filter out deleted comments
      };

      const response = await client.graphql({
        query: queries.listComments,
        variables: { 
          filter: filter,
          limit: 1000, // Adjust as needed
        },
      });

      if (response.data && response.data.listComments) {
        const allComments = response.data.listComments.items;
        
        // Create a map of comments by their IDs
        const commentMap = new Map<string, Comment>();
        allComments.forEach(comment => {
          if (comment._deleted !== true) { // Change this line
            commentMap.set(comment.id, {
              ...comment,
              likedBy: comment.likedBy || null,
              replies: [],
            });
          }
        });

        // Organize comments into a tree structure
        const topLevelComments: Comment[] = [];
        commentMap.forEach(comment => {
          if (comment.parentCommentId) {
            const parentComment = commentMap.get(comment.parentCommentId);
            if (parentComment) {
              parentComment.replies?.push(comment);
            }
          } else {
            topLevelComments.push(comment);
          }
        });

        // Sort top-level comments by creation date
        const sortedComments = topLevelComments.sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
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

  const toggleLike = async (commentId: string) => {
    try {
      const client = generateClient();
      
      // Helper function to find a comment or reply
      const findComment = (comments: Comment[], id: string): Comment | undefined => {
        for (const comment of comments) {
          if (comment.id === id) return comment;
          if (comment.replies) {
            const reply = findComment(comment.replies, id);
            if (reply) return reply;
          }
        }
        return undefined;
      };

      const commentToUpdate = findComment(comments, commentId);

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

      if (updatedComment.data && updatedComment.data.updateComment) {
        setComments(prevComments => {
          const updateCommentInTree = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likedBy: updatedComment.data.updateComment.likedBy || null,
                  likesCount: updatedComment.data.updateComment.likesCount,
                  _version: updatedComment.data.updateComment._version,
                };
              }
              if (comment.replies) {
                return {
                  ...comment,
                  replies: updateCommentInTree(comment.replies),
                };
              }
              return comment;
            });
          };
          
          return updateCommentInTree(prevComments);
        });
      } else {
        console.warn("No data returned from updateComment mutation:", updatedComment);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleLongPress = (comment: Comment, event: any) => {
    mediumImpact();
    const nodeHandle = findNodeHandle(event.target);
    if (nodeHandle) {
      UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
        setModalPosition({ top: pageY + height, left: pageX });
        setLongPressedComment(comment);
      });
    }
  };

  const closeOptionsModal = () => {
    setLongPressedComment(null);
  };

  const handleDeleteComment = async (comment: Comment) => {
    try {
      const client = generateClient();

      // Function to recursively delete a comment and its replies
      const deleteCommentAndReplies = async (commentToDelete: Comment) => {
        // Delete all replies first
        if (commentToDelete.replies && commentToDelete.replies.length > 0) {
          for (const reply of commentToDelete.replies) {
            await deleteCommentAndReplies(reply);
          }
        }

        // Delete the comment itself
        await client.graphql({
          query: deleteComment,
          variables: { input: { id: commentToDelete.id, _version: commentToDelete._version } },
        });
      };

      // Start the deletion process
      await deleteCommentAndReplies(comment);

      console.log('Comment and all its replies deleted successfully');

      // Remove the comment and its replies from the local state
      setComments(prevComments => {
        const removeCommentAndReplies = (comments: Comment[]): Comment[] => {
          return comments.filter(c => {
            if (c.id === comment.id) {
              return false; // Remove this comment
            }
            if (c.replies) {
              c.replies = removeCommentAndReplies(c.replies);
            }
            return true;
          });
        };
        return removeCommentAndReplies(prevComments);
      });

      closeOptionsModal();
    } catch (error) {
      console.error('Error deleting comment and its replies:', error);
      // You might want to show an error message to the user here
    }
  };

  const CommentOptionsModal = ({ comment }: { comment: Comment }) => {
    const isCommentOwner = comment.userPostsId === userInfo?.userId;

    return (
      <Modal
        transparent={true}
        visible={!!longPressedComment}
        onRequestClose={closeOptionsModal}
        animationType="fade"
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeOptionsModal}>
          <View style={[styles.optionsModalWrapper, { top: modalPosition.top, left: modalPosition.left }]}>
            <View style={styles.optionsModal}>
              <TouchableOpacity style={styles.optionItem} onPress={() => {
                setReplyingTo(comment);
                closeOptionsModal();
              }}>
                <FontAwesomeIcon icon={faReply} style={styles.optionIcon} />
                <Text style={styles.optionText}>Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionItem} onPress={() => {
                // Handle report option
                closeOptionsModal();
              }}>
                <FontAwesomeIcon icon={faFlag} style={styles.optionIcon} />
                <Text style={styles.optionText}>Report</Text>
              </TouchableOpacity>
              {isCommentOwner && (
                <TouchableOpacity 
                  style={[styles.optionItem, styles.lastOptionItem, styles.deleteOption]} 
                  onPress={() => handleDeleteComment(comment)}
                >
                  <FontAwesomeIcon icon={faTrash} style={styles.optionIcon} color={error}/>
                  <Text style={[styles.optionText, { color: error }]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderReply = (reply: Comment, parentComment: Comment) => {
    if (reply._deleted) return null; // Add this line to skip rendering deleted replies

    return (
      <LongPressGestureHandler
        key={reply.id}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handleLongPress(reply, nativeEvent);
          }
        }}
        minDurationMs={800}
      >
        <View style={styles.replyItem}>
          <View style={styles.commentContent}>
            <Text style={styles.commentUser}>{reply.username}</Text>
            <Text style={styles.commentText}>{reply.content}</Text>
          </View>
          <View style={styles.likeContainer}>
            <TouchableOpacity onPress={() => toggleLike(reply.id)}>
              <FontAwesomeIcon
                icon={reply.likedBy?.includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                style={styles.heartIcon}
                color={reply.likedBy?.includes(userInfo?.userId) ? 'red' : light}
              />
            </TouchableOpacity>
            <Text style={styles.likesCount}>{reply.likesCount > 0 ? reply.likesCount : '\u00A0'}</Text>
          </View>
        </View>
      </LongPressGestureHandler>
    );
  };

  const renderComment = ({ item }: { item: Comment }) => {
    if (item._deleted) return null; // Add this line to skip rendering deleted comments

    const isLiked = item.likedBy ? item.likedBy.includes(userInfo?.userId) : false;
    const hasReplies = item.replies && item.replies.length > 0;
    const isExpanded = expandedComments.has(item.id);

    // Sort replies by creation date, most recent first, and filter out deleted replies
    const sortedReplies = item.replies
      ?.filter(reply => !reply._deleted)
      .sort((a, b) => 
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      ) || [];

    return (
      <View style={styles.commentContainer}>
        <LongPressGestureHandler
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              handleLongPress(item, nativeEvent);
            }
          }}
          minDurationMs={800}
        >
          <View>
            <View style={styles.commentItem}>
              <View style={styles.commentContent}>
                <Text style={styles.commentUser}>{item.username}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
              </View>
              <View style={styles.likeContainer}>
                <TouchableOpacity onPress={() => toggleLike(item.id)}>
                  <FontAwesomeIcon
                    icon={isLiked ? likedIcon : unLikedIcon}
                    style={styles.heartIcon}
                    color={isLiked ? 'red' : light}
                  />
                </TouchableOpacity>
                <Text style={styles.likesCount}>{item.likesCount > 0 ? item.likesCount : '\u00A0'}</Text>
              </View>
            </View>
            <View style={styles.commentActions}>
              <TouchableOpacity onPress={() => setReplyingTo(item)}>
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>
              {hasReplies && (
                <TouchableOpacity onPress={() => toggleCommentExpansion(item.id)} style={styles.viewRepliesButton}>
                  <Text style={styles.actionText}>
                    {isExpanded ? 'Hide replies' : `View ${sortedReplies.length} ${sortedReplies.length === 1 ? 'reply' : 'replies'}`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LongPressGestureHandler>
        {isExpanded && hasReplies && (
          <View style={styles.repliesContainer}>
            {sortedReplies.map((reply) => renderReply(reply, item))}
          </View>
        )}
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
      backgroundStyle={{ backgroundColor: mediumgray }}
      handleIndicatorStyle={{ backgroundColor: light }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.listContainer}>
          {selectedPost && (
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.commentList}
              ListEmptyComponent={renderEmptyList}
            />
          )}
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 170 : 0}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.inputContainer}>
            {replyingTo && (
              <View style={styles.replyingToContainer}>
                <View style={styles.replyingToWrapper}>
                  <Text style={styles.replyingToText}>Replying to {replyingTo.username}</Text>
                  <TouchableOpacity onPress={() => setReplyingTo(null)} style={styles.cancelReplyButton}>
                    <Text style={styles.cancelReplyText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={handleCommentChange}
                value={newComment}
                placeholder={replyingTo ? "Write a reply..." : "Add a comment ..."}
                placeholderTextColor={placeholder}
                maxLength={600}
              />
              <TouchableOpacity onPress={createComment} style={styles.postButton}>
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        {longPressedComment && <CommentOptionsModal comment={longPressedComment} />}
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: mediumgray,
  },
  listContainer: {
    flex: 1,
  },
  commentList: {
    flexGrow: 1,
  },
  emptyListContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  emptyListText: {
    color: light,
    fontSize: 16,
    marginTop: 100,
  },
  keyboardAvoidingView: {
    marginTop: 'auto',
  },
  inputContainer: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    paddingBottom: 40,
    backgroundColor: mediumgray,
    borderTopWidth: 1,
    borderTopColor: gray,
  },
  replyingToContainer: {
    marginBottom: 10,
  },
  replyingToWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyingToText: {
    color: lgray,
    fontSize: 14,
    marginRight: 8,
  },
  cancelReplyButton: {
    marginLeft: 4,
  },
  cancelReplyText: {
    color: 'blue',
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
    borderRadius: 10,
    backgroundColor: gray,
    padding: 10,
    color: light,
  },
  postButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postButtonText: {
    color: light,
    fontWeight: 'bold',
  },
  commentContainer: {
    marginBottom: 10,
    paddingTop: 10,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: gray,
  },
  commentContent: {
    flex: 1,
    paddingRight: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    paddingBottom: 2,
    color: light,
  },
  commentText: {
    color: lgray,
  },
  likeContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  heartIcon: {
    marginLeft: 'auto',
  },
  likesCount: {
    marginTop: 4,
    fontSize: 12,
    color: light,
  },
  commentActions: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  actionText: {
    color: placeholder,
    fontSize: 14,
    marginRight: 15,
  },
  viewRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIcon: {
    marginLeft: 5,
  },
  repliesContainer: {
    marginLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: gray,
  },
  replyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  optionsModalWrapper: {
    position: 'absolute',
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.6,
    maxWidth: 250,
    marginTop: 5,
    marginLeft: 10,
  },
  optionsModal: {
    backgroundColor: 'rgb(40, 40, 40)',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    marginRight: 16,
    color: light,
    fontSize: 20,
  },
  optionText: {
    color: light,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default CustomBottomSheet;