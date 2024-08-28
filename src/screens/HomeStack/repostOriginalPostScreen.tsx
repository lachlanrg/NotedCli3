// repostOriginalPostScreen.tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { formatRelativeTime } from '../../components/formatComponents';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartSolid, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComment } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { HomeStackParamList } from '../../components/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Post } from '../../models';
import { getCurrentUser } from 'aws-amplify/auth';
import { dark, gray, light } from '../../components/colorModes';
import { generateClient } from 'aws-amplify/api';
import { updatePost } from '../../graphql/mutations';


const commentIcon = faComment as IconProp;
const unLikedIcon = faHeartRegular as IconProp;
const likedIcon = faHeartSolid as IconProp;
const repostIcon = faArrowsRotate as IconProp;


type RepostOriginalPostScreenRouteProp = NativeStackScreenProps<HomeStackParamList, 'RepostOriginalPost'>;


const RepostOriginalPostScreen: React.FC<RepostOriginalPostScreenRouteProp> = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { post } = route.params;
  const [userInfo, setUserId] = React.useState<any>(null);
  const [updatedPost, setUpdatedPost] = useState(post);


  React.useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { userId } = await getCurrentUser();
      console.log(`The User Id: ${userId}`);

      setUserId({ userId });
    } catch (err) {
      console.log(err);
    }
  }


  const handleLikePress = async (postId: string) => {
    try {
      const { userId } = await getCurrentUser();
      const client = generateClient();
  
      if (!userInfo) {
        console.error("User not logged in!");
        return;
      }
      const postToUpdate = updatedPost;
      if (!postToUpdate) {
        console.error("Post not found!");
        return;
      }
      const isLiked = (postToUpdate.likedBy || []).includes(userInfo?.userId || "");
  
      let updatedLikedBy = Array.isArray(postToUpdate.likedBy)
        ? postToUpdate.likedBy
        : []; // Start with an empty array if null or not an array
  
      if (!isLiked) {
        updatedLikedBy = [...updatedLikedBy, userId];
      } else {
        updatedLikedBy = updatedLikedBy.filter((id: string) => id !== userId);
      }
      const updatedLikesCount = updatedLikedBy.length;
      const updatedPostData = await client.graphql({
        query: updatePost,
        variables: {
          input: {
            id: postId,
            likedBy: updatedLikedBy,
            likesCount: updatedLikesCount,
            _version: postToUpdate._version, // Important for optimistic locking
          },
        },
      });
  
      // Update the _version field in the updatedPost state
      setUpdatedPost({
        ...postToUpdate,
        likedBy: updatedLikedBy,
        likesCount: updatedLikesCount,
        _version: updatedPostData.data.updatePost._version,
      });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handlePresentModalPress = (post: Post) => {
    // Handle present modal press logic here
  };

      
  const getImageUrl = (url: string | null | undefined) => {
    return url ? { uri: url } : require('../../assets/placeholder.png');
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}> 
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={light} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Post</Text>
        </View>

      <View style={styles.repostedPostContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeUserProfile', { userId: post.userPostsId })}>
          <Text style={styles.repostedPostUser}>{post.username}</Text>
        </TouchableOpacity>
        <Text style={styles.bodytext}>{post.body}</Text>

        {post.scTrackId && (
          <View style={styles.soundCloudPost}>
            <Image source={getImageUrl(post.scTrackArtworkUrl)} style={styles.image} />
              <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">{post.scTrackTitle}</Text>
            <Text style={styles.date}>{formatRelativeTime(post.createdAt)}</Text>
            <View style={styles.commentLikeSection}>
            <TouchableOpacity
                  style={styles.likeIcon}
                  onPress={() => handleLikePress(updatedPost.id)}
                >
                  <FontAwesomeIcon
                    icon={(updatedPost.likedBy || []).includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                    size={20}
                    color={(updatedPost.likedBy || []).includes(userInfo?.userId) ? 'red' : '#fff'}
                  />
            </TouchableOpacity>
              <Text style={styles.likesCountText}>
                {updatedPost.likesCount || ''}
              </Text>
                <TouchableOpacity style={styles.commentIcon}>
                    <FontAwesomeIcon icon={commentIcon} size={20} color="#fff" />
                </TouchableOpacity>
              <Text style={styles.commentCountText}>
                {/* {commentCounts[post.id] || null} */}
              </Text>
              <TouchableOpacity style={styles.repostIcon} onPress={() => navigation.navigate('PostRepost', { post: post })}>
                <FontAwesomeIcon icon={repostIcon} size={20} color="#fff" transform={{ rotate: 160 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {post.spotifyAlbumId && (
          <View style={styles.spotifyPost}>
            <Image source={getImageUrl(post.spotifyAlbumImageUrl)} style={styles.image} />
              <Text style={styles.albumTitle} numberOfLines={1} ellipsizeMode="tail">Album: {post.spotifyAlbumName}</Text>
            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
              {post.spotifyAlbumArtists}
            </Text>
            <Text style={styles.date}>Total Tracks: {post.spotifyAlbumTotalTracks}</Text>
            <Text style={styles.date}>Release Date: {post.spotifyAlbumReleaseDate}</Text>
            <Text style={styles.date}>{formatRelativeTime(post.createdAt)}</Text>
            <View style={styles.commentLikeSection}>
            <TouchableOpacity
                  style={styles.likeIcon}
                  onPress={() => handleLikePress(updatedPost.id)}
                >
                  <FontAwesomeIcon
                    icon={(updatedPost.likedBy || []).includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                    size={20}
                    color={(updatedPost.likedBy || []).includes(userInfo?.userId) ? 'red' : '#fff'}
                  />
                </TouchableOpacity>
              <Text style={styles.likesCountText}>
                {updatedPost.likesCount || ''}
              </Text>
                <TouchableOpacity style={styles.commentIcon}>
                    <FontAwesomeIcon icon={commentIcon} size={20} color="#fff" />
                </TouchableOpacity>
              <Text style={styles.commentCountText}>
                {/* {commentCounts[post.id] || null} */}
              </Text>
              <TouchableOpacity style={styles.repostIcon} onPress={() => navigation.navigate('PostRepost', { post: post })}>
                <FontAwesomeIcon icon={repostIcon} size={20} color="#fff" transform={{ rotate: 160 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {post.spotifyTrackId && (
          <View style={styles.spotifyPost}>
            <Image source={getImageUrl(post.spotifyTrackImageUrl )} style={styles.image} />
              <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">Track: {post.spotifyTrackName}</Text>
            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
              {post.spotifyTrackArtists}
            </Text>
            <Text style={styles.date}>{formatRelativeTime(post.createdAt)}</Text>
            <View style={styles.commentLikeSection}>
            <TouchableOpacity
                  style={styles.likeIcon}
                  onPress={() => handleLikePress(updatedPost.id)}
                >
                  <FontAwesomeIcon
                    icon={(updatedPost.likedBy || []).includes(userInfo?.userId) ? likedIcon : unLikedIcon}
                    size={20}
                    color={(updatedPost.likedBy || []).includes(userInfo?.userId) ? 'red' : '#fff'}
                  />
                </TouchableOpacity>

              <Text style={styles.likesCountText}>
                {updatedPost.likesCount || ''}
              </Text>
                <TouchableOpacity style={styles.commentIcon}>
                    <FontAwesomeIcon icon={commentIcon} size={20} color="#fff" />
                </TouchableOpacity>
              <Text style={styles.commentCountText}>
                {/* {commentCounts[post.id] || null} */}
              </Text>
              <TouchableOpacity style={styles.repostIcon} onPress={() => navigation.navigate('PostRepost', { post: post })}>
                <FontAwesomeIcon icon={repostIcon} size={20} color="#fff" transform={{ rotate: 160 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    // padding: 15,
  },
  header: {
    backgroundColor: dark,
    flexDirection: 'row',
    paddingBottom: 10,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: gray,
  },
  headerText: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingRight: 15,
        color: light,
  },
//   main: {
//     flex: 1,
//   },
  repostText: {
    color: '#ccc',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  repostDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
  },
  repostedPostContainer: {
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
    marginTop: 10,
  },
  repostedPostUser: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  soundCloudPost: {},
  spotifyPost: {},
  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  albumTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: '#ccc',
    fontSize: 14,
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  commentLikeSection: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  commentIcon: {
    marginLeft: 20,
  },
  repostIcon: {
    marginLeft: 20,
  },
  likeIcon: {
    marginLeft: 2,
  },
  likesCountText: {
    color: '#fff', 
    fontSize: 16,  
    marginLeft: 8,  
  },
  commentCountText: {
    color: '#fff', 
    fontSize: 16, 
    marginLeft: 8, 
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark,
  },
  bodytext: {
    color: '#ccc',
    marginBottom: 10,
  },
});

export default RepostOriginalPostScreen;
